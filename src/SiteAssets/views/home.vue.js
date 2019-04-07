var home = Vue.component('Home', {
  template: `<v-container fluid class="my-5">
  <v-layout row wrap>
    <v-flex xs12 sm12 md12>
      <h1 style="font-size: 38px;color: #0193d7;text-transform: uppercase;display: block;" v-html="content.Header"></h1>
    </v-flex>
    <v-flex xs8 sm8 md8>
      <h2
        style="font-size: 24px;padding-top: 13px;padding-right: 0px;padding-bottom: 13px;padding-left: 0px;color: #7ecbef;"
        v-html="content.Subheader"></h2>
      <v-divider mb-4></v-divider>
      <br />
      <span class="introCopy" v-html="content.Body"></span>
    </v-flex>
    <v-flex xs4 sm4 md4>
      <span class="blockquote-reverse quote">
        <p class="blockquote-paragraph" v-html="content.Aside"></p>
      </span>
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