<template>
  <div :class="['nav',{'test-nav':currentEnv==='testNet'}]">
    <div class="nav-content">
      <nuxt-link class="nav-logo border-bottom-no" :to="$i18n.path('')">
        <div class="nav-logo-img">
          <img src="~/assets/img/logo.png" alt="alchemint">
          <img src="~/assets/img/logo_higher.png" alt="alchemint" style="display: none">
        </div>
      </nuxt-link>
      <div class="nav-router">
        <nuxt-link class="nav-router__item" :to="$i18n.path('individual')">
          {{ $t('nav.individual')}}
        </nuxt-link>
        <nuxt-link class="nav-router__item" :to="$i18n.path('institution')">
          {{ $t('nav.institution')}}
        </nuxt-link>
        <nuxt-link class="nav-router__item" :to="$i18n.path('wallet')" v-if="hasUser">
          {{ $t('nav.wallet')}}
        </nuxt-link>
        <nuxt-link class="nav-router__item" :to="$i18n.path('lock')" v-if="hasUser">
          {{ $t('nav.lock')}}
        </nuxt-link>
      </div>
      <div class="nav-config">
        <lang-select></lang-select>
        <nuxt-link class="nav-config__router border-bottom-no"
                   :to="$i18n.path('tools')">{{ $t('nav.tools')}}
        </nuxt-link>
        <nuxt-link class="nav-config__router border-bottom-no"
                   :to="$i18n.path('faq')">FAQ
        </nuxt-link>
        <set-up></set-up>
        <div class="nav-config__divider"></div>
        <template v-if="!hasUser">
          <nuxt-link :to="$i18n.path('login')" class="nav-config__login border-bottom-no">
            {{ $t('global.loginBtn1')}}
          </nuxt-link>
          <nuxt-link :to="$i18n.path('register')" class="nav-config__register border-bottom-no">
            {{ $t('global.registerBtn')}}
          </nuxt-link>
        </template>
        <template v-else>
          <account-select :current-user="currentUser" :users="users"></account-select>
          <a class="border-bottom-no logout" @click="logout">
            <icon-font name="icon-tuichu"></icon-font>
            <span>{{$t('nav.logout')}}</span>
          </a>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  import {getCurrentUser, getUsers, logout} from '~/utils/login'
  import accountSelect from './accountSelect'
  import langSelect from './langSelect'
  import setUp from './setUp'
  import {mapGetters} from 'vuex';
  import {envs} from '~/utils/const'
  import {find} from 'lodash'

  export default {
    name: 'NavBar',
    computed: {
      ...mapGetters(['currentUser', 'users']),
      hasUser() {
        return this.currentUser ? true : false;
      }
    },
    data() {
      return {
        currentEnv: '',
      }
    },
    created() {
      let env = process.env._ENV;
      let currentEnv = find(envs, o => o.name === env);
      this.currentEnv = currentEnv.name;
    },
    mounted() {
      getCurrentUser(this);
      getUsers(this);
    },
    components: {
      accountSelect,
      langSelect,
      setUp
    },
    methods: {
      logout() {
        let path = this.$i18n.path('login');
        this.$router.push({path: path});
        logout(this);
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/var";
  @import "../../assets/styles/mixin";

  .nav {
    width: 100%;
    height: 70px;
    line-height: 70px;
    background: $--nav-bg;
    color: rgba(255, 255, 255, .5);
    font-size: 20px;
    min-width: 1280px;
    user-select: none;

    &.test-nav {
      background: #1E5473;
    }

    &-content {
      width: 1280px;
      margin: 0 auto;
      padding: 0 40px;
      @include clearfix;
    }

    &-logo {
      float: left;

      &-img {
        float: left;
        width: 142px;
        height: 40px;
        margin: 15px 0;

        > img {
          width: 100%;
          vertical-align: top;
        }
      }

      &-title {
        float: left;
        margin-left: 30px;
      }
    }

    &-router {
      float: left;
      margin-left: 40px;

      &__item {
        display: inline-block;
        margin: 0 14px;
        height: 70px;
        border-bottom: 4px solid transparent;
        box-sizing: border-box;
        padding: 0 6px;
        color: rgba(255, 255, 255, .5);

        &:hover {
          color: #fff;
        }
      }
    }

    &-config {
      float: right;
      @include clearfix;

      &__router {
        float: left;
        font-size: 14px;
        margin-left: 20px;

        &:hover {
          color: #fff;
        }
      }

      &__login, > div {
        margin-left: 20px;
        float: left;
        font-size: 14px;
      }

      &__register {
        margin-left: 10px;
        font-size: 14px;
        float: left;
      }

      &__divider {
        float: left;
        height: 70px;
        background: #35435A;
        width: 1px;
      }

      .logout {
        float: left;
        height: 70px;
        margin-left: 20px;
        font-size: 14px;

        &:hover {
          color: #fff;
        }

        .icon-tuichu {
          font-size: 24px;
        }

        > span {
          display: inline-block;
          vertical-align: top;
        }
      }
    }
  }
</style>

<style lang="scss">
  @import "../../assets/styles/var.scss";

  .nav {
    .nuxt-link-active {
      border-bottom: 4px solid $--color-primary;
      color: $--color-primary;
      font-weight: 500;
    }

    &.test-nav {
      .nav-config__divider {
        background: #296384;
      }
    }
  }

</style>

