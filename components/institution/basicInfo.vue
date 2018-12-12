<template>
  <el-card class="border-card">
    <div slot="header" class="border-card-header">
      <span class="border-card-header__title">{{$t('institution.relevantAssets')}}</span>
    </div>
    <div class="mt-20">
      <div class="basic" v-if="sdsObj">
        <span class="basic-title">SDS:</span>
        <span class="basic-content">{{sdsObj.showBalance | numFormat}}
          <span class="basic-value">(${{sdsObj.totalVal | numFormat}})</span>
        </span>
      </div>
      <div class="basic" v-if="wenObj">
        <span class="basic-title">{{wenObj.symbol}}:</span>
        <span class="basic-content">{{wenObj.showBalance | numFormat}}
          <span class="basic-value">(${{wenObj.totalVal | numFormat}})</span>
        </span>
      </div>
    </div>
  </el-card>
</template>

<script>
  import {formatPrecision, bigmath, printNumber} from '../../utils'
  import {numFormat} from '../../filters'

  export default {
    name: 'BasicInfo',
    props: {
      sarConfig: {
        type: Object,
        required: true,
      },
      currentUser: {
        type: Object,
        required: true,
      },
      sdsObj: {},
    },
    data() {
      return {
        wenObj: null,
      }
    },
    filters: {
      numFormat,
    },
    mounted() {
      this.getMySar();
    },
    methods: {
      async getMySar() {
        let mySar = await this.$parent.getSarInfo(this.currentUser.address);
        if (!mySar) {
          return;
        }

        let tokenName = await this.$parent.getTokenName(mySar.name);
        if (tokenName) {
          let wenObj = await this.$parent.getNewBalance(mySar.name, mySar.owner);
          if (!wenObj) {
            return;
          }
          let {balance} = wenObj;
          wenObj.totalVal = formatPrecision(
            printNumber(
              bigmath.chain(bigmath.bignumber(balance))
                .multiply(bigmath.bignumber(this.sarConfig[mySar.anchorType]))
                .divide(bigmath.bignumber(bigmath.pow(10, 16)))
                .done()
            ), 2
          );
          this.wenObj = wenObj;
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  .basic {
    margin-bottom: 20px;
    line-height: 20px;
    &-title {
      display: inline-block;
      width: 100px;
      font-weight: bold;
    }
    &-value {
      color: #9999AA;
      margin-left: 4px;
    }
  }
</style>
