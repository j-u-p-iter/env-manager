import fs from "fs";
import path from "path";
import { createEnvManager } from "../.";

describe("envManager", () => {
  let envManager;

  beforeAll(() => {
    envManager = createEnvManager("SomePassword");
  });

  describe("createConfig(%pathToFile)", () => {
    describe('with default names', () => {
      it("works properly", () => {
        envManager.createConfig({ 
          pathToFile: path.resolve(__dirname, "./forCreateConfigTest"), 
        });

        const pathToEncodedConfig = path.resolve(
          __dirname,
          "forCreateConfigTest",
          "env.enc.js"
        );

        expect(() => fs.accessSync(pathToEncodedConfig)).not.toThrow();

        fs.unlinkSync(pathToEncodedConfig);
      });
    });

    describe('with custom names', () => {
      it("works properly", () => {
        envManager.createConfig({ 
          pathToFile: path.resolve(__dirname, "./forCreateConfigTest"), 
          originalFileName: 'someConfig.json',
          encryptedFileName: 'encryptedConfig.json',
        });

        const pathToEncodedConfig = path.resolve(
          __dirname,
          "forCreateConfigTest",
          "encryptedConfig.json"
        );

        expect(() => fs.accessSync(pathToEncodedConfig)).not.toThrow();

        fs.unlinkSync(pathToEncodedConfig);
      });
    });
  });

  describe("decodeConfig(%pathToFile)", () => {
    describe('with default names', () => {
      it("works properly", () => {
        envManager.decodeConfig({ pathToFile: path.resolve(__dirname, "./forDecodeConfigTest") });

        const pathToDecodedConfig = path.resolve(
          __dirname,
          "forDecodeConfigTest",
          "env.js"
        );

        const config = require(pathToDecodedConfig);

        expect(config).toEqual({
          development: {
            ACCESS_TOKEN: 'tokenForDevelopment',
          },
          test: {
            ACCESS_TOKEN: 'tokenForTesting',
          },
          ci: {
            ACCESS_TOKEN: 'tokenForCI',
          },
          production: {
            ACCESS_TOKEN: 'tokenForProduction',
          }
        });

        fs.unlinkSync(pathToDecodedConfig);
      });
    });

    describe('with custom names', () => {
      it("works properly", () => {
        envManager.decodeConfig({ 
          pathToFile: path.resolve(__dirname, "./forDecodeConfigTest"),
          originalFileName: 'encryptedConfig.json',
          decodedFileName: 'someConfig.json',
        });

        const pathToDecodedConfig = path.resolve(
          __dirname,
          "forDecodeConfigTest",
          "someConfig.json"
        );

        const config = require(pathToDecodedConfig);

        expect(config).toEqual({
          key1: "value1",
          key2: "value2"
        });

        fs.unlinkSync(pathToDecodedConfig);
      });
    });
  });

  describe.each([
    ["development", "tokenForDevelopment"],
    ["test", "tokenForTesting"],
    ["ci", "tokenForCI"],
    ["production", "tokenForProduction"]
  ])("readConfig(%pathToFile)", (environmentName, expectedValue) => {
    it(`sets up environment variable equal to ${expectedValue}`, () => {
      process.env.NODE_ENV = environmentName;

      envManager.readConfig(path.resolve(__dirname, "./forReadConfigTest"));

      expect(process.env.NODE_ENV).toBe(environmentName);
      expect(process.env.ACCESS_TOKEN).toBe(expectedValue);
    });
  });
});
