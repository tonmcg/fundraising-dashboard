var fiscalYear = Vue.component('Fiscal-Year', {
  template: `<v-container fluid class="my-5">
  <iframe :width="width" height="541.25"
    src="https://app.powerbi.com/reportEmbed?reportId=b63af4b2-4807-4014-91b8-47089dab5623&autoAuth=true&ctid=dc59b51d-efd2-4626-83a2-9c2e6315170f"
    frameborder="0" allowFullScreen="true"></iframe>
</v-container>`,
  props: {
    width: Number
  }
});