import { createGenericFile } from "@metaplex-foundation/umi";
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { NFT_CONFIG } from "../config";
import { createIrysUmiClient } from "../utils/irys";

(async () => {
    const umi = createIrysUmiClient();

    const imageBuffer = readFileSync(NFT_CONFIG.imagePath);
    const filename = path.basename(NFT_CONFIG.imagePath);
    const file = createGenericFile(imageBuffer, filename, {
        contentType: NFT_CONFIG.imageMimeType,
    });

    const [uri] = await umi.uploader.upload([file]);
    console.log("Image URI:", uri);

    writeFileSync("artifacts/image.json", JSON.stringify({ uri }, null, 2));
})();
