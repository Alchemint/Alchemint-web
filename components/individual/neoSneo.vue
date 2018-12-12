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
                       @click="neoToSneoConfirm"
                       :disabled="neoToSneoBtn"
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
                       @click="sneoToneoConfirm"
                       :disabled="sneoToNeoBtn"
                       size="small">{{$t('global.confirmBtn')}}
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <!--tooltip dialog-->
    <div class="modal-mask" v-if="show">
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
  </el-card>
</template>

<script>
  import {invokeScript} from '../../api/global'
  import sarAddr from '../../mixins/getSarAddr'
  import {sendDrawTransaction, getUtxo, getStorage, getContractState} from '../../api/global'
  import checkTxid from '../../mixins/checkTxid'
  import {find} from 'lodash'

  export default {
    name: 'NeoSneo',
    props: {
      currentUser: {
        type: Object,
        required: true,
      },
      assets: {},
    },
    data() {
      return {
        neo2sneoVal: 0,
        sneo2neoVal: 0,
        show: false,
      }
    },
    computed: {
      neoToSneoBtn: {
        get() {
          //amount need >0
          if (this.neo2sneoVal <= 0) {
            return true;
          }
          if (!this.assets) {
            return true;
          }
          let neoObj = find(this.assets, o => o.symbol === 'NEO');
          if (neoObj && neoObj.balance >= this.neo2sneoVal) {
            return false;
          } else {
            return true;
          }
        },
        set() {

        },
      },
      sneoToNeoBtn: {
        get() {
          //amount need >0
          if (this.sneo2neoVal <= 0) {
            return true;
          }
          if (!this.assets) {
            return true;
          }
          let sneoObj = find(this.assets, o => o.symbol === 'SNEO');
          if (sneoObj && sneoObj.balance >= this.sneo2neoVal) {
            return false;
          } else {
            return true;
          }
        },
        set() {

        }
      },
    },
    mixins: [sarAddr, checkTxid],
    methods: {
      getAllNeo() {
        if (!this.assets) {
          return;
        }
        let tempObj = find(this.assets, o => o.symbol === 'NEO');
        if (tempObj) {
          this.neo2sneoVal = parseInt(tempObj.balance);
        } else {
          this.neo2sneoVal = 0;
        }
      },
      getAllSneo() {
        if (!this.assets) {
          return;
        }
        let tempObj = find(this.assets, o => o.symbol === 'SNEO');
        if (tempObj) {
          this.sneo2neoVal = parseInt(tempObj.balance);
        } else {
          this.sneo2neoVal = 0;
        }
      },
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
      async neoToSneoConfirm() {
        // neo transfer sneo
        const loading = this.$loading({
          lock: true,
          text: '',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        let {wif, address} = this.currentUser;
        let scHash = this.sarAddr.sneo.hash;
        let scAddr = ThinNeo.Helper.GetAddressFromScriptHash(eNeo.endianChange(scHash).hexToBytes());
        let amount = parseInt(this.neo2sneoVal);
        let utxos = await getUtxo([address]);
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

        let r = await eNeo.callC2(wif, globalCoinParams, callParams);
        let draw = await sendDrawTransaction([r.rawData]);

        this.checkTxid(r, draw, () => {
          loading.close();
          location.reload();
        });
      },
      async sneoToneoConfirm() {
        this.refund1();
      },
      async refund1() {
        this.show = true;

        let me = this;
        let amount = parseInt(this.sneo2neoVal);
        let scHash = this.sarAddr.sneo.hash;
        let scHash2 = scHash.hexToBytes().reverse();
        let scAddr = ThinNeo.Helper.GetAddressFromScriptHash(eNeo.endianChange(scHash).hexToBytes());
        let {wif} = this.currentUser;
        let prikey = ThinNeo.Helper.GetPrivateKeyFromWIF(wif);
        let pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(prikey);
        let address = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);
        let addressHash = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(address);
        let assertId = eNeo.config.neoId;
        let assertIdBytes = assertId.hexToBytes().reverse();
        let _utxosRaw = await getUtxo([scAddr]);
        let utxosRaw = _utxosRaw.result;
        if (!utxosRaw) {
          this.show = false;
          return;
        }
        let tran = new ThinNeo.Transaction();
        tran.type = ThinNeo.TransactionType.ContractTransaction;
        tran.version = 0; //0 or 1

        tran.inputs = [];
        tran.outputs = [];
        let utxos = [];

        for (let i = 0; i < utxosRaw.length; i++) {
          let item = utxosRaw[i];
          if (item.n > 0) {
            utxos.push(item);
            continue;
          }
          let params = [
            {
              param: ["(hex)" + item.txid],
              method: "getRefundTarget",
            }
          ];
          let _p = eNeo.emitParams(scHash, params);
          let res = await invokeScript([_p]);
          let isUtxoUsed = res.result[0].stack[0].value;
          if (isUtxoUsed) continue;
          if (item.asset === assertId) utxos.push(item);
        }

        let count = Neo.Fixed8.Zero;
        let sendcount = Neo.Fixed8.parse(amount.toString());
        for (let i = 0; i < utxos.length; i++) {
          let item = utxos[i];
          let input = new ThinNeo.TransactionInput();
          input.hash = item.txid.hexToBytes().reverse();
          input.index = item.n;
          input["_addr"] = item.addr;
          tran.inputs.push(input);
          count = count.add(Neo.Fixed8.parse(item.value.toString()));
          if (count.compareTo(sendcount) >= 0) break;
        }
        if (count.compareTo(sendcount) < 0) {
          return false;
        }

        let output = new ThinNeo.TransactionOutput();
        output.assetId = assertIdBytes;
        output.value = sendcount;
        output.toAddress = scHash2;
        tran.outputs.push(output);

        let change = count.subtract(sendcount);
        if (change.compareTo(Neo.Fixed8.Zero) > 0) {
          let outputChange = new ThinNeo.TransactionOutput();
          outputChange.assetId = assertIdBytes;
          outputChange.value = change;
          outputChange.toAddress = scHash2;
          tran.outputs.push(outputChange);
        }

        tran.type = ThinNeo.TransactionType.InvocationTransaction;
        tran.extdata = new ThinNeo.InvokeTransData();
        let sb = new ThinNeo.ScriptBuilder();
        sb.EmitParamJson(["(addr)" + address]);
        sb.EmitPushString("refund");
        sb.EmitAppCall(scHash2);
        (tran.extdata).script = sb.ToArray();

        tran.attributes = [];
        tran.attributes[0] = new ThinNeo.Attribute();
        tran.attributes[0].usage = ThinNeo.TransactionAttributeUsage.Script;
        tran.attributes[0].data = addressHash;

        let sb2 = new ThinNeo.ScriptBuilder();
        sb2.EmitPushString("whatever");
        let randomNum = new Neo.BigInteger(250);
        sb2.EmitPushNumber(randomNum);
        let r1 = await getContractState([scHash]);
        let scHashCode = r1.result[0].script;
        let scHashCodeBytes = scHashCode.hexToBytes();
        tran.AddWitnessScript(scHashCodeBytes, sb2.ToArray());

        let msg = tran.GetMessage();
        let signdata = ThinNeo.Helper.Sign(msg, prikey);
        tran.AddWitness(signdata, pubkey, address);
        let txid = "0x" + tran.GetHash().clone().reverse().toHexString();
        let rawData = tran.GetRawData().toHexString();
        let r = await sendDrawTransaction([rawData]);
        this.checkTxid({txid: txid}, {result: r.result[0]}, () => {
          me.refund2(txid);
        })
      },
      async refund2(refundTxid) {
        let scHash = this.sarAddr.sneo.hash;
        let scAddr = ThinNeo.Helper.GetAddressFromScriptHash(eNeo.endianChange(scHash).hexToBytes());
        let {wif} = this.currentUser;
        let prikey = ThinNeo.Helper.GetPrivateKeyFromWIF(wif);
        let pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(prikey);
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
          return;
        }

        let tran = new ThinNeo.Transaction();
        tran.type = ThinNeo.TransactionType.ContractTransaction;
        tran.version = 0; //0 or 1
        tran.attributes = [];

        tran.inputs = [];
        tran.outputs = [];

        let input = new ThinNeo.TransactionInput();
        input.hash = utxo.txid.hexToBytes().reverse();
        input.index = utxo.n;
        input["_addr"] = utxo.addr;
        tran.inputs.push(input);

        let output = new ThinNeo.TransactionOutput();
        output.assetId = assertIdBytes;
        output.value = Neo.Fixed8.parse(utxo.value.toString());
        output.toAddress = addressHash;
        tran.outputs.push(output);

        let sb3 = new ThinNeo.ScriptBuilder();
        let randomNum = new Neo.BigInteger(0)
        sb3.EmitPushNumber(randomNum);
        sb3.EmitPushNumber(randomNum);
        let r1 = await getContractState([scHash]);
        let scHashCode = r1.result[0].script;
        let scHashCodeBytes = scHashCode.hexToBytes();
        tran.AddWitnessScript(scHashCodeBytes, sb3.ToArray());

        let txid = "0x" + tran.GetHash().clone().reverse().toHexString();
        let rawData = tran.GetRawData().toHexString();

        let r = await sendDrawTransaction([rawData]);
        this.checkTxid({txid: txid}, {result: r.result[0]}, () => {
          this.show = false;
          location.reload();
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/var";

  .neo-sneo {
    padding: 50px 0 0 10px;
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
      &__item {
        margin-bottom: 16px;
      }
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

