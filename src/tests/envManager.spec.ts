import fs from "fs";
import path from "path";
import { createEnvManager } from "../.";

describe("envManager", () => {
  let envManager;

  beforeAll(() => {
    envManager = createEnvManager("SomePassword");
  });

  describe("createConfig(%pathToFile)", () => {
    it("works properly", () => {
      envManager.createConfig(path.resolve(__dirname, "./forCreateConfigTest"));

      const pathToEncodedConfig = path.resolve(
        __dirname,
        "forCreateConfigTest",
        "env.enc.js"
      );

      expect(() => fs.accessSync(pathToEncodedConfig)).not.toThrow();

      fs.unlinkSync(pathToEncodedConfig);
    });
  });

  describe("decodeConfig(%pathToFile)", () => {
    it("works properly", () => {
      envManager.decodeConfig(path.resolve(__dirname, "./forDecodeConfigTest"));

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
