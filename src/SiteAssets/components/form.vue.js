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
                    <v-text-field 
                      v-model="fieldsMetadata.Title.model" 
                      :id="fieldsMetadata.Title.id"
                      :rules="fieldsMetadata.Title.rules" 
                      :label="fieldsMetadata.Title.label"
                      :type="fieldsMetadata.Title.type" 
                      :counter="fieldsMetadata.Title.counter"
                      :required="fieldsMetadata.Title.required" 
                      :readOnly="fieldsMetadata.Title.readOnly"
                      :maxLength="fieldsMetadata.Title.maxLength" 
                      :hint="fieldsMetadata.Title.hint" 
                      clearable
                      >
                    </v-text-field>
                  </v-flex>
                  <v-flex xs6 sm6 md6>
                      <v-select 
                        v-model="fieldsMetadata.ProgramId.model" 
                        :id="fieldsMetadata.ProgramId.id" 
                        :rules="fieldsMetadata.ProgramId.rules"
                        :label="fieldsMetadata.ProgramId.label"
                        :type="fieldsMetadata.ProgramId.type"
                        :required="fieldsMetadata.ProgramId.required" 
                        :readonly="fieldsMetadata.ProgramId.readOnly"
                        :items="fieldsMetadata.ProgramId.lookupRelationships.lookupValues" 
                        :item-text="fieldsMetadata.ProgramId.lookupRelationships.lookupField"
                        item-value="Id" 
                        outline
                      >
                        <v-tooltip slot="prepend" bottom>
                          <v-icon light medium slot="activator">info</v-icon>
                          <span>{{ fieldsMetadata.ProgramId.description }}</span>
                        </v-tooltip>
                      </v-select>
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
      readonly: false,
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
        ProgramId: {
          model: null,
          id: null,
          rules: [],
          label: null,
          type: null,
          required: null,
          readonly: null,
          items: [],
          lookupRelationships: { lookupValues: [], lookupField: null },
          description: null
        },
        FieldSiteId: {
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
          numericalSchema: { minValue: null, maxValue: null, decPlaces: null, isPercent: null },
          lookupRelationships: { lookupField: null, lookupList: null }
        },
        DonorTypeId: {
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
          numericalSchema: { minValue: null, maxValue: null, decPlaces: null, isPercent: null },
          lookupRelationships: { lookupField: null, lookupList: null }
        },
        DonorId: {
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
          numericalSchema: { minValue: null, maxValue: null, decPlaces: null, isPercent: null },
          lookupRelationships: { lookupField: null, lookupList: null }
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
          numericalSchema: { minValue: null, maxValue: null, decPlaces: null, isPercent: null },
          lookupRelationships: { lookupField: null, lookupList: null }
        },
        FiscalYearId: {
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
          numericalSchema: { minValue: null, maxValue: null, decPlaces: null, isPercent: null },
          lookupRelationships: { lookupField: null, lookupList: null }
        },
        FundingStatus: {
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
          choices: [],
          numericalSchema: { minValue: null, maxValue: null, decPlaces: null, isPercent: null },
          lookupRelationships: { lookupField: null, lookupList: null }
        },
        Duration: {
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
          numericalSchema: { minValue: null, maxValue: null, decPlaces: null, isPercent: null },
          lookupRelationships: { lookupField: null, lookupList: null }
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

    filteredDonors: function () {
      let that = this;
      let options = this.donors;
      return options.filter(function (i) {
        if (i.DonorTypeId == that.fieldsMetadata.DonorTypeId.model) console.log(i.Title, i.Id);
        i.DonorTypeId == that.fieldsMetadata.DonorTypeId.model;
      });
    }
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
      this.readonly = false;
      this.clearable = true;
      this.snackbar = false;

      for (let obj in this.editedItem) {
        if (obj !== "Id") {
          let fieldId = obj;
          let itemFormattedValue = null;
          let itemValue = this.editedItem[fieldId];

          if (itemValue !== null && this.pageName === "Saved Requests") {
            switch (fieldId) {
              case "TargetDate":
                itemFormattedValue = format(itemValue, "MM/DD/YYYY");
                this.targetDateFormatted = itemFormattedValue;
                break;
              case "StartDate":
                itemFormattedValue = format(itemValue, "MM/DD/YYYY");
                this.startDateFormatted = itemFormattedValue;
                break;
              case "EndDate":
                itemFormattedValue = format(itemValue, "MM/DD/YYYY");
                this.endDateFormatted = itemFormattedValue;
                break;
              case "ProcurementLabor":
              case "ProcurementEquipment":
              case "ProcurementMaintenance":
              case "ProcurementOther":
                itemFormattedValue = itemValue * 100;
                this.fieldsMetadata[
                  fieldId
                ].model = itemFormattedValue;
                break;
              default:
                itemFormattedValue = itemValue;
                this.fieldsMetadata[fieldId].model = itemFormattedValue;
            }
          } else if (itemValue !== null && this.pageName === "Submitted Forecasts") {
            switch (fieldId) {
              case "KeyTechnologies":
              case "Probability":
              case "isContract":
                break;
              default:
                itemFormattedValue = itemValue;
                this.fieldsMetadata[fieldId].model = itemFormattedValue;
            }
          }

        }
      }
    }
  },

  methods: {
    // return json representation of the field xml schema
    parseXML: function (xmlText) {
      let parser = new DOMParser();
      let xmlDoc = parser.parseFromString(xmlText, "text/xml");

      return xmlDoc;
    },

    // // return the field description
    // getDescription: function (fieldDescription) {
    //   let description = null;

    //   description = fieldDescription;

    //   return description;
    // },
    // // return the field default value
    // getDefaultValue: function (fieldInternalName, fieldDefault, dataType) {
    //   let defaultValue = null;

    //   if (fieldDefault !== null) {

    //     if (fieldInternalName == "FiscalYear") {
    //       // set default value of fiscal year field to current year
    //       defaultValue = this.fiscalYears.filter(d => {
    //         let currMonth = parseInt(moment().format('M'));
    //         let currYear = parseInt(moment().format('YYYY'));
    //         // CI fiscal years start in July of the current year
    //         let currFY = currMonth < 7 ? currYear.toString() : (currYear + 1).toString();
    //         return d.Title == currFY;
    //       })[0].Id;
    //     } else if (dataType == "number" && fieldDefault !== null)  {
    //       defaultValue = parseInt(fieldDefault).toString();
    //     } else if (dataType == "text" && fieldDefault == null) {
    //       defaultValue = '';
    //     } else {
    //       defaultValue = fieldDefault;
    //     }
    //   }

    //   return defaultValue;
    // },
    // // return the field filterable property
    // isFilterable: function (fieldFilterable) {
    //   let filterable = false;

    //   filterable = fieldFilterable;

    //   return filterable;
    // },
    // // return the field read only property
    // isReadOnly: function (fieldReadOnly) {
    //   let readOnly = false;

    //   readOnly = fieldReadOnly;

    //   return readOnly;
    // },
    // // return the field required property
    // isRequired: function (fieldRequired) {
    //   let required = false;

    //   required = fieldRequired;

    //   return required;
    // },
    // // return the field sortable property
    // isSortable: function (fieldSortable) {
    //   let sortable = false;

    //   sortable = fieldSortable;

    //   return sortable;
    // },
    // // return the field display name
    // getDisplayName: function (fieldDisplayName) {
    //   let displayName = null;

    //   displayName = fieldDisplayName;

    //   return displayName;
    // },
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
      let xmlDoc = this.parseXML(textXML);
      let fieldSchema = xmlDoc.getElementsByTagName('CHOICES')[0];
      let choicesColl = fieldSchema.children;
      let htmlArr = Array.prototype.slice.call(choicesColl);

      return htmlArr.map(c => {
        c.textContent;
      });
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
        value => !!value || "Please " + f.Description.charAt(0).toLowerCase() + f.Description.substring(1)
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
        let fieldsMetadata = {};
        let that = this;

        // TODO: programmatically get the lookup list id and title for each
        // lookup field to feed into a getPrograms function (below)
        listFields.forEach(function (f) {

          let fieldId = that.getFieldId(f.InternalName, f.Title);
          let internalName = that.getInternalName(f.InternalName, f.TypeAsString);
          let label = f.Title;
          let description = f.Description;
          let required = f.Required;
          let sortable = f.Sortable;
          let readOnly = f.ReadOnlyField;
          let defaultValue = f.DefaultValue;
          let hint = description;
          let rules = required ? [
            v => !!v || "Please " + f.Description.charAt(0).toLowerCase() + f.Description.substring(1)
          ] : [];
          let dataType = that.defineDataType(f.TypeAsString);

          fieldsMetadata[internalName] = {
            model: defaultValue,
            id: fieldId,
            rules: rules,
            label: label,
            type: dataType,
            required: required,
            readOnly: readOnly,
            description: description
          };

          // these properties may not exist for certain fields:
          // choices is relevant for choice fields
          // MaxLength is relevant for text fields
          // numericalSchema is relevant for numerical fields
          // lookupRelationships is relevant for lookup (relationship) fields
          if (f.TypeAsString == "Choice") {
            let choices = that.getChoices(f.SchemaXml);
            fieldsMetadata[internalName].choices = choices;
          } else if (f.TypeAsString == "Text") {
            let maxLength = that.getMaxLength(f.MaxLength);
            fieldsMetadata[internalName].maxLength = maxLength;
            fieldsMetadata[internalName].counter = maxLength;
            fieldsMetadata[internalName].hint = hint;
          } else if (f.TypeAsString == "Number") {
            let numericalSchema = that.getNumericalSchema(f.SchemaXml);
            fieldsMetadata[internalName].numericalSchema = numericalSchema;
          } else if (f.TypeAsString == "Lookup") {
            let lookupRelationships = { lookupField: f.LookupField, lookupList: f.LookupList, lookupValues: [] };
            fieldsMetadata[internalName].lookupRelationships = lookupRelationships;
          }

        });
        console.log(fieldsMetadata);
        this.fieldsMetadata = fieldsMetadata;
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
        this.fieldsMetadata.ProgramId.lookupRelationships.lookupValues = response.data.value;
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

    getDonorTypes: function () {
      let select = "Id,Title";
      let endpoint = this.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Donor Types')/items?$select=" + select;
      return axios.get(endpoint, {
        headers: {
          Accept: "application/json;odata=nometadata"
        }
      }).then(response => {
        this.donorTypes = response.data.value;
      })
    },

    getDonors: function () {
      let select = "Id,Title,DonorTypeId";
      let top = "500";
      let endpoint = this.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Donors')/items?$select=" + select + "&$top=" + top;
      return axios.get(endpoint, {
        headers: {
          Accept: "application/json;odata=nometadata"
        }
      }).then(response => {
        this.donors = response.data.value;
      })
    },

    async fetchData() {
      this.loading = true;
      try {
        await Promise.all([
          this.getFieldMetadata(),
          this.getPrograms(),
          this.getFieldSites(),
          this.getDonorTypes(),
          this.getDonors()
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

        console.log(data);

        axios
          .post("https://jsonplaceholder.typicode.com/posts", data)
          .then(function (response) {
            console.log(response);
            that.submissionType = submissionType;
            that.valid = false;
            that.loading = false;
            that.dialog = false;
            that.clearable = false;
            that.readonly = true;
            that.snackbar = true;
          });
      }
    }
  }
});