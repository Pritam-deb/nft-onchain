import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi";
import wallet from "../../devnet-wallet.json";
import { RPC_ENDPOINT } from "../config";

export function createUmiClient() {
    const umi = createUmi(RPC_ENDPOINT);
    const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
    const signer = createSignerFromKeypair(umi, keypair);
    umi.use(signerIdentity(signer));
    return umi;
}