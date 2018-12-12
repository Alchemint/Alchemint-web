import {sarAddrList} from '../utils/const'

export default {
  data() {
    return {
      sarAddr: null,
    }
  },
  created() {
    let env = process.env._ENV;
    this.sarAddr = sarAddrList[env];
  },
}
