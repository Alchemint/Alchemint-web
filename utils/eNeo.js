import axios from 'axios';

// 配置
let config = {
  neoId: "0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b",
  neoGasId: "0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7"
};

// 从wif获取私钥公钥地址等相关信息
function getInfoFromWIF(wif) {
  let prikey = ThinNeo.Helper.GetPrivateKeyFromWIF(wif);
  let pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(prikey);
  let address = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);
  return {
    wif: wif,
    prikey: prikey.toHexString(),
    pubkey: pubkey.toHexString(),
    address: address
  };
}

// 只转Nep5资产快捷方法
function transferNep5(wif, assertId, toAddr, amount, utxos, payfee, isColdWallet = false) {
  let address;
  if (!isColdWallet) {
    address = getInfoFromWIF(wif)["address"];
  } else {
    let pubkey = window.neoLedger.pubkey.hexToBytes();
    address = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);
  }
  let method = "transfer";
  let params = ["(address)" + address, "(address)" + toAddr, "(integer)" + amount];

  return callC(wif, assertId, method, params, utxos, payfee, isColdWallet);
}

// 只转全局资产快捷方法
function transferGlobalCoin(wif, utxos, assertId, toAddr, amount, payfee, isColdWallet = false) {
  if (assertId === "neo") {
    assertId = config.neoId;
  }
  if (assertId === "gas") {
    assertId = config.neoGasId;
  }
  let globalCoinParams = {
    assertId: assertId,
    amount: amount,
    toAddr: toAddr,
    utxos: utxos
  };
  return callC2(wif, globalCoinParams, payfee, null, isColdWallet);
}

// 直接调用合约（与utxo无关）
async function callC(wif, scHash, method, params, utxos, payfee, isColdWallet) {
  console.log(arguments);
  //判断是否是leader硬件钱包登录
  let prikey, pubkey;
  if (!isColdWallet) {
    prikey = ThinNeo.Helper.GetPrivateKeyFromWIF(wif);
    pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(prikey);
  } else {
    pubkey = window.neoLedger.pubkey.hexToBytes();
  }

  let address = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);
  let addressHash = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(address);
  // 封装交易
  let tran = new ThinNeo.Transaction();
  tran.type = ThinNeo.TransactionType.InvocationTransaction;
  tran.extdata = new ThinNeo.InvokeTransData();
  let sb = new ThinNeo.ScriptBuilder();
  let scriptaddress = scHash.hexToBytes().reverse();
  //生成随机数
  let random_uint8 = Neo.Cryptography.RandomNumberGenerator.getRandomValues < Uint8Array > (new Uint8Array(32));
  let random_int = Neo.BigInteger.fromUint8Array(random_uint8);
  //let randomNum = new Neo.BigInteger(Math.floor(Math.random() * 10000)); 原生成随机数方式
  sb.EmitPushNumber(random_int);
  sb.Emit(ThinNeo.OpCode.DROP);
  sb.EmitParamJson(params);
  sb.EmitPushString(method);
  sb.EmitAppCall(scriptaddress);
  tran.extdata.script = sb.ToArray();
  tran.inputs = [];
  tran.outputs = [];
  tran.attributes = [];
  tran.attributes[0] = new ThinNeo.Attribute();
  tran.attributes[0].usage = ThinNeo.TransactionAttributeUsage.Script;
  tran.attributes[0].data = addressHash;
  //假设需要手续费
  let gasUtxos = [];
  utxos.forEach(function (item) {
    if (item.asset === config.neoGasId) {
      gasUtxos.push(item);
    }
  });
  if (payfee && gasUtxos.length > 0) {
    //创建fee的输入输出
    let fee = Neo.Fixed8.parse(payfee);
    let feeRes = creatInputAndOutput(gasUtxos, fee);
    tran.inputs = feeRes.inputs;
    tran.outputs = feeRes.outputs;
  }
  let msg = tran.GetMessage();


  //签名
  let signdata;
  if (!isColdWallet) {
    signdata = ThinNeo.Helper.Sign(msg, prikey);
  } else {
    msg = msg.toHexString();
    try {
      signdata = await window.neoLedger.signMessage(msg);
    } catch (e) {
      console.log(e);
      return e;
    }
    signdata = signdata.hexToBytes();
  }

  //添加观察者
  tran.AddWitness(signdata, pubkey, address);
  let txid = "0x" + tran.GetHash().clone().reverse().toHexString();
  let rawData = tran.GetRawData().toHexString();
  return {
    txid: txid,
    rawData: rawData
  };

}

