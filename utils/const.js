export const envs = [
  {
    name: "neo",
    label: '主网',
    rpcUrl: "https://apiaggr.nel.group/api",
    apiUrl: "https://api.alchemint.io/api/mainnet"
  },
  {
    name: "testNet",
    label: '测试网',
    rpcUrl: "http://47.52.188.214:10332",
    apiUrl: "https://api.alchemint.io/api/testnet"
  },
  {
    name: "pri",
    label: '私链',
    rpcUrl: "http://47.52.188.214:10332",
    apiUrl: "https://api.alchemint.io/api/pri"
  }
];

export const sarAddrList = {
  neo: {
    sneo: {
      hash: "0xa2aeccd6a7a7808b9959866f5463e5dcb911a578"
    },
    sarC: {
      hash: "0x754c10820de5f6d9b75091c134294d6cd986c89e"
    },
    sdusd: {
      hash: "0x7146278a76c33fc6bb870fcaa428e3cdb16809ac"
    },
    sds: {
      hash: "0x6fad54d8cc692fc808fd97a207836a846c217705"
    },
    sarB: {
      hash: "0x203205eef5a81c093d04b5c591d8f2308598caa2"
    },
    newToken: {
      hash: "0x8e9530352c4e8b5c6c5eea5b82c7c46fd89cae6a"
    },
    oracle: {
      hash: "0xfde69a7dd2a1c948977fb3ce512158987c0e2197"
    },
    lock: {
      hash: '0x85d3e487098b43fb1df5d2ca5d5201bdb19cc43d',
    }
  },
  testNet: {
    sneo: {
      hash: "0x789afc2bba96905d628cb41598c8f8cfcf213b58"
    },
    sarC: {
      hash: "0x1775f1af5df77ff876b2d7a06e256f1388199dc7"
    },
    sdusd: {
      hash: "0x80fe8494d517a0c9caaabd5ddffd48593f67d70f"
    },
    sds: {
      hash: "0x4b4deb4caad37fcfbadcfefc0bebfc869ff523ea"
    },
    sarB: {
      hash: "0x7a173e56605ff5f47a1ffd7b071970eacf98ca25"
    },
    newToken: {
      hash: "0x5125f12e6b2b03f20873895dcf9c39aaf89940e9"
    },
    oracle: {
      hash: "0xfde69a7dd2a1c948977fb3ce512158987c0e2197"
    },
    lock: {
      hash: '0xd84af467b65a1e6c120c1a89bd93ff9b2137a37b'
    }
  },
  pri: {
    sneo: {
      hash: "0xa2aeccd6a7a7808b9959866f5463e5dcb911a578"
    },
    sarC: {
      hash: "0xb4df68fd65a3ce11c7d55325f95845be100b9710",
    },
    sdusd: {
      hash: "0x46d31e98371937464b44a60bed2ba027b036da59",
    },
    sds: {
      hash: "0xfea5b131f9a9af5e97ec421001a69e2e8fe183ae"
    },
    sarB: {
      hash: "0x203205eef5a81c093d04b5c591d8f2308598caa2"
    },
    newToken: {
      hash: "0x8e9530352c4e8b5c6c5eea5b82c7c46fd89cae6a"
    },
    oracle: {
      hash: "0xfde69a7dd2a1c948977fb3ce512158987c0e2197"
    },
    lock: {
      hash: '0x1b8c076996f09c35a54978ff7f1d0151201302fe'
    }
  }
};
