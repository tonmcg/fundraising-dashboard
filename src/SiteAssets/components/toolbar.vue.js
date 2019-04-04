Vue.component("toolbar", {
  template: `<div>
  <header role="banner"
    style="display: block;background: #fff;position: fixed;width: 100%;top: 0px;color:rgb(51, 51, 51);"></header>
  <v-toolbar app color="grey lighten-5">
    <v-toolbar-side-icon></v-toolbar-side-icon>

    <v-toolbar-items>
      <v-btn large flat to="/">Center for Oceans</v-btn>
      <v-btn large flat>New Grant Form</v-btn>
      <v-btn large flat to="/shortfall">Shortfall</v-btn>
      <v-btn large flat to="/fiscal-year">Fiscal Year</v-btn>
      <v-btn large flat>Projections</v-btn>
    </v-toolbar-items>

    <v-spacer></v-spacer>

    <v-btn flat>
      <span>{{ userDisplayName }}</span>
    </v-btn>

    <v-btn icon>
      <v-icon>search</v-icon>
    </v-btn>

    <v-btn icon v-if="isPrivileged()" :href="this.webAbsoluteUrl + '/' + this.layoutsUrl + '/viewlsts.aspx'"
      target="_blank">
      <v-icon>settings</v-icon>
    </v-btn>
  </v-toolbar>
</div>`,
  data: function () {
    return {
      users: [],
      userDisplayName: _spPageContextInfo.userDisplayName,
      layoutsUrl: _spPageContextInfo.layoutsUrl,
      userId: _spPageContextInfo.userId,
      webAbsoluteUrl: _spPageContextInfo.webAbsoluteUrl
    };
  },

  computed: {},

  async created() {
    this.fetchData();
  },

  methods: {
    isPrivileged() {
      let that = this;
      let privileged = [];
      console.log(this.userId);
      privileged = that.users.filter(d => {
        return d.UserId == that.userId;
      });

      return privileged.length > 0;
    },

    getPrivilegedUsers() {
      let endpoint = this.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Privileged Users')/items?$select=UserId";
      return axios.get(endpoint, {
        headers: {
          Accept: "application/json;odata=nometadata"
        }
      }).then(response => {
        this.users = response.data.value;
      });
    },

    async fetchData() {
      this.loading = true;
      try {
        await Promise.all([this.getPrivilegedUsers()]);
      } catch (error) {
        this.errormsg = error.message;
      } finally {
        this.loading = false;
      }
    }
  }
});