<template>
  <el-tooltip popper-class="global-popper"
              placement="bottom-start"
              offset="100"
              effect="light">
    <div slot="content">
      <ul class="tooltip-ul"
          v-html="$t('individual.statusInfo',{
                      'lineRate': lineRateC,
                      'topRate':lineRateC + 50
                    })">

      </ul>
    </div>
    <icon-font name="icon-wenhao" class="green"></icon-font>
  </el-tooltip>
</template>

<script>
  import {find} from 'lodash'

  export default {
    name: 'StatusTooltip',
    props: {
      typeA: {
        required: true,
        type: Array,
      }
    },
    computed: {
      lineRateC() {
        return find(this.typeA, o => o.key === 'liquidate_line_rate_c').value;
      }
    }
  }
</script>
