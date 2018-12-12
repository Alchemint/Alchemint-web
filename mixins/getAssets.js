import {getAllNep5Assets, getAllNep55Assets, getAllGlobalAssets} from '../api/wallet'
import {find, cloneDeep, forEach, orderBy} from 'lodash'
import sarAddr from './getSarAddr'
import getSarConfig from './getSarConfig'
import {formatPrecision, bigmath, printNumber} from '../utils'
import {getSarBType, getSarBByName} from '../api/institution'
import getSarB from './getSarB'

export default {
  data() {
    return {
      sarConfig: null,
      assets: null,
      sarBTypeList: null,
    }
  },
  mixins: [sarAddr, getSarConfig, getSarB],
  methods: {
    async initAssets(hasResuce) {
      this.sarConfig = await this.getSarConfig();
      let scAddr = this.sarAddr.sarB.hash;
      let _sarBTypeList = await getSarBType([1, scAddr, 10000, 1]);
      this.sarBTypeList = _sarBTypeList.result;
      if (this.currentUser) {
        let assets = await this.getAllAssets(this.sarConfig, this.sarBTypeList, hasResuce);
        this.assets = this.handleAssetsOrder(assets);
      }
    },
    async getAllAssets(sarConfig, sarBTypeList, hasResuce) {
      let global = await this.getGlobalAssets(sarConfig);
      let nep5 = await this.getNep5Assets(sarConfig);
      let nep55 = await this.getNep55Assets(sarConfig, sarBTypeList, hasResuce);
      let allAssets = [].concat(global, nep5, nep55);

      let tempArr = [
        {
          symbol: 'SDUSD',
          price: bigmath.pow(10, 8),
          type: 'nep5',
          decimals: 8,
        },
        {
          symbol: 'SDS',
          price: sarConfig.sds_price,
          type: 'nep5',
          decimals: 8,
        },
        {
          assetid: eNeo.config.neoGasId,
          symbol: 'GAS',
          price: sarConfig.gas_price,
          type: 'global',
          decimals: 8
        },
        {
          symbol: 'SNEO',
          price: sarConfig.sneo_price,
          type: 'nep5',
          decimals: 8,
        },
        {
          assetid: eNeo.config.neoId,
          symbol: 'NEO',
          price: sarConfig.neo_price,
          type: 'global',
          decimals: 0,
        },
      ];
      for (let i = 0, len = tempArr.length; i < len; i++) {
        let item = tempArr[i];
        allAssets = this.insertDefaultVal(item, allAssets);
      }
      return allAssets;
    },
    handleAssetsOrder(assets) {
      if (assets && assets.length > 0) {
        forEach(assets, item => {
          item.total_val = Number(item.totalVal);
        });
        let tempArr = orderBy(assets, ['total_val'], ['desc']);
        return tempArr;
      }
      return [];
    },

    // global assets
    async getGlobalAssets(sarConfig) {
      let params = [this.currentUser.address];
      let data = await getAllGlobalAssets(params);
      let result = data.result;
      if (result) {
        result = result.map(item => {
          let name, decimals, tempObj, price;
          if (item.asset === eNeo.config.neoId) {
            name = 'NEO';
            decimals = 0;
            price = sarConfig.neo_price;
          } else {
            name = 'GAS';
            decimals = 8;
            price = sarConfig.gas_price;
          }
          let showPrice = formatPrecision(
            printNumber(
              bigmath.chain(bigmath.bignumber(price))
                .divide(bigmath.bignumber(bigmath.pow(10, 8)))
                .done()
            ), 3);

          let totalVal = formatPrecision(
            printNumber(
              bigmath.chain(bigmath.bignumber(price))
                .multiply(bigmath.bignumber(item.balance))
                .divide(bigmath.bignumber(bigmath.pow(10, 8)))
                .done()
            ), 3);

          let showBalance = formatPrecision(item.balance, 3);
          tempObj = {
            name,
            decimals,
            assetid: item.asset,
            balance: item.balance,
            symbol: name,
            type: 'global',
            price,
            showPrice,
            totalVal,
            showBalance,
          };
          return tempObj;
        });
        return result;
      }
      return [];
    },

    // nep5 assets
    async getNep5Assets(sarConfig) {
      let params = [this.currentUser.address, 1];
      let data = await getAllNep5Assets(params);
      let allNep5 = [];
      if (data.result) {
        forEach(data.result, item => {
          if (item.symbol === 'SDUSD' && item.assetid === this.sarAddr.sdusd.hash) {
            allNep5.push(item);
          }
          if (item.symbol === 'SNEO' && item.assetid === this.sarAddr.sneo.hash) {
            allNep5.push(item);
          }
          if (item.symbol === 'SDS' && item.assetid === this.sarAddr.sds.hash) {
            allNep5.push(item);
          }
        });

        forEach(allNep5, item => {
          item.decimals = 8;
          item.totalSupply = 0;
          item.type = 'nep5';
          let price;
          switch (item.symbol) {
            case 'SNEO':
              price = sarConfig.sneo_price;
              break;
            case 'SDS':
              price = sarConfig.sds_price;
              break;
            case 'SDUSD':
              price = bigmath.pow(10, 8);
              break;
            default :
              price = bigmath.pow(10, 8);
          }
          item.price = price;
          item.showBalance = formatPrecision(item.balance, 3);
          item.showPrice = formatPrecision(
            printNumber(
              bigmath.chain(bigmath.bignumber(price))
                .divide(bigmath.bignumber(bigmath.pow(10, 8)))
                .done()
            ), 3);

          item.totalVal = formatPrecision(
            printNumber(
              bigmath.chain(bigmath.bignumber(price))
                .multiply(bigmath.bignumber(item.balance))
                .divide(bigmath.bignumber(bigmath.pow(10, 8)))
                .done()
            ), 3);
        });
        return allNep5;
      }
      return [];
    },

    // new token assets
    async getNep55Assets(sarConfig, sarBTypeList, hasResuce) {
      let params = [this.currentUser.address, this.sarAddr.newToken.hash, 1];
      let data = await getAllNep55Assets(params);
      if (data.result) {
        for (let i = 0, len = data.result.length; i < len; i++) {
          let item = data.result[i];
          item.decimals = 8;
          item.totalSupply = 0;
          item.type = 'nep55';
          item.price = this.getAnchorType(item, sarBTypeList, sarConfig);
          item.showPrice = formatPrecision(
            printNumber(
              bigmath.chain(bigmath.bignumber(item.price))
                .divide(bigmath.bignumber(bigmath.pow(10, 8)))
                .done()
            ), 3
          );

          item.totalVal = formatPrecision(
            printNumber(
              bigmath.chain(bigmath.bignumber(item.price))
                .multiply(bigmath.bignumber(item.balance))
                .divide(bigmath.bignumber(bigmath.pow(10, 8)))
                .done()
            ), 3
          );
          item.showBalance = formatPrecision(item.balance, 3);

          if (hasResuce) {
            let nameParams = [this.sarAddr.sarB.hash, item.name];
            let nameResult = await getSarBByName(nameParams);
            if (nameResult.result) {
              let owner = nameResult.result[0].addr;
              item.owner = owner;
              let tempObj = await this.getSarB(owner);
              item = Object.assign(item, tempObj);
            }
          }
        }
        return data.result;
      }
      return [];
    },

    // insert default val
    insertDefaultVal(item, arr) {
      let defaultObj = find(arr, o => o.symbol === item.symbol);
      if (!defaultObj) {
        let showPrice = formatPrecision(
          printNumber(
            bigmath.chain(bigmath.bignumber(item.price))
              .divide(bigmath.bignumber(bigmath.pow(10, 8)))
              .done()
          ), 3);
        let tempObj = {
          assetid: item.assetid,
          type: item.type,
          balance: 0,
          showBalance: formatPrecision(0, 3),
          price: item.price,
          showPrice,
          symbol: item.symbol,
          name: item.symbol,
          decimals: item.decimals,
          totalVal: formatPrecision(0, 3),
        };
        arr = [tempObj].concat(arr);
      }
      return arr;
    },

    //Conversion of new Token Price
    getAnchorType(item, sarBList, sarConfig) {
      let tempObj = find(sarBList, o => o.name === item.name);
      let anchorType;
      if (tempObj) {
        anchorType = tempObj.anchor;
      } else {
        anchorType = 'anchor_type_usd';
      }
      return sarConfig[anchorType];
    },
  }
}
