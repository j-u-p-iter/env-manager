import { createEncryptor } from "@j.u.p.iter/encryptor";
import fs from "fs";
import path from "path";

type CreateEnvManager = (
  password: string
) => {
  createConfig: (pathToFile: string) => void;
  readConfig: (pathToFile: string) => void;
};

export const createEnvManager: CreateEnvManager = password => {
  const createConfig = pathToFile => {
    const encryptor = createEncryptor(password);

    const pathToConfig = path.resolve(pathToFile, "env.js");

    const fileData = fs.readFileSync(pathToConfig);

    const encrypted = encryptor.encrypt(fileData);

    fs.writeFileSync(path.resolve(pathToFile, "env.enc.js"), encrypted);
  };

  const decodeConfig = pathToFile => {
    const encryptor = createEncryptor(password);

    const pathToEncodedConfig = path.resolve(pathToFile, "env.enc.js");

    const fileData = fs.readFileSync(pathToEncodedConfig);

    const decrypted = encryptor.decrypt(fileData);

    const pathToDecodedConfig = path.resolve(pathToFile, "env.js");

    fs.writeFileSync(pathToDecodedConfig, decrypted);

    return pathToDecodedConfig;
  };

  const readConfig = pathToFile => {
    const pathToDecodedConfig = decodeConfig(pathToFile);

    const config = require(pathToDecodedConfig);

    fs.unlinkSync(pathToDecodedConfig);

    process.env = {
      ...process.env,
      ...config[process.env.NODE_ENV]
    };
  };

  return {
    readConfig,
    decodeConfig,
    createConfig
  };
};
