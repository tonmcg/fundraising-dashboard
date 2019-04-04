var home = Vue.component('Home', {
  template: `<v-container fluid class="my-5">
    <v-layout>
      <v-flex xs8 sm8 md8>
        <h1 v-html="content.Header"></h1>
        <h2 v-html="content.Subheader"></h2>
        <span v-html="content.Body"></span>
      </v-flex>
    </v-layout>
  </v-container>`,
  data: function () {
    return {
      content: {
        Header: '',
        Subheader: '',
        Body: '',
        Aside: ''
      },
      webAbsoluteUrl: _spPageContextInfo.webAbsoluteUrl
    };
  },
  computed: {},

  async created() {
    this.fetchData();
  },

  methods: {
    getPageContent() {
      let endpoint = this.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Home Page')/items?$select=Title,Content";
      return axios.get(endpoint, {
        headers: {
          Accept: "application/json;odata=nometadata"
        }
      }).then(response => {
        response.data.value.forEach(d => {
          this.content[d.Title] = d.Content;
        });
      });
    },

    async fetchData() {
      this.loading = true;
      try {
        await Promise.all([this.getPageContent()]);
      } catch (error) {
        this.errormsg = error.message;
      } finally {
        this.loading = false;
      }
    }
  }
});