// 调用合约底层方法
async function callC2(wif, globalCoinParams, payfee, callParams, isColdWallet = false) {
  console.log(arguments);
  //判断是否是leader硬件钱包登录
  let prikey, pubkey;
  if (!isColdWallet) {
    prikey = ThinNeo.Helper.GetPrivateKeyFromWIF(wif);
    pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(prikey);
  } else {
    pubkey = window.neoLedger.pubkey.hexToBytes();
  }

  let address = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);
  let addressHash = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(address);
  let toAddrHash = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(globalCoinParams.toAddr);
  let assertId = globalCoinParams.assertId;
  if (assertId === "neo") {
    assertId = config.neoId;
  }
  if (assertId === "gas") {
    assertId = config.neoGasId;
  }
  let assertIdBytes = assertId.hexToBytes().reverse();
  let sendcount = Neo.Fixed8.parse(toNonExponential(globalCoinParams.amount));

  // 封装交易信息
  let tran = new ThinNeo.Transaction();
  tran.type = ThinNeo.TransactionType.ContractTransaction;
  tran.version = 0; //0 or 1
  tran.attributes = [];

  // 封装utxo的input和output
  tran.inputs = [];
  tran.outputs = [];
  let utxos = [];
  let gasUtxos = [];
  globalCoinParams.utxos.forEach(function (item) {
    if (item.asset === assertId) {
      utxos.push(item);
    }
    if (item.asset === config.neoGasId) {
      gasUtxos.push(item);
    }
  });
  // 封装input
  let count = Neo.Fixed8.Zero;
  for (let i = 0; i < utxos.length; i++) {
    let item = utxos[i];
    let input = new ThinNeo.TransactionInput();
    input.hash = item.txid.hexToBytes().reverse();
    input.index = item.n;
    input["_addr"] = item.addr;
    tran.inputs.push(input);
    count = count.add(Neo.Fixed8.parse(item.value));
    if (count.compareTo(sendcount) > 0) break;
  }
  if (count.compareTo(sendcount) < 0) {
    console.log("utxo input error !!!");
    return false;
  }
  //输出
  let output = new ThinNeo.TransactionOutput();
  output.assetId = assertIdBytes;
  output.value = sendcount;
  output.toAddress = toAddrHash;
  tran.outputs.push(output);
  //找零
  let change = count.subtract(sendcount);
  if (change.compareTo(Neo.Fixed8.Zero) > 0) {
    let outputChange = new ThinNeo.TransactionOutput();
    outputChange.toAddress = addressHash;
    outputChange.value = change;
    outputChange.assetId = assertIdBytes;
    tran.outputs.push(outputChange);

    /**假设需要手续费 gas*/
    if (assertId === config.neoGasId) { //如果转账的金额是gas
      if (payfee && gasUtxos.length > 0) {
        let fee = Neo.Fixed8.parse(payfee);
        let len = tran.outputs.length;
        if (payfee && tran.outputs && len > 1) {
          tran.outputs[len - 1].value = tran.outputs[len - 1].value.subtract(fee);
        }
      }
    } else {
      if (payfee && gasUtxos.length > 0) {
        //创建fee的输入输出
        let fee = Neo.Fixed8.parse(payfee);
        let feeRes = creatInputAndOutput(gasUtxos, fee);
        tran.inputs = tran.inputs.concat(feeRes.inputs);
        tran.outputs = tran.outputs.concat(feeRes.outputs);
      }
    }
  }

  // 封装调用合约参数
  if (callParams) {
    tran.type = ThinNeo.TransactionType.InvocationTransaction;
    tran.extdata = new ThinNeo.InvokeTransData();
    let sb = new ThinNeo.ScriptBuilder();
    let scHash = callParams.scHash.hexToBytes().reverse();
    sb.EmitParamJson(callParams.params);
    sb.EmitPushString(callParams.method);
    sb.EmitAppCall(scHash);
    tran.extdata.script = sb.ToArray();
    tran.extdata.gas = Neo.Fixed8.fromNumber(1.0);
  }
  let msg = tran.GetMessage();

  //签名
  let signdata;
  if (!isColdWallet) {
    signdata = ThinNeo.Helper.Sign(msg, prikey);

  } else {
    msg = msg.toHexString();
    try {
      signdata = await window.neoLedger.signMessage(msg);
    } catch (e) {
      console.log(e);
      return e;
    }
    signdata = signdata.hexToBytes();
  }

  //添加观察者
  tran.AddWitness(signdata, pubkey, address);
  let txid = "0x" + tran.GetHash().clone().reverse().toHexString();
  let rawData = tran.GetRawData().toHexString();
  return {
    txid: txid,
    rawData: rawData
  };
};

