import {getOracleConfig} from '../../api/global'

const sarConfig = {
  state: {
    typeA: null,
    typeB: null
  },
  mutations: {
    SET_TYPE_A: (state, typeA) => {
      state.typeA = typeA;
    },
    SET_TYPE_B: (state, typeB) => {
      state.typeB = typeB;
    }
  },
  actions: {
    async getTypeB({commit}) {
      //获取typeB配置参数
      let _typeB = await getOracleConfig(['typeB']);
      let typeB = _typeB.result;
      if (!typeB) {
        return;
      }
      commit('SET_TYPE_B', typeB);
    },
    async getTypeA({commit}) {
      //获取typeB配置参数
      let _typeA = await getOracleConfig(['typeA']);
      let typeA = _typeA.result;
      if (!typeA) {
        return;
      }
      commit('SET_TYPE_A', typeA);
    },
  }
};

export default sarConfig
