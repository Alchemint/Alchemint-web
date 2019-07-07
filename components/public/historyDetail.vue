<template>
  <el-table class="no-border-table empty-img-table"
            :data="data"
            stripe
            max-height="400"
            style="width: 100%">
    <div slot="empty" class="no-data">
      <img class="img" src="~/assets/img/noData.png" alt="">
      <div class="txt">{{$t('global.noData')}}</div>
    </div>
    <el-table-column prop="blocktime"
                     :label="$t('global.history.date')"
                     min-width="140">
      <template slot-scope="scope">
        {{scope.row.blocktime.$date | filterTime}}
      </template>
    </el-table-column>
    <el-table-column prop="type"
                     :label="$t('global.history.operation')"
                     width="120">
      <template slot-scope="scope">
        <span v-if="type==='sarB'">{{scope.row.type | filterMethod($t('sarBTypes'))}}</span>
        <span v-else>{{scope.row.type | filterMethod($t('sarCTypes'))}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="value"
                     :label="$t('global.history.quantity')"
                     align="right"
                     min-width="120">
      <template slot-scope="scope">
        <span :title="setDp(scope.row.value)">
          {{scope.row.value | decimalPlaces}}
        </span>
      </template>
    </el-table-column>
    <el-table-column prop="txid"
                     label="TX"
                     align="center"
                     min-width="180">
      <template slot-scope="scope">
        {{scope.row.txid | filterTxid}}
        <icon-font class='copy-btn'
                   name="icon-fuzhi1"
                   v-clipboard:copy="scope.row.txid.substring(2)"
                   v-clipboard:success="onCopy"
                   v-clipboard:error="onError"></icon-font>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  import {filterMethod, filterTime, decimalPlaces} from '~/filters/core'
  import clipboard from '~/mixins/clipboard'
  import {BN, setDp} from "~/utils/core";

  export default {
    name: 'HistoryDetail',
    props: {
      data: {
        type: Array,
        required: true,
      },
      type: {
        type: String,
        default: 'sarC'
      }
    },
    filters: {
      filterMethod,
      filterTime,
      decimalPlaces,
      filterTxid(val) {
        return val.slice(2, 6) + "..." + val.substr(val.length - 4);
      }
    },
    mixins: [clipboard],
    methods: {
      setDp,
    }
  }
</script>

<style lang="scss" scoped>
  .copy-btn {
    margin-left: 6px;
    cursor: pointer;
  }
</style>
