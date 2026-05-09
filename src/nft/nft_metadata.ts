import { readFileSync, writeFileSync } from "fs";
import { NFT_CONFIG } from "../config";
import { createIrysUmiClient } from "../utils/irys";

(async () => {
    let imageUri: string;
    try {
        const imageArtifact = JSON.parse(readFileSync("artifacts/image.json", "utf-8"));
        imageUri = imageArtifact.uri;
    } catch {
        throw new Error("artifacts/image.json not found — run nft_image.ts first");
    }

    const umi = createIrysUmiClient();

    const metadata = {
        name: NFT_CONFIG.name,
        description: NFT_CONFIG.description,
        image: imageUri,
        attributes: NFT_CONFIG.attributes,
        properties: {
            files: [{ type: NFT_CONFIG.imageMimeType, uri: imageUri }],
            category: "image",
        },
    };

    const uri = await umi.uploader.uploadJson(metadata);
    console.log("Metadata URI:", uri);

    writeFileSync("artifacts/metadata.json", JSON.stringify({ uri }, null, 2));
})();
