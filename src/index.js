import { ethers } from "ethers";
import { PluginClient } from "@remixproject/plugin";
import { createClient } from "@remixproject/plugin-webview";

const client = createClient(new PluginClient());
const wallet = ethers.Wallet.createRandom();
const signingKey = wallet._signingKey();
document.getElementById('signer').options[0].innerHTML = "JS Wallet: " + wallet.address;

function sign() {
    const invokerValue = document.getElementById("invoker").value;
    const commitValue = document.getElementById("commit").value;
    const invokerAddress = ethers.utils.arrayify(invokerValue);
    const commit = commitValue == '' ? Array(32).fill(0x00) : ethers.utils.arrayify(commitValue);
    if (invokerAddress.length != 20) {
        throw "invalid invoker address length";
    }
    if (commit.length != 32) {
        throw "invalid commit length";
    }
    const hash = ethers.utils.keccak256(ethers.utils.concat([0x03, Array(12).fill(0x00), invokerAddress, commit]));
    return signingKey.signDigest(hash);
}

function print(yParity, r, s) {
    document.getElementById("yParity").value = yParity;
    document.getElementById("r").value = r;
    document.getElementById("s").value = s;
}

document.getElementById("signBtn").addEventListener("click", function() {
    try {
        const sig = sign();
        print(sig.v-27, sig.r, sig.s);
    } catch (e) {
        console.error(e);
        print("","","");
    }
});
