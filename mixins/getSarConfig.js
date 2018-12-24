import sarAddr from './getSarAddr'
import {invokeScript} from '../api/global'

export default {
  mixins: [sarAddr],
  methods: {
    async getSarConfig() {
      let scAddr = this.sarAddr.oracle.hash;
      let params = [
        {
          name: 'neo_price',
          param: ['(str)sneo_price'],
          method: 'getTypeB',
        },
        {
          name: 'sneo_price',
          param: ['(str)sneo_price'],
          method: 'getTypeB',
        },
        {
          name: 'gas_price',
          param: ["(str)gas_price"],
          method: 'getTypeB',
        },
        {
          name: 'sds_price',
          param: ["(str)sds_price"],
          method: 'getTypeB'
        },
        {
          name: 'anchor_type_usd',
          param: ["(str)anchor_type_usd"],
          method: 'getTypeB'
        },
        {
          name: 'anchor_type_eur',
          param: ["(str)anchor_type_eur"],
          method: 'getTypeB'
        },
        {
          name: 'anchor_type_jpy',
          param: ["(str)anchor_type_jpy"],
          method: 'getTypeB'
        },
        {
          name: 'anchor_type_gbp',
          param: ["(str)anchor_type_gbp"],
          method: 'getTypeB'
        },
        {
          name: 'anchor_type_gold',
          param: ["(str)anchor_type_gold"],
          method: 'getTypeB'
        },
        {
          name: 'liquidate_line_rate_b',
          param: ["(str)liquidate_line_rate_b"],
          method: 'getTypeA'
        },
        {
          name: 'liquidate_line_rate_c',
          param: ["(str)liquidate_line_rate_c"],
          method: 'getTypeA'
        },
        {
          name: 'liquidate_dis_rate_c',
          param: ["(str)liquidate_dis_rate_c"],
          method: 'getTypeA'
        },
        {
          name: 'liquidate_top_rate_c',
          param: ["(str)liquidate_top_rate_c"],
          method: 'getTypeA'
        },
        {
          name: 'debt_top_c',
          param: ["(str)debt_top_c"],
          method: 'getTypeA'
        },
        {
          name: 'liquidate_line_rateT_c',
          param: ["(str)liquidate_line_rateT_c"],
          method: 'getTypeA'
        },
        {
          name: 'fee_rate_c',
          param: ["(str)fee_rate_c"],
          method: 'getTypeA'
        },
        {
          name: 'issuing_fee_b',
          param: ["(str)issuing_fee_b"],
          method: 'getTypeA'
        },
        {
          name: 'fee_rate_c_year',
          param: ["(str)fee_rate_c_year"],
          method: 'getTypeA'
        },
      ];
      let scHash = eNeo.emitParams(scAddr, params);
      let _r = await invokeScript([scHash]);
      let sarConfig = _r.result[0].stack;
      let tempObj = {};

      if (sarConfig && Array.isArray(sarConfig)) {
        for (let i = 0, len = params.length; i < len; i++) {
          let item = params[i];
          tempObj[item.name] = eNeo.hex2Integer(sarConfig[i].value);
        }
      }
      return tempObj;
    }
  }
}