/**
 * 创建一个交易中的输入和输出
 * @param utxos 资产的utxo
 * @param sendcount 输出总数
 * @param target 对方地址
 * @returns res:{ inputs: ThinNeo.TransactionInput[], outputs: ThinNeo.TransactionOutput[] }
 */
function creatInputAndOutput(utxos, sendcount, target) {
  console.log(utxos);
  let count = Neo.Fixed8.Zero;
  let res = {};
  res["inputs"] = [];
  res["outputs"] = [];
  let scraddr = "";
  let assetId = '';
  for (let i = 0; i < utxos.length; i++) {
    console.log(utxos[i]);
    console.log(utxos[i].txid);
    let input = new ThinNeo.TransactionInput();
    input.hash = utxos[i].txid.hexToBytes().reverse();
    input.index = utxos[i].n;
    input["_addr"] = utxos[i].addr;//利用js的隨意性，臨時傳個值
    res.inputs.push(input);        //将utxo塞入input
    count = count.add(Neo.Fixed8.parse(utxos[i].value.toString()));//添加至count中
    scraddr = utxos[i].addr;
    assetId = utxos[i].asset.hexToBytes().reverse();
    if (count.compareTo(sendcount) > 0) //判断输入是否足够
    {
      break;      //如果足够则跳出循环
    }
  }
  if (count.compareTo(sendcount) >= 0) {
    //输出
    if (target) {
      if (sendcount.compareTo(Neo.Fixed8.Zero) > 0) {
        let output = new ThinNeo.TransactionOutput();
        output.assetId = assetId;
        output.value = sendcount;
        output.toAddress = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(target);
        res.outputs.push(output);
      }
    }
    let change = count.subtract(sendcount); //应该找零的值
    if (change.compareTo(Neo.Fixed8.Zero) > 0) {
      let outputchange = new ThinNeo.TransactionOutput();
      outputchange.toAddress = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(scraddr);
      outputchange.value = change;
      outputchange.assetId = assetId;
      res.outputs.push(outputchange);
    }
    console.log(res);
    return res;
  } else {
    throw "You don't have enough utxo;";
  }
}

//科学记数法转换
function toNonExponential(num) {
  let m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
  return num.toFixed(Math.max(0, (m[1] || '').length - m[2]));
}

// hex转字符串
function hex2String(hex) {
  return ThinNeo.Helper.Bytes2String(hex.toString().hexToBytes());
}

// hex转int
function hex2Integer(hex) {
  if (!hex) return 0;
  return +new Neo.BigInteger(hex.toString().hexToBytes());
}

// 大小端序转换
function endianChange(str) {
  if (!str.length) return;
  let result = [];
  if (str.indexOf("0x") === 0) {
    str = str.slice(2);
  } else {
    result.push("0x");
  }
  let smaArray = str.hexToBytes().reverse();
  for (let i = 0; i < smaArray.length; i++) {
    let item = smaArray[i];
    let _item = item.toString(16);
    let itemStr = item < 16 ? "0" + _item : _item;
    result.push(itemStr);
  }
  return result.join("");
}

// addr转hex
function addr2Hex(addr) {
  let _addrArr = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(addr);
  return _addrArr.toHexString();
}

// 字符串转hex
function string2Hex(str) {
  if (str === "") return "";
  let hexChar = [];
  for (let i = 0; i < str.length; i++) {
    hexChar.push(str.charCodeAt(i).toString(16));
  }
  return hexChar;
}

// rpc调用
function getRpc(method) {
  for (let _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  let urlStr = config.apiUrl + "?jsonrpc=2.0&id=1&method=" + method + "&params=" + JSON.stringify(args);
  return axios.get(urlStr);
}

// rpc调用
function postRpc(method) {
  for (let _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  let params = {
    "jsonrpc": "2.0",
    "method": method,
    "id": "1",
    "params": args
  };
  return axios.post(config.apiUrl, params);
}

// 处理参数，返回sb-ScriptBuilder
function emitParams(scHash, params) {
  let sb = new ThinNeo.ScriptBuilder();
  let scBytes = scHash.hexToBytes().reverse();

  params.forEach(function (item) {
    let param = item.param ? item.param : [];
    sb.EmitParamJson(param); //Parameter list
    sb.EmitPushString(item.method); //Method
    sb.EmitAppCall(scBytes); //nep5脚本
  });
  return sb.ToArray().toHexString();
}


export default {
  config,
  getInfoFromWIF,
  transferNep5,
  transferGlobalCoin,
  callC,
  callC2,
  creatInputAndOutput,
  toNonExponential,
  hex2Integer,
  hex2String,
  endianChange,
  addr2Hex,
  string2Hex,
  getRpc,
  postRpc,
  emitParams,
}
