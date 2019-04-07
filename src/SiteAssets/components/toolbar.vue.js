Vue.component("toolbar", {
  template: `<v-toolbar app color="grey lighten-5">
  <v-toolbar-items>
    <v-btn flat href="https://www.conservation.org/Pages/default.aspx" target="_blank">
      <img width="128px" src="../images/ciLogo_Large.svg" alt="CI logo" />
    </v-btn>
    <v-btn large flat style="font-size: 18px;" v-for="link in links" :key="link.name" :to="link.path">{{ link.name }}</v-btn>
  </v-toolbar-items>

  <v-spacer></v-spacer>

  <v-btn flat :href="delve" target="_blank">
    <span>{{ userDisplayName }}</span>
  </v-btn>

  <v-btn icon>
    <v-icon>search</v-icon>
  </v-btn>

  <v-btn icon v-if="isPrivileged()" :href="this.webAbsoluteUrl + '/' + this.layoutsUrl + '/viewlsts.aspx'"
    target="_blank">
    <v-icon>settings</v-icon>
  </v-btn>
</v-toolbar>`,
  data() {
    return {
      users: [],
      userDisplayName: _spPageContextInfo.userDisplayName,
      layoutsUrl: _spPageContextInfo.layoutsUrl,
      delve: _spPageContextInfo.siteAbsoluteUrl.split('.')[0] + '-my.' + _spPageContextInfo.siteAbsoluteUrl.split('.')[1] + '.com/person.aspx',
      userId: _spPageContextInfo.userId,
      webAbsoluteUrl: _spPageContextInfo.webAbsoluteUrl,
      webTitle: _spPageContextInfo.webTitle,
      links: [
        { name: 'Center for Oceans', path: '/'},
        { name: 'New Grant Form', path: '/new-grant'},
        { name: 'Shortfall', path: '/shortfall'},
        { name: 'Fiscal Year', path: '/fiscal-year'},
        { name: 'Projections', path: '/projections'}
      ]
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