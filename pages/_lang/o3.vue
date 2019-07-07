<template>
  <div
    class="mobile"
    v-loading.fullscreen.lock="fullscreenLoading"
    element-loading-background="rgba(0, 0, 0, 0.3)"
  >
    <!--logo-->
    <div class="mobile-header">
      <img class="logo-img" src="~/assets/img/logo.png" alt="logo">
    </div>

    <!--一键发币-->
    <div class="mint">
      <div class="mint-title">
        <span class="mint-title__sub">One-Click Mint</span>
      </div>
      <el-steps
        v-if="quickSarSteps"
        :active="activeStep"
        finish-status="success"
        class="one-click-steps"
      >
        <el-step v-for="(item,index) in quickSarSteps" :key="index">
          <span slot="title" v-html="item.enTitle"></span>
        </el-step>
      </el-steps>
      <div class="mint-content">
        <!--抵押neo-->
        <div class="mint-item">
          <span class="mint-item__name">Mortgage NEO</span>
          <el-input-number
            class="mint-item__val"
            :min="0"
            :max="formData.neoMax"
            :step="1"
            :controls="false"
            :disabled="formData.neoMax<=0"
            v-model.number="formData.neoAmount"
            @change="neoChange"
          ></el-input-number>
        </div>
        <el-slider
          v-model="formData.neoAmount"
          :min="0"
          :max="formData.neoMax"
          :disabled="formData.neoMax<=0"
          @change="neoChange"
          :step="1"
        ></el-slider>
        <!--发行sdusd-->
        <div class="mint-item mt-10">
          <span class="mint-item__name">Mint SDUSD</span>
          <el-input-number
            class="mint-item__val"
            :min="0"
            :max="formData.sdusdMax"
            :disabled="formData.sdusdMax<=0"
            :step="0.00000001"
            :controls="false"
            v-model.number="formData.sdusdAmount"
            @change="sdusdChange"
          ></el-input-number>
        </div>
        <el-slider
          v-model="formData.sdusdAmount"
          :min="0"
          :max="formData.sdusdMax"
          :disabled="formData.sdusdMax<=0"
          @change="sdusdChange"
          :step="0.00000001"
        ></el-slider>
        <!--发行后的抵押率-->
        <div class="status mt-10">
          <div>Mortgage</div>
          <div
            v-if="formData.status!=='0'"
            :class="[{'green':formData.status==='0',
                         'blue':formData.status==='1',
                         'yellow':formData.status==='2',
                         'red':formData.status==='3'}]"
          >
            {{formData.rate | decimalPlaces(2)}}%
            ({{formData.status | filterMethod($t('sarCStatus'))}})
          </div>
          <div v-else>-</div>
        </div>
        <!--confirm按钮-->
        <div class="align-center mt-20">
          <el-button
            class="confirm-btn"
            type="primary"
            :disabled="btnDisabled"
            @click="oneClickMint"
          >Confirm</el-button>
        </div>
      </div>
    </div>

    <div class="divider"></div>
    <!--SAR状态-->
    <div class="sar-status">
      <div class="sar-status-title">My SAR</div>
      <div class="sar-status-content">
        <div class="sar-status-item">
          <span class="sar-status-item__name">Mortgage Rate</span>
          <span
            v-if="mySar"
            class="align-right"
            :class="[{'blue':parseFloat(mySar.mortgageRate)>lineRateC+50,
                      'yellow':parseFloat(mySar.mortgageRate)<=lineRateC+50 && parseFloat(mySar.mortgageRate)>=lineRateC,
                      'red':parseFloat(mySar.mortgageRate)<lineRateC}]"
          >{{mySar.mortgageRate | decimalPlaces(2,3) }}%</span>
          <span v-else class="align-right">-</span>
        </div>
        <div class="sar-status-item">
          <span class="sar-status-item__name">SDUSD Minted</span>
          <span v-if="mySar" class="align-right">
            {{mySar.hasDrawed | decimalPlaces(2,3)}}
            (${{mySar.hasDrawed | decimalPlaces(2,3)}})
          </span>
          <span v-else class="align-right">-</span>
        </div>
        <div class="sar-status-item">
          <span class="sar-status-item__name">NEO Mortgaged</span>
          <span v-if="mySar" class="align-right">
            {{mySar.locked | decimalPlaces(2,3)}}
            (${{(mySar.locked*sneoPrice) | decimalPlaces(2,3)}})
          </span>
          <span v-else class="align-right">-</span>
        </div>
      </div>
    </div>

    <!--备注-->
    <div class="remark">
      <div>
        Note：For full functions & help, pls visit:
        <br>
        <a class="go-to-alchemint" href="http://neo.alchemint.io">neo.alchemint.io</a>
      </div>
    </div>
  </div>
