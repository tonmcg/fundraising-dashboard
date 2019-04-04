var projections = Vue.component('Projections', {
  template: `<v-container fluid class="my-5">
  <iframe :width="width" height="541.25"
    src="https://app.powerbi.com/reportEmbed?reportId=1c2bb989-76aa-4e88-88aa-2a735ba04d0c&autoAuth=true&ctid=dc59b51d-efd2-4626-83a2-9c2e6315170f"
    frameborder="0" allowFullScreen="true"></iframe>
</v-container>`,
  props: {
    width: Number
  }
});