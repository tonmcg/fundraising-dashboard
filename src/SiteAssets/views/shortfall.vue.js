var shortfall = Vue.component('Shortfall', {
  template: `<v-container fluid class="my-5">
  <iframe :width="width" height="541.25"
    src="https://app.powerbi.com/reportEmbed?reportId=36afa9d8-becf-4135-88ea-124a0a81bfc5&autoAuth=true&ctid=dc59b51d-efd2-4626-83a2-9c2e6315170f"
    frameborder="0" allowFullScreen="true"></iframe>
</v-container>`,
  props: {
    width: Number
  }, 
  data() {
    return {
      window: {
        width:0,
        height:0
      }
    };
  },
  mounted() {
    if (this.width) {
        this.window.width = this.width;
    }
  }
});