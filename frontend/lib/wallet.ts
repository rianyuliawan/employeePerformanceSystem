type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
};

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export const SEPOLIA_CHAIN_ID = "0xaa36a7"; // 11155111 in hex

export async function connectWallet(): Promise<{ address: string; chainId: string }> {
  if (!window.ethereum) throw new Error("MetaMask is not installed");
  const accounts = (await window.ethereum.request({
    method: "eth_requestAccounts",
  })) as string[];
  const chainId = (await window.ethereum.request({ method: "eth_chainId" })) as string;
  return { address: accounts[0], chainId };
}

export async function switchToSepolia(): Promise<void> {
  if (!window.ethereum) throw new Error("MetaMask is not installed");
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: SEPOLIA_CHAIN_ID }],
    });
  } catch (err: unknown) {
    // Chain not added — add it
    if (typeof err === "object" && err !== null && "code" in err && (err as { code: number }).code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: SEPOLIA_CHAIN_ID,
            chainName: "Sepolia Testnet",
            nativeCurrency: { name: "SepoliaETH", symbol: "ETH", decimals: 18 },
            rpcUrls: ["https://rpc.sepolia.org"],
            blockExplorerUrls: ["https://sepolia.etherscan.io"],
          },
        ],
      });
    } else {
      throw err;
    }
  }
}

export async function signMessage(message: string): Promise<string> {
  if (!window.ethereum) throw new Error("MetaMask is not installed");
  const accounts = (await window.ethereum.request({
    method: "eth_accounts",
  })) as string[];
  if (!accounts.length) throw new Error("No connected account");

  const signature = (await window.ethereum.request({
    method: "personal_sign",
    params: [message, accounts[0]],
  })) as string;
  return signature;
}

export function isMetaMaskInstalled(): boolean {
  return typeof window !== "undefined" && !!window.ethereum;
}

export function shortenAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
