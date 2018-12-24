<template>
  <el-table class="no-border-table"
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
        <span>{{scope.row.value | printNumber}}</span>
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
                   v-clipboard:copy="scope.row.txid"
                   v-clipboard:success="onCopy"
                   v-clipboard:error="onError"></icon-font>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  import {filterMethod, filterTime} from '../../filters/index'
  import clipboard from '../../mixins/clipboard'
  import {bigmath} from "../../utils";

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
      filterTxid(val) {
        return val.slice(0, 4) + "..." + val.substr(val.length - 4);
      },
      printNumber(value, precision = 8) {
        return bigmath.format(
          Number(value),
          {notation: 'fixed', precision: precision}
        );
      }
    },
    mixins: [clipboard],
  }
</script>

<style lang="scss" scoped>
  .copy-btn {
    margin-left: 6px;
    cursor: pointer;
  }
</style>
