<template>
  <el-card class="border-card">
    <div slot="header" class="border-card-header">
      <span class="border-card-header__title">
        NEO <icon-font name="icon-zhuanhuan"></icon-font> SNEO
      </span>
      <el-tooltip popper-class="global-popper"
                  placement="bottom-start"
                  offset="100"
                  effect="light">
        <ul slot="content" class="tooltip-ul" v-html="$t('individual.neoToSneo.info')"></ul>
        <icon-font name="icon-wenhao" class="green"></icon-font>
      </el-tooltip>
    </div>
    <div class="neo-sneo">
      <div class="neo-sneo-title">
        <span>{{$t('individual.neoToSneo.amountToInput')}}</span>
        <span>{{$t('individual.neoToSneo.amountToGet')}}</span>
      </div>
      <el-form class="neo-sneo-form"
               label-position="left"
               :inline="true"
               label-width="50px">
        <div class="neo-sneo-form__item">
          <el-form-item label="NEO">
            <el-input v-model="neo2sneoVal"
                      style="width: 100px;height: 32px"
                      size="small"
                      @change="handleNeoChange">
              <div slot="append" @click="getAllNeo" class="all-btn">{{$t('global.all')}}</div>
            </el-input>
            <i class="el-icon-caret-right"></i>
          </el-form-item>
          <el-form-item label="SNEO">
            <el-input v-model="neo2sneoVal" disabled style="width: 80px" size="small"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       class="confirm-btn"
                       @click="validateNeoToSneo"
                       size="small">{{$t('global.confirmBtn')}}
            </el-button>
          </el-form-item>
        </div>
        <div class="neo-sneo-form__item clearfix">
          <el-form-item label="SNEO">
            <el-input v-model="sneo2neoVal"
                      style="width: 100px"
                      size="small"
                      @change="handleSneoChange">
              <div slot="append" @click="getAllSneo" class="all-btn">{{$t('global.all')}}</div>
            </el-input>
            <i class="el-icon-caret-right"></i>
          </el-form-item>
          <el-form-item label="NEO">
            <el-input v-model="sneo2neoVal" disabled style="width: 80px" size="small"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       class="confirm-btn"
                       @click="validateSneoToNeo"
                       size="small">{{$t('global.confirmBtn')}}
            </el-button>
          </el-form-item>
        </div>
      </el-form>
      <div class="align-center" v-if="hasErrTransfer">
        <span class="red">{{$t('individual.neoToSneo.transferAgain')}}&nbsp;&nbsp;</span>
        <el-button type="primary"
                   size="small"
                   class="small-btn"
                   @click.native="transferAgainModal=true"
                   plain>{{$t('individual.neoToSneo.transferAgainBtn')}}
        </el-button>
        <el-tooltip popper-class="global-popper"
                    placement="bottom-end"
                    offset="100"
                    effect="light">
          <ul slot="content" class="tooltip-ul" v-html="$t('individual.neoToSneo.warnTip')"></ul>
          <icon-font name="icon-wenhao" class="green"></icon-font>
        </el-tooltip>
      </div>
    </div>

    <!--sneo转neo,提示模态框-->
    <div class="modal-mask" v-if="refundWarnModal">
      <div class="modal">
        <div class="modal-content">
          <div class="modal-content__notice">
            <icon-font class="modal-content__status" name="icon-warning"></icon-font>
            <span>{{$t('individual.neoToSneo.warnTitle')}}</span>
          </div>
          <ul class="modal-content__message"
              v-html="$t('individual.neoToSneo.warnInfo')"></ul>
        </div>
      </div>
    </div>

    <!--sneo转neo,再次转换模态框-->
    <el-dialog class="sar-modal"
               :title="$t('individual.neoToSneo.transferAgainTitle')"
               label-position="top"
               center
               :show-close="false"
               :lock-scroll="false"
               :visible.sync="transferAgainModal">
      <div class="transfer-modal-content">
        <el-table :data="transferErrData" style="width: 100%" stripe
                  @selection-change="handleSelectionChange">
          <el-table-column prop="time" :label="$t('global.history.date')" width="80">
            <template slot-scope="scope">
              <span class="time">{{scope.row.blocktime.$date | filterTime }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="value" :label="$t('global.history.quantity')" align="center"
                           min-width="100"></el-table-column>
          <el-table-column type="selection" width="55"></el-table-column>
        </el-table>
      </div>
      <div slot="footer">
        <el-button class="full-btn"
                   plain
                   type="primary"
                   @click.native="transferAgain">{{$t('global.confirmBtn')}}
        </el-button>
      </div>
    </el-dialog>

    <!--是否需要手续费-->
    <el-dialog class="sar-modal"
               :title="$t('global.fee')"
               label-position="top"
               center
               :show-close="false"
               :lock-scroll="false"
               :visible.sync="feeDialog">
      <el-checkbox class="mt-30" v-model="gasFee">{{$t('global.feeInfo')}}</el-checkbox>
      <div slot="footer">
        <el-button class="full-btn"
                   plain
                   type="primary"
                   @click.native="neoToSneoConfirm">{{$t('global.confirmBtn')}}
        </el-button>
      </div>
    </el-dialog>

    <!--硬件钱包提示签名模态框-->
    <cold-wallet-dialog :cold-wallet-dialog-visible="coldWalletDialogVisible"></cold-wallet-dialog>
  </el-card>
</template>

<script>
  import getSarAddr from '~/mixins/getSarAddr'
  import {sendDrawTransaction, getUtxo, getContractState, invokeScript} from '~/api/global'
  import {getSarCByAddr, getUsableUtxoForNEO, setRefundFlagByTxid, setRefundErrorFlagByTxid} from '~/api/individual'
  import checkTxid from '~/mixins/checkTxid'
  import {find, forEach} from 'lodash'
  import {filterTime} from '~/filters/core'
  import getLeaderPubkey from '~/mixins/getLeaderPubkey'
  import {getCurrentUser} from '~/utils/login'
  import {LOADING_OPTION} from '../../filters/const'
  import eNeo from '~/utils/eNeo'

  export default {
    name: 'NeoSneo',
    props: ['assets'],
    data() {
      return {
        currentUser: null, //用户信息
        neo2sneoVal: 0,
        sneo2neoVal: 0,
        btnLocked: false, //避免多次弹框
        refundWarnModal: false, //SNEO转neo警示框
        hasErrTransfer: false,
        transferAgainModal: false,
        transferErrData: null,
        loading: false,
        multipleSelection: [],
        hasTransferNum: 0,
        gasFee: false,
        feeDialog: false,
      }
    },
    mixins: [getSarAddr, checkTxid, getLeaderPubkey],
    filters: {
      filterTime,
    },
    mounted() {
      //用户信息
      let user = getCurrentUser(this);
      this.currentUser = user;

      //获取sneo转neo不成功的列表
      if (user) {
        this.getTransferErrData();
      }
    },
    methods: {
      //检验neo转sneo
      validateNeoToSneo() {
        let locale = this.$i18n.locale;
        //未登录，跳转到登录界面
        if (!this.currentUser) {
          this.$alert('', locale === 'zh' ? '未登录' : 'Not logged in', {
            confirmButtonText: locale === 'zh' ? '立即登录' : 'Login Now',
            confirmButtonClass: 'login-now-btn',
            customClass: 'login-now-container',
            center: true,
          }).then(() => {
            this.$router.replace({path: `${this.$i18n.locale === 'en' ? '' : '/zh'}/login`});
          });
          return;
        }

        //转账数量大于0
        let tip = locale === 'zh' ? '提示' : 'Tips';
        if (this.neo2sneoVal <= 0) {
          this.$alert(locale === 'zh' ? '转化数量必须大于0' : 'The converting amount must be greater than 0', tip, {
            confirmButtonText: this.$t('global.confirmBtn')
          });
          return;
        }

        //转账金额必须是整数
        if (!Number.isInteger(this.neo2sneoVal)) {
          this.$alert(locale === 'zh' ? '转化数量必须为整数' : 'The converting amount must be an integer', tip, {
            confirmButtonText: this.$t('global.confirmBtn')
          });
          return;
        }

        //转账金额不能大于资产余额
        if (!this.assets) {
          return;
        }
        let neoAmount = find(this.assets, o => o.assetid === eNeo.config.neoId).balance;
        if (this.neo2sneoVal > neoAmount) {
          this.$alert(locale === 'zh' ? '转化数量大于资产数量' : 'The converting amount is greater than the asset balance', tip, {
            confirmButtonText: this.$t('global.confirmBtn')
          });
          return;
        }

        //弹出手续费模态框
        this.feeDialog = true;
      },

      //检验sneo转neo
      validateSneoToNeo() {
        let locale = this.$i18n.locale;
        //未登录，跳转到登录界面
        if (!this.currentUser) {
          this.$alert('', locale === 'zh' ? '未登录' : 'Not logged in', {
            confirmButtonText: locale === 'zh' ? '立即登录' : 'Login Now',
            confirmButtonClass: 'login-now-btn',
            customClass: 'login-now-container',
            center: true,
          }).then(() => {
            this.$router.replace({path: `${this.$i18n.locale === 'en' ? '' : '/zh'}/login`});
          });
          return;
        }

        //转账数量大于0
        let tip = locale === 'zh' ? '提示' : 'Tips';
        if (this.sneo2neoVal <= 0) {
          this.$alert(locale === 'zh' ? '转化数量必须大于0' : 'The converting amount must be greater than 0', tip, {
            confirmButtonText: this.$t('global.confirmBtn')
          });
          return;
        }

        //转账金额必须是整数
        if (!Number.isInteger(this.sneo2neoVal)) {
          this.$alert(locale === 'zh' ? '转化数量必须为整数' : 'The converting amount must be an integer', tip, {
            confirmButtonText: this.$t('global.confirmBtn')
          });
          return;
        }

        //转账金额不能大于资产余额
        if (!this.assets) {
          return;
        }
        let sneoAmount = find(this.assets, o => o.assetid === this.sarAddr.sneo.hash).balance;
        if (this.sneo2neoVal > sneoAmount) {
          this.$alert(locale === 'zh' ? '转化数量大于资产数量' : 'The converting amount is greater than the asset balance', tip, {
            confirmButtonText: this.$t('global.confirmBtn')
          });
          return;
        }
        //发起转账
        this.sneoToneoConfirm();
      },

      //获取资产所有的Neo
      getAllNeo() {
        if (!this.assets) {
          return;
        }
        let tempObj = find(this.assets, o => o.assetid === eNeo.config.neoId);
        if (tempObj) {
          if (tempObj.balance <= 0) {
            let locale = this.$i18n.locale;
            let tip = locale === 'zh' ? '提示' : 'Tips';
            this.$alert(locale === 'zh' ? 'NEO的最小单位是1' : 'The minimum unit of NEO is 1', tip, {
              confirmButtonText: this.$t('global.confirmBtn')
            });
            return
          }
          this.neo2sneoVal = parseInt(tempObj.balance);
        } else {
          this.neo2sneoVal = 0;
        }
      },

      //获取资产中所有的SNEO
      getAllSneo() {
        if (!this.assets) {
          return;
        }
        let tempObj = find(this.assets, o => o.assetid === this.sarAddr.sneo.hash);
        if (tempObj) {
          if (tempObj.balance <= 0) {
            let locale = this.$i18n.locale;
            let tip = locale === 'zh' ? '提示' : 'Tips';
            this.$alert(locale === 'zh' ? 'SNEO的最小单位是1' : 'The minimum unit of SNEO is 1', tip, {
              confirmButtonText: this.$t('global.confirmBtn')
            });
            return
          }
          this.sneo2neoVal = parseInt(tempObj.balance);
        } else {
          this.sneo2neoVal = 0;
        }
      },

      //查看neo值变化
      handleNeoChange(value) {
        const newVal = value === '' ? undefined : parseInt(value);
        let max = this.getAllNeo();
        if (!isNaN(newVal) || value === '') {
          if (newVal > max) {
            this.neo2sneoVal = max;
          } else {
            this.neo2sneoVal = newVal;
          }
        } else {
          this.neo2sneoVal = 0;
        }
      },

      //查看sneo值变化
      handleSneoChange(value) {
        const newVal = value === '' ? undefined : parseInt(value);
        let max = this.getAllSneo();
        if (!isNaN(newVal) || value === '') {
          if (newVal > max) {
            this.sneo2neoVal = max;
          } else {
            this.sneo2neoVal = newVal;
          }
        } else {
          this.sneo2neoVal = 0;
        }
      },

      //neo转sneo资产转换
      async neoToSneoConfirm() {
        if (this.btnLocked) {
          return;
        }
        this.btnLocked = true;

        const loading = this.$loading(LOADING_OPTION);
        let {wif, address} = this.currentUser;
        let scHash = this.sarAddr.sneo.hash;
        let scAddr = ThinNeo.Helper.GetAddressFromScriptHash(eNeo.endianChange(scHash).hexToBytes());
        let amount = parseInt(this.neo2sneoVal);
        let utxos = await getUtxo([address]);
        let payfee = this.gasFee ? '0.001' : false;
        if (!utxos.result) {
          return;
        }
        if (!amount) return;
        let globalCoinParams = {
          assertId: 'neo',
          amount: amount,
          toAddr: scAddr,
          utxos: utxos.result,
        };
        let callParams = {
          scHash,
          method: "mintTokens",
          params: ["(str)neo"]
        };
        let tempObj = {
          wif,
          globalCoinParams,
          callParams
        };
        //签名
        let r = await this.getSignature("callc2", tempObj, payfee, loading);
        if (!r) {
          this.btnLocked = false;
          loading.close();
          return;
        }

        //广播
        let draw = await sendDrawTransaction([r.rawData]);
        if (!draw) {
          this.btnLocked = false;
          this.feeDialog = false;
          loading.close();
        }
        this.checkTxid(r, draw, () => {
          this.btnLocked = false;
          this.feeDialog = false;
          this.neo2sneoVal = 0;
          this.$emit('update-assets');
          loading.close();
        });
      },

      //sneo转neo的资产转换
      async sneoToneoConfirm() {
        this.refund1();
      },
      async refund1() {
        if (this.btnLocked) {
          return;
        }
        this.btnLocked = true;

        this.refundWarnModal = true; //警示框弹框
        let me = this;

        //要sneo转neo的数额
        let amount = parseInt(this.sneo2neoVal);
        let scHash = this.sarAddr.sneo.hash;
        let scHash2 = scHash.hexToBytes().reverse();
        let scAddr = ThinNeo.Helper.GetAddressFromScriptHash(eNeo.endianChange(scHash).hexToBytes());
        let {wif} = this.currentUser;

        //判断是否是leader硬件钱包登录
        let prikey, pubkey;
        if (this.isColdWallet) {
          let isLogin = await this.getNeoLedger();
          if (!isLogin) {
            // this.$alert('硬件钱包失效，请重新登录！', '提示', {
            //   confirmButtonText: '确定'
            // });
            return false;
          }
          pubkey = window.neoLedger.pubkey.hexToBytes();
        } else {
          prikey = ThinNeo.Helper.GetPrivateKeyFromWIF(wif);
          pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(prikey);
        }
        let address = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);
        let addressHash = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(address);
        let assertId = eNeo.config.neoId;
        let assertIdBytes = assertId.hexToBytes().reverse();

        //封装交易信息
        let tran = new ThinNeo.Transaction();
        tran.type = ThinNeo.TransactionType.ContractTransaction;
        tran.version = 0; //0 or 1

        //封装utxo的input和output
        tran.inputs = [];
        tran.outputs = [];

        //预处理utxos，去除不符合要求的utxo（被标记的）
        let locale = this.$i18n.locale;
        let _utxos = await getUsableUtxoForNEO([]);
        let utxos = _utxos.result;
        if (!utxos) {
          this.$message.error(locale === 'zh' ? '没有符合条件的UTXO' : 'There are no eligible UTXOs');
          this.show = false;
          return;
        }

        //封装input
        let count = Neo.Fixed8.Zero;
        let sendcount = Neo.Fixed8.parse(amount.toString());
        //添加标记需要的inputs
        let inputs = [];

        for (let i = 0; i < utxos.length; i++) {
          let item = utxos[i];
          let input = new ThinNeo.TransactionInput();
          input.hash = item.txid.hexToBytes().reverse();
          input.index = item.n;
          input["_addr"] = item.addr;
          tran.inputs.push(input);
          //添加inputs
          inputs.push({
            txid: item.txid,
            n: item.n
          });
          count = count.add(Neo.Fixed8.parse(item.value.toString()));
          if (count.compareTo(sendcount) >= 0) break;
        }
        if (count.compareTo(sendcount) < 0) {
          this.$message.error(locale === 'zh' ? 'UTXO输入有误' : 'UTXO input is incorrect');
          this.btnLocked = false;
          this.refundWarnModal = false;
          return false;
        }
        //输出
        let output = new ThinNeo.TransactionOutput();
        output.assetId = assertIdBytes;
        output.value = sendcount;
        output.toAddress = scHash2;
        tran.outputs.push(output);
        //找零
        let change = count.subtract(sendcount);
        if (change.compareTo(Neo.Fixed8.Zero) > 0) {
          let outputChange = new ThinNeo.TransactionOutput();
          outputChange.assetId = assertIdBytes;
          outputChange.value = change;
          outputChange.toAddress = scHash2;
          tran.outputs.push(outputChange);
        }
        //封装调用合约参数
        tran.type = ThinNeo.TransactionType.InvocationTransaction;
        tran.extdata = new ThinNeo.InvokeTransData();
        let sb = new ThinNeo.ScriptBuilder();
        sb.EmitParamJson(["(addr)" + address]);
        sb.EmitPushString("refund");
        sb.EmitAppCall(scHash2);
        (tran.extdata).script = sb.ToArray();
        //(tran.extdata).gas = Neo.Fixed8.fromNumber(0.001);

        tran.attributes = [];
        tran.attributes[0] = new ThinNeo.Attribute();
        tran.attributes[0].usage = ThinNeo.TransactionAttributeUsage.Script;
        tran.attributes[0].data = addressHash;

        //做智能合约的签名
        let sb2 = new ThinNeo.ScriptBuilder();
        sb2.EmitPushString("whatever");
        let random_uint8 = Neo.Cryptography.RandomNumberGenerator.getRandomValues < Uint8Array > (new Uint8Array(32));
        let random_int = Neo.BigInteger.fromUint8Array(random_uint8);
        // let randomNum = new Neo.BigInteger(250)
        //let randomNum = new Neo.BigInteger(Math.floor(Math.random() * 10000))
        sb2.EmitPushNumber(random_int);
        let r1 = await getContractState([scHash]);
        let scHashCode = r1.result[0].script;
        let scHashCodeBytes = scHashCode.hexToBytes();
        tran.AddWitnessScript(new Uint8Array(0), sb2.ToArray(), scHashCodeBytes);

        //做发起人签名
        let msg = tran.GetMessage();

        //签名
        let signdata;
        if (!this.isColdWallet) {
          signdata = ThinNeo.Helper.Sign(msg, prikey);
        } else {
          //弹出硬件钱包确认提示
          this.coldWalletDialogVisible = true;
          let coldWalletCount = 30;
          let timer = setTimeout(() => {
            if (coldWalletCount <= 0) {
              clearTimeout(timer);
              this.coldWalletDialogVisible = false;
            }
            coldWalletCount++;
          });

          //签名
          msg = msg.toHexString();
          try {
            signdata = await window.neoLedger.signMessage(msg);
          } catch (e) {
            this.coldWalletDialogVisible = false;
            this.$confirm(e.message, 'Operation failed', {
              confirmButtonText: 'Confirm',
              showCancelButton: false,
              type: 'error',
              center: false
            }).then(() => {
              this.refundWarnModal = false;
              this.btnLocked = false;
            }).catch(() => {
              this.refundWarnModal = false;
              this.btnLocked = false;
            });
            return;
          } finally {
            clearTimeout(timer);
            this.coldWalletDialogVisible = false;
          }
          signdata = signdata.hexToBytes();
        }

        tran.AddWitness(signdata, pubkey, address);
        let txid = "0x" + tran.GetHash().clone().reverse().toHexString();
        let rawData = tran.GetRawData().toHexString();

        let r = await sendDrawTransaction([rawData]);
        //判断是否发送到节点，节点打包就标记utxo
        if (r.result && r.result[0].sendrawtransactionresult) {
          setRefundFlagByTxid([inputs, address]).then(res => {
            console.log(res);
          })
        } else {
          let errMsg = r.result[0].errorMessage;
          setRefundErrorFlagByTxid([inputs, address, errMsg]).then(res => {
            console.log(res);
          })
        }
        //标记结束

        this.checkTxid({txid: txid, rawData: rawData}, r, () => {
          me.refund2(txid);
        })
      },
      async refund2(refundTxid, loading, cb) {
        let scHash = this.sarAddr.sneo.hash;
        // let scHash2 = scHash.hexToBytes().reverse();
        let scAddr = ThinNeo.Helper.GetAddressFromScriptHash(eNeo.endianChange(scHash).hexToBytes());
        let {wif} = this.currentUser;

        // let prikey = ThinNeo.Helper.GetPrivateKeyFromWIF(wif);
        // let pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(prikey);
        //判断是否是leader硬件钱包登录
        let prikey, pubkey;
        if (this.isColdWallet) {
          let isLogin = await this.getNeoLedger();
          if (isLogin) {
            pubkey = window.neoLedger.pubkey.hexToBytes();
          } else {
            return;
          }
        } else {
          prikey = ThinNeo.Helper.GetPrivateKeyFromWIF(wif);
          pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(prikey);
        }
        let address = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);
        let addressHash = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(address);
        let assertId = eNeo.config.neoId;
        let assertIdBytes = assertId.hexToBytes().reverse();
        let _utxosRaw = await getUtxo([scAddr]);
        let utxosRaw = _utxosRaw.result;
        let utxo;
        for (let i = 0; i < utxosRaw.length; i++) {
          let item = utxosRaw[i];
          if (item.n === 0 && item.txid === refundTxid) {
            utxo = item;
          }
        }

        if (!utxo) {
          this.$message.error("no utxo, refund 2nd faild");
          this.btnLocked = false;
          this.refundWarnModal = false;
          return;
        }

        //封装交易信息
        let tran = new ThinNeo.Transaction();
        tran.type = ThinNeo.TransactionType.ContractTransaction;
        tran.version = 0; //0 or 1
        tran.attributes = [];

        //封装utxo的input和output
        tran.inputs = [];
        tran.outputs = [];

        //封装input
        let input = new ThinNeo.TransactionInput();
        input.hash = utxo.txid.hexToBytes().reverse();
        input.index = utxo.n;
        input["_addr"] = utxo.addr;
        tran.inputs.push(input);

        //输出
        let output = new ThinNeo.TransactionOutput();
        output.assetId = assertIdBytes;
        output.value = Neo.Fixed8.parse(utxo.value.toString());
        output.toAddress = addressHash;
        tran.outputs.push(output);

        //做智能合约的签名
        let sb3 = new ThinNeo.ScriptBuilder();
        //let randomNum = new Neo.BigInteger(new Date().getTime());
        let randomNum = new Neo.BigInteger(0);
        sb3.EmitPushNumber(randomNum);
        sb3.EmitPushNumber(randomNum);
        //sb3.Emit(ThinNeo.OpCode.DROP);
        let r1 = await getContractState([scHash]);
        let scHashCode = r1.result[0].script;
        let scHashCodeBytes = scHashCode.hexToBytes();
        tran.AddWitnessScript(new Uint8Array(0), sb3.ToArray(), scHashCodeBytes);

        //Sign as sponsor
        //let msg = tran.GetMessage();
        //let signdata = ThinNeo.Helper.Sign(msg, prikey);
        //tran.AddWitness(signdata, pubkey, address);
        let txid = "0x" + tran.GetHash().clone().reverse().toHexString();
        let rawData = tran.GetRawData().toHexString();
        let r = await sendDrawTransaction([rawData]);

        if (!r) {
          this.refundWarnModal = false;
          this.btnLocked = false;
          if (loading) {
            loading.close();
            this.transferErrData();
            this.transferAgainModal = false;
          }
        }

        this.checkTxid({txid: txid, rawData: rawData}, r, () => {
          this.refundWarnModal = false;
          this.btnLocked = false;
          this.sneo2neoVal = 0;
          this.$emit('update-assets');
          if (cb) {
            cb();
          }
        })
      },

      //sneo转neo(第二部转账失败)
      async getTransferErrData() {
        let params = [this.currentUser.address, 100, 1];
        let _tempArr = await getSarCByAddr(params);
        let tempArr = _tempArr.result;
        if (!tempArr) {
          return;
        }
        let result = [];
        for (let i = 0, len = tempArr.length; i < len; i++) {
          let item = tempArr[i];
          if (await this.judgeHasUtxo(item.txid)) {
            result.push(item);
          }
        }
        if (result.length > 0) {
          this.hasErrTransfer = true;
        } else {
          this.hasErrTransfer = false;
        }
        this.transferErrData = result;
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      async transferAgain() {
        this.hasTransferNum = 0;
        forEach(this.multipleSelection, item => {
          const loading = this.$loading(LOADING_OPTION);
          this.refund2(item.txid, loading, () => {
            this.hasTransferNum++;
            if (this.hasTransferNum === this.multipleSelection.length) {
              loading.close();
              this.getTransferErrData();
              this.transferAgainModal = false;

            }
          });
        })
      },
      async judgeHasUtxo(refundTxid) {
        let scHash = this.sarAddr.sneo.hash;
        let scAddr = ThinNeo.Helper.GetAddressFromScriptHash(eNeo.endianChange(scHash).hexToBytes());

        let _utxosRaw = await getUtxo([scAddr]);
        let utxosRaw = _utxosRaw.result;
        let utxo;
        for (let i = 0; i < utxosRaw.length; i++) {
          let item = utxosRaw[i];
          if (item.n === 0 && item.txid === refundTxid) {
            utxo = item;
          }
        }
        if (!utxo) {
          return false;
        }
        return true;
      }
    },
    watch: {
      currentUser(newVal) {
        if (newVal) {
          this.getTransferErrData();
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/var";

  .neo-sneo {
    padding: 50px 10px 0;
    height: 240px;

    &-title {
      margin-bottom: 26px;

      > span {
        display: inline-block;
        width: 184px;
        font-weight: bold;
      }
    }

    &-form {
      .el-icon-caret-right {
        display: inline-block;
        margin-left: 10px;
        color: #99a;
        width: 14px;
        margin-right: 0;
      }

      .confirm-btn {
        margin-left: 4px;
      }
    }
  }

  .modal-mask {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, .6);
    text-align: center;
    z-index: 2000;

    .modal {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 410px;
      background: #fff;
      border-radius: 4px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
      min-height: 100px;

      &-content {
        position: relative;
        text-align: left;
        padding: 20px 25px;

        &__notice {
          font-size: 16px;
          color: $--color-warning;
        }

        &__status {
          font-size: 16px;
          margin-right: 10px;
        }

        &__message {
          line-height: 20px;
        }
      }
    }
  }

  .transfer-modal-content {
    padding-top: 30px;

    &__item {
      line-height: 24px;
      border-bottom: 1px solid $--border-color-base;
    }

    .time {
      font-size: 12px;
      color: #9999aa;
      line-height: 16px;
    }

    .convert-btn {
      height: 30px;
      line-height: 30px;
      padding-top: 0;
      padding-bottom: 0;
    }
  }
</style>

<style lang="scss">
  @import "../../assets/styles/var";

  .neo-sneo-form {
    .el-form-item {
      margin-bottom: 0;

      .el-input-group__append {
        width: 32px;
        line-height: 30px;
        font-size: 12px;
        text-align: center;
        background: #FFF;
        cursor: pointer;
        padding: 0;
      }
    }
  }
</style>

