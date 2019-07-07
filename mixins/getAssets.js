import {getCurrentUser} from '~/utils/login'
import {getAllassetBalance} from '~/api/global'
import {forEach, find, orderBy} from 'lodash'
import {mapGetters} from 'vuex'
import getSarAddr from '~/mixins/getSarAddr'
import eNeo from '~/utils/eNeo'

export default {
  data() {
    return {
      assets: null,
    }
  },
  computed: {
    ...mapGetters(['typeB'])
  },
  mixins:[getSarAddr],
  async mounted() {
    //用户信息
    let user = getCurrentUser(this);

    //获取typeB配置参数
    if (!this.typeB) {
      await this.$store.dispatch('getTypeB');
    }

    //获取assets或prices;
    if (user) {
      await this.getAssets(user.address);
    } else {
      await this.getPrices();
    }
  },
  methods: {
    async getAssets(address) {
      //接口数据
      let _assets = await getAllassetBalance([address]);
      let assets = _assets.result;
      if (!assets) {
        assets = [];
      }

      //初始必须包含的资产
      let initAssets = this.getInitAssets();

      //添加初始资产
      forEach(initAssets, item => {
        let hasName = find(assets, o => o.symbol === item.symbol);
        if (!hasName) {
          assets.push(item);
        }
      });

      //按照总价value倒序排列
      assets = orderBy(assets, ['value'], ['desc']);

      //赋值
      this.assets = assets;
    },
    getPrices() {
      let assets = this.getInitAssets();
      this.assets = assets;
    },
    getInitAssets() {
      let initAssets = [
        {
          assetid: eNeo.config.neoId,
          balance: 0,
          price: find(this.typeB, o => o.key === 'neo_price').value,
          symbol: 'NEO',
          type: 'global',
          value: 0,
        },
        {
          assetid: eNeo.config.neoGasId,
          balance: 0,
          price: find(this.typeB, o => o.key === 'gas_price').value,
          symbol: 'GAS',
          type: 'global',
          value: 0,
        },
        {
          assetid: this.sarAddr.sneo.hash,
          balance: 0,
          price: find(this.typeB, o => o.key === 'sneo_price').value,
          symbol: 'SNEO',
          type: 'nep5',
          value: 0,
        },
        {
          assetid: this.sarAddr.sdusd.hash,
          balance: 0,
          price: 1,
          symbol: 'SDUSD',
          type: 'nep5',
          value: 0,
        },
        {
          assetid: this.sarAddr.sds.hash,
          balance: 0,
          price: find(this.typeB, o => o.key === 'sds_price').value,
          symbol: 'SDS',
          type: 'nep5',
          value: 0,
        },
      ];
      return initAssets;
    }
  }
}
