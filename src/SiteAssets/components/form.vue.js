Vue.component("grant-form", {
  template: `<div>
  <progress-dialog :submissionType="submissionType" :dialog="progress"></progress-dialog>
  <success-dialog :submissionType="submissionType" :dialog="posted" :items="response"></success-dialog>
  <v-card>
    <v-card-title>
      <h2>Enter a New Commitment</h2>
    </v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid" class="px-3">
        <v-stepper v-model="step" vertical>
          <v-stepper-header>
            <v-stepper-step step="1" :complete="step > 1">General Commitment Information</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step step="2" :complete="complete">Funding Information</v-stepper-step>
          </v-stepper-header>
          <v-stepper-items>
            <v-stepper-content step="1">
              <v-container fluid grid-list-xl>
                <v-layout wrap align-center>

                  <v-flex xs12 sm12 md12>
                    <v-text-field v-model="fieldProperties.Title['v-model']"
                      :internalname="fieldProperties.Title.internalName" :id="fieldProperties.Title.id"
                      :rules="fieldProperties.Title.rules" :label="fieldProperties.Title.label"
                      :type="fieldProperties.Title.type" :counter="fieldProperties.Title.counter"
                      :required="fieldProperties.Title.required" :readOnly="readOnly"
                      :maxLength="fieldProperties.Title.maxLength" :hint="fieldProperties.Title.hint" persistent-hint
                      :clearable="clearable">
                    </v-text-field>
                  </v-flex>

                  <v-flex xs12 sm6 md6>
                    <v-select v-model="fieldProperties.Program['v-model']"
                      :internalname="fieldProperties.Program.internalName" :id="fieldProperties.Program.id"
                      :rules="fieldProperties.Program.rules" :label="fieldProperties.Program.label"
                      :required="fieldProperties.Program.required" :readonly="readOnly"
                      :items="fieldProperties.Program.items" :item-text="fieldProperties.Program['item-text']"
                      :item-value="fieldProperties.Program['item-value']" :hint="fieldProperties.Program.hint"
                      persistent-hint outline>
                    </v-select>
                  </v-flex>

                  <v-flex xs12 sm6 md6>
                    <v-select v-model="fieldProperties.FieldSite['v-model']"
                      :internalname="fieldProperties.FieldSite.internalName" :id="fieldProperties.FieldSite.id"
                      :rules="fieldProperties.FieldSite.rules" :label="fieldProperties.FieldSite.label"
                      :required="fieldProperties.FieldSite.required" :readonly="readOnly"
                      :items="fieldProperties.FieldSite.items" :item-text="fieldProperties.FieldSite['item-text']"
                      :item-value="fieldProperties.FieldSite['item-value']" :hint="fieldProperties.FieldSite.hint"
                      persistent-hint outline>
                    </v-select>
                  </v-flex>

                  <v-flex xs12 sm12 md12>
                    <span class="v-label theme--light">{{ fieldProperties.Duration.label }} </span>
                    <span class="display-1 v-label primary--text" v-text="fieldProperties.Duration['v-model']"></span>
                    <span class="v-label theme--light"
                      v-text="fieldProperties.Duration['v-model'] == 1 ? ' Year' : ' Years'"></span>
                    <v-slider v-model="fieldProperties.Duration['v-model']"
                      :internalname="fieldProperties.Duration.internalName" :id="fieldProperties.Duration.id"
                      :rules="fieldProperties.Duration.rules" :readonly="readOnly"
                      :label="fieldProperties.Duration.label" :required="fieldProperties.Duration.required"
                      :min="fieldProperties.Duration.min" :max="fieldProperties.Duration.max"
                      :hint="fieldProperties.Duration.description" persistent-hint always-dirty step="1" ticks>
                      <v-icon :disabled="disabled" slot="prepend" @click="moveLeft($event)">fas fa-minus</v-icon>
                      <v-icon :disabled="disabled" slot="append" @click="moveRight($event)">fas fa-plus</v-icon>
                    </v-slider>
                  </v-flex>

                  <v-flex xs12 sm12 md12>
                    <v-textarea v-model="fieldProperties.Notes['v-model']"
                      :internalname="fieldProperties.Notes.internalName" :id="fieldProperties.Notes.id"
                      :rules="fieldProperties.Notes.rules" :readonly="readOnly" :label="fieldProperties.Notes.label"
                      :type="fieldProperties.Notes.type" :required="fieldProperties.Notes.required"
                      :hint="fieldProperties.Notes.hint" persistent-hint :clearable="clearable" outline auto-grow>
                    </v-textarea>
                  </v-flex>

                </v-layout>
              </v-container>
              <v-btn color="primary" @click.native="step='2'">Continue</v-btn>
            </v-stepper-content>
            <v-stepper-content step="2">
              <v-container fluid grid-list-xl>
                <v-layout wrap align-center>

                  <v-flex xs12 sm9 md9 class="text-xs-center">

                    <v-radio-group v-model="fieldProperties.FundingStatus['v-model']"
                      :internalname="fieldProperties.FundingStatus.internalName" :id="fieldProperties.FundingStatus.id"
                      :rules="fieldProperties.FundingStatus.rules" :readonly="readOnly"
                      :label="fieldProperties.FundingStatus.label" :hint="fieldProperties.FundingStatus.description"
                      persistent-hint row>
                      <v-radio v-for="item in fieldProperties.FundingStatus.items" :key="item.Id" :label="item.Title"
                        :value="item.Id" :color="item.Color.Color">
                      </v-radio>
                    </v-radio-group>

                    <!-- <v-item-group 
                      v-model="fieldProperties.FundingStatus['v-model']"
                      :internalname="fieldProperties.FundingStatus.internalName"
                      :id="fieldProperties.FundingStatus.id"
                      :rules="fieldProperties.FundingStatus.rules" 
                      :readonly="readOnly"
                      :label="fieldProperties.FundingStatus.label"
                      :hint="fieldProperties.FundingStatus.description"
                      persistent-hint
                    >
                      <span class="v-label theme--light">{{ fieldProperties.FundingStatus.label }}</span>
                        <v-item 
                          v-for="(item,index) in fieldProperties.FundingStatus.items" 
                          :key="item.Id"
                        >
                          <v-btn 
                            slot-scope="{ active, toggle }" 
                            large
                            :class="active ? 'white--text' : ''"
                            :color="item.Color.Color"
                            :outline="active ? false : true" 
                            :value="item.Id"
                            @click="toggle"
                          >
                            {{ item.Title }}</v-btn>
                        </v-item>
                      </v-item-group>
                    <span class="v-messages theme--light">{{ fieldProperties.FundingStatus.hint }}</span> -->

                  </v-flex>

                  <v-flex xs12 sm3 md3>
                    <v-select v-model="fieldProperties.FiscalYear['v-model']"
                      :internalname="fieldProperties.FiscalYear.internalName" :id="fieldProperties.FiscalYear.id"
                      :rules="fieldProperties.FiscalYear.rules" :label="fieldProperties.FiscalYear.label"
                      :required="fieldProperties.FiscalYear.required" :readonly="readOnly"
                      :items="fieldProperties.FiscalYear.items" item-text="Title" item-value="Id"
                      :hint="fieldProperties.FiscalYear.hint" persistent-hint outline>
                    </v-select>
                  </v-flex>

                  <v-flex xs12 sm6 md6>
                    <v-select v-model="fieldProperties.DonorType['v-model']"
                      :internalname="fieldProperties.DonorType.internalName" :id="fieldProperties.DonorType.id"
                      :rules="fieldProperties.DonorType.rules" :label="fieldProperties.DonorType.label"
                      :required="fieldProperties.DonorType.required" :readonly="readOnly"
                      :items="fieldProperties.DonorType.items" item-text="DonorType.Title" item-value="DonorType.Id"
                      :hint="fieldProperties.DonorType.hint" persistent-hint outline>
                    </v-select>
                  </v-flex>

                  <v-flex xs12 sm6 md6>
                    <v-select v-model="fieldProperties.Donor['v-model']"
                      :internalname="fieldProperties.Donor.internalName" :id="fieldProperties.Donor.id"
                      :rules="fieldProperties.Donor.rules" :label="fieldProperties.Donor.label"
                      :required="fieldProperties.Donor.required" :readonly="readOnly" :items="filteredDonors"
                      :item-text="fieldProperties.Donor['item-text']" :item-value="fieldProperties.Donor['item-value']"
                      :hint="fieldProperties.Donor.hint" persistent-hint outline>
                    </v-select>
                  </v-flex>

                  <v-flex xs6 sm6 md6>
                    <currency v-model="fieldProperties.ProgramCommitment['v-model']"
                      :internalname="fieldProperties.ProgramCommitment.internalName"
                      :id="fieldProperties.ProgramCommitment.id" :rules="fieldProperties.ProgramCommitment.rules"
                      :label="fieldProperties.ProgramCommitment.label" :type="fieldProperties.ProgramCommitment.type"
                      :required="fieldProperties.ProgramCommitment.required" :readonly="readOnly"
                      :hint="fieldProperties.ProgramCommitment.hint" persistent-hint>
                    </currency>
                  </v-flex>

                  <v-flex xs6 sm6 md6>
                    <currency v-model="fieldProperties.FieldSiteCommitment['v-model']"
                      :internalname="fieldProperties.FieldSiteCommitment.internalName"
                      :id="fieldProperties.FieldSiteCommitment.id" :rules="fieldProperties.FieldSiteCommitment.rules"
                      :label="fieldProperties.FieldSiteCommitment.label"
                      :type="fieldProperties.FieldSiteCommitment.type"
                      :required="fieldProperties.FieldSiteCommitment.required" :readonly="readOnly"
                      :hint="fieldProperties.FieldSiteCommitment.hint" persistent-hint>
                    </currency>
                  </v-flex>

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
  props: {},
  data: function (vm) {
    return {
      step: 1,
      disabled: false,
      valid: false,
      complete: false,
      loading: false,
      progress: false,
      readOnly: false,
      clearable: true,
      posted: false,
      response: [],
      submissionType: null,
      fieldProperties: {
        Title: {
          "v-model": null,
          internalName: null,
          typeAsString: null,
          id: null,
          rules: [],
          label: null,
          type: null,
          counter: null,
          required: null,
          maxLength: null,
          hint: null
        },
        Program: {
          "v-model": null,
          internalName: null,
          typeAsString: null,
          id: null,
          rules: [],
          label: null,
          required: null,
          items: [],
          "item-text": null,
          "item-value": 'Id',
          hint: null
        },
        FieldSite: {
          "v-model": null,
          internalName: null,
          typeAsString: null,
          id: null,
          rules: [],
          label: null,
          required: null,
          items: [],
          "item-text": null,
          "item-value": 'Id',
          hint: null
        },
        DonorType: {
          "v-model": null,
          internalName: null,
          typeAsString: null,
          id: null,
          rules: [],
          label: null,
          required: null,
          items: [],
          "item-text": null,
          "item-value": 'Id',
          hint: null
        },
        Donor: {
          "v-model": null,
          internalName: null,
          typeAsString: null,
          id: null,
          rules: [],
          label: null,
          required: null,
          items: [],
          "item-text": null,
          "item-value": 'Id',
          hint: null
        },
        Notes: {
          "v-model": null,
          internalName: null,
          typeAsString: null,
          id: null,
          rules: [],
          label: null,
          type: null,
          required: null,
          hint: null
        },
        FiscalYear: {
          "v-model": null,
          internalName: null,
          typeAsString: null,
          id: null,
          rules: [],
          label: null,
          required: null,
          items: [],
          "item-text": null,
          "item-value": 'Id',
          hint: null
        },
        FundingStatus: {
          "v-model": null,
          internalName: null,
          typeAsString: null,
          id: null,
          rules: [],
          label: null,
          type: null,
          required: null,
          items: [],
          hint: null
        },
        Duration: {
          "v-model": 1,
          internalName: null,
          typeAsString: null,
          id: null,
          rules: [],
          description: null,
          label: null,
          type: null,
          required: null,
          hint: null,
          min: null,
          max: null,
          Decimals: null,
          Percentage: null
        },
        ProgramCommitment: {
          "v-model": null,
          internalName: null,
          typeAsString: null,
          id: null,
          rules: [],
          label: null,
          type: null,
          required: null,
          hint: null,
          placeholder: null,
          min: null,
          max: null,
          Decimals: null,
          Percentage: null
        },
        FieldSiteCommitment: {
          "v-model": null,
          internalName: null,
          typeAsString: null,
          id: null,
          rules: [],
          label: null,
          type: null,
          required: null,
          hint: null,
          placeholder: null,
          min: null,
          max: null,
          Decimals: null,
          Percentage: null
        }
      },
      listFields: [],
      webAbsoluteUrl: _spPageContextInfo.webAbsoluteUrl,
      formDigestValue: _spPageContextInfo.formDigestValue
    };
  },

  async created() {
    this.fetchData();
  },

  computed: {

    // return the subset of donors who match the selected donor type
    filteredDonors: function () {

      // get selected donor type id
      // filter donors by the donor type id
      // return filtered set of donors data
      // reset donors model
      let donorTypeId = this.fieldProperties.DonorType['v-model'];
      let donors = donorTypeId ? this.fieldProperties.DonorType.items.filter(d => {
        return d.DonorType.Id == donorTypeId;
      }) : [];

      this.fieldProperties.Donor['v-model'] = null;

      return donors;
    },

    // set the color of the silder based on the current selection
    filteredColors: function () {
      // get the model value
      // get the status based on the model value
      // get the color hex code based on the model value

      let model = this.fieldProperties.FundingStatus['v-model'];
      let choicesLength = this.fieldProperties.FundingStatus.choices.length;
      let colorsLength = this.fieldProperties.FundingStatus.colors.length;
      let label = choicesLength ? this.fieldProperties.FundingStatus.choices[model] : null;
      let color = colorsLength ? this.fieldProperties.FundingStatus.colors[model] : null;

      // console.table({
      //   value: model,
      //   color: color,
      //   label: label
      // });

      return color;
    },

  },

  watch: {
    valid: function () {
      this.complete = this.valid;
    }
  },

  methods: {
    moveLeft: function (e) {
      this.fieldProperties[e.target.__vue__.$parent.$attrs.internalname]['v-model']--;
    },

    moveRight: function (e) {
      this.fieldProperties[e.target.__vue__.$parent.$attrs.internalname]['v-model']++;
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
        case "Number":
        case "Lookup":
        case "Counter":
        case "User":
        case "Choice":
          dataType = "number";
          break;
        case "Currency":
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

    // return a object representing the field choice including
    // control format
    // boolean for fill-in choices
    // array of choice values
    getChoiceSchema: function (textXML) {
      let xmlDoc = this.parseXML(textXML);
      let fieldSchema = xmlDoc.getElementsByTagName('Field')[0];
      let choiceSchema = xmlDoc.getElementsByTagName('CHOICES')[0];

      let Format = fieldSchema.getAttribute('Format') ? fieldSchema.getAttribute('Format') : "Dropdown";
      let FillInChoice = fieldSchema.getAttribute('FillInChoice') ? JSON.parse(fieldSchema.getAttribute('FillInChoice').toLowerCase()) : false;
      let Choices = Array.prototype.slice.call(choiceSchema.children).map((c, i) => {
        return {
          "Id": i,
          "Title": c.textContent
        };
      });

      return {
        Format: Format,
        FillInChoice: FillInChoice,
        Choices: Choices
      };
    },

    // return a object representing the field note including
    // number of lines
    // boolean for rich text field
    // mode of rich text for field
    getNoteSchema: function (textXML) {
      let xmlDoc = this.parseXML(textXML);
      let fieldSchema = xmlDoc.getElementsByTagName('Field')[0];

      let NumLines = fieldSchema.getAttribute('NumLines') ? parseInt(fieldSchema.getAttribute('NumLines')) : 0;
      let RichText = fieldSchema.getAttribute('RichText') ? JSON.parse(fieldSchema.getAttribute('RichText').toLowerCase()) : false;
      let RichTextMode = fieldSchema.getAttribute('RichTextMode') ? fieldSchema.getAttribute('RichTextMode') : 'Compatible';

      return {
        NumLines: NumLines,
        RichText: RichText,
        RichTextMode: RichTextMode
      };
    },

    /*  
      return a object representing the field numerical or currency schema including
      mimimum value
      maximum value
      number of decimal places
      boolean if field is in percentage format
    */
    getNumericalSchema: function (textXML) {
      let xmlDoc = this.parseXML(textXML);
      let fieldSchema = xmlDoc.getElementsByTagName('Field')[0];

      let Min = fieldSchema.getAttribute('Min') ? parseInt(fieldSchema.getAttribute('Min')) : 0;
      let Max = fieldSchema.getAttribute('Max') ? parseInt(fieldSchema.getAttribute('Max')) : Infinity;
      let Decimals = fieldSchema.getAttribute('Decimals') ? parseInt(fieldSchema.getAttribute('Decimals')) : 0;
      let Percentage = fieldSchema.getAttribute('Percentage') ? JSON.parse(fieldSchema.getAttribute('Percentage').toLowerCase()) : false;

      return {
        Min: Min,
        Max: Max,
        Decimals: Decimals,
        Percentage: Percentage
      };
    },

    // define rules for the field
    defineRules: function (fieldRequired) {
      let rules = fieldRequired ? [
        value => (value !== 0 && !value) || "Please " + f.Description.charAt(0).toLowerCase() + f.Description.substring(1)
      ] : [];
      return rules;
    },
    /*  
      return information on the fields in this form
      including static names, display names, data types,
      field descriptions, and default and possible values
    */
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

        listFields.forEach(function (f) {

          // get SharePoint field metadata
          // set field properties based on metadata

          // console.log("Getting metadata for the " + f.InternalName + " field.");

          // SharePoint field metadata
          let metadata = {
            InternalName: f.InternalName,
            Title: f.Title,
            TypeAsString: f.TypeAsString,
            Required: f.Required,
            Sortable: f.Sortable,
            Description: f.Description,
            DefaultValue: f.DefaultValue,
            Filterable: f.Filterable,
            ReadOnlyField: f.ReadOnlyField
          };

          // SharePoint field custom metadata
          if (metadata.TypeAsString == "Choice") {
            schemaXml = that.getChoiceSchema(f.SchemaXml);
            metadata.Format = schemaXml.Format;
            metadata.FillInChoice = schemaXml.FillInChoice;
            metadata.Choices = schemaXml.Choices;
            metadata.DefaultChoice = schemaXml.Choices.filter(d => d.Title == metadata.DefaultValue)[0].Id;
          } else if (metadata.TypeAsString == "Text") {
            metadata.MaxLength = f.MaxLength;
          } else if (metadata.TypeAsString == "Note") {
            schemaXml = that.getNoteSchema(f.SchemaXml);
            metadata.NumLines = schemaXml.NumLines;
            metadata.RichText = schemaXml.RichText;
            metadata.RichTextMode = schemaXml.RichTextMode;
          } else if (metadata.TypeAsString == "Lookup") {
            metadata.LookupField = f.LookupField;
            metadata.LookupList = f.LookupList;
          } else if (metadata.TypeAsString == "Number" || metadata.TypeAsString == "Currency") {
            metadata.DefaultValue = parseInt(metadata.DefaultValue);
            schemaXml = that.getNumericalSchema(f.SchemaXml);
            metadata.Min = schemaXml.Min;
            metadata.Max = schemaXml.Max;
            metadata.Decimals = schemaXml.Decimals;
            metadata.Percentage = schemaXml.Percentage;
          }
          // console.table(metadata);

          // field properties based on metadata
          // console.log("Setting initial properites for the " + metadata.InternalName + " field.");

          let fieldProperty = that.fieldProperties[metadata.InternalName];

          fieldProperty.internalName = metadata.InternalName;
          fieldProperty.typeAsString = metadata.TypeAsString;
          fieldProperty.id = that.getFieldId(metadata.InternalName, metadata.Title);
          fieldProperty.label = metadata.Title;
          fieldProperty.description = metadata.Description;
          fieldProperty.required = metadata.Required;
          fieldProperty.readOnly = metadata.ReadOnlyField;
          fieldProperty.rules = metadata.Required ? [
            value => (value == 0 || !!value) || "Please " + metadata.Description.charAt(0).toLowerCase() + metadata.Description.substring(1)
          ] : [];
          fieldProperty.type = that.defineDataType(metadata.TypeAsString);

          // let consoleTable = {
          //   id: fieldProperty.id,
          //   label: fieldProperty.label,
          //   description: fieldProperty.description,
          //   required: fieldProperty.required,
          //   readOnly: fieldProperty.readOnly,
          //   rules: fieldProperty.rules,
          //   type: fieldProperty.type
          // };

          // console.table(consoleTable);

          // field custom properties based on custom metadata
          // console.log("Setting custom properites for the " + metadata.InternalName + " field.");

          // these custom properties exist only for certain fields
          if (metadata.TypeAsString == "Choice") {
            fieldProperty['v-model'] = metadata.DefaultChoice;
            fieldProperty.items = metadata.Choices;
            fieldProperty.hint = metadata.Description;
            consoleTable = {
              "v-model": fieldProperty['v-model'],
              items: fieldProperty.items
            };
          } else if (metadata.TypeAsString == "Text") {
            fieldProperty['v-model'] = metadata.DefaultValue;
            fieldProperty.maxLength = metadata.MaxLength;
            fieldProperty.counter = metadata.MaxLength;
            fieldProperty.hint = metadata.Description;
            consoleTable = {
              "v-model": fieldProperty['v-model'],
              maxLength: fieldProperty.maxLength,
              counter: fieldProperty.counter,
              hint: fieldProperty.hint
            };
          } else if (metadata.TypeAsString == "Note") {
            fieldProperty['v-model'] = metadata.DefaultValue;
            fieldProperty.hint = metadata.Description;
            consoleTable = {
              "v-model": fieldProperty['v-model'],
              counter: fieldProperty.counter,
              hint: fieldProperty.hint
            };
          } else if (metadata.TypeAsString == "Number" || metadata.TypeAsString == "Currency") {
            fieldProperty['v-model'] = metadata.DefaultValue;
            fieldProperty.min = metadata.Min;
            fieldProperty.max = metadata.Max;
            fieldProperty.Decimals = metadata.Decimals;
            fieldProperty.Percentage = metadata.Percentage;
            fieldProperty.placeholder = fieldProperty['v-model'];
            fieldProperty.hint = metadata.Description;
            consoleTable = {
              "v-model": fieldProperty['v-model'],
              min: fieldProperty.min,
              max: fieldProperty.max,
              Decimals: fieldProperty.Decimals,
              Percentage: fieldProperty.Percentage,
              hint: fieldProperty.hint
            };
          } else if (metadata.TypeAsString == "Lookup") {
            fieldProperty['v-model'] = metadata.DefaultValue;
            fieldProperty.hint = metadata.Description;
            fieldProperty['item-text'] = metadata.LookupField;
            fieldProperty.LookupList = metadata.LookupList;
            consoleTable = {
              "v-model": fieldProperty['v-model'],
              hint: fieldProperty.hint,
              "item-text": fieldProperty['item-text'],
              LookupList: fieldProperty.LookupList
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
        this.fieldProperties.Program.items = response.data.value;
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
        this.fieldProperties.FieldSite.items = response.data.value;
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

        this.fieldProperties.FundingStatus.items = data;
        this.fieldProperties.FundingStatus.choices = choices;
        this.fieldProperties.FundingStatus.colors = colors;
        this.fieldProperties.FundingStatus.min = min;
        this.fieldProperties.FundingStatus.max = max;
      })
    },

    getDonors: function () {
      let select = "Id,Title,DonorType/Title,DonorType/Id";
      let expand = "DonorType";
      let top = '500';
      let endpoint = this.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Donors')/items?$select=" + select + "&$expand=" + expand + "&$top=" + top;
      return axios.get(endpoint, {
        headers: {
          Accept: "application/json;odata=nometadata"
        }
      }).then(response => {
        this.fieldProperties.DonorType.items = response.data.value;
      })
    },

    async fetchData() {
      this.loading = true;
      try {
        await Promise.all([
          this.getFieldMetadata(),
          this.getPrograms(),
          this.getFieldSites(),
          this.getFundingStatuses(),
          this.getDonors()
        ]);
      } catch (error) {
        this.errormsg = error.message;
      } finally {
        this.loading = false;
      }
    },

    formatNumeric: function (text) {
      let value = text == null ? null : Number(text.replace(/[^0-9.-]+/g, ""));

      return value;
    },

    formatCurrency: function (e) {

      // let val = this.fieldProperties.ProgramCommitment['v-model'];
      let val = e.target.value;

      let value = !val ? null : parseInt(this.formatNumeric(val)).toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: this.fieldProperties.ProgramCommitment.Decimals
      });

      e.target.value = value;
      // this.fieldProperties.ProgramCommitment['v-model'] = value;
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

        that.submissionType = submissionType;
        that.loading = true;
        that.progress = true;

        let data = {
          "__metadata": {
            "type": "SP.Data.GrantsListItem"
          }
        };

        that.response.push({
          label: 'Id',
          value: null
        });

        // create SharePoint-accepted data structure
        this.$refs.form._data.inputs.forEach(function (d) {
          // let key = that.fieldProperties[d.$attrs];
          let key = that.fieldProperties[d.$vnode.data.attrs.internalname];
          let val = null;
          let value = null;
          let TypeAsString = key.typeAsString;
          let internalName = TypeAsString == "Lookup" ? key.internalName + "Id" : key.internalName;

          // get field value from control
          // to submit to SharePoint, get the 'v-model' property
          // to show in a data table, determine the type of control and get the printer-friendly value
          if (TypeAsString == "Choice") {
            value = key.items.filter(d => d.Id == key['v-model'])[0].Title;
          } else {
            value = key['v-model'];
          }

          label = d.label;
          if (d.items) {
            val = d._data.selectedItems[0].Title
          } else if (d.radios) {
            val = d._data.radios[d.value - 1].label;
          } else {
            val = d.value;
          }
          that.response.push({
            label: label,
            value: val
          });

          data[internalName] = value;
        });

        console.table(data);

        let endpoint = this.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Grants')/items";
        axios
          // .post("https://jsonplaceholder.typicode.com/posts", data)
          .post(endpoint, data, {
            headers: {
              "Accept": "application/json;odata=verbose",
              "Content-Type": "application/json;odata=verbose",
              "X-RequestDigest": that.formDigestValue
            }
          })
          .then(function (r) {
            console.table(r.data.d);
            that.response.filter(d => d.label == "Id")[0].value = r.data.d.Id;

            setTimeout(() => (
              that.progress = false,
              that.posted = true
            ), 4000)

            // lock down form
            that.valid = false;
            that.complete = true;
            that.loading = false;
            that.clearable = false;
            that.readOnly = true;
            that.disabled = true;
          });
      }
    }
  }
});