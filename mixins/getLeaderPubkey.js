const switcheo = require('switcheo-js/build/main');
const NeoLedger = switcheo.NeoLedgerProvider;
import {getPublicKeyEncoded} from '@cityofzion/neon-core/lib/wallet/core'
import {loginColdWallet} from '~/utils/login'
import coldWalletDialog from "~/components/public/coldWalletDialog.vue"
import eNeo from '~/utils/eNeo'

export default {
  data() {
    return {
      isColdWallet: true,
      coldWalletDialogVisible: false,  //签名模态框
    }
  },
  components: {
    coldWalletDialog
  },
  mounted() {
    //判断是否是硬件钱包登录
    this.isColdWallet = sessionStorage.getItem('loginMethod') === 'coldWallet' ? true : false;
  },
  methods: {
    //硬件钱包是否登录
    async getNeoLedger() {
      try {
        let neoLedger = await NeoLedger.init();

        //获取解码后的pubkey
        let pubkey = getPublicKeyEncoded(neoLedger.publicKey);
        neoLedger.pubkey = pubkey;

        //存入缓存
        let tempObj = {
          address: neoLedger.displayAddress,
          publicKey: neoLedger.publicKey,
          pubkey: pubkey
        };
        loginColdWallet(tempObj, this);

        //全局保存实例
        window.neoLedger = neoLedger;

        //sessionStorage存储为硬件钱包登录
        sessionStorage.setItem('loginMethod', 'coldWallet');
        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    },

    /** @param type 方法名：可选参数：callc,callc2,transferglobalcoin,transfernep5
     *  @param obj  对应方法名中eNeo所需参数，
     *  @param cb ，是否有回调函数
     *  @return r ，签名的txid和rawdata
     * */
    async getSignature(type, obj, payfee, loading, cb) {
      let r;
      //硬件钱包登录
      if (this.isColdWallet) {
        //获取硬件钱包实例
        let isLogin = await this.getNeoLedger();

        //登录失败
        if (!isLogin) {
          this.$alert('硬件钱包失效，请重新登录！', '提示', {
            confirmButtonText: '确定'
          });
          return false;
        }

        //弹出硬件钱包确认提示
        this.coldWalletDialogVisible = true;
        let count = 30;
        let timer = setTimeout(() => {
          if (count <= 0) {
            clearTimeout(timer);
            this.coldWalletDialogVisible = false;
          }
          count++;
        });

        //登录成功并发起签名
        r = await this.judgeTypeAjaxCallC(type, obj, payfee, r);
        clearTimeout(timer);
        this.coldWalletDialogVisible = false;

        //签名失败
        if (r.message) {
          this.$confirm(r.message, 'Operation failed', {
            confirmButtonText: 'Confirm',
            showCancelButton: false,
            type: 'error',
            center: false
          }).then(() => {
            this.btnLocked = false;
            if (cb) {
              cb();
            } else {
              if (loading) {
                loading.close();
              }
            }

          }).catch(() => {
            this.btnLocked = false;
            if (cb) {
              cb();
            } else {
              if (loading) {
                loading.close();
              }
            }
          });
          return false;
        }
      }

      //wif登录或者json登录
      if (!this.isColdWallet) {
        r = await this.judgeTypeAjaxCallC(type, obj, payfee, r);
      }

      return r;
    },

    //发起eNeo接口请求
    async judgeTypeAjaxCallC(type, obj, payfee, r) {
      if (type === 'callc') {
        let {wif, scAddr, type, params, utxos} = obj;
        r = await eNeo.callC(wif, scAddr, type, params, utxos, payfee, this.isColdWallet);
      } else if (type === 'callc2') {
        let {wif, globalCoinParams, callParams} = obj;
        r = await await eNeo.callC2(wif, globalCoinParams, payfee, callParams, this.isColdWallet);
      } else if (type === "transferglobalcoin") {
        let {wif, utxos, scAddr, toAddress, amount} = obj;
        r = await eNeo.transferGlobalCoin(wif, utxos, scAddr, toAddress, amount, payfee, this.isColdWallet);
      } else if (type === 'transfernep5') {
        let {wif, scAddr, toAddress, amount, utxos} = obj;
        r = await eNeo.transferNep5(wif, scAddr, toAddress, amount, utxos, payfee, this.isColdWallet);
      }
      return r;
    }
  }
}
