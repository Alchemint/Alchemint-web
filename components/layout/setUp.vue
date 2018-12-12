<template>
  <div class="nav-right">
    <el-dropdown class="nav-right-dropdown"
                 trigger="hover"
                 @command="toggleSetUp"
                 placement="bottom">
      <span class="nav-right-dropdown-current">{{env?env.label:''}}
      </span>
      <el-dropdown-menu class="nav-right-dropdown-menu" slot="dropdown">
        <el-dropdown-item v-if="env" v-for="item in $t('envs')"
                          :command="item"
                          :key="item.name"
                          :class="['nav-right-dropdown-menu__item',{
                                 'is-active':(env.name===item.name), }]">
          <a style="display:block;"
             :href="'http://'+item.name+'.alchemint.io'"
             target="_blank">{{item.label}}
          </a>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
  import iconFont from '../public/icon-font'
  import {find} from 'lodash'

  export default {
    name: 'SetUp',
    data() {
      return {
        env: null,
      }
    },
    components: {
      iconFont,
    },
    created() {
      this.getCurrentEnv();
    },
    methods: {
      getCurrentEnv() {
        let env = process.env._ENV;
        let envs = this.$i18n.messages[this.$i18n.locale].envs;
        let currentEnv = find(envs, o => o.name === env);
        if (currentEnv) {
          this.env = currentEnv;
        } else {
          this.env = envs[envs.length - 1];
        }
      },
      toggleSetUp(item) {
        if (item.name === this.env.name) {
          return;
        }
      }
    },
    watch: {
      '$i18n.locale'() {
        this.getCurrentEnv();
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/var";

  .set-up {
    height: 70px;
    cursor: pointer;
    .icon {
      font-size: 20px;
      color: $--color-white;
      cursor: pointer;
      outline: 0;
    }
    .current-env {
      font-size: 14px;
      outline: 0;
    }
    &-dropdown-menu {
      background: $--nav-bg-light;
      &__item {
        color: #fff;
        text-align: center;
        padding: 0 14px;
        height: 28px;
        line-height: 28px;
        &.is-active {
          background: $--color-primary;
          color: $--color-white;
        }
        &:hover,
        &:focus {
          background: $--color-primary;
          color: $--color-white;
        }
      }
    }
  }
</style>

<style lang="scss">
  @import "../../assets/styles/var";

  .set-up-dropdown-menu {
    .popper__arrow {
      border-bottom-color: $--nav-bg-light !important;
      &:after {
        border-bottom-color: $--nav-bg-light !important;
      }
    }
  }
</style>

