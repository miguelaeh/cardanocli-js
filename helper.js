const fs = require("fs");

exports.ownerToString = (ownerList) => {
  let result = "";
  ownerList.forEach(
    (owner) => (result += `--pool-owner-stake-verification-key-file ${owner} `)
  );
  return result;
};

exports.relayToString = (relayList) => {
  let result = "";
  relayList.forEach((relay) => {
    if (!((relay.host || relay.ip) && relay.port) && !relay.multiHost)
      throw new Error("Relay is missing arguments");
    if (relay.host) {
      result += `--single-host-pool-relay ${relay.host} --pool-relay-port ${relay.port} `;
    } else if (relay.ip) {
      result += `--pool-relay-ipv4 ${relay.ip} --pool-relay-port ${relay.port} `;
    } else if (relay.multiHost) {
      result += `--multi-host-pool-relay ${relay.multiHost} `;
    }
  });
  return result;
};

exports.certToString = (dir, certList) => {
  let result = "";
  certList.forEach(
    (cert) =>
      (result += `--certificate ${cert.cert} ${
        cert.script
          ? `--certificate-script-file ${this.jsonToPath(dir, cert.script)} `
          : ""
      } ${
        cert.datum
          ? `--certificate-script-datum-value '${JSON.stringify(cert.datum)}' `
          : ""
      } ${
        cert.redeemer
          ? `--certificate-script-redeemer-value '${JSON.stringify(
              cert.redeemer
            )}' `
          : ""
      } ${
        cert.executionUnits
          ? `--certificate-execution-units "(${
              cert.executionUnits[0] + "," + cert.executionUnits[1]
            })" `
          : ""
      }`)
  );
  return result;
};

exports.withdrawalToString = (dir, withdrawalList) => {
  let result = "";
  withdrawalList.forEach(
    (withdrawal) =>
      (result += `--withdrawal ${withdrawal.stakingAddress}+${
        withdrawal.reward
      } ${
        withdrawal.script
          ? `--withdrawal-script-file ${this.jsonToPath(
              dir,
              withdrawal.script
            )} `
          : ""
      } ${
        withdrawal.datum
          ? `--withdrawal-script-datum-value '${JSON.stringify(
              withdrawal.datum
            )}' `
          : ""
      } ${
        withdrawal.redeemer
          ? `--withdrawal-script-redeemer-value '${JSON.stringify(
              withdrawal.redeemer
            )}' `
          : ""
      } ${
        withdrawal.executionUnits
          ? `--withdrawal-execution-units "(${
              withdrawal.executionUnits[0] + "," + withdrawal.executionUnits[1]
            })" `
          : ""
      }`)
  );
  return result;
};

exports.auxScriptToString = (dir, scriptList) => {
  return scriptList
    .map((script) => `--auxiliary-script-file ${this.jsonToPath(dir, script)}`)
    .join(" ");
};

exports.jsonToPath = (dir, json, type = "script") => {
  let scriptUID = Math.random().toString(36).substr(2, 9);
  fs.writeFileSync(
    `${dir}/tmp/${type}_${scriptUID}.json`,
    JSON.stringify(json)
  );
  return `${dir}/tmp/${type}_${scriptUID}.json`;
};

exports.txInToString = (dir, txInList, isCollateral) => {
  let result = "";
  txInList.forEach(
    (txIn) =>
      (result += `--tx-in${isCollateral ? "-collateral" : ""} ${txIn.txHash}#${
        txIn.txId
      } ${
        txIn.script
          ? `--tx-in-script-file ${this.jsonToPath(dir, txIn.script)} `
          : ""
      } ${
        txIn.datum
          ? `--tx-in-datum-value '${JSON.stringify(txIn.datum)}' `
          : ""
      } ${
        txIn.redeemer
          ? `--tx-in-redeemer-value '${JSON.stringify(txIn.redeemer)}' `
          : ""
      } ${
        txIn.executionUnits
          ? `--tx-in-execution-units "(${
              txIn.executionUnits[0] + "," + txIn.executionUnits[1]
            })" `
          : ""
      }`)
  );
  return result;
};

exports.txOutToString = (txOutList) => {
  let result = "";
  let assetOutStr;
  txOutList.forEach((txOut) => {
    assetOutStr = "";
    result += `--tx-out ${txOut.address}+${txOut.value.lovelace}`;
    Object.keys(txOut.value).forEach((asset) => {
      if (asset == "lovelace") return;
      assetOutStr += `+${txOut.value[asset]} ${asset}`;
    });
    if (assetOutStr)
      result += `+"${assetOutStr.slice(1)}"`;
    txOut.datumHash && (result += ` --tx-out-datum-hash ${txOut.datumHash}`);
    result += " ";
  });
  return result;
};

exports.signingKeysToString = (signingKeys) => {
  let result = "";
  signingKeys.forEach(
    (signingKey) => (result += `--signing-key-file ${signingKey} `)
  );
  return result;
};

exports.witnessFilesToString = (witnessFiles) => {
  let result = "";
  witnessFiles.forEach(
    (witnessFile) => (result += `--witness-file ${witnessFile} `)
  );
  return result;
};

exports.fileException = (callback) => {
  try {
    callback();
  } catch {}
};

exports.setKeys = (obj, path, value) => {
  var pList = path.split(".");
  var len = pList.length;
  for (var i = 0; i < len - 1; i++) {
    var elem = pList[i];
    if (!obj[elem]) obj[elem] = {};
    obj = obj[elem];
  }

  obj[pList[len - 1]] = value;
};

exports.fileExists = (files) => {
  for (file of files) {
    let exists;
    this.fileException(() => {
      exists = fs.readFileSync(file);
    });
    if (exists)
      throw new Error(
        `File ${file} already exists. Remove it manually if you want to create a new file.`
      );
  }
};

exports.mintToString = (dir, minting) => {
  let result = `--mint="`;
  minting.forEach((mint, index, arr) => {
    if (
      !(
        (mint.quantity || mint.asset) &&
        (mint.action == "mint" || mint.action == "burn")
      )
    )
      throw new Error("action, asset and quantity property required");
    if (Object.is(arr.length - 1, index)) {
      result += `${mint.action == "mint" ? "" : "-"}${mint.quantity} ${
        mint.asset
      }`;
    } else {
      result += `${mint.action == "mint" ? "" : "-"}${mint.quantity} ${
        mint.asset
      }+`;
    }
  });
  result = result.trim();
  result += `" `;
  const usedScripts = [];
  result += minting
    .map((mint) => {
      const script = this.jsonToPath(dir, mint.script);
      if (usedScripts.includes(script)) return "";
      usedScripts.push(script);
      return `--mint-script-file ${script} ${
        mint.redeemer
          ? `--mint-redeemer-value '${JSON.stringify(mint.redeemer)}' `
          : ""
      } ${
        mint.executionUnits
          ? `--mint-execution-units "(${
              mint.executionUnits[0] + "," + mint.executionUnits[1]
            })" `
          : ""
      }`;
    })
    .join(" ");
  return result;
};

exports.multiAssetToString = (options) => {
  let result = `"${options.address} + `;
  result += `${options.value.lovelace}`;
  Object.keys(options.value).forEach((asset) => {
    if (asset == "lovelace") return;
    result += `+${options.value[asset]} ${asset}`;
  });
  result += `"`;
  return result;
};
