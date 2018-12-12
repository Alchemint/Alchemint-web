<template>
  <div class="institution">
    <basic-info v-if="currentUser && sarConfig"
                :current-user="currentUser"
                :sar-config="sarConfig"
                :sds-obj="sdsObj"></basic-info>
    <div class="clearfix" v-if="sarConfig">
      <stable-coins class="fl"
                    style="width:860px;margin-right: 30px"
                    :sar-config="sarConfig"></stable-coins>
      <asset-price class="fr"
                   style="width: 310px"
                   :sar-config="sarConfig"></asset-price>
    </div>
    <sar-b v-if="currentUser && sarConfig && sdsObj"
           :current-user="currentUser"
           :sds-obj="sdsObj"
           :sar-config="sarConfig"></sar-b>
  </div>
</template>

<script>
  import {basicInfo, assetPrice, sarB, stableCoins} from '~/components/institution'
  import {mapGetters} from 'vuex'
  import getSarConfig from '~/mixins/getSarConfig'
  import getSarB from '~/mixins/getSarB'

  export default {
    name: 'Institution',
    data() {
      return {
        sarConfig: null,
        sdsObj: null,
      }
    },
    computed: {
      ...mapGetters([
        'currentUser',
      ])
    },
    components: {
      basicInfo,
      assetPrice,
      sarB,
      stableCoins,
    },
    mixins: [getSarConfig, getSarB],
    async mounted() {
      this.sarConfig = await this.getSarConfig();
      if (this.currentUser) {
        let sdsObj = await this.getNep5Info();
        if (!sdsObj) {
          this.sdsObj = {};
        }
        this.sdsObj = sdsObj
      }
    }
  }
</script>

<style lang="scss" scoped>
  .institution {
    padding-top: 30px;
    > div {
      margin-top: 30px;
      &:first-child {
        margin-top: 0;
      }
    }
  }
</style>

