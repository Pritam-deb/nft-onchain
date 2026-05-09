import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { IRYS_URL } from "../config";
import { createUmiClient } from "./umi";

export function createIrysUmiClient() {
    const umi = createUmiClient();
    umi.use(irysUploader({ address: IRYS_URL }));
    return umi;
}