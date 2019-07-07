import {getDrawTransaction, sendDrawTransaction} from "../api/global";
import {LOADING_OPTION} from "~/filters/const";
import getLeaderPubkey from "~/mixins/getLeaderPubkey";

export default {
  data() {
    return {
      btnLocked: false
    };
  },
  mixins: [getLeaderPubkey],
  methods: {
    /**
     * 交易发起封装
     * @param {*} scAddr  合约地址
     * @param {*} type    合约方法
     * @param {*} params  对应方法执行的回调
     * @param {*} cb
     */
    async handleParams(scAddr, type, params, cb) {
      if (this.btnLocked) {
        return;
      }
      this.btnLocked = true;

      const loading = this.$loading(LOADING_OPTION);
      let {wif} = this.currentUser;

      //签名
      let tempObj = {wif, scAddr, type, params};
      let r = await this.getSignature("callc", tempObj, loading);
      if (!r) {
        loading.close();
        this.btnLocked = false;
        return;
      }

      sendDrawTransaction([r.rawData]).then(draw => {
        this.checkTxid(r, draw, () => {
          this.btnLocked = false;
          if (cb) {
            cb();
          }
          loading.close();
        }).catch(err => {
          this.btnLocked = false;
          loading.close();
        });
      });
    },

    //广播并检查是否写入区块
    async checkTxid(r, draw, cb) {
      //交易失败
      let locale = this.$i18n.locale;

      let transResult, txid;
      if (!draw.result) {
        let message = locale === "en" ? "Operation Failed" : "交易失败";
        this.$message.error(message);
        return;
      } else {
        transResult = draw.result[0];
        if (!transResult.sendrawtransactionresult) {
          let message = locale === "en" ? "Operation Failed" : "交易失败";
          this.$message.error(transResult.errorMessage);
          return;
        }
        txid = transResult.txid;
      }
      console.log(txid);

      //交易成功，轮询检查是否写入区块
      let randomNum = Math.floor(Math.random() * 1000);
      let h = this.$createElement;
      const notify = this.$notify({
        title: locale === "en" ? "Operation Succeeded" : "操作成功",
        duration: 0,
        customClass: "check-notify",
        showClose: false,
        message: h("div", [
          h(
            "div",
            {
              class: "check-notify-desc"
            },
            [
              h(
                "p",
                {
                  style: {
                    fontSize: locale === "en" ? "12px" : "14px"
                  }
                },
                locale === "en"
                  ? "Please wait while block is confirming."
                  : "区块确认中，请耐心等待。"
              ),
              h(
                "p",
                {
                  style: {
                    fontSize: locale === "en" ? "12px" : "14px"
                  }
                },
                locale === "en"
                  ? " Latest data will display after page refreshes."
                  : "页面刷新后，即可显示最新数据。"
              )
            ]
          ),
          h(
            "div",
            {
              class: "check-notify-time",
              attrs: {
                id: "notifyCountDown" + randomNum
              }
            },
            "30"
          )
        ])
      });

      //设置定时器
      let $notifyCountDown = document.getElementById(
        "notifyCountDown" + randomNum
      );
      let countNum = 30;
      const notifyCountDownInterval = setInterval(() => {
        if (countNum <= 0) {
          clearInterval(notifyCountDownInterval);
        }
        $notifyCountDown.innerText = countNum--;
      }, 1000);

      //轮询检查是否写入区块
      const interval = setInterval(async () => {
        let draw = await getDrawTransaction([txid]);
        if (!draw.result) {
          return;
        }
        clearInterval(interval);
        notify.close();

        setTimeout(() => {
          if (cb) {
            cb();
          } else {
            location.reload();
          }
        }, 1000);
      }, 4000);
    }
  }
};
