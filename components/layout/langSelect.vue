<template>
  <div class="nav-right">
    <el-dropdown class='nav-right-dropdown'
                 @command="handleSetLanguage"
                 placement="bottom"
                 trigger="hover">
      <span class="nav-right-dropdown-current">
        <img v-if="$i18n.locale==='zh'" class="current-lang" src="~/assets/img/zh.png" alt="lang">
        <img v-else src="~/assets/img/en.png" class="current-lang" alt="lang">
      </span>
      <el-dropdown-menu slot="dropdown" class="nav-right-dropdown-menu">
        <el-dropdown-item class="nav-right-dropdown-menu__item" command="en">
          <nuxt-link :to="$route.fullPath.replace(/^\/[^\/]+/, '')"
                     active-class="none"
                     exact>
            <img class="lang-img" src="~/assets/img/en.png" alt="lang">
          </nuxt-link>
        </el-dropdown-item>
        <el-dropdown-item class="nav-right-dropdown-menu__item" command="zh">
          <nuxt-link :to="$route.fullPath.indexOf('/zh')>-1?'':'/zh' + $route.fullPath"
                     active-class="none"
                     exact>
            <img class="lang-img" src="~/assets/img/zh.png" alt="lang">
          </nuxt-link>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
  export default {
    name: 'LangSelect',
    methods: {
      handleSetLanguage(lang) {
        let locale = this.$i18n.locale;
        if (locale === lang) {
          return;
        }
        this.$i18n.locale = lang;
      }
    }
  };
</script>

<style lang="scss">
  @import "./dropdown";
</style>
