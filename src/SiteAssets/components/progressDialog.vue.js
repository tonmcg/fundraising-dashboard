Vue.component("progress-dialog", {
    template: `<v-dialog v-model="dialog" hide-overlay persistent width="300">
  <v-card color="primary" dark>
    <v-card-text>
      {{ submission }} your commitment
      <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
    </v-card-text>
  </v-card>
</v-dialog>`,
    props: {
        dialog: {
            type: Boolean
        },
        submissionType: {
            type: String
        }
    },
    data() {
        return {
            submission: ''
        };
    },
    watch: {
        submissionType: function() {
            this.submission = this.submissionType == 'Saved' ? 'Saving' : 'Submitting';
        }

    }
});