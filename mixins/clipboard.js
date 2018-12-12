export default {
  methods: {
    onCopy(e) {
      this.$message({
        type: 'success',
        message: this.$t('global.copySucc')
      });
    },
    onError(e) {
      this.$message({
        type: 'warning',
        message: this.$t('global.copyErr')
      });
    }
  }
}
