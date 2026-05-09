export const NFT_CONFIG = {
    name: "Monke",
    description: "MKT NFT Collection",
    imagePath: "./monke.jpeg",
    imageMimeType: "image/jpeg" as const,
    attributes: [
        { trait_type: "Rarity", value: "Legendary" },
    ],
} as const;

export const RPC_ENDPOINT = "https://api.devnet.solana.com";
export const IRYS_URL = "https://devnet.irys.xyz/";
export const WALLET_PATH = "../devnet-wallet.json";