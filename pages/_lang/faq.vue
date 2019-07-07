<template>
  <el-card class="border-card mt-30">
    <div slot="header" class="border-card-header">
      <span class="border-card-header__title">{{$t('faq.title')}}</span>
      <el-input class="fr"
                style="width: 300px;margin-right: 25px"
                v-model="search"
                @change="handleSearch"
                suffix-icon="el-icon-search"
                :placeholder="$t('faq.search')"></el-input>
    </div>
    <el-collapse accordion class="faq-collapse" v-if="$i18n.locale==='zh'">
      <el-collapse-item v-for="(item,index) in faqArr" :key="index">
        <template slot="title">{{item.zhQue}}</template>
        <div v-html="item.zhAns"></div>
      </el-collapse-item>
    </el-collapse>
    <el-collapse accordion class="faq-collapse" v-else>
      <el-collapse-item v-for="(item,index) in faqArr" :key="index">
        <template slot="title">{{item.enQue}}</template>
        <div v-html="item.enAns"></div>
      </el-collapse-item>
    </el-collapse>
  </el-card>
</template>

<script>
  import {faqDetails} from '~/filters/const'
  import {filter} from 'lodash'

  export default {
    name: 'FAQ',
    data() {
      return {
        search: '',
        matchSearchNum: 24,
        faqArr: null,
      }
    },
    created() {
      this.faqArr = faqDetails;
    },
    methods: {
      handleSearch() {
        let locale = this.$i18n.locale;
        let result = filter(faqDetails, item => {
          if (locale === 'zh') {
            return item.zhQue.search(this.search) > -1 || item.zhAns.search(this.search) > -1
          } else {
            return item.enQue.search(this.search) > -1 || item.enAns.search(this.search) > -1
          }
        });
        this.faqArr = result;
      }
    }
  }
</script>

<style lang="scss">
  @import "../../assets/styles/var";

  .faq-collapse {
    border-top: none !important;
    border-bottom: none !important;
    padding: 10px;

    .el-collapse-item {
      &__header {
        font-size: 15px;
        //color: $--color-primary;
        //font-weight: bold;
        height: 52px;
        line-height: 52px;
      }

      &__content {
        padding: 6px 30px 6px 10px;
        color: #99a;
      }
    }
  }
</style>
