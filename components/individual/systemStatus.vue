<template>
  <el-card class="border-card content-no-padding">
    <div slot="header" class="border-card-header">
      <span class="border-card-header__title">{{$t('individual.systemStatus.title')}}</span>
    </div>

    <div class="system-info" v-if="data">
      <div class="fl">
        <div class="system-item" :title="setDp(data.lockedTotal)">
          <div class="system-item__val">{{data.lockedTotal | decimalPlaces(2)}}</div>
          <div class="system-item__title">{{$t('individual.systemStatus.sneoTotal')}}</div>
        </div>
        <div class="system-item" :title="setDp(data.sdusdTotal)">
          <div class="system-item__val">{{data.sdusdTotal | decimalPlaces(2)}}</div>
          <div class="system-item__title">{{$t('individual.systemStatus.sdusdTotal')}}</div>
        </div>
        <div class="system-item" :title="setDp(data.mortgageRate)">
          <div class="system-item__val">{{data.mortgageRate | decimalPlaces(2)}}%</div>
          <div class="system-item__title">{{$t('individual.systemStatus.allRate')}}</div>
        </div>
        <div class="system-item" style="width: 220px" :title="setDp(data.sdsFeeTotal)">
          <div class="system-item__val">{{data.sdsFeeTotal | decimalPlaces(2)}}</div>
          <div class="system-item__title">{{$t('individual.systemStatus.feePaid')}}</div>
        </div>
        <div class="system-item" v-if="predictFeeTotal">
          <div class="system-item__val" :title="setDp(predictFeeTotal)">{{predictFeeTotal | decimalPlaces(2)}}</div>
          <div class="system-item__title">{{$t('individual.systemStatus.predictFeeTotal')}}</div>
        </div>
      </div>
      <div class="fl">
        <div class="system-item">
          <div class="system-item__val">{{data.liquidationRate}}</div>
          <div class="system-item__title">{{$t('individual.systemStatus.liquidateRate')}}</div>
        </div>
        <div class="system-item">
          <div class="system-item__val">{{data.liquidationDiscount}}</div>
          <div class="system-item__title">{{$t('individual.systemStatus.liquidateDis')}}</div>
        </div>
        <div class="system-item">
          <div class="system-item__val">{{data.feeRate}}</div>
          <div class="system-item__title">{{$t('individual.systemStatus.issuingRate')}}</div>
        </div>
        <div class="system-item" style="width: 220px" :title="setDp(data.issueingCeiling,0)">
          <div class="system-item__val">{{data.issueingCeiling | decimalPlaces(0)}}</div>
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
        <div class="system-item" style="width: 220px">
          <div class="system-item__val">--</div>
          <div class="system-item__title">{{$t('individual.systemStatus.feePaid')}}</div>
        </div>
        <div class="system-item" v-if="predictFeeTotal">
          <div class="system-item__val">--</div>
          <div class="system-item__title">{{$t('individual.systemStatus.predictFeeTotal')}}</div>
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
  import {decimalPlaces} from '~/filters/core'
  import {getStaticReport, getPredictFeeTotal} from '~/api/individual'
  import {setDp} from '~/utils/core'

  export default {
    name: 'systemStatus',
    filters: {
      decimalPlaces,
    },
    data() {
      return {
        data: null,
        predictFeeTotal: '',
      }
    },
    created() {
      this.getSystemReport();
      this.getTotalServicePaid();
    },
    methods: {
      setDp,
      getSystemReport() {
        getStaticReport([]).then(res => {
          if (res.result) {
            this.data = res.result[0];
          }
        })
      },
      getTotalServicePaid() {
        getPredictFeeTotal().then(res => {
          if (res.result) {
            this.predictFeeTotal = res.result[0].feeTotal;
          }
        }).catch(err => {
          console.log(err);
        })
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
        word-wrap: break-word;
      }
    }
  }
</style>
