<template>
  <div>
    <div class="cold-wallet">
      <ul class="cold-wallet-info" v-html="$t('login.coldWalletInfo')"></ul>
      <img class="cold-wallet-img"
           src="~/assets/img/ledger.png"
           alt="cold-wallet">
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
                 @click.native="$parent.type='json'">{{$t('login.loginByJson')}}
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
  import {loginColdWallet} from '~/utils/login'
  import {getPublicKeyEncoded} from '@cityofzion/neon-core/lib/wallet/core'

  const switcheo = require('switcheo-js/build/main');
  const NeoLedger = switcheo.NeoLedgerProvider;

  export default {
    name: 'ColdWalletLogin',
    data() {
      return {
        disabled: true,
        loading: false,
        timer: null,
        neoLedger: null,
      }
    },
    mounted() {
      this.getNeoLedger();
      this.timer = setInterval(() => {
        this.getNeoLedger();
      }, 1000 * 10);
    },
    beforeDestroy() {
      clearInterval(this.timer);
    },
    methods: {
      //硬件钱包是否登录
      async getNeoLedger() {
        try {
          let neoLedger = await NeoLedger.init();
          this.disabled = false; //启用

          //获取解码后的pubkey
          let pubkey = getPublicKeyEncoded(neoLedger.publicKey);
          neoLedger.pubkey = pubkey;

          //存入缓存
          let tempObj = {
            address: neoLedger.displayAddress,
            publicKey: neoLedger.publicKey,
            pubkey: pubkey
          };
          this.neoLedger = tempObj;

          //全局保存实例
          window.neoLedger = neoLedger;

          //清除定时器
          clearInterval(this.timer);
        } catch (e) {
          console.log(e);
        }
      },
      async handleLogin() {
        if (!this.neoLedger) {
          return;
        }
        //存入缓存
        loginColdWallet(this.neoLedger, this);

        //sessionStorage存储为硬件钱包登录
        sessionStorage.setItem('loginMethod', 'coldWallet');

        let path = this.$i18n.path('wallet');
        this.$router.push({path: path});
      }
    }
  }
</script>

<style lang="scss" scoped>
  .cold-wallet {
    position: relative;
    width: 100%;
    height: 90px;
    background: #FAFAFB;
    border: 1px solid #E6EAEE;
    border-radius: 4px;
    &-img {
      position: absolute;
      top: 29px;
      right: 0;
      height: 39px;
    }
    &-info {
      color: #334;
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      margin: 0;
      line-height: 20px;
      padding-left: 30px;
    }
  }
</style>
