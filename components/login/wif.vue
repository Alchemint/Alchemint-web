<template>
  <div class="login-content mt-100">
    <div class="login-input-container">
      <el-input :placeholder="$t('login.wif')"
                v-model="wif"
                @input="handleWifChange">
        <icon-font slot="prefix" name="icon-yuechi" class="prefix-icon"></icon-font>
      </el-input>

      <div class="login-err-container">
        <div class="login-err" v-if="errInfo">
          <i class="el-icon-warning red"></i>
          <span class="login-err-info">{{$t('login.wifErr')}}</span>
          <div class="popper__arrow"></div>
        </div>
      </div>
    </div>

    <el-button type="primary"
               class="login-btn"
               :disabled="disabled"
               :loading="loading"
               @click.native="handleLogin">{{$t('global.loginBtn')}}
    </el-button>
    <div class="otherwise mt-50">
      <div class="otherwise-line">
        <span class="otherwise-line-text">{{$t('global.otherwise')}}</span>
      </div>
    </div>
    <el-button type="primary"
               plain
               class="login-btn"
               @click.native="$parent.type='json'">{{$t('login.loginByJson')}}
    </el-button>
  </div>
</template>

<script>
  import {loginWif} from '~/utils/login'
  import handleEnter from '~/mixins/handleEnter'

  export default {
    name: 'LoginWif',
    data() {
      return {
        wif: '',
        errInfo: false,
        loading: false,
      }
    },
    computed: {
      disabled() {
        if (this.wif) {
          return false;
        } else {
          return true;
        }
      }
    },
    mixins: [handleEnter],
    methods: {
      handleEnter() {
        this.handleLogin();
      },
      handleLogin() {
        this.loading = true;
        try {
          loginWif(this.wif, this);
          this.$router.push({path: this.$i18n.path('wallet')});
        } catch (e) {
          this.errInfo = true;
        } finally {
          this.loading = false;
        }
      },
      handleWifChange(val) {
        this.errInfo = false;
      }
    }
  }
</script>
