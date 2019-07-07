<template>
  <div class="individual">
    <div class="clearfix">
      <my-asset class="fl"
                :assets="assets"
                :current-user="currentUser"
                style="width: 700px;margin-right: 30px"></my-asset>
      <neo-sneo class="fl"
                :current-user="currentUser"
                :assets="assets"
                @update-assets="updateAssets"
                style="width:470px"></neo-sneo>
    </div>
    <my-sar :assets="assets"
            ref="mySar"
            @update-assets="updateAssets"
            @update-data="updateData"></my-sar>
    <system-status ref="systemStatus"></system-status>
    <my-bond ref="myBond"
             v-if="hasBond && assets"
             :current-user="currentUser"
             :assets="assets"
             @update-data="updateData"></my-bond>
    <sarc-list ref="sarCList"
               @update-data="updateData"
               :current-user="currentUser"
               :assets="assets"></sarc-list>
  </div>
</template>

<script>
  import {myAsset, mySar, neoSneo, sarcList, systemStatus, myBond} from '~/components/individual'
  import {getStorage} from '~/api/global'
  import getSarAddr from '~/mixins/getSarAddr'
  import {getCurrentUser} from '../../utils/login'
  import getAssets from "~/mixins/getAssets";
  import eNeo from '../../utils/eNeo'

  export default {
    name: 'Individual',
    components: {
      myAsset,
      mySar,
      neoSneo,
      sarcList,
      systemStatus,
      myBond
    },
    data() {
      return {
        currentUser: null, //用户信息,
        hasBond: false, //是否有bond权限
        hasMySar: false,
      }
    },
    mixins: [getSarAddr, getAssets],
    async mounted() {
      //用户信息
      let user = getCurrentUser(this);
      this.currentUser = user;
    },
    methods: {
      //获取当前用户是否有bond权限
      async getBondAuthority() {
        if (!this.currentUser) {
          return;
        }
        let scAddr = this.sarAddr.sarC.hash;
        let address = '16' + eNeo.addr2Hex(this.currentUser.address);
        let _r = await getStorage([scAddr, address]);
        if (!_r.result) {
          this.hasBond = false;
          return;
        }
        let hasBond = _r.result[0].storagevalue;
        this.hasBond = hasBond ? true : false;
      },

      //更新assets资产列表
      updateAssets() {
        this.getAssets(this.currentUser.address);
      },

      //更新数据
      updateData() {
        //更新assets
        this.updateAssets();

        //更新全局状态
        this.$refs.systemStatus.getSystemReport();

        //更新oracle配置参数
        this.$store.dispatch('getTypeA');
        this.$store.dispatch('getTypeB');

        //更新列表数据
        let sarCList = this.$refs.sarCList;
        let currentPage = sarCList.currentPage || 1;
        if (sarCList.activeTab === '1') {
          sarCList.getSarCList(currentPage);
        } else {
          sarCList.getSarByFilterRate(sarCList.rangeRate[0], sarCList.rangeRate[1], currentPage);
        }

        //更新mySar状态
        this.$refs.mySar.getSarCInfo();

        //更新bond
        if (this.hasBond) {
          this.$refs.myBond.getSarCInfo();
        }
      }
    },
    watch: {
      currentUser(newVal, oldVal) {
        if (newVal) {
          this.getBondAuthority();
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .individual {
    padding-top: 30px;

    > div {
      margin-top: 30px;

      &:first-child {
        margin-top: 0;
      }
    }
  }
</style>
