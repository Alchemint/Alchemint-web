import eNeo from '~/utils/eNeo'

function getCurrentUser(me) {
  let cUser = sessionStorage.getItem("currentUser");
  me.$store.commit('SET_CURRENT_USER', JSON.parse(cUser));
  return JSON.parse(cUser);
}

function setCurrentUer(user, me) {
  if (typeof user === "string") {
    sessionStorage.setItem("currentUser", user);
    me.$store.commit('SET_CURRENT_USER', JSON.parse(user));
    return;
  }
  let cUser = JSON.stringify(user);
  sessionStorage.setItem("currentUser", cUser);
  me.$store.commit('SET_CURRENT_USER', user);
}

function getUsers(me) {
  let users = sessionStorage.getItem("users");
  me.$store.commit('SET_USERS', JSON.parse(users));
  return JSON.parse(users);
}

function setUsers(users, me) {
  if (typeof users === "string") {
    sessionStorage.setItem("users", users);
    me.$store.commit('SET_USERS', JSON.parse(users));
    return;
  }
  let _users = JSON.stringify(users);
  sessionStorage.setItem("users", _users);
  me.$store.commit('SET_USERS', users);
}

function logout(me) {
  sessionStorage.removeItem("currentUser");
  sessionStorage.removeItem("users");
  sessionStorage.removeItem('loginMethod');
  me.$store.commit('SET_USERS', null);
  me.$store.commit('SET_CURRENT_USER', null);
}

function loginColdWallet(user, me) {
  setCurrentUer(user, me);
  setUsers([user], me);
}

function loginWif(wif, me) {
  let user = eNeo.getInfoFromWIF(wif);
  setCurrentUer(user, me);
  setUsers([user], me);
}

function getWifFromJson(account, scrypt, pwd) {
  return new Promise((resolve, reject) => {
    account.getPrivateKey(scrypt, pwd, (info, result) => {
      if (info == "finish") {
        let wif = ThinNeo.Helper.GetWifFromPrivateKey(result);
        resolve(wif);
        return;
      }
      reject(result);
    });
  })
}

async function loginJson(json, pwd, me) {
  let _users = new ThinNeo.nep6wallet();
  let users = [];
  _users.fromJsonStr(json);
  let scrypt = _users.scrypt;
  let accounts = _users.accounts;
  for (let i = 0; i < accounts.length; i++) {
    let account = accounts[i];
    if (!account.nep2key) continue;
    let wif = await getWifFromJson(account, scrypt, pwd);
    users.push(eNeo.getInfoFromWIF(wif));
  }
  setUsers(users, me);
  setCurrentUer(users[0], me);
}

function createUser(name, pwd, me) {
  let priKey = Neo.Cryptography.RandomNumberGenerator.getRandomValues(new Uint8Array(32));
  let wif = ThinNeo.Helper.GetWifFromPrivateKey(priKey);
  let user = eNeo.getInfoFromWIF(wif);
  setCurrentUer(user, me);
  setUsers([user], me);
  return user;
}

function getJsonFromWif(name, wif, pwd) {
  let user = eNeo.getInfoFromWIF(wif);
  let wallet = new ThinNeo.nep6wallet();
  wallet.scrypt = new ThinNeo.nep6ScryptParameters();
  wallet.scrypt.N = 16384;
  wallet.scrypt.r = 8;
  wallet.scrypt.p = 8;
  wallet.accounts = [];
  wallet.accounts[0] = new ThinNeo.nep6account();
  wallet.accounts[0].address = user.address;
  return new Promise((resolve, reject) => {
    let prikey = user.prikey.hexToBytes();
    ThinNeo.Helper.GetNep2FromPrivateKey(prikey, pwd, wallet.scrypt.N, wallet.scrypt.r, wallet.scrypt.p, (info, result) => {
      if (info == "finish") {
        wallet.accounts[0].nep2key = result;
        wallet.accounts[0].contract = new ThinNeo.contract();
        wallet.accounts[0].contract.script = ThinNeo.Helper.GetAddressCheckScriptFromPublicKey(user.pubkey.hexToBytes()).toHexString();
        let jsonStr = JSON.stringify(wallet.toJson());
        resolve(jsonStr);
        return;
      }
      reject(result);
    });
  });
}

function downFile(filename, content, tips) {
  let eleLink = document.createElement('a');
  if (!('download' in eleLink)) {
    alert(tips);
    return;
  }
  eleLink.download = filename;
  eleLink.style.display = 'none';
  //change character content to blob address
  let blob = new Blob([content]);
  eleLink.href = URL.createObjectURL(blob);
  //trigger Click
  document.body.appendChild(eleLink);
  eleLink.click();
  //remove
  document.body.removeChild(eleLink);
};

export {
  getCurrentUser,
  setCurrentUer,
  getUsers,
  setUsers,
  logout,
  loginWif,
  getWifFromJson,
  loginJson,
  createUser,
  getJsonFromWif,
  downFile,
  loginColdWallet
};
