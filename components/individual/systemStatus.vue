<template>
  <el-card class="border-card content-no-padding">
    <div slot="header" class="border-card-header">
      <span class="border-card-header__title">{{$t('individual.systemStatus.title')}}</span>
    </div>

    <div class="system-info" v-if="data">
      <div class="fl">
        <div class="system-item">
          <div class="system-item__val">{{data.sneoTotalShow | numFormat}}</div>
          <div class="system-item__title">{{$t('individual.systemStatus.sneoTotal')}}</div>
        </div>
        <div class="system-item">
          <div class="system-item__val">{{data.sdusdTotalShow | numFormat}}</div>
          <div class="system-item__title">{{$t('individual.systemStatus.sdusdTotal')}}</div>
        </div>
        <div class="system-item">
          <div class="system-item__val">{{data.total_rate | numFormat}}</div>
          <div class="system-item__title">{{$t('individual.systemStatus.allRate')}}</div>
        </div>
      </div>
      <div class="fl">
        <div class="system-item">
          <div class="system-item__val">{{data.liquidate_line_rate_c | numFormat}}</div>
          <div class="system-item__title">{{$t('individual.systemStatus.liquidateRate')}}</div>
        </div>
        <div class="system-item">
          <div class="system-item__val">{{data.liquidate_dis_rate_c | numFormat}}</div>
          <div class="system-item__title">{{$t('individual.systemStatus.liquidateDis')}}</div>
        </div>
        <div class="system-item">
          <div class="system-item__val">{{data.fee_rate_c_show | numFormat}}</div>
          <div class="system-item__title">{{$t('individual.systemStatus.issuingRate')}}</div>
        </div>
        <div class="system-item" style="width: 220px">
          <div class="system-item__val">{{data.debt_top_c_show | numFormat}}</div>
          <div class="system-item__title">{{$t('individual.systemStatus.deptTop')}}</div>
        </div>
      </div>
    </div>

    <div class="system-info" v-else>
      <div class="fl">
        <div class="system-item">
          <div class="system-item__val">--</div>
          <div class="system-item__title">{{$t('individual.systemStatus.sneoTotal')}}</div>
        </div>
        <div class="system-item">
          <div class="system-item__val">--</div>
          <div class="system-item__title">{{$t('individual.systemStatus.sdusdTotal')}}</div>
        </div>
        <div class="system-item">
          <div class="system-item__val">--</div>
          <div class="system-item__title">{{$t('individual.systemStatus.allRate')}}</div>
        </div>
      </div>

      <div class="fl">
        <div class="system-item">
          <div class="system-item__val">--</div>
          <div class="system-item__title">{{$t('individual.systemStatus.liquidateRate')}}</div>
        </div>
        <div class="system-item">
          <div class="system-item__val">--</div>
          <div class="system-item__title">{{$t('individual.systemStatus.liquidateDis')}}</div>
        </div>
        <div class="system-item">
          <div class="system-item__val">--</div>
          <div class="system-item__title">{{$t('individual.systemStatus.issuingRate')}}</div>
        </div>
        <div class="system-item" style="width: 220px">
          <div class="system-item__val">--</div>
          <div class="system-item__title">{{$t('individual.systemStatus.deptTop')}}</div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
  import sarAddr from '../../mixins/getSarAddr'
  import {invokeScript} from '../../api/global'
  import {formatPrecision, bigmath, printNumber} from '../../utils'
  import {numFormat} from '../../filters'

  export default {
    name: 'systemStatus',
    props: {
      sarConfig: {
        type: Object,
        required: true,
      }
    },
    filters: {
      numFormat,
    },
    data() {
      return {
        data: null,
      }
    },
    mixins: [sarAddr],
    async mounted() {
      //total sneo collateralized
      let sneo_total = await this.getSneoTotal();

      //total sdusd issued
      let sdusd_total = await this.getSdusdTotal();
      let sneoTotalShow = formatPrecision(
        printNumber(
          bigmath.chain(bigmath.bignumber(sneo_total))
            .divide(bigmath.bignumber(bigmath.pow(10, 8)))
            .done()
        ), 2
      );
      let sdusdTotalShow = formatPrecision(
        printNumber(
          bigmath.chain(bigmath.bignumber(sdusd_total))
            .divide(bigmath.bignumber(bigmath.pow(10, 8)))
            .done()
        ), 2
      );
      let {
        sneo_price, liquidate_line_rate_c, liquidate_dis_rate_c,
        liquidate_top_rate_c, debt_top_c, liquidate_line_rateT_c, fee_rate_c, fee_rate_c_year
      } = this.sarConfig;

      //overall mortgage rate
      let total_rate;
      if (sdusd_total) {
        total_rate = formatPrecision(
          printNumber(
            bigmath.chain(bigmath.bignumber(sneo_price))
              .multiply(bigmath.bignumber(sneo_total))
              .divide(bigmath.bignumber(bigmath.pow(10, 8)))
              .multiply(bigmath.bignumber(100))
              .divide(bigmath.bignumber(sdusd_total))
              .done()
          ), 2
        ) + '%';
      } else {
        total_rate = '--';
      }

      //issuing fee (yearly)
      let fee_rate_c_show = Math.round(printNumber(
        bigmath.chain(bigmath.bignumber(fee_rate_c))
          .multiply(bigmath.bignumber(1500000))
          .multiply(bigmath.bignumber(100))
          .divide(bigmath.bignumber(bigmath.pow(10, 16)))
          .done()
      ));

      //overall issueing ceiling
      let debt_top_c_show = formatPrecision(
        printNumber(
          bigmath.chain(bigmath.bignumber(debt_top_c))
            .divide(bigmath.bignumber(bigmath.pow(10, 8)))
            .done()
        ), 2
      );
      this.data = {
        sneo_total,
        sdusd_total,
        sneoTotalShow,
        sdusdTotalShow,
        debt_top_c,
        liquidate_line_rate_c: `${liquidate_line_rate_c}%`,
        liquidate_dis_rate_c: `${liquidate_dis_rate_c}%`,
        liquidate_top_rate_c: `${liquidate_top_rate_c}%`,
        liquidate_line_rateT_c: `${liquidate_line_rateT_c}%`,
        fee_rate_c_show: `${fee_rate_c_show}%`,
        debt_top_c_show,
        total_rate: total_rate,
      };
    },
    methods: {
      async getSneoTotal() {
        let scAddr = this.sarAddr.sneo.hash;
        let params = [
          {
            param: ["(hex)" + this.sarAddr.sarC.hash],
            method: "balanceOf"
          }
        ];
        let scHash = eNeo.emitParams(scAddr, params);
        let _r = await invokeScript([scHash]);
        let r = _r.result[0].stack;
        let total = eNeo.hex2Integer(r[0].value);
        return total;
      },
      async getSdusdTotal() {
        let scAddr = this.sarAddr.sdusd.hash;
        let params = [{
          method: "totalSupply"
        }];
        let scHash = eNeo.emitParams(scAddr, params);
        let _r = await invokeScript([scHash]);
        let r = _r.result[0].stack;
        let total = eNeo.hex2Integer(r[0].value);
        return total;
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/var";

  .system-info {
    float: left;
    height: 200px;
    .system-item {
      float: left;
      width: 184px;
      box-sizing: border-box;
      height: 100px;
      padding-left: 20px;
      &__val {
        margin-top: 36px;
        font-size: 18px;
        font-weight: bold;
      }
      &__title {
        font-size: 12px;
        color: #667;
        margin-top: 6px;
        font-family: PingFangSC-Regular;
      }
    }
  }
</style>
