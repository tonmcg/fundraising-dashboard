Vue.component("footbar", {
  template: `<div>
  <v-footer app height="auto">
    <v-layout justify-center row wrap>
      <v-flex>
        <v-card flat tiel class="lighten-1 white--text text-xs-center">
          <v-card-text>
            <v-btn v-for="icon in icons" :key="icon.name" class="mx-3 white--text" :href="icon.url" icon>
              <v-icon size="24px">{{ icon.name }}</v-icon>
            </v-btn>
          </v-card-text>
          <v-card-text class="white--text pt-0">Questions? Contact Ashleigh McGovern, Senior Director of Development + Innovation at <a style="color:#fff;" href="mailto&#58;amcgovern@conservation.org?subject=Question%20on%20Fundraising%20Site&amp;body=Ashleigh&#58;">amcgovern@conservation.org</a> or at extension 2494.</v-card-text>
          <v-divider></v-divider>
          <v-card-text white--text>
            &copy;2019 — <strong>emdata, Inc.</strong>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-footer>
</div>`,
  data() {
    return {
      icons: [{
          name: 'fab fa-facebook',
          url: 'https://www.facebook.com/conservation.intl'
        },
        {
          name: 'fab fa-twitter',
          url: 'https://twitter.com/conservationorg'
        },
        {
          name: 'fab fa-instagram',
          url: 'http://instagram.com/conservationorg'
        },
        {
          name: 'fab fa-youtube',
          url: 'http://www.youtube.com/user/ConservationDotOrg'
        }
      ]
    };
  }
});