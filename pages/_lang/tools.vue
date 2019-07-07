<template>
  <el-tabs :class="['tools',{'tools-assets-active':activeTab==='technical'}]" v-model="activeTab"
           @tab-click="handleTabClick">
    <el-tab-pane :label="$t('tools.contractAddr.title')" name="technical">
      <span slot="label">
        <icon-font name="icon-ziyuan" style="color: #FEB178"></icon-font>{{$t('tools.contractAddr.title')}}
      </span>
      <technical-params></technical-params>
    </el-tab-pane>
    <el-tab-pane :label="$t('tools.browse.title')" name="browse">
      <span slot="label">
        <icon-font name="icon-liulanqi2" style="color: #97EAB1"></icon-font>
        {{$t('tools.browse.title')}}
      </span>
      <browse></browse>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  import {technicalParams, browse} from '~/components/tools'
  import {mapGetters} from 'vuex'
  import getSarAddr from '~/mixins/getSarAddr'

  export default {
    name: 'Tools',
    data() {
      return {}
    },
    computed: {
      activeTab: {
        get() {
          return this.$route.query.tab || 'technical';
        },
        set() {
        }
      },
      ...mapGetters([
        'currentUser'
      ])
    },
    components: {
      technicalParams,
      browse
    },
    mixins: [getSarAddr],
    async mounted() {
      const {tab} = this.$route.query;
      if (!tab) {
        this.changeRouteQuery({tab: 'technical'}, false);
      }
    },
    methods: {
      handleTabClick(tab) {
        this.changeRouteQuery({tab: tab.name}, true);
      },
      changeRouteQuery({tab}, onlyTab) {
        const queryObj = JSON.parse(JSON.stringify({tab}));
        this.$router.push({
          path: this.$route.path,
          query: onlyTab ? {...queryObj} : {...this.$route.query, ...queryObj},
        });
      },
    }
  }
</script>

<style lang="scss" scoped>
  .tools {
    padding-top: 30px;
    > div {
      margin-top: 30px;
      &:first-child {
        margin-top: 0;
      }
      .icon {
        margin-right: 6px;
        display: inline-block;
        vertical-align: middle;
        font-size: 18px;
      }
    }
  }
</style>

<style lang="scss">
  @import "../../assets/styles/var";

  .tools {
    &.tools-assets-active {
      .el-tabs__active-bar {
        background-color: #FEB178;
      }
    }
    .el-tabs__header {
      background: #fff;
      border-radius: 2px;
      height: 60px;
      line-height: 60px;
      width: 100%;
      padding: 0 15px;
      margin: 0;
      border: 1px solid #E6EAEE;
      .el-tabs__item {
        font-size: 18px;
        &.is-active, &:hover, &:focus {
          color: #303133;
        }
      }
    }
    .el-tabs__active-bar {
      background-color: #97EAB1;
    }
    .el-tabs__nav-wrap::after {
      display: none !important;
    }
  }
</style>

