import { generateSigner } from "@metaplex-foundation/umi";
import { create, mplCore, addPlugin, ruleSet } from "@metaplex-foundation/mpl-core";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { readFileSync, writeFileSync } from "fs";
import { NFT_CONFIG } from "../config";
import { createUmiClient } from "../utils/umi";

(async () => {
    let metadataUri: string;
    try {
        const metadataArtifact = JSON.parse(readFileSync("artifacts/metadata.json", "utf-8"));
        metadataUri = metadataArtifact.uri;
    } catch {
        throw new Error("artifacts/metadata.json not found — run nft_metadata.ts first");
    }

    const umi = createUmiClient();
    umi.use(mplCore());

    const asset = generateSigner(umi);

    const tx = await create(umi, {
        asset,
        name: NFT_CONFIG.name,
        uri: metadataUri,
        plugins: [
            {
                type: 'Royalties',
                basisPoints: 500,
                creators: [
                    { address: umi.identity.publicKey, percentage: 100 },
                ],
                ruleSet: ruleSet('None'),
            },
            {
                type: 'Attributes',
                attributeList: [
                    { key: "Rarity", value: "Legendary" },
                ],
            }
        ]
    }).sendAndConfirm(umi);

    const signature = base58.deserialize(tx.signature)[0];
    const assetAddress = asset.publicKey;

    console.log("Signature:", signature);
    console.log("Asset Address:", assetAddress);

    writeFileSync(
        "artifacts/nft.json",
        JSON.stringify({ signature, assetAddress }, null, 2)
    );
})();
