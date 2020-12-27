const CardanoJs = require("./index.js");

const cardanoJs = new CardanoJs({ era: "allegra" });

// console.log(cardanoJs.queryUtxo("Ae2tdPwUPEYwNguM7TB3dMnZMfZxn1pjGHyGdjaF4mFqZF9L3bj6cdhiH8t"));

const createWallet = accout => {
    cardanoJs.addressKeyGen(accout);
    cardanoJs.stakeAddressKeyGen(accout);
    cardanoJs.stakeAddressBuild(accout);
    cardanoJs.addressBuild(accout);
    return [cardanoJs.address(accout), cardanoJs.stakingAddress(accout)];
}

let wallet = createWallet("Wow");

console.log(wallet);