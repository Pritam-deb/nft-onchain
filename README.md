# nft-onchain

A Turbin3 project that mints an NFT on Solana devnet using **Metaplex Core (mpl-core)** and **Irys** for decentralised storage. The pipeline is split into three steps — image upload, metadata upload, and on-chain mint — each writing its output to `artifacts/` so the next step can pick up where the last left off.

---

## Stack

| Layer | Tool |
|---|---|
| Language | TypeScript (ts-node, no build step needed) |
| Solana client | `@metaplex-foundation/umi` + `umi-bundle-defaults` |
| NFT standard | `@metaplex-foundation/mpl-core` |
| Decentralised storage | Irys (devnet) via `umi-uploader-irys` |
| Network | Solana devnet |

---

## Setup

**1. Install dependencies**
```bash
npm install
```

**2. Add your devnet wallet**

Copy your Solana CLI keypair into the project root (it's gitignored):
```bash
cp ~/.config/solana/id.json ./devnet-wallet.json
```

**3. Add your image**

Drop your NFT image in the project root. The default expected filename is:
```
monke.jpeg
```
Change `imagePath` in `src/config.ts` if yours is named differently.

**4. Fund your wallet**

The image/metadata uploads to Irys and the on-chain mint both cost a small amount of SOL:
```bash
solana airdrop 2 --url devnet
```

---

## Running

The three scripts must be run in order:

```bash
# Step 1 — upload image to Irys, writes artifacts/image.json
npm run nft:image

# Step 2 — upload metadata JSON to Irys, writes artifacts/metadata.json
npm run nft:metadata

# Step 3 — mint the NFT on-chain, writes artifacts/nft.json
npm run nft:mint
```

Each step validates that the previous step's artifact exists before running, so running out of order gives a clear error.

After `nft:mint`, `artifacts/nft.json` contains:
```json
{
  "signature": "<tx signature>",
  "assetAddress": "<on-chain asset address>"
}
```

---

## Config

All NFT configuration lives in `src/config.ts`:

```ts
export const NFT_CONFIG = {
    name: "Monke",
    description: "MKT NFT Collection",
    imagePath: "./monke.jpeg",
    imageMimeType: "image/jpeg",
    attributes: [
        { trait_type: "Rarity", value: "Legendary" },
    ],
};
```

---

## Project Structure

```
nft-onchain/
├── src/
│   ├── config.ts              # NFT config, RPC endpoint, Irys URL
│   ├── nft/
│   │   ├── nft_image.ts       # Step 1: upload image
│   │   ├── nft_metadata.ts    # Step 2: upload metadata
│   │   └── nft_mint.ts        # Step 3: mint on-chain
│   └── utils/
│       ├── umi.ts             # Creates base UMI client with wallet
│       └── irys.ts            # Extends UMI client with Irys uploader
├── artifacts/                 # Auto-generated, gitignored
│   ├── image.json
│   ├── metadata.json
│   └── nft.json
├── devnet-wallet.json         # Gitignored
└── monke.jpeg                 # Your NFT image
```

---

## What I Learned

**mpl-core vs the old Token Metadata standard**
Metaplex Core is a cleaner, cheaper NFT standard. Instead of juggling a mint account + a separate metadata account + a master edition account, everything lives in a single asset account. Fewer accounts = lower rent = simpler code.

**mpl-core plugins**
Plugins are the killer feature of mpl-core. Royalties are enforced on-chain (not just advisory like before), and you can attach on-chain traits via the `Attributes` plugin — meaning your NFT's properties live directly on-chain rather than pointing off to a JSON file that could disappear.

**UMI**
UMI is Metaplex's client framework — it abstracts the wallet, RPC connection, and uploader behind a unified interface. Swapping storage backends (Irys → Bundlr → AWS) is just swapping one `umi.use()` call, the rest of the code doesn't change.

**Irys for storage**
Irys (formerly Bundlr) uploads to Arweave, giving permanent storage. Devnet Irys is free, mainnet charges in SOL. The image and metadata URIs are permanent once uploaded — you can't update them, so getting config right before minting matters.

**Artifact handoff pattern**
Splitting the pipeline into three scripts that communicate through JSON files (rather than one big script) makes each step independently debuggable. If the image upload succeeds but metadata fails, you don't re-upload the image — you just re-run step 2.

**Token-2022 as an alternative**
Token-2022 can also represent NFTs (1 supply, 0 decimals, with the `MetadataPointer` + `TokenMetadata` extensions storing name/uri directly in the mint). It removes the Metaplex dependency entirely but loses built-in royalty enforcement and has weaker marketplace support today.
