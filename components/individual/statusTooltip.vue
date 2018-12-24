<template>
  <el-tooltip popper-class="global-popper"
              placement="bottom-start"
              offset="100"
              effect="light">
    <div slot="content">
      <ul class="tooltip-ul"
          v-html="$t('individual.statusInfo',{
                      'lineRate':sarConfig.liquidate_line_rate_c,
                      'topRate':sarConfig.liquidate_line_rate_c + 50
                    })">

      </ul>
    </div>
    <icon-font name="icon-wenhao" class="green"></icon-font>
  </el-tooltip>
</template>

<script>
  export default {
    name: 'StatusTooltip',
    props: {
      sarConfig: {
        required: true,
        type: Object,
      }
    }
  }
</script>
