<template>
  <div class="individual">
    <!--<div>
      <el-button type="primary"
                 class="mt-30"
                 @click="handleTransferContract">用户自主迁移
      </el-button>
    </div>-->
    <div class="clearfix" v-if="currentUser">
      <my-asset class="fl"
                :assets="assets"
                style="width: 700px;margin-right: 30px"></my-asset>
      <neo-sneo class="fl"
                :current-user="currentUser"
                :assets="assets"
                style="width:470px"></neo-sneo>
    </div>
    <my-sar v-if="currentUser && sarConfig && assets"
            :sar-config="sarConfig"
            :current-user="currentUser"
            :assets="assets"></my-sar>
    <div class="clearfix">
      <system-status v-if="sarConfig"
                     class="fl"
                     :style="{width:hasBond?'780px':'100%'}"
                     :sar-config="sarConfig"></system-status>
      <my-bond class="fl"
               v-if="sarConfig && currentUser && hasBond && assets"
               :sar-config="sarConfig"
               :current-user="currentUser"
               :assets="assets"
               style="width: 390px;margin-left: 30px"></my-bond>
    </div>
    <sarc-list v-if="sarConfig"
               :current-user="currentUser"
               :sar-config="sarConfig"
               :assets="assets"></sarc-list>
  </div>
</template>

