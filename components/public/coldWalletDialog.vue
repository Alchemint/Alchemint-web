<template>
  <!--硬件钱包签名提醒模态框 -->
  <el-dialog :visible.sync="coldWalletDialogVisible"
             custom-class="cold-wallet-dialog"
             :show-close="false"
             :lock-scroll="false"
             width="490px">
    <div slot="title" class="cold-wallet-dialog__title">
      <icon-font name="icon-bianji"></icon-font>
      <span style="padding-left:6px">Signature</span>
    </div>
    <span class="cold-wallet-dialog__content">Please sign the Tx on your cold wallet within 30s.</span>
  </el-dialog>
</template>

<script>
  export default {
    name: 'ColdWalletDialog',
    props: {
      coldWalletDialogVisible: {
        type: Boolean,
        required: true,
      }
    }
  }
</script>

<style lang="scss">
  .cold-wallet-dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin-top: 0 !important;
    z-index: 10000;
    &__title {
      color: #67C23A;
      font-size: 16px;
    }
    .el-dialog__body {
      padding: 20px 20px;
    }
  }
</style>
