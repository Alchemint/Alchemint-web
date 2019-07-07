import {BN} from '~/utils/core'

export default {
  methods: {
    /**
     *
     * @param {*} locked  SNEO已抵押数量
     * @param {*} hasDrawed SDUSD已发行数量
     * @param {*} rate    当前SAR的抵押率
     * @param {*} lineRateC  liquidate_line_rate_c的清算触发抵押率
     */
    getSarCStatus(locked, hasDrawed, rate, lineRateC) {
      //状态
      let status;
      if (rate >= lineRateC + 50) {
        status = "1";
      } else if (rate >= lineRateC && rate < lineRateC + 50) {
        status = "2";
      } else if (rate < lineRateC) {
        status = "3";
      }

      if (Number(locked) === 0 || Number(hasDrawed) === 0 || rate === 0) {
        status = "0";
      }
      return status;
    },
    
    /**
     *
     * @param {*} locked  SNEO已抵押数量
     * @param {*} hasDrawed SDUSD已发行数量
     * @param {*} sneo_price   SNEO的价格
     * @param {*} lineRateC  liquidate_line_rate_c的清算触发抵押率
     */
    getRateAndStatus(locked, hasDrawed, sneo_price, lineRateC) {
      //抵押率
      let rate;
      if (Number(hasDrawed) > 0) {
        rate = new BN(sneo_price)
          .times(locked)
          .div(hasDrawed)
          .times(100)
          .dp(8, 3)
          .toNumber();
      } else {
        rate = 0;
      }

      //状态
      let status = this.getSarCStatus(locked, hasDrawed, rate, lineRateC);

      return {
        rate,
        status
      };
    }
  }
};
