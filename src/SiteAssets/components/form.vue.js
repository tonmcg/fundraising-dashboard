Vue.component("grantForm", {
  template: `<div>
  <v-card>
    <v-card-title>
      <h2>Enter a New Commitment</h2>
    </v-card-title>
    <v-card-text>
      <v-snackbar v-model="snackbar" absolute color="primary">
        <span>The Commitment Has Been {{ submissionType }}</span>
        <v-btn flat color="white" @click="snackbar = false">Close</v-btn>
      </v-snackbar>
      <v-form ref="form" v-model="valid" class="px-3">
        <v-stepper v-model="step" vertical>
          <v-stepper-header>
            <v-stepper-step step="1" :complete="step > 1">General Commitment Information</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step step="2">Funding Information</v-stepper-step>
          </v-stepper-header>
          <v-stepper-items>
            <v-stepper-content step="1">
              <v-container fluid grid-list-xl>
                <v-layout wrap align-center>
                  <v-flex xs12 sm12 md12>
                    <v-text-field v-model="fieldsMetadata.Title.model" :id="fieldsMetadata.Title.id"
                      :rules="fieldsMetadata.Title.rules" :label="fieldsMetadata.Title.label"
                      :type="fieldsMetadata.Title.type" :counter="fieldsMetadata.Title.counter"
                      :required="fieldsMetadata.Title.required" :readOnly="fieldsMetadata.Title.readOnly"
                      :maxLength="fieldsMetadata.Title.maxLength" :hint="fieldsMetadata.Title.hint" persistent-hint clearable>
                    </v-text-field>
                  </v-flex>
                  <v-flex xs6 sm6 md6>
                    <v-select v-model="fieldsMetadata.Program.model" :id="fieldsMetadata.Program.id"
                      :rules="fieldsMetadata.Program.rules" :label="fieldsMetadata.Program.label"
                      :type="fieldsMetadata.Program.type" :required="fieldsMetadata.Program.required"
                      :readonly="fieldsMetadata.Program.readOnly"
                      :items="fieldsMetadata.Program.lookupRelationships.values"
                      :item-text="fieldsMetadata.Program.lookupRelationships.key" 
                      item-value="Id" 
                      :hint="fieldsMetadata.Title.hint" 
                      persistent-hint outline>
                      <v-tooltip slot="prepend" bottom>
                        <v-icon light medium slot="activator">info</v-icon>
                        <span class="title">{{ fieldsMetadata.Program.description }}</span>
                      </v-tooltip>
                    </v-select>
                  </v-flex>
                  <v-flex xs6 sm6 md6>
                    <span class="v-label theme--light">{{ fieldsMetadata.Duration.label }} </span>
                    <span class="display-1 v-label theme--light" v-text="fieldsMetadata.Duration.model"></span>
                    <span class="subheading v-label theme--light"
                      v-text="fieldsMetadata.Duration.model == 1 ? ' Year' : ' Years'"></span>

                    <v-slider v-model="fieldsMetadata.Duration.model" :rules="fieldsMetadata.Duration.rules"
                      :id="fieldsMetadata.Duration.id" :required="fieldsMetadata.Duration.required"
                      :min="fieldsMetadata.Duration.numericalSchema.minValue"
                      :max="fieldsMetadata.Duration.numericalSchema.maxValue"
                      :hint="fieldsMetadata.Duration.description" persistent-hint always-dirty step="1" ticks>
                      <v-icon slot="prepend" @click="moveLeft">fas fa-minus</v-icon>
                      <v-icon slot="append" @click="moveRight">fas fa-plus</v-icon>
                    </v-slider>
                  </v-flex>

                  <v-flex xs12 sm12 md12>
                    <template>
                      <v-tooltip slot="prepend" bottom>
                        <v-icon light medium slot="activator">info</v-icon>
                        <span class="title">{{ fieldsMetadata.FundingStatus.description }}</span>
                      </v-tooltip>
                    <span class="v-label theme--light">{{ fieldsMetadata.FundingStatus.label }} 
                      </span>
                    </template>
                    <v-item-group 
                        v-model="fieldsMetadata.FundingStatus.model"
                      >
                      <v-container grid-list-md>
                        <v-layout wrap>
                          <v-flex xs12 sm12 md12>
                          <v-item v-for="(choice,index) in fieldsMetadata.FundingStatus.choices" :key="choice">
                              <v-btn slot-scope="{ active, toggle }" large class="white--text"
                                :color="fieldsMetadata.FundingStatus.model == index ? filteredColors : 'primary'"
                                :outline="fieldsMetadata.FundingStatus.model !== index" :value="index" @click="toggle">
                                {{ choice }}</v-btn>
                            </v-item>
                          </v-flex>
                        </v-layout>
                      </v-container>
                    </v-item-group>
                  </v-flex>
                </v-layout>
              </v-container>
              <v-btn color="primary" @click.native="step='2'">Continue</v-btn>
            </v-stepper-content>
            <v-stepper-content step="2">
              <v-container fluid grid-list-xl>
                <v-layout wrap align-center>
                </v-layout>
              </v-container>
              <v-btn flat @click.native="step = 1">Previous</v-btn>
              <v-btn :disabled="!valid" :loading="loading" outline color="primary" @click.prevent="save">
                Save
                <template v-slot:loader>
                  <span class="custom-loader">
                    <v-icon light>cached</v-icon>
                  </span>
                </template>
              </v-btn>
              <v-btn :disabled="!valid" :loading="loading" class="white--text" color="primary" @click.prevent="submit">
                Submit
                <template v-slot:loader>
                  <span class="custom-loader">
                    <v-icon light>cached</v-icon>
                  </span>
                </template>
              </v-btn>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-form>
    </v-card-text>
  </v-card>
</div>`,
  props: {
    editedItem: Object,
    pageName: String
  },

  data: function () {
    return {
      step: 1,
      valid: false,
      loading: false,
      dialog: true,
      readOnly: false,
      clearable: true,
      snackbar: false,
      submissionType: null,
      fieldsMetadata: {
        Title: {
          model: null,
          id: null,
          rules: [],
          label: null,
          type: null,
          counter: null,
          required: null,
          readOnly: null,
          maxLength: null,
          hint: null
        },
        Program: {
          model: null,
          id: null,
          rules: [],
          label: null,
          type: null,
          required: null,
          readOnly: null,
          choices: [],
          colors: [],
          min: null,
          max: null,
          lookupRelationships: {
            values: [],
            key: null
          },
          description: null
        },
        FieldSite: {
          model: null,
          id: null,
          rules: [],
          label: null,
          type: null,
          required: null,
          readOnly: null,
          lookupRelationships: {
            values: [],
            key: null
          },
          description: null
        },
        DonorType: {
          model: null,
          id: null,
          rules: [],
          description: null,
          label: null,
          type: null,
          counter: null,
          required: null,
          readOnly: null,
          sortable: null,
          hint: null,
          numericalSchema: {
            minValue: null,
            maxValue: null,
            decPlaces: null,
            isPercent: null
          },
          lookupRelationships: {
            key: null,
            sourceList: null
          }
        },
        Donor: {
          model: null,
          id: null,
          rules: [],
          description: null,
          label: null,
          type: null,
          counter: null,
          required: null,
          readOnly: null,
          sortable: null,
          hint: null,
          numericalSchema: {
            minValue: null,
            maxValue: null,
            decPlaces: null,
            isPercent: null
          },
          lookupRelationships: {
            key: null,
            sourceList: null
          }
        },
        Notes: {
          model: null,
          id: null,
          rules: [],
          description: null,
          label: null,
          type: null,
          counter: null,
          required: null,
          readOnly: null,
          sortable: null,
          hint: null,
          numericalSchema: {
            minValue: null,
            maxValue: null,
            decPlaces: null,
            isPercent: null
          },
          lookupRelationships: {
            key: null,
            sourceList: null
          }
        },
        FiscalYear: {
          model: null,
          id: null,
          rules: [],
          description: null,
          label: null,
          type: null,
          counter: null,
          required: null,
          readOnly: null,
          sortable: null,
          hint: null,
          numericalSchema: {
            minValue: null,
            maxValue: null,
            decPlaces: null,
            isPercent: null
          },
          lookupRelationships: {
            key: null,
            sourceList: null
          }
        },
        FundingStatus: {
          model: 0,
          id: null,
          rules: [],
          label: null,
          type: null,
          required: null,
          readOnly: null,
          choices: [],
          colors: [],
          min: 1,
          max: 1,
          lookupRelationships: {
            values: [],
            key: null
          },
          description: null
        },
        Duration: {
          model: 1,
          id: null,
          rules: [],
          description: null,
          label: null,
          type: null,
          required: null,
          readOnly: null,
          hint: null,
          numericalSchema: {
            minValue: 1,
            maxValue: 1,
            decPlaces: null,
            isPercent: null
          }
        },
        ProgramCommitment: {
          model: null,
          id: null,
          rules: [],
          label: null,
          type: null,
          required: null,
          readOnly: null,
          description: null,
          currencySchema: {
            minValue: null,
            decPlaces: null
          }
        },
        FieldSiteCommitment: {
          model: null,
          id: null,
          rules: [],
          label: null,
          type: null,
          required: null,
          readOnly: null,
          description: null,
          currencySchema: {
            minValue: null,
            decPlaces: null
          }
        },
        TotalCommitment: {
          model: null,
          id: null,
          rules: [],
          label: null,
          type: null,
          required: null,
          readOnly: null,
          description: null,
          currencySchema: {
            minValue: null,
            decPlaces: null
          }
        }
      },
      listFields: [],
      programs: [],
      donorTypes: [],
      donors: [],
      fieldSites: [],
      fiscalYears: [],
      fundingStatuses: [],
      webAbsoluteUrl: _spPageContextInfo.webAbsoluteUrl
    };
  },

  async created() {
    this.fetchData();
  },

  computed: {

    // set the color of the silder based on the current selection
    filteredColors: function () {
      // get the model value
      // get the status based on the model value
      // get the color hex code based on the model value

      let model = this.fieldsMetadata.FundingStatus.model;
      let choicesLength = this.fieldsMetadata.FundingStatus.choices.length;
      let colorsLength = this.fieldsMetadata.FundingStatus.colors.length;
      let label = choicesLength ? this.fieldsMetadata.FundingStatus.choices[model] : null;
      let color = colorsLength ? this.fieldsMetadata.FundingStatus.colors[model] : null;

      console.table({
        value: model,
        color: color,
        label: label
      });

      return color;
    },

  },

  watch: {
    projectCost: function (val) {
      this.projectCostFormatted = this.formatProjectCost(val);
    },

    targetDate: function (val) {
      this.targetDateFormatted = this.formatDate(val);
    },
    startDate: function (val) {
      this.startDateFormatted = this.formatDate(val);
    },
    endDate: function (val) {
      this.endDateFormatted = this.formatDate(val);
    },

    editedItem: function () {
      this.$refs.form.reset();
      this.step = 1;
      this.valid = false;
      this.loading = false;
      this.dialog = true;
      this.readOnly = false;
      this.clearable = true;
      this.snackbar = false;

      for (let obj in this.editedItem) {
        if (obj !== "Id") {
          let fieldId = obj;
          let itemFormattedValue = null;
          let itemValue = this.editedItem[fieldId];

        }
      }
    }
  },

  methods: {
    moveLeft: function () {
      this.fieldsMetadata.Duration.model--;

      // let model = this.fieldsMetadata.Duration.model;
      // console.table({ model: model });
    },

    moveRight: function () {
      this.fieldsMetadata.Duration.model++;

      // let model = this.fieldsMetadata.Duration.model;
      // console.table({ model: model });
    },

    // return json representation of the field xml schema
    parseXML: function (xmlText) {
      let parser = new DOMParser();
      let xmlDoc = parser.parseFromString(xmlText, "text/xml");

      return xmlDoc;
    },

    // return the field data type
    defineDataType: function (fieldType) {
      let dataType = null;

      switch (fieldType) {
        case "Currency":
        case "Lookup":
        case "Counter":
        case "User":
          dataType = "number";
          break;
        case "Text":
        case "Note":
          dataType = "text";
          break;
        case "DateTime":
          dataType = "date";
          break;
      }

      return dataType;
    },
    // return SharePoint-specific internal names for lookup fields
    getInternalName: function (fieldInternalName, fieldTypeAsString) {
      let internalName = null;

      internalName = fieldTypeAsString == "Lookup" ? fieldInternalName + "Id" : fieldInternalName;

      return internalName;
    },

    // create a field unique id
    getFieldId: function (fieldInternalName, fieldDisplayName) {
      let fieldId = null;

      if (fieldInternalName !== "Title") {
        fieldId = fieldInternalName.charAt(0).toLowerCase() + fieldInternalName.substring(1);
      } else {
        fieldId = fieldDisplayName.charAt(0).toLowerCase() + fieldDisplayName.substring(1) + fieldInternalName; // i.e., projectTitle
      }

      return fieldId;
    },

    // get the field maxLength, if it exists
    getMaxLength: function (fieldMaxLength) {
      let maxLength = null;

      if (fieldMaxLength) maxLength = fieldMaxLength;

      return maxLength;
    },

    // return an array of field choices
    getChoices: function (textXML) {
      let choices;

      let xmlDoc = this.parseXML(textXML);
      let fieldSchema = xmlDoc.getElementsByTagName('CHOICES')[0];
      let choicesColl = fieldSchema.children;
      let htmlArr = Array.prototype.slice.call(choicesColl);

      choices = htmlArr.map(c => {
        return c.textContent;
      });

      return choices;
    },

    // return a object representing the field currency schema including
    // mimimum value
    // number of decimal places
    // default value
    getCurrencySchema: function (textXML) {
      let minValue = 0;
      let decPlaces = 0;

      let xmlDoc = this.parseXML(textXML);
      let fieldSchema = xmlDoc.getElementsByTagName('Field')[0];

      minValue = parseInt(fieldSchema.getAttribute('Min'));
      decPlaces = parseInt(fieldSchema.getAttribute('Decimals'));

      return {
        minValue: minValue,
        decPlaces: decPlaces
      };
    },

    // return a object representing the field numerical schema including
    // mimimum value
    // maximum value
    // number of decimal places
    // boolean if field is in percentage format
    getNumericalSchema: function (textXML) {
      let minValue = 0;
      let maxValue = 0;
      let decPlaces = 0;
      let isPercent = false;

      let xmlDoc = this.parseXML(textXML);
      let fieldSchema = xmlDoc.getElementsByTagName('Field')[0];

      minValue = parseInt(fieldSchema.getAttribute('Min'));
      maxValue = parseInt(fieldSchema.getAttribute('Max'));
      decPlaces = parseInt(fieldSchema.getAttribute('Decimals'));
      isPercent = JSON.parse(fieldSchema.getAttribute('Percentage').toLowerCase());

      return {
        minValue: minValue,
        maxValue: maxValue,
        decPlaces: decPlaces,
        isPercent: isPercent
      };
    },

    // define rules for the field
    defineRules: function (fieldRequired) {
      let rules = fieldRequired ? [
        value => (value !== 0 && !value) || "Please " + f.Description.charAt(0).toLowerCase() + f.Description.substring(1)
      ] : [];
      return rules;
    },
    // return information on the fields in this form
    // including static names, display names, data types,
    // field descriptions, and default and possible values
    getFieldMetadata: function () {
      let filter = "(Hidden eq false) and (TypeAsString ne 'Attachments' and TypeAsString ne 'Computed') and (FromBaseType eq false) or (InternalName eq 'Title')  or (InternalName eq 'ID') or (InternalName eq 'Author') or (InternalName eq 'Created')";
      let select = "InternalName,Title,TypeAsString,Required,MaxLength,Sortable,Description,DefaultValue,Filterable,ReadOnlyField,SchemaXml,LookupList,LookupField";
      let endpoint = this.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Grants')/fields?$select=" + select + "&$filter=" + filter;
      return axios.get(endpoint, {
        headers: {
          Accept: "application/json;odata=nometadata"
        }
      }).then(response => {
        let listFields = response.data.value;
        let that = this;

        // TODO: programmatically get the lookup list id and title for each
        // lookup field to feed into a getPrograms function (below)
        listFields.forEach(function (f) {

          let internalName = f.InternalName;

          // console.log("Setting initial properites for the " + internalName + " field.");
          let targetObj = that.fieldsMetadata[internalName];

          targetObj.id = that.getFieldId(f.InternalName, f.Title);
          targetObj.label = f.Title;
          targetObj.description = f.Description;
          targetObj.required = f.Required;
          targetObj.readOnly = f.ReadOnlyField;
          targetObj.rules = f.Required ? [
            value => (value == 0 || !!value) || "Please " + f.Description.charAt(0).toLowerCase() + f.Description.substring(1)
          ] : [];
          targetObj.type = that.defineDataType(f.TypeAsString);

          let consoleTable = {
            id: targetObj.id,
            label: targetObj.label,
            description: targetObj.description,
            required: targetObj.required,
            readOnly: targetObj.readOnly,
            rules: targetObj.rules,
            type: targetObj.type
          };

          // console.table(consoleTable);
          // console.log("Setting custom properites for the " + internalName + " field.");

          // these properties may not exist for certain fields:
          // choices is relevant for choice fields
          // MaxLength is relevant for text fields
          // numericalSchema is relevant for numerical fields
          // lookupRelationships is relevant for lookup (relationship) fields
          // For any data type, the default value will change
          if (f.TypeAsString == "Choice") {
            let choices = that.getChoices(f.SchemaXml);
            let defaultValue = choices.indexOf(f.DefaultValue);
            targetObj.model = defaultValue;
            targetObj.choices = choices;
            consoleTable = {
              model: targetObj.model,
              choices: targetObj.choices
            };
          } else if (f.TypeAsString == "Text") {
            targetObj.model = f.DefaultValue;
            targetObj.maxLength = that.getMaxLength(f.MaxLength);
            targetObj.counter = that.getMaxLength(f.MaxLength);
            targetObj.hint = f.Description;
            consoleTable = {
              model: targetObj.model,
              maxLength: targetObj.maxLength,
              counter: targetObj.counter,
              hint: targetObj.hint
            };
          } else if (f.TypeAsString == "Number") {
            let numericalSchema = that.getNumericalSchema(f.SchemaXml);
            targetObj.model = f.DefaultValue;
            targetObj.numericalSchema.minValue = numericalSchema.minValue;
            targetObj.numericalSchema.maxValue = numericalSchema.maxValue;
            targetObj.numericalSchema.decPlaces = numericalSchema.decPlaces;
            targetObj.numericalSchema.isPercent = numericalSchema.isPercent;
            consoleTable = {
              model: targetObj.model,
              numericalSchema: targetObj.numericalSchema
            };
          } else if (f.TypeAsString == "Currency") {
            let currencySchema = that.getCurrencySchema(f.SchemaXml);
            targetObj.model = f.DefaultValue;
            targetObj.currencySchema.minValue = currencySchema.minValue;
            targetObj.currencySchema.decPlaces = currencySchema.decPlaces;
            consoleTable = {
              model: targetObj.model,
              currencySchema: targetObj.currencySchema
            };
          } else if (f.TypeAsString == "Lookup") {
            // these defaults have already been set elsewehere
            // carry them over here
            targetObj.lookupRelationships.key = f.LookupField;
            targetObj.lookupRelationships.sourceList = f.LookupList;
            consoleTable = {
              lookupRelationships: targetObj.lookupRelationships
            };
          }

          // console.table(consoleTable);


        });
      });
    },

    getPrograms: function () {
      let select = "Id,Title";
      let endpoint = this.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Programs')/items?$select=" + select;
      return axios.get(endpoint, {
        headers: {
          Accept: "application/json;odata=nometadata"
        }
      }).then(response => {
        this.fieldsMetadata.Program.lookupRelationships.values = response.data.value;
      })
    },

    getFundingStatuses: function () {
      let select = "Id,Title,Color/Color";
      let expand = "Color";
      let endpoint = this.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Funding Statuses')/items?$select=" + select + "&$expand=" + expand;
      return axios.get(endpoint, {
        headers: {
          Accept: "application/json;odata=nometadata"
        }
      }).then(response => {
        let data = response.data.value.sort((b, a) => b.Id - a.Id);
        let choices = data.map(d => d.Title);
        let colors = data.map(d => d.Color.Color);
        let min = data.map(d => d.Id).reduce((acc, cur) => Math.min(acc, cur), 1);
        let max = data.map(d => d.Id).reduce((acc, cur) => Math.max(acc, cur), 1);

        this.fieldsMetadata.FundingStatus.lookupRelationships.values = data;
        this.fieldsMetadata.FundingStatus.choices = choices;
        this.fieldsMetadata.FundingStatus.colors = colors;
        this.fieldsMetadata.FundingStatus.min = min;
        this.fieldsMetadata.FundingStatus.max = max;
      })
    },

    getFieldSites: function () {
      let select = "Id,Title";
      let endpoint = this.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Field Sites')/items?$select=" + select;
      return axios.get(endpoint, {
        headers: {
          Accept: "application/json;odata=nometadata"
        }
      }).then(response => {
        this.fieldSites = response.data.value;
      })
    },

    async fetchData() {
      this.loading = true;
      try {
        await Promise.all([
          this.getFieldMetadata(),
          this.getPrograms(),
          this.getFieldSites(),
          this.getFundingStatuses()
        ]);
      } catch (error) {
        this.errormsg = error.message;
      } finally {
        this.loading = false;
      }
    },

    formatProjectCost: function (val) {
      let value =
        val == null ?
        null :
        parseInt(val).toLocaleString(undefined, {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0
        });
      return value;
    },

    formatDate: function (date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },

    parseDate(date) {
      if (!date) return null;

      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },

    submit: function () {
      this.submission("Submitted");
    },

    save: function () {
      this.submission("Saved");
    },

    submission: function (submissionType) {
      if (this.$refs.form.validate()) {
        let that = this;
        that.loading = true;
        // TODO: Http POST request to SharePoint

        let data = {};

        // create SharePoint-accepted data structure
        this.$refs.form._data.inputs.forEach(function (d) {
          let internalName = d.$attrs.id;
          let value = d.value !== undefined ? d.value : null;
          let dataType = d.type;
          data[internalName] = value;
        });

        console.table(data);

        axios
          .post("https://jsonplaceholder.typicode.com/posts", data)
          .then(function (response) {
            console.table(response);
            that.submissionType = submissionType;
            that.valid = false;
            that.loading = false;
            that.dialog = false;
            that.clearable = false;
            that.readOnly = true;
            that.snackbar = true;
          });
      }
    }
  }
});