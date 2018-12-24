import {getDrawTransaction, sendDrawTransaction} from '../api/global';

export default {
  methods: {
    async checkTxid(r, draw, cb) {
      //transaction failure
      let locale = this.$i18n.locale;

      let transResult, txid;
      if (!draw.result) {
        let message = locale === 'en' ? 'Operation Failed' : '交易失败';
        this.$message.error(message);
        return;
      } else {
        transResult = draw.result[0];
        if (!transResult.sendrawtransactionresult) {
          let message = locale === 'en' ? 'Operation Failed' : '交易失败';
          this.$message.error(message);
          return;
        }
        txid = transResult.txid;
      }
      console.log(txid);

      //transaction succeeded, polling to see if txid was written into the block chain
      let randomNum = Math.floor(Math.random() * 1000);
      let h = this.$createElement;
      const notify = this.$notify({
        title: locale === 'en' ? 'Operation Succeeded' : '操作成功',
        duration: 0,
        customClass: 'check-notify',
        showClose: false,
        message: h('div', [
          h('div', {
            class: 'check-notify-desc'
          }, [
            h('p', {
              style: {
                fontSize: locale === 'en' ? '12px' : '14px'
              }
            }, locale === 'en' ? 'Please wait while block is confirming.' : '区块确认中，请耐心等待。'),
            h('p', {
              style: {
                fontSize: locale === 'en' ? '12px' : '14px'
              }
            }, locale === 'en' ? ' Latest data will display after page refreshes.' : '页面刷新后，即可显示最新数据。'),
          ]),
          h('div', {
            class: 'check-notify-time',
            attrs: {
              id: "notifyCountDown" + randomNum,
            }
          }, '30')
        ])
      });

      //setting notify Countdown
      let $notifyCountDown = document.getElementById('notifyCountDown' + randomNum);
      let countNum = 30;
      const notifyCountDownInterval = setInterval(() => {
        if (countNum <= 0) {
          clearInterval(notifyCountDownInterval);
        }
        $notifyCountDown.innerText = countNum--;
      }, 1000);

      //polling and inspection of transaction result
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
}
