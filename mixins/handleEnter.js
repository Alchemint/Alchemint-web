export default {
  mounted() {
    window.addEventListener('keyup', this.handleEnterUp, false);
  },
  destroyed() {
    window.removeEventListener('keyup', this.handleEnterUp, false);
  },
  methods: {
    handleEnterUp(event) {
      if (event.keyCode === 13) {
        this.handleEnter();
      }
    }
  }
}
