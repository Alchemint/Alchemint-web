export default {
  methods: {
    onCopy(e) {
      this.$message({
        type: 'success',
        message: this.$t('global.copySucc'),
        customClass:'copy-msg-btn'
      });
    },
    onError(e) {
      this.$message({
        type: 'warning',
        message: this.$t('global.copyErr'),
        customClass:'copy-msg-btn'
      });
    }
  }
}
