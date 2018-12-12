<template>
  <div class="technical clearfix">
    <div class="technical-left">
      <div class="technical-panel">
        <div class="technical-panel__content">
          <div class="technical-panel__title">{{$t('tools.contractAddr.blockHeight')}}</div>
          <div class="technical-panel__info">
            <count-to :startVal="0" :endVal="blockHeight" :duration="3000"></count-to>
          </div>
        </div>
      </div>
      <div class="technical-panel">
        <div class="technical-panel__content">
          <div class="technical-panel__title">{{$t('tools.contractAddr.sdusdAddr')}}</div>
          <div class="technical-panel__info color-txid">{{sarAddr.sdusd.hash}}</div>
        </div>
        <div class="technical-panel__child">
          <div class="clearfix"
               v-for="item in sdusdData"
               :key="item.key">
            <span class="fl">{{$i18n.locale==='zh'?item.zhName:item.enName}}</span>
            <span class="fr color-txid">{{item.hash}}</span>
          </div>
        </div>
      </div>
      <div class="technical-panel">
        <div class="technical-panel__content">
          <div class="technical-panel__title">{{$t('tools.contractAddr.sar4CAddr')}}</div>
          <div class="technical-panel__info color-txid">{{sarAddr.sarC.hash}}</div>
        </div>
        <div class="technical-panel__child">
          <div class="clearfix"
               v-for="item in sarCData"
               :key="item.key">
            <span class="fl">{{$i18n.locale==='zh'?item.zhName:item.enName}}</span>
            <span class="fr color-txid">{{item.hash}}</span>
          </div>
        </div>
      </div>
      <div class="technical-panel">
        <div class="technical-panel__content">
          <div class="technical-panel__title">{{$t('tools.contractAddr.oracleAddr')}}</div>
          <div class="technical-panel__info color-txid">{{sarAddr.oracle.hash}}</div>
        </div>
      </div>
    </div>
    <div class="technical-right">
      <div class="technical-panel">
        <div class="technical-panel__content">
          <div class="technical-panel__title">{{$t('tools.contractAddr.sdsAddr')}}</div>
          <div class="technical-panel__info color-txid">{{sarAddr.sds.hash}}</div>
        </div>
      </div>
      <div class="technical-panel">
        <div class="technical-panel__content">
          <div class="technical-panel__title">{{$t('tools.contractAddr.sar4BAddr')}}</div>
          <div class="technical-panel__info color-txid">{{sarAddr.sarB.hash}}</div>
        </div>
        <div class="technical-panel__child">
          <div class="clearfix"
               v-for="item in sarBData"
               :key="item.key">
            <span class="fl">{{$i18n.locale==='zh'?item.zhName:item.enName}}</span>
            <span class="fr color-txid">{{item.hash}}</span>
          </div>
        </div>
      </div>
      <div class="technical-panel">
        <div class="technical-panel__content">
          <div class="technical-panel__title">{{$t('tools.contractAddr.tokenAddr')}}</div>
          <div class="technical-panel__info color-txid">{{sarAddr.newToken.hash}}</div>
        </div>
        <div class="technical-panel__child">
          <div class="clearfix"
               v-for="item in tokenData"
               :key="item.key">
            <span class="fl">{{$i18n.locale==='zh'?item.zhName:item.enName}}</span>
            <span class="fr color-txid">{{item.hash}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {getBlockCount} from '../../api/global'
  import getSarAddr from '../../mixins/getSarAddr'
  import countTo from 'vue-count-to'
  import {getStorage} from '../../api/global'
  import {forEach} from 'lodash'

  export default {
    name: 'TechnicalParams',
    data() {
      return {
        blockHeight: 0,
        sarCData: [
          {
            zhName: 'SDS地址',
            enName: 'SDS Address',
            key: 'sds_account',
            hash: '',
          },
          {
            zhName: 'Oracle地址',
            enName: 'Oracle Address',
            key: 'oracle_account',
            hash: '',
          },
          {
            zhName: 'SDUSD地址',
            enName: 'SDUSD Address',
            key: 'sdusd_account',
            hash: '',
          }
        ],
        sarBData: [
          {
            zhName: 'SDS地址',
            enName: 'SDS Address',
            key: 'sds_account',
            hash: '',
          },
          {
            zhName: 'Oracle地址',
            enName: 'Oracle Address',
            key: 'oracle_account',
            hash: '',
          },
          {
            zhName: 'Tokenized Asset地址',
            enName: 'Tokenized Asset Address',
            key: 'tokenized_account',
            hash: '',
          }
        ],
        sdusdData: [
          {
            zhName: 'SAR4C地址',
            enName: 'SAR4C Address',
            key: 'call_account',
            hash: '',
          }
        ],
        tokenData: [
          {
            zhName: 'SAR4B 地址',
            enName: 'SAR4B Address',
            key: 'call_account',
            hash: '',
          }
        ]
      }
    },
    components: {
      countTo,
    },
    mixins: [getSarAddr],
    mounted() {
      this.getBlockHeight();
      this.getAllData(this.sarBData, this.sarAddr.sarB.hash);
      this.getAllData(this.sarCData, this.sarAddr.sarC.hash);
      this.getAllData(this.sdusdData, this.sarAddr.sdusd.hash);
      this.getAllData(this.tokenData, this.sarAddr.newToken.hash);
    },
    methods: {
      getBlockHeight() {
        getBlockCount([]).then(res => {
          if (res.result) {
            this.blockHeight = Number(res.result[0].blockcount);
          }
        }).catch(err => {
        })
      },

      getAllData(arr, hash) {
        for (let i = 0, len = arr.length; i < len; i++) {
          let item = arr[i];
          this.getSarData(item, hash);
        }
      },

      getSarData(obj, scAddr) {
        let account = eNeo.string2Hex(obj.key);
        account = '15' + account.join('');
        getStorage([scAddr, account]).then(res => {
          if (res.result && res.result[0].storagevalue) {
            let hash = res.result[0].storagevalue;
            obj.hash = eNeo.endianChange(hash);
          }
        }).catch(err => {

        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/var";
  @import "../../assets/styles/mixin";

  .color-txid {
    color: #7199DB !important;
  }

  .technical {
    margin-top: 30px;
    @include clearfix;
    &-left {
      float: left;
      width: 585px;
      .technical-panel {
        &:first-child {
          margin-top: 0;
        }
      }
    }
    &-right {
      float: right;
      width: 585px;
      .technical-panel {
        &:first-child {
          margin-top: 0;
        }
      }
    }
    &-panel {
      margin-top: 20px;
      background: rgba(255, 255, 255, 1);
      border-radius: 2px;
      border: 1px solid $--border-color-base;
      &__content {
        padding: 20px 30px;
      }
      &__title {
        font-size: 18px;
        font-weight: bold;
      }
      &__info {
        margin-top: 10px;
        color: #667;
      }
      &__txid {
        font-size: 18px;
        margin-top: 10px;
        color: #7199DB;
      }
      &__child {
        padding: 6px 30px;
        line-height: 26px;
        border-top: 1px dashed $--border-color-base;
        @include clearfix;
      }
    }
  }
</style>
