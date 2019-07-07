<template>
  <div class="login-container">
    <div class="login">
      <div class="login-tabs">
        <nuxt-link class="login-tabs-item" :to="$i18n.path('login')">{{$t('global.loginBtn1')}}</nuxt-link>
        <span class="login-tabs-border"></span>
        <nuxt-link class="login-tabs-item" :to="$i18n.path('register')">{{$t('global.registerBtn')}}</nuxt-link>
      </div>
      <div v-if="type==='coldWallet'" class="login-content mt-50">
        <cold-wallet></cold-wallet>
      </div>
      <div v-else-if="type==='json'" class="login-content mt-50">
        <key-store></key-store>
      </div>
      <div v-else>
        <wif></wif>
      </div>
    </div>
  </div>
</template>

<script>
import wif from "~/components/login/wif.vue";
import coldWallet from "~/components/login/coldWallet.vue";
import keyStore from "~/components/login/keyStore.vue";

export default {
  name: "Login",
  data() {
    return {
      type: "coldWallet"
    };
  },
  components: {
    wif,
    coldWallet,
    keyStore
  }
};
</script>

