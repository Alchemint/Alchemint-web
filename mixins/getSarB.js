import sarAddr from './getSarAddr'
import {invokeScript} from '../api/global'
import {formatPrecision, bigmath, printNumber} from '../utils/index'

export default {
  mixins: [sarAddr],
  data() {
    return {
      sarConfig: null,
    }
  },
  methods: {
    // sar basic info
    async getSarB(addr) {
      let scAddr = this.sarAddr.sarB.hash;
      let params = [
        {
          param: ["(addr)" + addr],
          method: "getSAR4B",
        }
      ];
      let scHash = eNeo.emitParams(scAddr, params);
      let _r = await invokeScript([scHash]);
      let arr = _r.result[0].stack[0].value;
      if (!arr) {
        return;
      }
      let name = eNeo.hex2String(arr[0].value);
      let symbol = eNeo.hex2String(arr[1].value);
      let decimals = +arr[2].value;
      let owner = ThinNeo.Helper.GetAddressFromScriptHash(
        arr[3].value.hexToBytes()
      );
      let sarTxid = eNeo.endianChange(arr[4].value);
      let sarLocked = +arr[5].value;
      let sarHasDrawed = +arr[6].value;
      let status = +arr[7].value;
      let anchorType = eNeo.hex2String(arr[8].value);
      return {
        name,
        symbol,
        decimals,
        owner,
        sarTxid,
        sarLocked,
        sarHasDrawed,
        status,
        anchorType,
      }
    },

    // calculate sar
    async getSarInfo(addr) {
      let sarBasicInfo = await this.getSarB(addr);
      if (sarBasicInfo) {

        let tokenName = await this.getTokenName(sarBasicInfo.name);

        let {sarLocked, sarHasDrawed, anchorType} = sarBasicInfo;
        let {sds_price, liquidate_line_rate_b} = this.sarConfig;
        let anchorPrice = this.sarConfig[anchorType];

        //sarLocked and sarHasDrawed show amount
        let sarLockedShow = formatPrecision(
          printNumber(
            bigmath.chain(bigmath.bignumber(sarLocked))
              .divide(bigmath.bignumber(bigmath.pow(10, 8)))
              .done()
          ), 3
        );
        let sarHasDrawedShow = formatPrecision(
          printNumber(
            bigmath.chain(bigmath.bignumber(sarHasDrawed))
              .divide(bigmath.bignumber(bigmath.pow(10, 8)))
              .done()
          ), 3
        );

        // Calculate the sarLocked and sarHasDrawed of the dollar
        let sarLockedTranUsd, sarHasDrawedTranUsd;
        sarLockedTranUsd = formatPrecision(
          printNumber(
            bigmath.chain(bigmath.bignumber(sarLocked))
              .multiply(bigmath.bignumber(sds_price))
              .divide(bigmath.bignumber(bigmath.pow(10, 16)))
              .done()
          ), 3
        );
        sarHasDrawedTranUsd = formatPrecision(
          printNumber(
            bigmath.chain(bigmath.bignumber(sarHasDrawed))
              .multiply(bigmath.bignumber(anchorPrice))
              .divide(bigmath.bignumber(bigmath.pow(10, 16)))
              .done()
          ), 3
        );

        //wen can draw
        let allDraw, wenCanDraw;
        allDraw = formatPrecision(
          printNumber(
            bigmath.chain(bigmath.bignumber(sarLocked))
              .multiply(bigmath.bignumber(sds_price))
              .divide(bigmath.bignumber(liquidate_line_rate_b))
              .divide(bigmath.bignumber(anchorPrice))
              .multiply(bigmath.bignumber(100))
              .done()
          ), 0
        );
        wenCanDraw = formatPrecision(
          printNumber(
            bigmath.chain(bigmath.bignumber(allDraw))
              .subtract(bigmath.bignumber(sarHasDrawed))
              .divide(bigmath.bignumber(bigmath.pow(10, 8)))
              .done()
          )
        );

        //free sds
        let availSdsCanfree, hasDrawSds;
        hasDrawSds = formatPrecision(
          printNumber(
            bigmath.chain(bigmath.bignumber(sarHasDrawed))
              .multiply(bigmath.bignumber(anchorPrice))
              .multiply(bigmath.bignumber(liquidate_line_rate_b))
              .divide(bigmath.bignumber(100))
              .divide(bigmath.bignumber(sds_price))
              .done()
          ), 0
        );
        availSdsCanfree = formatPrecision(
          printNumber(
            bigmath.chain(bigmath.bignumber(sarLocked))
              .subtract(bigmath.bignumber(hasDrawSds))
              .divide(bigmath.bignumber(bigmath.pow(10, 8)))
              .subtract(bigmath.bignumber(10)) // 10个保证金
              .done()
          )
        );


        //ratio avail
        let ratioAvail, ratioAvailShow;

        if (sarHasDrawed) {
          ratioAvail = formatPrecision(
            printNumber(
              bigmath.chain(bigmath.bignumber(sds_price))
                .multiply(bigmath.bignumber(sarLocked))
                .divide(bigmath.bignumber(sarHasDrawed))
                .divide(bigmath.bignumber(anchorPrice))
                .done()
            )
          );
          ratioAvailShow = formatPrecision(ratioAvail * 100, 2) + "%"; //截取2位小数
        } else {
          ratioAvailShow = '--'
        }

        //liquidation price
        let liquidationPrice;
        if (sarLocked) {
          liquidationPrice = formatPrecision(
            printNumber(
              bigmath.chain(bigmath.bignumber(sarHasDrawed))
                .multiply(bigmath.bignumber(liquidate_line_rate_b))
                .divide(bigmath.bignumber(sarLocked))
                .divide(bigmath.bignumber(100))
                .done()
            )
          );
        }

        let tempObj = {
          tokenName,
          sarLockedShow,
          sarHasDrawedShow,
          sarLockedTranUsd,
          sarHasDrawedTranUsd,
          wenCanDraw,
          availSdsCanfree,
          ratioAvail,
          ratioAvailShow,
          liquidationPrice
        };

        return Object.assign(sarBasicInfo, tempObj);
      }
    },

    async getTokenName(name) {
      let scAddr = this.sarAddr.newToken.hash;
      let params = [
        {
          param: ["(str)" + name],
          method: "name",
        }
      ];
      let scHash = eNeo.emitParams(scAddr, params);
      let _r = await invokeScript([scHash]);
      let r = _r.result[0].stack[0].value;
      if (!r) {
        return '';
      }
      let tokenName = eNeo.hex2String(r);
      return tokenName;
    },

    async getNewBalance(name, addr) {
      let scAddr = this.sarAddr.newToken.hash;
      let params = [
        {
          param: ["(str)" + name, "(addr)" + addr],
          method: "balanceOf",
        },
        {
          method: 'totalSupply',
        }
      ];
      let scHash = eNeo.emitParams(scAddr, params);
      let _r = await invokeScript([scHash]);
      let r = _r.result[0].stack;

      let balance = eNeo.hex2Integer(r[0].value);
      let totalSupply = eNeo.hex2Integer(r[1].value);
      let showBalance = formatPrecision(
        printNumber(
          bigmath.chain(bigmath.bignumber(balance))
            .divide(bigmath.bignumber(bigmath.pow(10, 8)))
            .done()
        ), 2
      );
      let totalSupplyShow = formatPrecision(
        printNumber(
          bigmath.chain(bigmath.bignumber(totalSupply))
            .divide(bigmath.bignumber(bigmath.pow(10, 8)))
            .done()
        ), 2
      );
      return {
        name,
        symbol: name,
        type: "nep55",
        balance,
        showBalance,
        totalSupply,
        totalSupplyShow,
      };
    },

    async getNep5Info() {
      let scAddr = this.sarAddr.sds.hash;
      let params = [
        {
          name: 'balance',
          param: ["(addr)" + this.currentUser.address],
          method: "balanceOf",
        },
        {
          name: 'symbol',
          method: 'symbol',
        },
        {
          name: 'name',
          method: 'name',
        },
        {
          name: 'decimals',
          method: 'decimals',
        },
        {
          name: 'totalSupply',
          method: 'totalSupply',
        }
      ];
      let scHash = eNeo.emitParams(scAddr, params);
      let _r = await invokeScript([scHash]);
      let r = _r["result"][0]["stack"];
      let decimals = +r[3].value;
      let balance = eNeo.hex2Integer(r[0].value);
      let totalSupply = eNeo.hex2Integer(r[4].value);

      let {sds_price} = this.sarConfig;
      let showBalance = formatPrecision(
        printNumber(
          bigmath.chain(bigmath.bignumber(balance))
            .divide(bigmath.bignumber(bigmath.pow(10, decimals)))
            .done()
        ), 2
      );
      let totalSupplyShow = formatPrecision(
        printNumber(
          bigmath.chain(bigmath.bignumber(totalSupply))
            .divide(bigmath.bignumber(bigmath.pow(10, decimals)))
            .done()
        ), 2
      );
      let totalVal = formatPrecision(
        printNumber(
          bigmath.chain(bigmath.bignumber(balance))
            .multiply(bigmath.bignumber(sds_price))
            .divide(bigmath.bignumber(bigmath.pow(10, (decimals + 8))))
            .done()
        ), 2
      );
      return {
        asset: scAddr,
        type: "nep5",
        symbol: eNeo.hex2String(r[1].value),
        name: eNeo.hex2String(r[2].value),
        decimals,
        balance,
        totalSupply,
        showBalance,
        totalSupplyShow,
        totalVal,
      };
    }
  }
}
