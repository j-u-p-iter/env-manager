import { createEncryptor } from "@j.u.p.iter/encryptor";
import fs from "fs";
import path from "path";

type CreateEnvManager = (
  password: string
) => {
  createConfig: (params: {
    pathToFile: string;
    originalFileName?: string;
    encryptedFileName?: string;
  }) => void;
  readConfig: (params: {
    pathToFile: string;
    originalFileName?: string;
    decodedFileName?: string;
  }) => void;
  decodeConfig: (params: {
    pathToFile: string;
    originalFileName?: string;
    decodedFileName?: string;
  }) => void;
};

export const createEnvManager: CreateEnvManager = password => {
  const createConfig = ({
    pathToFile,
    originalFileName = "env.js",
    encryptedFileName = "env.enc.js"
  }) => {
    const encryptor = createEncryptor(password);

    const pathToConfig = path.resolve(pathToFile, originalFileName);

    const fileData = fs.readFileSync(pathToConfig);

    const encrypted = encryptor.encrypt(fileData);

    fs.writeFileSync(path.resolve(pathToFile, encryptedFileName), encrypted);
  };

  const decodeConfig = ({
    pathToFile,
    originalFileName = "env.enc.js",
    decodedFileName = "env.js"
  }) => {
    const encryptor = createEncryptor(password);

    const pathToEncodedConfig = path.resolve(pathToFile, originalFileName);

    const fileData = fs.readFileSync(pathToEncodedConfig);

    const decrypted = encryptor.decrypt(fileData);

    const pathToDecodedConfig = path.resolve(pathToFile, decodedFileName);

    fs.writeFileSync(pathToDecodedConfig, decrypted);

    return pathToDecodedConfig;
  };

  const readConfig = pathToFile => {
    const pathToDecodedConfig = decodeConfig({ pathToFile });

    const config: {
      [key: string]: string | number;
    } = require(pathToDecodedConfig);

    fs.unlinkSync(pathToDecodedConfig);

    Object.entries(config[process.env.NODE_ENV]).forEach(([key, value]) => {
      process.env[key] = value;
    });
  };

  return {
    readConfig,
    decodeConfig,
    createConfig
  };
};
