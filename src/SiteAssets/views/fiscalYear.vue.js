var fiscalYear = Vue.component('Fiscal-Year', {
  template: `<v-container fluid class="my-5">
  <iframe :width="width" height="541.25"
    src="https://app.powerbi.com/reportEmbed?reportId=bd9038bf-c06d-422c-900a-2165ca8b135d&autoAuth=true&ctid=dc59b51d-efd2-4626-83a2-9c2e6315170f"
    frameborder="0" allowFullScreen="true"></iframe>
</v-container>`,
  props: {
    width: Number
  }
});