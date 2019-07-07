<template>
  <div class="login-container">
    <!--register-->
    <div class="register" v-if="!downLoadDialog">
      <div class="login-tabs">
        <nuxt-link class="login-tabs-item" :to="$i18n.path('login')">
          {{$t('global.loginBtn1')}}
        </nuxt-link>
        <span class="login-tabs-border"></span>
        <nuxt-link class="login-tabs-item" :to="$i18n.path('register')">
          {{$t('global.registerBtn')}}
        </nuxt-link>
      </div>
      <div class="login-content mt-50">

        <div class="login-input-container">
          <el-input :placeholder="$t('register.wallet')"
                    v-model="formData.name">
            <icon-font slot="prefix" name="icon-yuechi" class="prefix-icon"></icon-font>
          </el-input>
          <!--register err info-->
          <div class="login-err-container">
            <div class="login-err" v-if="nameErr">
              <i class="el-icon-warning red"></i>
              <span class="login-err-info">{{$t('register.walletErr')}}</span>
              <div class="popper__arrow"></div>
            </div>
          </div>
        </div>

        <div class="login-input-container">
          <el-input :placeholder="$t('register.pwd')"
                    type="password"
                    v-model="formData.pwd">
            <icon-font slot="prefix" name="icon-suo" class="prefix-icon"></icon-font>
          </el-input>
          <!--register err info-->
          <div class="login-err-container">
            <div class="login-err" v-if="pwdErr">
              <i class="el-icon-warning red"></i>
              <span class="login-err-info">{{$t('register.pwdErr')}}</span>
              <div class="popper__arrow"></div>
            </div>
          </div>
        </div>

        <div class="login-input-container">
          <el-input :placeholder="$t('register.confirmPwd')"
                    type="password"
                    @blur="validateConfirmPwd"
                    v-model="formData.confirmPwd">
            <icon-font slot="prefix" name="icon-suo" class="prefix-icon"></icon-font>
          </el-input>
          <!--register err info-->
          <div class="login-err-container">
            <div class="login-err" v-if="confirmPwdErr">
              <i class="el-icon-warning red"></i>
              <span class="login-err-info">{{$t('register.confirmPwdErr')}}</span>
              <div class="popper__arrow"></div>
            </div>
          </div>
        </div>

        <el-button type="primary"
                   class="login-btn"
                   :loading="loading"
                   @click.native="handleRegister">{{$t('global.registerBtn')}}
        </el-button>
        <div class="otherwise mt-50">
          <div class="otherwise-line">
            <span class="otherwise-line-text">{{$t('global.otherwise')}}</span>
          </div>
        </div>
        <el-button type="primary"
                   plain
                   class="login-btn"
                   @click.native="loginByJson">{{$t('login.loginByJson')}}
        </el-button>
      </div>
    </div>

    <!--register success-->
    <el-dialog custom-class="register-modal"
               :visible.sync="downLoadDialog"
               :close-on-press-escape="false"
               :close-on-click-modal="false"
               :show-close="false">
      <div class="register-succ">
        <i class="el-icon-circle-check succ-icon"></i>
        <div class="succ-title" v-html="$t('register.succTitle')"></div>
        <ul class="succ-desc" v-html="$t('register.succInfo')"></ul>
        <el-button type="primary"
                   class="login-btn"
                   :style="{marginTop:$i18n.locale === 'en'?'34px':'58px'}"
                   @click.native="handleDownLoad">{{$t('register.downLoadBtn')}}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {createUser, getCurrentUser, downFile, getJsonFromWif} from '~/utils/login'
  import handleEnter from '~/mixins/handleEnter'

  export default {
    name: 'Register',
    data() {
      return {
        formData: {
          name: '',
          pwd: '',
          confirmPwd: '',
        },
        nameErr: false,
        pwdErr: false,
        confirmPwdErr: false,
        downLoadDialog: false,
        loading: false,
      }
    },
    mixins: [handleEnter],
    mounted() {
      //The principle of the random number generator is to collect mouse events,
      //so the effect is good if you dot early.
      Neo.Cryptography.RandomNumberGenerator.startCollectors();
    },
    methods: {
      validateName(e) {
        let val = e ? e.target.value : this.formData.name;
        let pattern = /^\w{1,20}$/g;
        if (!(pattern.test(val))) {
          this.nameErr = true;
          return false;
        }
        this.nameErr = false;
        return true;
      },
      validatePwd(e) {
        let val = e ? e.target.value : this.formData.pwd;
        let pattern = /^\w{1,20}$/g;
        if (!(pattern.test(val))) {
          this.pwdErr = true;
          return false;
        }
        this.pwdErr = false;
        return true;
      },
      validateConfirmPwd(e) {
        let val = e ? e.target.value : this.formData.confirmPwd;
        if (val !== this.formData.pwd || !val) {
          this.confirmPwdErr = true;
          return false;
        }
        this.confirmPwdErr = false;
        return true;
      },
      handleEnter() {
        this.handleRegister()
      },
      handleRegister() {
        this.validateName();
        this.validatePwd();
        this.validateConfirmPwd();
        if (!this.nameErr && !this.pwdErr && !this.confirmPwdErr) {
          this.loading = true;
          try {
            createUser(this.formData.name, this.formData.pwd, this);
            this.downLoadDialog = true;
          } catch (e) {
            console.log(e);
          } finally {
            this.loading = false;
          }
        }
      },
      loginByJson() {
        let path = this.$i18n.path('login');
        this.$router.push({path: path});
      },
      async handleDownLoad() {
        //download json file
        let user = await getCurrentUser(this);
        //computing wallet JSON file
        let jsonStr = await getJsonFromWif(this.formData.name, user.wif, this.formData.pwd);
        //trigger JSON Download
        let tips = this.$i18n.locale === 'zh' ? '浏览器不支持下载文件，请更换浏览器重试！' : 'This browser does not support downloading this file. Please change your browser and try again!';
        downFile(user.address + ".json", ThinNeo.Helper.String2Bytes(jsonStr), tips);

        let path = this.$i18n.path('wallet');
        this.$router.push({path: path});
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/var";

  .register-succ {
    height: 430px;
    text-align: center;
    padding: 50px 40px 0;
    .succ-icon {
      font-size: 34px;
      color: $--color-success;
    }
    .succ-title {
      margin-top: 23px;
      font-size: 18px;
      line-height: 25px;
      font-weight: bold;
      margin-left: -14px;
      margin-right: -14px;
    }
    .succ-desc {
      margin-top: 34px;
      line-height: 20px;
      color: #667;
      text-align: left;
      > li {
        margin-top: 6px;
      }
    }
    .login-btn {
      margin-top: 40px;
      width: 300px;
      height: 44px;
    }
  }
</style>

<style lang="scss">
  .register-modal {
    width: 400px;
    margin-top: 60px;
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 0 !important;
    }
  }
</style>
