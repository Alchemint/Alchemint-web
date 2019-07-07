<template>
  <div>
    <!--input hidden-->
    <div class="login-input-container">
      <input type="file"
             style="display: none"
             accept=".json"
             id="json-file"
             @change="handleSelectFile">
      <el-input :placeholder="$t('login.json')"
                v-model="formData.name"
                @input='toggleErrInfo'
                @click.native="triggerSelectFile">
        <icon-font slot="prefix" name="icon-yuechi" class="prefix-icon"></icon-font>
      </el-input>
      <el-input :placeholder="$t('login.pwd')"
                type="password"
                @input='toggleErrInfo'
                v-model="formData.key">
        <icon-font slot="prefix" name="icon-suo" class="prefix-icon"></icon-font>
      </el-input>

      <!--login err info-->
      <div class="login-err-container">
        <div class="login-err" v-if="errInfo">
          <i class="el-icon-warning red"></i>
          <span class="login-err-info">{{$t('login.jsonErr')}}</span>
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
    <div class="login-toggle">
      <el-button type="primary"
                 plain
                 class="login-toggle-btn"
                 @click.native="$parent.type='coldWallet'">{{$t('login.loginByCold')}}
      </el-button>
      <el-button type="primary"
                 plain
                 class="login-toggle-btn"
                 @click.native="$parent.type='wif'">{{$t('login.loginByKey')}}
      </el-button>
    </div>
  </div>
</template>

<script>
  import handleEnter from '~/mixins/handleEnter'
  import {loginJson} from "~/utils/login";

  export default {
    name: 'KeyStoreLogin',
    data() {
      return {
        formData: {
          name: '',
          key: '',
          json: '',
        },
        errInfo: false,
        loading: false,
      }
    },
    computed: {
      disabled() {
        if (this.formData.json && this.formData.name && this.formData.key) {
          return false;
        } else {
          return true;
        }
      }
    },
    mixins: [handleEnter],
    methods: {
      async handleLogin() {
        this.loading = true;
        try {
          await loginJson(this.formData.json, this.formData.key, this);
          let path = this.$i18n.path('wallet');

          //缓存登录方式
          sessionStorage.setItem('loginMethod', 'keyStore');
          this.$router.push({path: path});
        } catch (e) {
          this.errInfo = true;
        } finally {
          this.loading = false;
        }
      },
      handleEnter() {
        this.handleLogin();
      },

      triggerSelectFile() {
        //trigger the input click of the file and select the local file to upload
        let $file = document.getElementById("json-file");
        $file.click();
      },
      handleSelectFile() {
        let $file = document.getElementById("json-file");
        let file = $file.files[0];
        this.formData.name = file.name;
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onload = (e) => {
          this.formData.json = reader.result;
        };
        this.toggleErrInfo();
      },
      toggleErrInfo() {
        this.errInfo = false;
      }
    }
  }
</script>