<script>
  import {myAsset, mySar, neoSneo, sarcList, systemStatus, myBond} from '~/components/individual'
  import {mapGetters} from 'vuex'
  import getAssets from '~/mixins/getAssets'
  import checkTxid from '~/mixins/checkTxid'
  import {formatPrecision, bigmath, printNumber} from '~/utils'
  import {invokeScript, sendDrawTransaction, getStorage} from '~/api/global'
  import sarAddr from '~/mixins/getSarAddr'

  export default {
    name: 'Individual',
    components: {
      myAsset,
      mySar,
      neoSneo,
      sarcList,
      systemStatus,
      myBond
    },
    computed: {
      ...mapGetters([
        'currentUser'
      ])
    },
    data() {
      return {
        hasBond: false,
        hasMySar: false,
      }
    },
    mixins: [sarAddr, getAssets, checkTxid],
    async mounted() {
      await this.initAssets();
      this.getBondAuthority();
    },
    methods: {
      //get sar basic info
      async getSarC(addr) {
        let scAddr = this.sarAddr.sarC.hash;
        let params = [
          {
            param: ["(addr)" + addr],
            method: "getSAR4C",
          }
        ];
        let scHash = eNeo.emitParams(scAddr, params);
        let _r = await invokeScript([scHash]);
        let arr;
        if (_r.result[0].stack[0]) {
          arr = _r.result[0].stack[0].value;
        }
        if (!arr) {
          return;
        }

        /** args[0] = addr;
         *  args[1] = sarInfo.txid;
         *  args[2] = sarInfo.locked;
         *  args[3] = sarInfo.hasDrawed;
         *  args[4] = sarInfo.assetType;
         *  args[5] = sarInfo.status;
         *  args[6] = sarInfo.bondLocked;
         *  args[7]= sarInfo.bondDrawed;
         *  args[8] = sarInfo.lastHeight;
         *  args[9]=  sarInfo.fee;
         *  args[10]= sarInfo.sdsFee; */
        let sarTxid = eNeo.endianChange(arr[1].value);
        let sarLocked, sarHasDrawed, status, bondLocked, bondDrawed, lastHeight, fee, sdsFee;
        if (arr[2].type === 'Integer') {
          sarLocked = +arr[2].value;
        } else {
          sarLocked = eNeo.hex2Integer(arr[2].value);
        }
        if (arr[3].type === 'Integer') {
          sarHasDrawed = +arr[3].value;
        } else {
          sarHasDrawed = eNeo.hex2Integer(arr[3].value);
        }
        status = arr[5].value;


        if (arr[6].type === 'Integer') {
          bondLocked = +arr[6].value;
        } else {
          bondLocked = eNeo.hex2Integer(arr[6].value);
        }
        if (arr[7].type === 'Integer') {
          bondDrawed = +arr[7].value;
        } else {
          bondDrawed = eNeo.hex2Integer(arr[7].value);
        }

        if (arr[8].type === 'Integer') {
          lastHeight = +arr[8].value;
        } else {
          lastHeight = eNeo.hex2Integer(arr[8].value);
        }


        if (arr[9].type === 'Integer') {
          fee = +arr[9].value;
        } else {
          fee = eNeo.hex2Integer(arr[9].value);
        }

        if (arr[10].type === 'Integer') {
          sdsFee = +arr[10].value;
        } else {
          sdsFee = eNeo.hex2Integer(arr[10].value);
        }

        return {
          addr,
          sarTxid,
          sarLocked,
          sarHasDrawed,
          status,
          bondLocked,
          bondDrawed,
          lastHeight,
          fee,
          sdsFee,
        }
      },

      //calculate margin rate and other values
      async getSarInfo(sarConfig, addr) {
        let sarBasicInfo = await this.getSarC(addr);
        if (!sarBasicInfo) {
          return;
        }
        let {sarLocked, sarHasDrawed, sdsFee, fee, bondLocked, bondDrawed} = sarBasicInfo;
        let {sneo_price, liquidate_line_rate_c, sds_price} = sarConfig;

        //sarLocked and sarHasDrawed display data
        let sarLockedShow = formatPrecision(
          printNumber(
            bigmath.chain(bigmath.bignumber(sarLocked))
              .divide(bigmath.bignumber(bigmath.pow(10, 8)))
              .done()
          ), 2
        );
        let sarHasDrawedShow = formatPrecision(
          printNumber(
            bigmath.chain(bigmath.bignumber(sarHasDrawed))
              .divide(bigmath.bignumber(bigmath.pow(10, 8)))
              .done()
          ), 2
        );

        //bondLocked and bondDrawed display data
        let bondLockedShow, bondDrawedShow;
        bondLockedShow = formatPrecision(
          printNumber(
            bigmath.chain(bigmath.bignumber(bondLocked))
              .divide(bigmath.bignumber(bigmath.pow(10, 8)))
              .done()
          ), 2
        );
        bondDrawedShow = formatPrecision(
          printNumber(
            bigmath.chain(bigmath.bignumber(bondDrawed))
              .divide(bigmath.bignumber(bigmath.pow(10, 8)))
              .done()
          ), 2
        );

        //sdsFee and fee display data
        let sdsFeeShow;
        if (sdsFee) {
          sdsFeeShow = formatPrecision(
            printNumber(
              bigmath.chain(bigmath.bignumber(sdsFee))
                .divide(bigmath.bignumber(bigmath.pow(10, 8)))
                .done()
            ), 2
          )
        } else {
          sdsFeeShow = formatPrecision(0, 2);
        }

        let feeShow;
        if (fee) {
          feeShow = formatPrecision(
            printNumber(
              bigmath.chain(bigmath.bignumber(fee))
                .divide(bigmath.bignumber(bigmath.pow(10, 8)))
                .done()
            ), 2
          )
        } else {
          feeShow = formatPrecision(0, 2);
        }

        //can draw fee(sds)
        let feeToSds = formatPrecision(
          printNumber(
            bigmath.chain(bigmath.bignumber(fee))
              .divide(bigmath.bignumber(sds_price))
              .multiply(bigmath.bignumber(bigmath.pow(10, 8)))
              .done()
          )
        );
        let wenCanSdsFee = formatPrecision(
          printNumber(
            bigmath.chain(bigmath.bignumber(sdsFee))
              .subtract(bigmath.bignumber(feeToSds))
              .divide(bigmath.bignumber(bigmath.pow(10, 8)))
              .done()
          )
        );


        //sds Drawable
        let allSdusd, wenCanDraw, wenCanDrawShow;

        allSdusd = formatPrecision(
          printNumber(
            bigmath.chain(bigmath.bignumber(sarLocked))
              .multiply(bigmath.bignumber(sneo_price))
              .divide(bigmath.bignumber(liquidate_line_rate_c))
              .multiply(bigmath.bignumber(100))
              .divide(bigmath.bignumber(bigmath.pow(10, 8)))
              .done()
          )
        );

        wenCanDraw = formatPrecision(
          printNumber(
            bigmath.chain(bigmath.bignumber(allSdusd))
              .subtract(bigmath.bignumber(sarHasDrawed))
              .divide(bigmath.bignumber(bigmath.pow(10, 8)))
              .done()
          )
        );

        wenCanDrawShow = formatPrecision(wenCanDraw, 2);

        //can free sdusd
        let availSdsCanfree, hasDrawSds, availSdsCanfreeShow;
        hasDrawSds = formatPrecision(
          printNumber(
            bigmath.chain(bigmath.bignumber(sarHasDrawed))
              .multiply(bigmath.bignumber(bigmath.pow(10, 8)))
              .multiply(bigmath.bignumber(liquidate_line_rate_c))
              .divide(bigmath.bignumber(100))
              .divide(bigmath.bignumber(sneo_price))
              .done()
          )
        );

        availSdsCanfree = formatPrecision(
          printNumber(
            bigmath.chain(bigmath.bignumber(sarLocked))
              .subtract(bigmath.bignumber(hasDrawSds))
              .divide(bigmath.bignumber(bigmath.pow(10, 8)))
              .done()
          )
        );

        availSdsCanfreeShow = formatPrecision(availSdsCanfree, 2);


        //default extractable and mortgageable
        let initAllSdusd, initWenCanDraw;
        let initRate = liquidate_line_rate_c + 50;

        initAllSdusd = formatPrecision(
          printNumber(
            bigmath.chain(bigmath.bignumber(sarLocked))
              .multiply(bigmath.bignumber(sneo_price))
              .divide(bigmath.bignumber(initRate))
              .multiply(bigmath.bignumber(100))
              .divide(bigmath.bignumber(bigmath.pow(10, 8)))
              .done()
          )
        );

        initWenCanDraw = formatPrecision(
          printNumber(
            bigmath.chain(bigmath.bignumber(initAllSdusd))
              .subtract(bigmath.bignumber(sarHasDrawed))
              .divide(bigmath.bignumber(bigmath.pow(10, 8)))
              .done()
          )
        );


        let initAvailSdsCanfree, initHasDrawSds;
        initHasDrawSds = formatPrecision(
          printNumber(
            bigmath.chain(bigmath.bignumber(sarHasDrawed))
              .multiply(bigmath.bignumber(bigmath.pow(10, 8)))
              .multiply(bigmath.bignumber(initRate))
              .divide(bigmath.bignumber(100))
              .divide(bigmath.bignumber(sneo_price))
              .done()
          )
        );

        initAvailSdsCanfree = formatPrecision(
          printNumber(
            bigmath.chain(bigmath.bignumber(sarLocked))
              .subtract(bigmath.bignumber(initHasDrawSds))
              .divide(bigmath.bignumber(bigmath.pow(10, 8)))
              .done()
          )
        );


        //end


        //current rate
        let ratioAvail, ratioAvailShow;
        if (sarHasDrawed) {
          ratioAvail = printNumber(
            bigmath.chain(bigmath.bignumber(sneo_price))
              .multiply(bigmath.bignumber(sarLocked))
              .divide(bigmath.bignumber(sarHasDrawed))
              .divide(bigmath.bignumber(bigmath.pow(10, 8)))
              .done()
          );
          ratioAvailShow = formatPrecision(ratioAvail * 100, 2) + "%";
        } else {
          ratioAvailShow = '--'
        }

        //liquidation price
        let liquidationPrice, liquidationPriceShow;
        if (sarLocked) {
          liquidationPrice = formatPrecision(
            printNumber(
              bigmath.chain(bigmath.bignumber(sarHasDrawed))
                .multiply(bigmath.bignumber(liquidate_line_rate_c))
                .divide(bigmath.bignumber(sarLocked))
                .divide(bigmath.bignumber(100))
                .done()
            )
          );
          liquidationPriceShow = formatPrecision(liquidationPrice, 2);
        } else {
          liquidationPriceShow = '--';
        }

        //status
        let status;
        let rate_c = liquidate_line_rate_c / 100;
        if (ratioAvail >= rate_c + 0.5) {
          status = '1';
        }
        if (ratioAvail >= rate_c && ratioAvail < rate_c + 0.5) {
          status = '2';
        }
        if (ratioAvail < rate_c) {
          status = '3';
        }

        if (sarLocked === 0 || sarHasDrawed === 0) {
          status = '0';
        }


        let tempObj = {
          wenCanDraw,
          availSdsCanfree,
          ratioAvail,
          liquidationPrice,
          status,
          sarLockedShow,
          sarHasDrawedShow,
          bondLockedShow,
          bondDrawedShow,
          sdsFeeShow,
          feeShow,
          feeToSds,
          wenCanSdsFee,
          wenCanDrawShow,
          availSdsCanfreeShow,
          liquidationPriceShow,
          ratioAvailShow,
          initAvailSdsCanfree,
          initWenCanDraw
        };
        return Object.assign(sarBasicInfo, tempObj);
      },

      //has bond authority
      async getBondAuthority() {
        if (!this.currentUser) {
          return;
        }
        let scAddr = this.sarAddr.sarC.hash;
        let address = '16' + eNeo.addr2Hex(this.currentUser.address);
        let _r = await getStorage([scAddr, address]);
        if (!_r.result) {
          this.hasBond = false;
          return;
        }
        let hasBond = _r.result[0].storagevalue;
        this.hasBond = hasBond ? true : false;
      },

      //transfer contract
      async handleTransferContract() {
        let {wif, address} = this.currentUser;
        let scAddr = this.sarAddr.sarC.hash;
        let type = 'migrateSAR4C';
        let params = [
          "(addr)" + address,
        ];

        let r = await eNeo.callC(wif, scAddr, type, params);

        sendDrawTransaction([r.rawData]).then(draw => {
          this.checkTxid(r, draw);
        }).catch(() => {

        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  .individual {
    padding-top: 30px;
    > div {
      margin-top: 30px;
      &:first-child {
        margin-top: 0;
      }
    }
  }
</style>
