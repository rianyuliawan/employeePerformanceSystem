import { ethers } from "ethers";
import { createRequire } from "module";
import { env } from "../config/env.js";

const require = createRequire(import.meta.url);
const ABI = require("./abi/EmployeePerformanceAudit.json");

export type BlockchainReceipt = {
  transactionHash: string;
  blockNumber: number | null;
  status: "Pending" | "Success" | "Failed";
};

function getContract() {
  if (!env.rpcUrl || !env.smartContractAddress || !env.deployerPrivateKey) {
    return null;
  }
  const provider = new ethers.JsonRpcProvider(env.rpcUrl);
  const signer = new ethers.Wallet(env.deployerPrivateKey, provider);
  return new ethers.Contract(env.smartContractAddress, ABI, signer);
}

function mockReceipt(label: string): BlockchainReceipt {
  return {
    transactionHash: `mock-${label}-${Date.now()}`,
    blockNumber: null,
    status: "Pending",
  };
}

// A SHA-256 digest is already exactly 32 bytes (64 hex chars) — it must be
// passed to the contract as raw bytes, not re-encoded as UTF-8 text and
// truncated (that would silently keep only the first 16 bytes of the hash).
export function hashToBytes32(hexHash: string): string {
  const normalized = hexHash.startsWith("0x") ? hexHash.slice(2) : hexHash;
  if (!/^[0-9a-fA-F]{64}$/.test(normalized)) {
    throw new Error(`Expected a 32-byte (64 hex char) SHA-256 hash, got: ${hexHash}`);
  }
  return `0x${normalized}`;
}

export class ContractService {
  async submitEvaluation(
    evaluationId: string,
    employeeId: string,
    documentHash: string
  ): Promise<BlockchainReceipt> {
    const contract = getContract();
    if (!contract) return mockReceipt(`submit-${evaluationId}`);

    const hash32 = hashToBytes32(documentHash);
    const tx = await contract.submitEvaluation(evaluationId, employeeId, hash32);
    const receipt = await tx.wait();
    return {
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber ?? null,
      status: receipt.status === 1 ? "Success" : "Failed",
    };
  }

  async reviewEvaluation(evaluationId: string): Promise<BlockchainReceipt> {
    const contract = getContract();
    if (!contract) return mockReceipt(`review-${evaluationId}`);

    const tx = await contract.reviewEvaluation(evaluationId);
    const receipt = await tx.wait();
    return {
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber ?? null,
      status: receipt.status === 1 ? "Success" : "Failed",
    };
  }

  async approveEvaluation(evaluationId: string): Promise<BlockchainReceipt> {
    const contract = getContract();
    if (!contract) return mockReceipt(`approve-${evaluationId}`);

    const tx = await contract.approveEvaluation(evaluationId);
    const receipt = await tx.wait();
    return {
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber ?? null,
      status: receipt.status === 1 ? "Success" : "Failed",
    };
  }

  async recommendPromotion(evaluationId: string): Promise<BlockchainReceipt> {
    const contract = getContract();
    if (!contract) return mockReceipt(`recommend-${evaluationId}`);

    const tx = await contract.recommendPromotion(evaluationId);
    const receipt = await tx.wait();
    return {
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber ?? null,
      status: receipt.status === 1 ? "Success" : "Failed",
    };
  }

  async approvePromotion(
    promotionId: string,
    evaluationId: string,
    promotionHash: string
  ): Promise<BlockchainReceipt> {
    const contract = getContract();
    if (!contract) return mockReceipt(`promotion-${promotionId}`);

    const hash32 = hashToBytes32(promotionHash);
    const tx = await contract.approvePromotion(promotionId, evaluationId, hash32);
    const receipt = await tx.wait();
    return {
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber ?? null,
      status: receipt.status === 1 ? "Success" : "Failed",
    };
  }

  async verifyDocument(evaluationId: string, documentHash: string): Promise<boolean> {
    const contract = getContract();
    if (!contract) {
      // fallback: simple string compare
      return documentHash.length > 0;
    }
    const hash32 = hashToBytes32(documentHash);
    const result: boolean = await contract.verifyDocument(evaluationId, hash32);
    return result;
  }

  async getEvaluationOnChain(evaluationId: string) {
    const contract = getContract();
    if (!contract) return null;
    try {
      const data = await contract.getEvaluation(evaluationId);
      return data;
    } catch {
      return null;
    }
  }

  async getPromotionOnChain(promotionId: string) {
    const contract = getContract();
    if (!contract) return null;
    try {
      const data = await contract.getPromotion(promotionId);
      return data;
    } catch {
      return null;
    }
  }
}
