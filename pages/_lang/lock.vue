<template>
  <div class="lock"
       v-loading="loading"
       :element-loading-text="$t('global.loading')"
       element-loading-spinner="el-icon-loading">
    <!--开通-->
    <el-card class="border-card assets-info mt-30" v-if="!hasLock">
      <div slot="header" class="border-card-header">
        <span class="border-card-header__title">{{$t('lock.openTit')}}</span>
      </div>
      <el-button type="primary" size="large" @click="openLock">{{$t('lock.openBtn')}}</el-button>
    </el-card>

    <template v-if="hasLock">
      <!-- 多链收益地址 -->
      <el-card class="border-card assets-info mt-30">
        <div slot="header" class="border-card-header">
          <span class="border-card-header__title">{{$t('lock.benefitAddrTit')}}</span>
        </div>

        <el-table :data="chainAddrList"
                  class="no-border-table cell-first-highlight mt-20"
                  :show-header="false"
                  style="width: 100%">
          <el-table-column prop="key" width="180">
            <template slot-scope="scope">
              <span>{{scope.row.key}}{{$t('lock.benefitAddr')}}：</span>
            </template>
          </el-table-column>
          <el-table-column prop="value" width="400">
            <template slot-scope="scope">
              <el-input v-model="scope.row.value"
                        :placeholder="$t('lock.inputPhl')"
                        @blur="checkAddr(scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column width="80" align="left">
            <template slot-scope="scope">
              <el-button type="primary" size="small" v-if="scope.row.isEmpty"
                         @click="setLockAdd(scope.row)">{{$t('lock.addAddrBtn')}}
              </el-button>
              <el-button type="primary" size="small" v-else
                         @click="changeLockAdd(scope.row)">{{$t('lock.editBtn')}}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column min-width="100" align="left">
            <template slot-scope="scope">
              <span class="red" style="font-size: 12px">{{scope.row.err}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 查看已锁仓情况 -->
      <el-card class="border-card assets-info mt-30">
        <div slot="header" class="border-card-header">
          <span class="border-card-header__title">{{$t('lock.basic.title')}}</span>
        </div>
        <el-table :data="lockInfo" class="no-border-table cell-first-highlight" style="width: 100%">
          <el-table-column prop="lockType" :label="$t('lock.basic.type')" min-width="100">
            <template slot-scope="scope">
              <span>{{scope.row.lockType | filterType(types,$i18n.locale)}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('lock.basic.additionalBenefits')" min-width="120" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.lockType | filterBenefit}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('lock.basic.status')" min-width="200">
            <template slot-scope="scope">
              <div>
                <span>{{$t('lock.basic.lockNum')}}：</span>
                <span>{{scope.row.locked?scope.row.locked:0}}</span>
              </div>
              <div>
                <span>{{$t('lock.basic.remainTime')}}：</span>
                <span>{{scope.row.remainTime | filterRemainTime($i18n.locale) }}</span>
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column :label="$t('lock.basic.benefit')" min-width="150">
             <template slot-scope="scope">
               <el-button type="text" @click="getBenefitByLock(scope.row)">收益详情</el-button>
             </template>
           </el-table-column>-->
          <el-table-column :label="$t('lock.basic.operation')" min-width="120" align="center">
            <template slot-scope="scope">
              <el-button type="primary"
                         size="small"
                         plain
                         :disabled="Number(scope.row.locked)!==0"
                         @click="popReserveLock(scope.row)">{{$t('lock.basic.deposit')}}
              </el-button>
              <el-button type="primary"
                         plain
                         size="small"
                         :disabled="Number(scope.row.remainTime)!=0 || Number(scope.row.locked) ===0"
                         @click="withDrawModal=true;currentLockInfo=scope.row">{{$t('lock.basic.draw')}}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 历史记录 -->
      <el-card class="border-card assets-info mt-30">
        <div slot="header" class="border-card-header">
          <span class="border-card-header__title">{{$t('lock.history.title')}}</span>
        </div>
        <el-table :data="historyList"
                  class="no-border-table"
                  style="width: 100%">
          <el-table-column prop="asset" :label="$t('lock.history.assetAddr')" min-width="120">
            <template slot-scope="scope">{{scope.row.asset | filterTxid}}
              <icon-font class="copy-btn"
                         name="icon-fuzhi1"
                         v-clipboard:copy="scope.row.asset.substring(2)"
                         v-clipboard:success="onCopy"
                         v-clipboard:error="onError"></icon-font>
            </template>
          </el-table-column>
          <el-table-column prop="type" :label="$t('lock.history.type')" width="100">
            <template slot-scope="scope">
              <span>{{scope.row.type | filterType(lockConfigTypes,$i18n.locale)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="locktype" :label="$t('lock.history.lockType')" min-width="160" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.locktype | filterType(types,$i18n.locale)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="value" :label="$t('lock.history.quantity')" min-width="100"></el-table-column>
          <el-table-column :label="$t('lock.history.lockTime')" width="180" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.blocktime.$date | filterTime}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="txid" label="TX" align="center" min-width="180">
            <template slot-scope="scope">{{scope.row.txid | filterTxid}}
              <icon-font class="copy-btn"
                         name="icon-fuzhi1"
                         v-clipboard:copy="scope.row.txid.substring(2)"
                         v-clipboard:success="onCopy"
                         v-clipboard:error="onError"></icon-font>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </template>

    <!--锁仓充值模态框-->
    <el-dialog class="sar-modal"
               :title="$t('lock.basic.depositLock')"
               width="360px"
               label-position="top"
               center
               :show-close="false"
               stripe
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :visible.sync="lockModal">
      <el-form @submit.native.prevent
               ref="lockForm"
               :model="lockForm"
               :rules="rules">
        <el-form-item :label="$t('lock.basic.depositLockNum')" prop="amount">
          <el-input-number v-model.number="lockForm.amount"
                           controls-position="right"
                           :min="0"
                           :disabled="Number(sdsBalance)===0"
                           :max="sdsBalance"
                           style="width: 100%"></el-input-number>
        </el-form-item>
        <el-slider v-model="lockForm.amount"
                   :step="0.00000001"
                   :disabled="Number(sdsBalance)===0"
                   :min="0"
                   :max="sdsBalance"></el-slider>
        <div class="mt-30" style="font-weight: bold">{{$t('lock.basic.depositInfoTit')}}：</div>
        <div class="mt-10" style="line-height: 1.5">{{$t('lock.basic.depositInfo')}}</div>
      </el-form>
      <div slot="footer">
        <el-button class="sar-modal-btn" @click="lockModal = false">
          {{$t('global.cancelBtn')}}
        </el-button>
        <el-button class="sar-modal-btn" type="primary" @click="reserveLock">
          {{$t('global.confirmBtn')}}
        </el-button>
      </div>
    </el-dialog>

    <!--锁仓提取模态框-->
    <el-dialog class="sar-modal"
               :title="$t('lock.basic.withDrawSds')"
               width="360px"
               label-position="top"
               center
               :show-close="false"
               stripe
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :visible.sync="withDrawModal">
      <div class="mt-50 align-center" style="line-height: 1.5">
        {{$t('lock.basic.withDrawSdsInfo')}}
      </div>
      <div slot="footer" class="mt-30">
        <el-button class="sar-modal-btn" @click="withDrawModal = false">
          {{$t('global.cancelBtn')}}
        </el-button>
        <el-button class="sar-modal-btn" type="primary" @click="withDrawLock">
          {{$t('global.confirmBtn')}}
        </el-button>
      </div>
    </el-dialog>

    <!--硬件钱包签名提示-->
    <cold-wallet-dialog :cold-wallet-dialog-visible="coldWalletDialogVisible"></cold-wallet-dialog>
  </div>
</template>

<script>
  import getLeaderPubkey from "~/mixins/getLeaderPubkey";
  import {filterTime,} from "~/filters/core";
  import {BN, isValidEthAddress} from "~/utils/core";
  import clipboard from "~/mixins/clipboard";
  import {LOADING_OPTION, EIGHT_POWER, types, lockConfigTypes} from "~/filters/const";
  import {invokeScript, sendDrawTransaction} from "~/api/global";
  import getSarAddr from "~/mixins/getSarAddr";
  import checkTxid from "~/mixins/checkTxid";
  import {find, forEach, cloneDeep} from "lodash";
  import {getLockListByAddr, getLockHistory} from "~/api/wallet";
  import {getCurrentUser} from "~/utils/login";
  import getAssets from "~/mixins/getAssets";
  import eNeo from '../../utils/eNeo'

  export default {
    data() {
      return {
        hasLock: false, //是否有锁仓账户
        btnLocked: false, //当前按钮锁定，避免发起两次
        loading: true,
        lockInfo: null, //锁仓情况列表
        types, //锁仓类型
        historyList: null, //历史记录
        timer: null, //计时器
        lockTimeList: null, //锁仓时间列表
        lockConfigTypes, //锁仓操作类型 {TRANSACTION_TYPE_OPEN = 1,TRANSACTION_TYPE_LOCK,TRANSACTION_TYPE_WITHDRAW,TRANSACTION_TYPE_SHUT}
        chainTypes: ["ETH", "EOS"], //公链列表
        chainAddrList: null, //公链收益地址列表,
        chainAddrListClone: null, //公链收益地址列表备份,
        lockModal: false,
        currentLockInfo: null,
        lockForm: {
          amount: 0,
        },
        rules: {
          amount: [
            {validator: this.validateReserveAmount, trigger: 'change'}
          ]
        },
        withDrawModal: false,
      };
    },
    mixins: [getLeaderPubkey, getSarAddr, checkTxid, clipboard, getAssets],
    filters: {
      filterTime,
      filterType(val, types, locale) {
        if (!val) {
          return val;
        }
        let tempObj = find(types, o => o.key === val);
        if (tempObj) {
          return locale === 'zh' ? tempObj.zhName : tempObj.enName;
        }
      },
      filterRemainTime(my_time, locale) {
        if (!my_time) {
          return my_time;
        }
        //将时间戳转换为天，小时，分，秒
        let days = my_time / 1000 / 60 / 60 / 24;
        let daysRound = Math.floor(days);
        let hours = my_time / 1000 / 60 / 60 - 24 * daysRound;
        let hoursRound = Math.floor(hours);
        let minutes = my_time / 1000 / 60 - 24 * 60 * daysRound - 60 * hoursRound;
        let minutesRound = Math.floor(minutes);
        let seconds = parseInt(
          my_time / 1000 -
          24 * 60 * 60 * daysRound -
          60 * 60 * hoursRound -
          60 * minutesRound
        );
        let time;
        if (locale === 'zh') {
          time = `${daysRound}天 ${hoursRound}时 ${minutesRound}分 ${seconds}秒`;
        } else {
          time = `${daysRound}days ${hoursRound}hours ${minutesRound}minutes  ${seconds}seconds`;
        }
        return time;
      },
      filterTxid(val) {
        return val.slice(2, 6) + "..." + val.substr(val.length - 4);
      },
      filterBenefit(val) {
        let benefit;
        switch (val) {
          case 'lock_01':
            benefit = '0%';
            break;
          case 'lock_02':
            benefit = '10%';
            break;
          case 'lock_03':
            benefit = '20%';
            break;
          case 'lock_04':
            benefit = '30%';
            break;
        }
        return benefit;
      }
    },
    computed: {
      sdsBalance() {
        if (this.assets) {
          let tempObj = find(this.assets, o => o.assetid === this.sarAddr.sds.hash);
          if (tempObj) {
            return BN(tempObj.balance).toNumber();
          }
        }
        return 0;
      }
    },
    mounted() {
      //获取用户信息
      let user = getCurrentUser(this);
      this.currentUser = user;

      //未登录跳转到登录界面
      if (!user) {
        this.$router.replace({
          path: `${this.$i18n.locale === "en" ? "" : "/zh"}/login`
        });
        return false;
      }

      //判断是否有锁仓账户
      this.getBasicLockInfo();

      //获取历史记录
      this.getHistoryList();

      //获取当前状态所有的type类型
      this.getLockTypesByAddr();

      //定时器刷新剩余时间
      this.timer = setInterval(() => {
        if (!this.lockInfo) {
          return;
        }
        forEach(this.lockInfo, o => {
          o.remainTime = this.getRemainTime(o.lockTime, o.lockType);
        });
      }, 1000);
    },
    beforeDestory() {
      this.timer = null;
    },
    methods: {
      //获取当前状态所有的type类型
      async getLockTypesByAddr() {
        let scAddr = this.sarAddr.lock.hash;
        let params = [
          {
            key: "ETH",
            param: ["(addr)" + this.currentUser.address, "(str)ETH"],
            method: "getLockAdd"
          },
          {
            key: "EOS",
            param: ["(addr)" + this.currentUser.address, "(str)EOS"],
            method: "getLockAdd"
          }
        ];

        let scHash = eNeo.emitParams(scAddr, params);
        let _r = await invokeScript([scHash]);
        let r = _r.result[0].stack;

        let tempArr = [];
        if (r && Array.isArray(r)) {
          for (let i = 0, len = params.length; i < len; i++) {
            let item = params[i];
            let value = eNeo.hex2String(r[i].value)
            let tempObj = {
              key: item.key,
              value: value,
              isEmpty: value.length > 0 ? false : true, //是否为空
              err: '',
            };
            tempArr.push(tempObj);
          }
          this.chainAddrList = tempArr;
          this.chainAddrListClone = cloneDeep(tempArr);
        }
      },
      //获取当前lock信息
      async getBasicLockInfo() {
        let scAddr = this.sarAddr.lock.hash;
        let {wif, address} = this.currentUser;

        let _r = await getLockListByAddr([scAddr, address]);
        let r = _r.result;

        if (r && Array.isArray(r)) {
          this.hasLock = true;
          this.lockTimeList = await this.getLockTime();
          this.lockInfo = this.dealLockInfo(r);
        } else {
          this.hasLock = false;
        }
        this.loading = false;
      },
      //处理lockInfo返回值
      dealLockInfo(arr) {
        arr.forEach(item => {
          let lockType = item.lockType;
          let lockTime = item.lockTime * 1000;
          item.lockTime = lockTime;
          let remainTime = this.getRemainTime(lockTime, lockType);
          this.$set(item, "remainTime", remainTime);
        });
        return arr;
      },
      //获取lockTime列表
      async getLockTime() {
        let scAddr = this.sarAddr.lock.hash;
        let params = [
          {
            key: "lock_01",
            param: ["(str)lock_01"],
            method: "getLockTime"
          },
          {
            key: "lock_02",
            param: ["(str)lock_02"],
            method: "getLockTime"
          },
          {
            key: "lock_03",
            param: ["(str)lock_03"],
            method: "getLockTime"
          },
          {
            key: "lock_04",
            param: ["(str)lock_04"],
            method: "getLockTime"
          }
        ];

        let scHash = eNeo.emitParams(scAddr, params);
        let _r = await invokeScript([scHash]);
        let r = _r.result[0].stack;
        let tempArr = [];
        if (r && Array.isArray(r)) {
          for (let i = 0, len = params.length; i < len; i++) {
            let item = params[i];

            let tempObj = {
              key: item.key,
              value: eNeo.hex2Integer(r[i].value)
            };
            tempArr.push(tempObj);
          }
          return tempArr;
        }
      },
      //获取剩余时间
      getRemainTime(lockTime, lockType) {
        //获取当前时间
        let nowTime = new Date().getTime();

        //计算截止时间
        let addTimeObj = find(this.lockTimeList, o => o.key === lockType);
        let addTime, remainTime;
        if (addTimeObj) {
          addTime = addTimeObj.value * 1000;
        }
        let endTime = lockTime + addTime;
        if (nowTime > endTime) {
          remainTime = 0;
        } else {
          remainTime = endTime - nowTime;
        }
        return remainTime;
      },
      async handleParams(scAddr, type, params, cb) {
        if (this.btnLocked) {
          return;
        }
        this.btnLocked = true;

        const loading = this.$loading(LOADING_OPTION);
        let {wif, address} = this.currentUser;

        //签名
        let tempObj = {
          wif,
          scAddr,
          type,
          params
        };
        let r = await this.getSignature("callc", tempObj, loading);
        if (!r) {
          loading.close();
          this.btnLocked = false;
          return;
        }

        sendDrawTransaction([r.rawData])
          .then(draw => {
            this.checkTxid(r, draw, () => {
              this.btnLocked = false;
              if (cb) {
                cb();
              }
              loading.close();
            });
          })
          .catch(() => {
            this.btnLocked = false;
            loading.close();
          });
      },
      //开通锁仓账户
      async openLock() {
        let scAddr = this.sarAddr.lock.hash;
        let type = "openLock";
        let params = ["(addr)" + this.currentUser.address, "(str)sds_account"];
        this.handleParams(scAddr, type, params, this.updateViewData);
      },
      //添加收益地址
      async setLockAdd(item) {
        //校验地址是否符合标准
        if (!this.checkAddr(item)) {
          return;
        }

        //发起请求
        let scAddr = this.sarAddr.lock.hash;
        let type = "setLockAdd";
        let params = [
          "(addr)" + this.currentUser.address,
          "(str)" + item.key,
          "(str)" + item.value
        ];
        this.handleParams(scAddr, type, params, this.getLockTypesByAddr);
      },
      //更改收益地址
      async changeLockAdd(item) {
        //校验地址是否符合标准
        if (!this.checkAddr(item)) {
          return;
        }

        let scAddr = this.sarAddr.lock.hash;
        let type = "setLockAdd";
        let params = [
          "(addr)" + this.currentUser.address,
          "(str)" + item.key,
          "(str)" + item.value
        ];
        this.handleParams(scAddr, type, params, this.getLockTypesByAddr);
      },
      //检查地址是否符合标准
      checkAddr(item) {
        let locale = this.$i18n.locale;

        //地址未更改
        let address = find(this.chainAddrListClone, o => o.key === item.key).value;
        if (address === item.value) {
          item.err = locale === 'zh' ? '请在输入框内修改地址' : 'Please modify the address in the input box';
          return false;
        }

        //地址不符合要求
        if (item.key === 'ETH') {
          if (!isValidEthAddress(item.value)) {
            item.err = locale === 'zh' ? 'ETH地址不符合要求' : 'The ETH address does not meet the requirements';
            return false;
          }
        } else if (item.key === 'EOS') {

        }

        item.err = '';

      },
      //检查锁仓数量
      validateReserveAmount(rule, value, callback) {
        let decimals = new BN(value).dp();
        let locale = this.$i18n.locale;
        if (value === "" || value === 0) {
          callback(new Error(locale === "zh" ? "锁仓金额不能为0" : "The transfer amount cannot be 0"));
        } else if (decimals > 8) {
          callback(new Error(locale === "zh" ? "锁仓金额不能超过小数点后8位" : "The transfer amount cannot exceed 8 decimal places"));
        } else if (Number(value) > Number(this.sdsBalance)) {
          callback(new Error(locale === "zh" ? `锁仓数量不能大于账户中sds余额${this.sdsBalance}` : ""));
        }
      },
      //弹出锁仓模态框
      popReserveLock(item) {
        this.lockModal = true;
        this.currentLockInfo = item;
      },
      //锁仓
      async reserveLock() {
        this.$refs['lockForm'].validate((valid) => {
          if (valid) {
            let lockType = this.currentLockInfo.lockType;
            let amount = this.lockForm.amount;
            let scAddr = this.sarAddr.lock.hash;
            let address = this.currentUser.address;
            let type = "reserve";
            amount = new BN(amount).times(EIGHT_POWER).integerValue().toString();
            let params = ["(addr)" + address, "(str)" + lockType, "(int)" + amount];
            this.handleParams(scAddr, type, params, () => {
              this.updateViewData();
              this.lockModal = false;
            });
          } else {
            return false;
          }
        });
      },
      //解锁
      async withDrawLock() {
        let scAddr = this.sarAddr.lock.hash;
        let address = this.currentUser.address;
        let lockType = this.currentLockInfo.lockType;
        let locked = this.currentLockInfo.locked;
        let type = "withdraw";
        let amount = new BN(locked).times(EIGHT_POWER).integerValue().toString();
        let params = ["(addr)" + address, "(str)" + lockType, "(int)" + amount];
        this.handleParams(scAddr, type, params, () => {
          this.updateViewData();
          this.withDrawModal = false;
        });
      },
      //更新数据
      updateViewData() {
        //更新assets,
        this.$emit("update-assets");

        //更新lockInfo
        this.getBasicLockInfo();
      },
      //获取历史记录
      getHistoryList() {
        getLockHistory([
          this.sarAddr.lock.hash,
          this.currentUser.address,
          1000,
          1
        ])
          .then(res => {
            if (res && res.result) {
              this.historyList = res.result;
            }
          })
          .catch(err => {
            console.log(err);
          });
      },
      //关闭
      closeLock(lockType) {
        let scAddr = this.sarAddr.lock.hash;
        let address = this.currentUser.address;
        let type = "close";
        let params = ["(addr)" + address, "(str)" + lockType];
        this.handleParams(scAddr, type, params, this.updateViewData);
      }
    }
  };
</script>
