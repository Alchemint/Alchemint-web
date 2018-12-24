<template>
  <div class="nav-right">
    <el-dropdown class="nav-right-dropdown"
                 trigger="hover"
                 @command="changeCurrentUser"
                 placement="bottom">
      <span class="nav-right-dropdown-current">
        {{$t('nav.account')}}：{{currentUser.address | filterUser}}
      </span>
      <el-dropdown-menu class="nav-right-dropdown-menu" slot="dropdown" v-if="users">
        <el-dropdown-item v-for="item in users"
                          :command="item"
                          :key="item.addr"
                          :class="['nav-right-dropdown-menu__item',
                          {'is-active':currentUser.address===item.address}]">{{item.address | filterUser}}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
  import {setCurrentUer} from '../../utils/login'

  export default {
    name: 'AccountSelect',
    props: {
      currentUser: {
        type: Object,
        required: true,
      },
      users: {
        type: Array,
        required: true,
      }
    },
    methods: {
      changeCurrentUser(item) {
        if (item.address === this.currentUser.address) {
          return;
        }
        setCurrentUer(item, this);
        location.reload();
      },
    },
    filters: {
      filterUser(val) {
        if (val.length > 20) {
          return val.slice(0, 4) + "..." + val.substr(val.length - 4);
        }
        return val;
      }
    }
  }
</script>

<style lang="scss">
  @import "./dropdown";
</style>

