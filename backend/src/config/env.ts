import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT ?? 5000),
  jwtSecret: process.env.JWT_SECRET ?? "development-secret",
  aesSecretKey: process.env.AES_SECRET_KEY ?? "development-aes-secret-key-change-me",
  databaseUrl: process.env.DATABASE_URL,
  rpcUrl: process.env.RPC_URL,
  smartContractAddress: process.env.SMART_CONTRACT_ADDRESS,
  deployerPrivateKey: process.env.DEPLOYER_PRIVATE_KEY,
  nodeEnv: process.env.NODE_ENV ?? "development"
};

