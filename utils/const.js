export const envs = [
  {
    name: "mainNet",
    label: '主网',
    rpcUrl: "https://apiaggr.nel.group/api",
    apiUrl: "https://api.nel.group/api"
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

// sar contract address
export const sarAddrList = {
  mainNet: {
    sneo: {
      hash: "0xc074a05e9dcf0141cbe6b4b3475dd67baf4dcb60"
    },
    sarC: {
      hash: "0x35f891491c17487ee40e2aa52e5d94117d3af5bf"
    },
    sdusd: {
      hash: "0xb739fd47f42eb4e320fc16a3555765f05a64d432"
    },
    sds: {
      hash: "0xfea5b131f9a9af5e97ec421001a69e2e8fe183ae"
    },
    sarB: {
      hash: "0x82306f524c187537786d07857a447f061f284ad9"
    },
    newToken: {
      hash: "0x3ebdbbd5a56054e7693d9b6bba7cb14d6ba8d5d6"
    },
    oracle: {
      hash: "0x411499182c8fc29157ae29c8fc9fa1d7b10d77e2"
    }
  },
  testNet: {
    sneo: {
      hash: "0x789afc2bba96905d628cb41598c8f8cfcf213b58"
    },
    sarC: {
      hash: "0x56ee43dabb7e9b1bbfc2b059a459a165d8cacf5e"
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
    }
  },
  pri: {
    sneo: {
      hash: "0xa2aeccd6a7a7808b9959866f5463e5dcb911a578"
    },
    sarC: {
      hash: "0x271dd92f34e5a3dab47b8a12eb0ca0a0cee89d4b",
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
    }
  }
};