</template>

<script>
import o3dapi from "o3-dapi-core";
import o3dapiNeo from "o3-dapi-neo";
import { getDrawTransaction } from "~/api/global";
import { find, cloneDeep, findIndex } from "lodash";
import { getsar4CDetailByAdd } from "~/api/individual";
import getSarAddr from "~/mixins/getSarAddr";
import { decimalPlaces, filterMethod } from "~/filters/core";
import { BN } from "~/utils/core";
import { LOADING_OPTION, EIGHT_POWER } from "~/filters/const";
import { mapGetters } from "vuex";
const quickSarSteps = [
  {
    name: "create",
    zhTitle: "SAR<br>创建",
    enTitle: "Creat<br>SAR"
  },
  {
    name: "convert",
    zhTitle: "NEO<br>转化",
    enTitle: "Convert<br>NEO"
  },
  {
    name: "mortgage",
    zhTitle: "SNEO<br>抵押",
    enTitle: "Mortgage<br>SNEO"
  },
  {
    name: "mint",
    zhTitle: "SDUSD<br>发行",
    enTitle: "Issue<br>SDUSD"
  }
];

o3dapi.initPlugins([o3dapiNeo]);

export default {
  layout: "mobile",
  name: "O3",
  data() {
    return {
      //一键发币
      formData: {
        neoAmount: 0,
        neoMax: 0,
        sdusdAmount: 0,
        sdusdMax: 0,
        rate: "",
        status: "0"
      },
      account: null, //账户信息
      balances: null, //资产信息
      networks: null, //网络环境
      hasSar: false, //是否已有sar
      mySar: null, //我的sar状态
      activeStep: 0,
      quickSarSteps: null,
      btnDisabled: true,
      fullscreenLoading: false
    };
  },
  computed: {
    ...mapGetters(["typeB", "typeA"]),
    lineRateC() {
      if (this.typeA) {
        return find(this.typeA, o => o.key === "liquidate_line_rate_c").value;
      } else {
        return 0;
      }
    },
    sneoPrice() {
      if (this.typeB) {
        return find(this.typeB, o => o.key === "sneo_price").value;
      } else {
        return 0;
      }
    }
  },
  mixins: [getSarAddr],
  filters: {
    decimalPlaces,
    filterMethod
  },
  async mounted() {
    const loading = this.$loading(LOADING_OPTION);

    //获取typeB数据
    if (!this.typeB) {
      await this.$store.dispatch("getTypeB");
    }

    //获取typeA数据
    if (!this.typeA) {
      await this.$store.dispatch("getTypeA");
    }

    //连接O3钱包
    this.connectToO3(loading);
  },
  methods: {
    //连接O3钱包
    async connectToO3(loading) {
      //选择wallet账户
      let account;
      try {
        account = await o3dapi.NEO.getAccount();
        this.account = account;
      } catch (err) {
        loading.close();
        return;
      }
      //获取网络环境
      let networks = await o3dapi.NEO.getNetworks();
      this.networks = networks;
      //获取账户资产
      let balances = await o3dapi.NEO.getBalance({
        params: {
          address: this.account.address
        },
        network: networks.defaultNetwork
      });
      this.balances = balances[this.account.address];
      //判断neoMax和sdusdMax的最大值
      let neoObj = find(this.balances, o => o.symbol === "NEO");
      if (neoObj) {
        let neoMax = parseInt(neoObj.amount);
        this.formData.neoMax = neoMax;
      }
      //获得全局sar状态
      let mySar = await getsar4CDetailByAdd([
        this.account.address,
        this.sarAddr.sarC.hash
      ]);
      if (!mySar.result) {
        this.hasSar = false;
        this.formData.sdusdMax = 0;
        loading.close();
        return;
      }
      this.hasSar = true;
      this.mySar = mySar.result[0];
      let { locked, hasDrawed } = this.mySar;
      let sdusdMax = this.getSdusdAmountByRate(
        locked,
        hasDrawed,
        this.lineRateC
      );
      this.formData.sdusdMax = +sdusdMax;
      loading.close();
    },

    //轮询检查是否写入区块
    async checkTxid(txid, cb) {
      txid = "0x" + txid;
      const interval = setInterval(async () => {
        let draw = await getDrawTransaction([txid]);
        if (!draw.result) {
          return;
        }
        clearInterval(interval);
        setTimeout(() => {
          if (cb) {
            cb();
          } else {
            location.reload();
          }
        });
      }, 4000);
    },

    //NEO值的变化
    async neoChange(neoAmount) {
      if (isNaN(neoAmount)) {
        this.formData.neoAmount = 0;
        return;
      }

      //获得原sar中已抵押SNEO和已发行的SDUSD的量
      let originalLocked, originalHasDrawed;
      if (this.mySar) {
        originalLocked = +this.mySar.locked;
        originalHasDrawed = +this.mySar.hasDrawed;
      } else {
        originalLocked = originalHasDrawed = 0;
      }

      //计算最大可发行SDUSD和最优可发行SDUSD
      let maxIssueSdusd, optimalIssueSdusd;
      let lineRate = this.lineRateC;
      //计算总抵押的SNEO
      let totalLocked = new BN(neoAmount)
        .plus(originalLocked)
        .dp(8, 3)
        .toNumber();
      maxIssueSdusd = this.getSdusdAmountByRate(
        totalLocked,
        originalHasDrawed,
        lineRate
      );
      optimalIssueSdusd = this.getSdusdAmountByRate(
        totalLocked,
        originalHasDrawed,
        lineRate + 50
      );
      //设置最大值和最优值
      this.formData.sdusdAmount = +optimalIssueSdusd;
      this.formData.sdusdMax = +maxIssueSdusd;

      //计算变化后的抵押率和抵押状态
      //计算总发行SDUSD
      let totalHasDrawed = new BN(optimalIssueSdusd)
        .plus(originalHasDrawed)
        .dp(8, 3)
        .toNumber();
      let { rate, status } = this.getRateAndStatusAfterDataChange(
        totalLocked,
        totalHasDrawed
      );
      this.formData.rate = rate;
      this.formData.status = status;

      this.quickSarSteps = this.judgeQuickSteps();

      //判断btnDisabled的状态
      if (this.formData.neoAmount === 0 && this.formData.sdusdAmount === 0) {
        this.btnDisabled = true;
      } else {
        this.btnDisabled = false;
      }
    },

    //SDUSD值变化
    async sdusdChange(sdusdAmount) {
      if (isNaN(sdusdAmount)) {
        this.formData.sdusdAmount = 0;
        return;
      }

      //获得原sar中已抵押SNEO和已发行的SDUSD的量
      let originalLocked, originalHasDrawed;
      if (this.mySar) {
        originalLocked = +this.mySar.locked;
        originalHasDrawed = +this.mySar.hasDrawed;
      } else {
        originalLocked = originalHasDrawed = 0;
      }

      //计算变化后的抵押率和抵押状态
      //计算总抵押的SNEO
      let totalLocked = new BN(this.formData.neoAmount)
        .plus(originalLocked)
        .dp(8, 3)
        .toNumber();
      //计算总发行SDUSD
      let totalHasDrawed = new BN(sdusdAmount)
        .plus(originalHasDrawed)
        .dp(8, 3)
        .toNumber();
      let { rate, status } = this.getRateAndStatusAfterDataChange(
        totalLocked,
        totalHasDrawed
      );
      this.formData.rate = rate;
      this.formData.status = status;

      this.quickSarSteps = this.judgeQuickSteps();

      //判断btnDisabled的状态
      if (this.formData.neoAmount === 0 && this.formData.sdusdAmount === 0) {
        this.btnDisabled = true;
      } else {
        this.btnDisabled = false;
      }
    },

    //获取对应rate的sdusd的值
    getSdusdAmountByRate(locked, hasDrawed, rate) {
      //totalSdusd包含可发行SDUSD和已发行SDUSD,
      //canDrawSdusd为可发行SDUSD
      let sneoPrice = this.sneoPrice;
      let totalSdusd, canDrawSdusd;
      totalSdusd = new BN(locked)
        .times(sneoPrice)
        .div(rate)
        .times(100)
        .dp(8, 3)
        .toNumber();
      canDrawSdusd = new BN(totalSdusd)
        .minus(hasDrawed)
        .dp(8, 3)
        .toNumber();
      canDrawSdusd = canDrawSdusd > 0 ? canDrawSdusd : 0;
      return canDrawSdusd;
    },

    //计算变化后的抵押率和抵押状态
    getRateAndStatusAfterDataChange(locked, hasDrawed) {
      //rate
      let rate;
      let sneoPrice = this.sneoPrice;
      let lineRateC = this.lineRateC;
      if (hasDrawed) {
        rate = new BN(sneoPrice)
          .times(locked)
          .div(hasDrawed)
          .times(100)
          .dp(8, 3)
          .toNumber();
      } else {
        rate = 0;
      }

      //状态
      let status;
      if (rate >= this.lineRateC + 50) {
        status = "1";
      } else if (rate >= this.lineRateC && rate < this.lineRateC + 50) {
        status = "2";
      } else if (rate < this.lineRateC) {
        status = "3";
      }

      if (Number(locked) === 0 || Number(hasDrawed) === 0) {
        status = "0";
      }

      return {
        rate,
        status
      };
    },

    //判断所需的步数
    judgeQuickSteps() {
      let tempArr = cloneDeep(quickSarSteps);

      if (this.mySar) {
        let index = findIndex(tempArr, o => o.name === "create");
        tempArr.splice(index, 1);
      }

      let neoAmount = Number(this.formData.neoAmount);
      if (isNaN(neoAmount) || neoAmount <= 0) {
        let index = findIndex(tempArr, o => o.name === "convert");
        tempArr.splice(index, 1);
        let index1 = findIndex(tempArr, o => o.name === "mortgage");
        tempArr.splice(index1, 1);
      }

      //sdusd amount <=0
      let sdusdAmount = Number(this.formData.sdusdAmount);
      if (isNaN(sdusdAmount) || sdusdAmount <= 0) {
        let index = findIndex(tempArr, o => o.name === "mint");
        tempArr.splice(index, 1);
      }
      if (tempArr.length === 0) {
        tempArr = null;
      }
      return tempArr;
    },

    //一键发币
    async oneClickMint() {
      let neoAmount = this.formData.neoAmount;

      if (!Number.isInteger(neoAmount)) {
        this.$message.error("NEO value must be integer.");
        return;
      }

      const h = this.$createElement;
      this.$msgbox({
        title: "Tip",
        message: h("ul", { style: "margin:0;line-height:22px" }, [
          h(
            "li",
            null,
            "Several steps will take place during confirmation process."
          ),
          h(
            "li",
            { style: "marginTop:10px" },
            'Please click on all the "Send" buttons afterwards.'
          )
        ]),
        showCancelButton: false,
        confirmButtonText: "Confirm",
        center: true,
        customClass: "o3-alert",
        showClose: true
      }).then(() => {
        this.fullscreenLoading = true;
        this.createSar();
      });
    },

    //具体操作
    createSar() {
      if (this.hasSar) {
        this.neoToSneo();
        return;
      }
      o3dapi.NEO.invoke({
        scriptHash: this.sarAddr.sarC.hash.substring(2),
        operation: "openSAR4C",
        args: [
          { type: "Address", value: this.account.address },
          { type: "String", value: "sneo_price" }
        ],
        attachedAssets: "",
        fee: "",
        network: this.networks.defaultNetwork,
        assetIntentOverrides: "",
        triggerContractVerification: false
      })
        .then(({ txid, nodeURL }) => {
          this.checkTxid(txid, () => {
            this.activeStep++;
            this.neoToSneo();
          });
        })
        .catch(() => {
          this.updateData();
        });
    },
    operationSar(method, amount, cb) {
      o3dapi.NEO.invoke({
        scriptHash: this.sarAddr.sarC.hash.substring(2),
        operation: method,
        args: [
          { type: "Address", value: this.account.address },
          { type: "Integer", value: amount }
        ],
        attachedAssets: "",
        fee: "",
        network: this.networks.defaultNetwork,
        assetIntentOverrides: "",
        triggerContractVerification: false
      })
        .then(({ txid }) => {
          this.checkTxid(txid, () => {
            this.activeStep++;
            if (cb) {
              cb();
            }
          });
        })
        .catch(() => {
          this.updateData();
        });
    },
    neoToSneo() {
      if (Number(this.formData.neoAmount) === 0) {
        this.addSneo();
        return;
      }
      o3dapi.NEO.invoke({
        scriptHash: this.sarAddr.sneo.hash.substring(2),
        operation: "mintTokens",
        args: [{ type: "String", value: "neo" }],
        attachedAssets: {
          NEO: this.formData.neoAmount
        },
        fee: "",
        network: this.networks.defaultNetwork,
        assetIntentOverrides: "",
        triggerContractVerification: false
      })
        .then(({ txid }) => {
          this.checkTxid(txid, () => {
            this.activeStep++;
            this.addSneo();
          });
        })
        .catch(() => {
          this.updateData();
        });
    },
    addSneo() {
      if (Number(this.formData.neoAmount) === 0) {
        this.issueSdusd();
        return;
      }
      let sneoAmount = new BN(this.formData.neoAmount)
        .times(EIGHT_POWER)
        .integerValue()
        .toNumber();
      this.operationSar("reserve", sneoAmount, this.issueSdusd);
    },
    issueSdusd() {
      if (Number(this.formData.sdusdAmount) === 0) {
        this.updateData();
        return;
      }
      let sdusdAmount = new BN(this.formData.sdusdAmount)
        .times(EIGHT_POWER)
        .integerValue()
        .toNumber();
      this.operationSar("expande", sdusdAmount, this.updateData);
    },
    async updateData() {
      if (this.activeStep === 0) {
        //按钮状态变更
        this.fullscreenLoading = false;
        this.btnDisabled = false;
        return;
      }

      //获取账户资产
      let balances = await o3dapi.NEO.getBalance({
        params: {
          address: this.account.address
        },
        network: this.networks.defaultNetwork
      });
      this.balances = balances[this.account.address];

      //获得全局sar状态
      let mySar = await getsar4CDetailByAdd([
        this.account.address,
        this.sarAddr.sarC.hash
      ]);
      if (!mySar.result) {
        return;
      }
      this.mySar = mySar.result[0];

      //step状态变更
      this.activeStep = 0;
      this.quickSarSteps = null;

      //表单元素变更
      let neoObj = find(this.balances, o => o.symbol === "NEO");
      let neoMax = 0;
      if (neoObj) {
        neoMax = parseInt(neoObj.amount);
      }
      let { locked, hasDrawed } = this.mySar;
      let sdusdMax = this.getSdusdAmountByRate(
        locked,
        hasDrawed,
        this.lineRateC
      );
      sdusdMax = +sdusdMax;
      this.formData = {
        neoAmount: 0,
        neoMax: neoMax,
        sdusdAmount: 0,
        sdusdMax: sdusdMax,
        rate: "",
        status: "0"
      };

      //按钮状态变更
      this.fullscreenLoading = false;
      this.btnDisabled = true;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/var";

@media screen and (min-width: 992px) {
  .mobile {
    max-width: 500px;
    margin: 0 auto;
  }
}

.mobile {
  width:100%;
  background: #fff;
  &-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0 10px 0 26px;
    height: 50px;
    background: $--nav-bg;
    color: rgba(255, 255, 255, 0.5);
    font-size: 12px;
    .logo-img {
      height: 36px;
    }
    .connect-container {
      display: flex;
      align-items: center;
      .connect-info {
        margin-right: 6px;
      }
    }
  }
  .mint {
    &-title {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      height: 50px;
      line-height: 50px;
      //background: rgba(91, 152, 250, 0.2);
      color: $--color-primary;
      font-size: 18px;
      font-weight: bold;
      border-bottom: 1px solid $--border-color-light;
      &__sub {
        text-align: center;
        flex: 1;
      }
    }
    &-content {
      padding: 20px 26px;
    }
    &-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      &__name {
        flex: 1;
        font-weight: bold;
      }
      &__val {
        width: 160px;
      }
    }
    .status {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    .confirm-btn {
      width: 140px;
      font-size: 16px;
    }
  }
  .divider {
    background: #f6f6f9;
    height: 20px;
  }
  .sar-status {
    &-title {
      text-align: center;
      height: 50px;
      line-height: 50px;
      //background: rgba(91, 152, 250, 0.2);
      color: $--color-primary;
      font-size: 18px;
      font-weight: bold;
      border-bottom: 1px solid $--border-color-light;
    }
    &-content {
      padding: 10px 26px;
      border-bottom: 1px solid #ddd;
    }
    &-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      height: 36px;
      line-height: 36px;
      &__name {
        font-weight: bold;
      }
      > span {
        width: 50%;
        &.sar-status-data {
          text-align: right;
        }
      }
    }
  }
  .remark {
    padding: 10px 26px;
    font-size: 13px;
    line-height: 20px;
    .go-to-alchemint {
      color: #5b98fa;
    }
  }
}
</style>

<style lang="scss">
@import "../../assets/styles/var";

.one-click-steps {
  padding: 10px 26px 10px 26px;
  background: #f6f6f9;
  .el-step__icon {
    width: 20px;
    height: 20px;
    font-size: 12px;
  }
  .el-step__title {
    font-size: 12px;
    line-height: 16px;
    margin-top: 10px;
  }
  .el-step.is-horizontal .el-step__line {
    top: 9px;
    height: 1px;
  }
}

.o3-alert {
  width: 300px !important;
  &.el-message-box--center {
    padding-bottom: 20px;
    .el-message-box__header {
      padding: 16px 0;
      border-bottom: 1px solid $--border-color-light;
    }
    .el-message-box__content {
      padding: 30px 10px 30px 0;
      text-align: left;
    }
    .el-message-box__btns {
      .el-button--small {
        padding: 10px 30px;
        font-size: 14px;
      }
    }
  }
}
</style>

