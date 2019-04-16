Vue.component("success-dialog", {
  template: `<v-dialog v-model="show" fullscreen hide-overlay transition="dialog-bottom-transition" scrollable>
  <v-card tile>
    <v-toolbar card dark color="primary">
      <v-btn icon dark @click="show = false">
        <v-icon>close</v-icon>
      </v-btn>
      <v-toolbar-title>{{ getFirstName }}, your commmitment has been successfully {{ submission }}</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-card-text>
      <v-data-table :headers="headers" :items="items" hide-actions class="elevation-1">
        <template v-slot:items="props">
          <td>{{ props.item.label }}</td>
          <td>{{ props.item.value }}</td>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</v-dialog>`,
  props: {
    items: {
      type: Array
    },
    dialog: {
      type: Boolean
    },
    submissionType: {
      type: String
    }
  },
  data() {
    return {
      show: false,
      submission: '',
      userDisplayName: _spPageContextInfo.userDisplayName,
      headers: [{
          text: 'Item',
          align: 'left',
          sortable: false,
          class: "display-1 v-label primary--text",
          value: 'label'
        },
        {
          text: 'Value',
          align: 'left',
          sortable: false,
          class: "display-1 v-label primary--text",
          value: 'value'
        }
      ]
    };
  },
  watch: {
    dialog: function () {
      this.show = this.dialog;
    },
    show(val) {
      val || this.close();
    },
    submissionType: function() {
      this.submission = this.submissionType.toLowerCase();
    }
  },
  methods: {
    close() {
      this.show = false;
    }
  },
  computed: {
    getFirstName() {
      return this.userDisplayName.split(" ")[0];
    }
  }
});