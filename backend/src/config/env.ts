import dotenv from "dotenv";

dotenv.config();

const nodeEnv = process.env.NODE_ENV ?? "development";
const isProduction = nodeEnv === "production";

// Dev-only fallbacks so `npm run dev` works out of the box. In production a
// missing secret must fail startup loudly instead of silently signing
// JWTs / encrypting PII with a value anyone can read in this source file.
function requireSecret(name: string, devFallback: string): string {
  const value = process.env[name];
  if (value) return value;
  if (isProduction) {
    throw new Error(`${name} must be set via environment variable in production`);
  }
  return devFallback;
}

export const env = {
  port: Number(process.env.PORT ?? 5000),
  jwtSecret: requireSecret("JWT_SECRET", "development-secret"),
  aesSecretKey: requireSecret("AES_SECRET_KEY", "development-aes-secret-key-change-me"),
  databaseUrl: process.env.DATABASE_URL,
  rpcUrl: process.env.RPC_URL,
  smartContractAddress: process.env.SMART_CONTRACT_ADDRESS,
  deployerPrivateKey: process.env.DEPLOYER_PRIVATE_KEY,
  nodeEnv,
};
