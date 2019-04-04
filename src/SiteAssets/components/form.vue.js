Vue.component("form", {
    template: `<div>
    <v-card>
      <v-card-title>
        <h2>Complete an Acquisition Request</h2>
      </v-card-title>
      <v-card-text>
        <v-snackbar v-model="snackbar" absolute color="primary">
          <span>Your Acquisition Request Has Been {{ submissionType }}</span>
          <v-btn flat color="white" @click="snackbar = false">Close</v-btn>
        </v-snackbar>
        <v-form ref="form" v-model="valid" lazy-validation class="px-3">
          <v-stepper v-model="step" vertical>
            <v-stepper-header>
              <v-stepper-step step="1" :complete="step > 1">General Acquisition Information</v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step step="2">Detailed Acquisition Information</v-stepper-step>
            </v-stepper-header>
            <v-stepper-items>
              <v-stepper-content step="1">
                <v-container fluid grid-list-xl>
                  <v-layout wrap align-center>
                    <v-flex xs12 sm12 md12>
                      <v-text-field
                        v-model="fieldDefinitions.Title.selectedValue"
                        :rules="fieldDefinitions.Title.rules"
                        :id="fieldDefinitions.Title.id"
                        :label="fieldDefinitions.Title.label"
                        :required="fieldDefinitions.Title.required"
                        :placeholder="fieldDefinitions.Title.placeholder"
                        :type="fieldDefinitions.Title.type"
                        :max-length="fieldDefinitions.Title.maxLength"
                        :counter="fieldDefinitions.Title.maxLength"
                        :readonly="readonly"
                        :clearable="clearable"
                      >
                        <v-tooltip slot="prepend" bottom>
                          <v-icon light medium slot="activator">info</v-icon>
                          <span>{{ fieldDefinitions.Title.description }}</span>
                        </v-tooltip>
                      </v-text-field>
                    </v-flex>
                    <v-flex xs6 sm6 md6>
                      <v-select
                        v-model="fieldDefinitions.ComponentId.selectedValue"
                        :rules="fieldDefinitions.ComponentId.rules"
                        :id="fieldDefinitions.ComponentId.id"
                        :label="fieldDefinitions.ComponentId.label"
                        :required="fieldDefinitions.ComponentId.required"
                        :type="fieldDefinitions.ComponentId.type"
                        :readonly="readonly"
                        :items="components"
                        item-text="Title"
                        item-value="Id"
                        outline
                      >
                        <v-tooltip slot="prepend" bottom>
                          <v-icon light medium slot="activator">info</v-icon>
                          <span>{{ fieldDefinitions.ComponentId.description }}</span>
                        </v-tooltip>
                      </v-select>
                    </v-flex>
                    <v-flex xs6 sm6 md6>
                      <v-select
                        ref="investments"
                        v-model="fieldDefinitions.ITInvestmentNameId.selectedValue"
                        :rules="fieldDefinitions.ITInvestmentNameId.rules"
                        :id="fieldDefinitions.ITInvestmentNameId.id"
                        :label="fieldDefinitions.ITInvestmentNameId.label"
                        :required="fieldDefinitions.ITInvestmentNameId.required"
                        :type="fieldDefinitions.ITInvestmentNameId.type"
                        :readonly="readonly"
                        :items="filteredInvestments"
                        item-text="Title"
                        item-value="Id"
                        outline
                      >
                        <v-tooltip slot="prepend" bottom>
                          <v-icon light medium slot="activator">info</v-icon>
                          <span>{{ fieldDefinitions.ITInvestmentNameId.description }}</span>
                        </v-tooltip>
                      </v-select>
                    </v-flex>
                    <v-flex xs12 sm12 md12>
                      <v-select
                        v-model="fieldDefinitions.SharedITSolution.selectedValue"
                        :rules="fieldDefinitions.SharedITSolution.rules"
                        :id="fieldDefinitions.SharedITSolution.id"
                        :label="fieldDefinitions.SharedITSolution.label"
                        :required="fieldDefinitions.SharedITSolution.required"
                        :type="fieldDefinitions.SharedITSolution.type"
                        :items="fieldDefinitions.SharedITSolution.choices"
                        :readonly="readonly"
                        outline
                      >
                        <v-tooltip slot="prepend" bottom>
                          <v-icon light medium slot="activator">info</v-icon>
                          <span>{{ fieldDefinitions.SharedITSolution.description }}</span>
                        </v-tooltip>
                      </v-select>
                    </v-flex>
                    <v-flex xs6 sm6 md6>
                      <v-select
                        ref="systems"
                        v-model="fieldDefinitions.SystemNameId.selectedValue"
                        :rules="fieldDefinitions.SystemNameId.rules"
                        :id="fieldDefinitions.SystemNameId.id"
                        :label="fieldDefinitions.SystemNameId.label"
                        :required="fieldDefinitions.SystemNameId.required"
                        :type="fieldDefinitions.SystemNameId.type"
                        :items="filteredSystems"
                        item-text="Title"
                        item-value="Id"
                        :readonly="readonly"
                        outline
                      >
                        <v-tooltip slot="prepend" bottom>
                          <v-icon light medium slot="activator">info</v-icon>
                          <span>{{ fieldDefinitions.SystemNameId.description }}</span>
                        </v-tooltip>
                      </v-select>
                    </v-flex>
                    <v-flex xs6 sm6 md6>
                      <v-select
                        v-model="fieldDefinitions.SystemStatusId.selectedValue"
                        :rules="fieldDefinitions.SystemStatusId.rules"
                        :id="fieldDefinitions.SystemStatusId.id"
                        :label="fieldDefinitions.SystemStatusId.label"
                        :required="fieldDefinitions.SystemStatusId.required"
                        :type="fieldDefinitions.SystemStatusId.type"
                        :items="filteredSystemStatuses"
                        item-text="SystemStatus.Title"
                        item-value="SystemStatus.Id"
                        :readonly="readonly"
                        outline
                      >
                        <v-tooltip slot="prepend" bottom>
                          <v-icon light medium slot="activator">info</v-icon>
                          <span>{{ fieldDefinitions.SystemStatusId.description }}</span>
                        </v-tooltip>
                      </v-select>
                    </v-flex>
                    <v-flex xs6 sm6 md6>
                      <v-select
                        v-model="fieldDefinitions.ITServiceTypeId.selectedValue"
                        :rules="fieldDefinitions.ITServiceTypeId.rules"
                        :id="fieldDefinitions.ITServiceTypeId.id"
                        :label="fieldDefinitions.ITServiceTypeId.label"
                        :required="fieldDefinitions.ITServiceTypeId.required"
                        :type="fieldDefinitions.ITServiceTypeId.type"
                        :items="serviceTypes"
                        item-text="Title"
                        item-value="Id"
                        :readonly="readonly"
                        outline
                      >
                        <v-tooltip slot="prepend" bottom>
                          <v-icon light medium slot="activator">info</v-icon>
                          <span>{{ fieldDefinitions.ITServiceTypeId.description }}</span>
                        </v-tooltip>
                      </v-select>
                    </v-flex>
                    <v-flex xs6 sm6 md6>
                      <v-select
                        v-model="fieldDefinitions.ITServiceId.selectedValue"
                        :rules="fieldDefinitions.ITServiceId.rules"
                        :id="fieldDefinitions.ITServiceId.id"
                        :label="fieldDefinitions.ITServiceId.label"
                        :required="fieldDefinitions.ITServiceId.required"
                        :type="fieldDefinitions.ITServiceId.type"
                        :items="filteredServices"
                        item-text="Title"
                        item-value="Id"
                        :readonly="readonly"
                        outline
                      >
                        <v-tooltip slot="prepend" bottom>
                          <v-icon light medium slot="activator">info</v-icon>
                          <span>{{ fieldDefinitions.ITServiceId.description }}</span>
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
                    <v-flex xs6 sm6 md6>
                      <v-select
                        v-model="fieldDefinitions.ProcurementAction.selectedValue"
                        :rules="fieldDefinitions.ProcurementAction.rules"
                        :id="fieldDefinitions.ProcurementAction.id"
                        :label="fieldDefinitions.ProcurementAction.label"
                        :required="fieldDefinitions.ProcurementAction.required"
                        :type="fieldDefinitions.ProcurementAction.type"
                        :items="fieldDefinitions.ProcurementAction.choices"
                        :readonly="readonly"
                        outline
                      >
                        <v-tooltip slot="prepend" bottom>
                          <v-icon light medium slot="activator">info</v-icon>
                          <span>{{ fieldDefinitions.ProcurementAction.description }}</span>
                        </v-tooltip>
                      </v-select>
                    </v-flex>

                    <v-flex xs6 sm6 md6>
                      <v-select
                        v-model="fieldDefinitions.AcquisitionVehicle.selectedValue"
                        :rules="fieldDefinitions.AcquisitionVehicle.rules"
                        :id="fieldDefinitions.AcquisitionVehicle.id"
                        :label="fieldDefinitions.AcquisitionVehicle.label"
                        :value="fieldDefinitions.AcquisitionVehicle.value"
                        :prefix="fieldDefinitions.AcquisitionVehicle.prefix"
                        :required="fieldDefinitions.AcquisitionVehicle.required"
                        :type="fieldDefinitions.AcquisitionVehicle.type"
                        :items="fieldDefinitions.AcquisitionVehicle.choices"
                        :readonly="readonly"
                        outline
                      >
                        <v-tooltip slot="prepend" bottom>
                          <v-icon light medium slot="activator">info</v-icon>
                          <span>{{ fieldDefinitions.AcquisitionVehicle.description }}</span>
                        </v-tooltip>
                      </v-select>
                    </v-flex>
                    <v-flex xs6 sm6 md6>
                      <v-text-field
                        v-model="fieldDefinitions.ProcurementActionValue.selectedValue"
                        :rules="fieldDefinitions.ProcurementActionValue.rules"
                        :id="fieldDefinitions.ProcurementActionValue.id"
                        :label="fieldDefinitions.ProcurementActionValue.label"
                        prefix="$"
                        :required="fieldDefinitions.ProcurementActionValue.required"
                        :readonly="readonly"
                      >
                        <v-tooltip slot="prepend" bottom>
                          <v-icon light medium slot="activator">info</v-icon>
                          <span>{{ fieldDefinitions.ProcurementActionValue.description }}</span>
                        </v-tooltip>
                      </v-text-field>
                    </v-flex>
                    <v-flex xs6 sm6 md6>
                      <v-text-field
                        v-model="fieldDefinitions.OverallProjectCost.selectedValue"
                        :rules="fieldDefinitions.OverallProjectCost.rules"
                        :id="fieldDefinitions.OverallProjectCost.id"
                        :label="fieldDefinitions.OverallProjectCost.label"
                        prefix="$"
                        :required="fieldDefinitions.OverallProjectCost.required"
                        :readonly="readonly"
                      >
                        <v-tooltip slot="prepend" bottom>
                          <v-icon light medium slot="activator">info</v-icon>
                          <span>{{ fieldDefinitions.OverallProjectCost.description }}</span>
                        </v-tooltip>
                      </v-text-field>
                    </v-flex>
                    <v-flex xs6 sm6 md6>
                      <v-menu
                        v-model="fieldDefinitions.TargetDate.menu"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        lazy
                        transition="scale-transition"
                        offset-y
                        full-width
                        max-width="290px"
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            :id="fieldDefinitions.TargetDate.id"
                            v-model="targetDateFormatted"
                            :label="fieldDefinitions.TargetDate.label"
                            hint="MM/DD/YYYY format"
                            persistent-hint
                            prepend-icon="event"
                            v-on="on"
                            :required="fieldDefinitions.TargetDate.required"
                            :disabled="readonly"
                          >
                            <v-tooltip slot="append" bottom>
                              <v-icon light medium slot="activator">info</v-icon>
                              <span>{{ fieldDefinitions.TargetDate.description }}</span>
                            </v-tooltip>
                          </v-text-field>
                        </template>
                        <v-date-picker
                          v-model="targetDate"
                          @input="fieldDefinitions.TargetDate.menu = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-flex>
                    <v-flex xs3 sm3 md3>
                      <v-menu
                        v-model="fieldDefinitions.StartDate.menu"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        lazy
                        transition="scale-transition"
                        offset-y
                        full-width
                        max-width="290px"
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            :id="fieldDefinitions.StartDate.id"
                            v-model="startDateFormatted"
                            :label="fieldDefinitions.StartDate.label"
                            hint="MM/DD/YYYY format"
                            persistent-hint
                            prepend-icon="event"
                            v-on="on"
                            :required="fieldDefinitions.StartDate.required"
                            :disabled="readonly"
                          >
                            <v-tooltip slot="append" bottom>
                              <v-icon light medium slot="activator">info</v-icon>
                              <span>{{ fieldDefinitions.StartDate.description }}</span>
                            </v-tooltip>
                          </v-text-field>
                        </template>
                        <v-date-picker
                          v-model="startDate"
                          @input="fieldDefinitions.StartDate.menu = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-flex>
                    <v-flex xs3 sm3 md3>
                      <v-menu
                        v-model="fieldDefinitions.EndDate.menu"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        lazy
                        transition="scale-transition"
                        offset-y
                        full-width
                        max-width="290px"
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            :id="fieldDefinitions.EndDate.id"
                            v-model="endDateFormatted"
                            :label="fieldDefinitions.EndDate.label"
                            hint="MM/DD/YYYY format"
                            persistentHint
                            prependIcon="event"
                            v-on="on"
                            :required="fieldDefinitions.EndDate.required"
                            :disabled="readonly"
                          >
                            <v-tooltip slot="append" bottom>
                              <v-icon light medium slot="activator">info</v-icon>
                              <span>{{ fieldDefinitions.EndDate.description }}</span>
                            </v-tooltip>
                          </v-text-field>
                        </template>
                        <v-date-picker
                          v-model="endDate"
                          @input="fieldDefinitions.EndDate.menu = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-flex>
                    <v-flex xs12 sm12 md12>
                      <v-textarea
                        v-model="fieldDefinitions.Description.selectedValue"
                        :rules="fieldDefinitions.Description.rules"
                        :id="fieldDefinitions.Description.id"
                        :label="fieldDefinitions.Description.label"
                        :required="fieldDefinitions.Description.required"
                        :placeholder="fieldDefinitions.Description.placeholder"
                        :type="fieldDefinitions.Description.type"
                        :max-length="fieldDefinitions.Description.maxLength"
                        :counter="fieldDefinitions.Description.maxLength"
                        :readonly="readonly"
                        :clearable="clearable"
                        auto-grow
                        outline
                        rows="2"
                      >
                        <v-tooltip slot="prepend" bottom>
                          <v-icon light medium slot="activator">info</v-icon>
                          <span>{{ fieldDefinitions.Description.description }}</span>
                        </v-tooltip>
                      </v-textarea>
                    </v-flex>
                    <v-flex xs6 sm6 md6>
                      <v-text-field
                        v-model="fieldDefinitions.ContractNumber.selectedValue"
                        :rules="fieldDefinitions.ContractNumber.rules"
                        :id="fieldDefinitions.ContractNumber.id"
                        :label="fieldDefinitions.ContractNumber.label"
                        :required="fieldDefinitions.ContractNumber.required"
                        :placeholder="fieldDefinitions.ContractNumber.placeholder"
                        :type="fieldDefinitions.ContractNumber.type"
                        :max-length="fieldDefinitions.ContractNumber.maxLength"
                        :counter="fieldDefinitions.ContractNumber.maxLength"
                        :readonly="readonly"
                        :clearable="clearable"
                      >
                        <v-tooltip slot="prepend" bottom>
                          <v-icon light medium slot="activator">info</v-icon>
                          <span>{{ fieldDefinitions.ContractNumber.description }}</span>
                        </v-tooltip>
                      </v-text-field>
                    </v-flex>
                    <v-flex xs6 sm6 md6>
                      <v-text-field
                        v-model="fieldDefinitions.VendorName.selectedValue"
                        :rules="fieldDefinitions.VendorName.rules"
                        :id="fieldDefinitions.VendorName.id"
                        :label="fieldDefinitions.VendorName.label"
                        :required="fieldDefinitions.VendorName.required"
                        :placeholder="fieldDefinitions.VendorName.placeholder"
                        :type="fieldDefinitions.VendorName.type"
                        :max-length="fieldDefinitions.VendorName.maxLength"
                        :counter="fieldDefinitions.VendorName.maxLength"
                        :readonly="readonly"
                        :clearable="clearable"
                      >
                        <v-tooltip slot="prepend" bottom>
                          <v-icon light medium slot="activator">info</v-icon>
                          <span>{{ fieldDefinitions.VendorName.description }}</span>
                        </v-tooltip>
                      </v-text-field>
                    </v-flex>
                    <v-flex xs3 sm3 md3>
                      <v-select
                        v-model="fieldDefinitions.SCRM.selectedValue"
                        :rules="fieldDefinitions.SCRM.rules"
                        :id="fieldDefinitions.SCRM.id"
                        :label="fieldDefinitions.SCRM.label"
                        :required="fieldDefinitions.SCRM.required"
                        :type="fieldDefinitions.SCRM.type"
                        :items="fieldDefinitions.SCRM.choices"
                        :readonly="readonly"
                        outline
                      >
                        <v-tooltip slot="prepend" bottom>
                          <v-icon light medium slot="activator">info</v-icon>
                          <span>{{ fieldDefinitions.SCRM.description }}</span>
                        </v-tooltip>
                      </v-select>
                    </v-flex>
                    <v-flex xs3 sm3 md3>
                      <v-select
                        v-model="fieldDefinitions.Sole_x0020_Source.selectedValue"
                        :rules="fieldDefinitions.Sole_x0020_Source.rules"
                        :id="fieldDefinitions.Sole_x0020_Source.id"
                        :label="fieldDefinitions.Sole_x0020_Source.label"
                        :required="fieldDefinitions.Sole_x0020_Source.required"
                        :type="fieldDefinitions.Sole_x0020_Source.type"
                        :items="fieldDefinitions.Sole_x0020_Source.choices"
                        :readonly="readonly"
                        outline
                      >
                        <v-tooltip slot="prepend" bottom>
                          <v-icon light medium slot="activator">info</v-icon>
                          <span>{{ fieldDefinitions.Sole_x0020_Source.description }}</span>
                        </v-tooltip>
                      </v-select>
                    </v-flex>
                    <v-flex xs6 sm6 md6>
                      <v-select
                        v-model="fieldDefinitions.EquipmentLocationId.selectedValue"
                        :rules="fieldDefinitions.EquipmentLocationId.rules"
                        :id="fieldDefinitions.EquipmentLocationId.id"
                        :label="fieldDefinitions.EquipmentLocationId.label"
                        :required="fieldDefinitions.EquipmentLocationId.required"
                        :type="fieldDefinitions.EquipmentLocationId.type"
                        :readonly="readonly"
                        :items="equipmentLocations"
                        item-text="Title"
                        item-value="Id"
                        outline
                      >
                        <v-tooltip slot="prepend" bottom>
                          <v-icon light medium slot="activator">info</v-icon>
                          <span>{{ fieldDefinitions.EquipmentLocationId.description }}</span>
                        </v-tooltip>
                      </v-select>
                    </v-flex>

                    <v-flex xs3 sm3 md3>
                      <v-text-field
                        v-model="fieldDefinitions.ProcurementLabor.selectedValue"
                        :rules="fieldDefinitions.ProcurementLabor.rules"
                        :required="fieldDefinitions.ProcurementLabor.required"
                        :id="fieldDefinitions.ProcurementLabor.id"
                        :label="fieldDefinitions.ProcurementLabor.label"
                        :type="fieldDefinitions.ProcurementLabor.type"
                        :readonly="readonly"
                        value="0"
                        suffix="%"
                      >
                        <v-tooltip slot="prepend" bottom>
                          <v-icon light medium slot="activator">info</v-icon>
                          <span>{{ fieldDefinitions.ProcurementLabor.description }}</span>
                        </v-tooltip>
                      </v-text-field>
                    </v-flex>
                    <v-flex xs3 sm3 md3>
                      <v-text-field
                        v-model="fieldDefinitions.ProcurementEquipment.selectedValue"
                        :rules="fieldDefinitions.ProcurementEquipment.rules"
                        :required="fieldDefinitions.ProcurementEquipment.required"
                        :id="fieldDefinitions.ProcurementEquipment.id"
                        :label="fieldDefinitions.ProcurementEquipment.label"
                        :type="fieldDefinitions.ProcurementEquipment.type"
                        :readonly="readonly"
                        value="0"
                        suffix="%"
                      >
                        <v-tooltip slot="prepend" bottom>
                          <v-icon light medium slot="activator">info</v-icon>
                          <span>{{ fieldDefinitions.ProcurementEquipment.description }}</span>
                        </v-tooltip>
                      </v-text-field>
                    </v-flex>
                    <v-flex xs3 sm3 md3>
                      <v-text-field
                        v-model="fieldDefinitions.ProcurementMaintenance.selectedValue"
                        :rules="fieldDefinitions.ProcurementMaintenance.rules"
                        :required="fieldDefinitions.ProcurementMaintenance.required"
                        :id="fieldDefinitions.ProcurementMaintenance.id"
                        :label="fieldDefinitions.ProcurementMaintenance.label"
                        :type="fieldDefinitions.ProcurementMaintenance.type"
                        :readonly="readonly"
                        value="0"
                        suffix="%"
                      >
                        <v-tooltip slot="prepend" bottom>
                          <v-icon light medium slot="activator">info</v-icon>
                          <span>{{ fieldDefinitions.ProcurementMaintenance.description }}</span>
                        </v-tooltip>
                      </v-text-field>
                    </v-flex>
                    <v-flex xs3 sm3 md3>
                      <v-text-field
                        v-model="fieldDefinitions.ProcurementOther.selectedValue"
                        :rules="fieldDefinitions.ProcurementOther.rules"
                        :required="fieldDefinitions.ProcurementOther.required"
                        :id="fieldDefinitions.ProcurementOther.id"
                        :label="fieldDefinitions.ProcurementOther.label"
                        :type="fieldDefinitions.ProcurementOther.type"
                        :readonly="readonly"
                        value="0"
                        suffix="%"
                      >
                        <v-tooltip slot="prepend" bottom>
                          <v-icon light medium slot="activator">info</v-icon>
                          <span>{{ fieldDefinitions.ProcurementOther.description }}</span>
                        </v-tooltip>
                      </v-text-field>
                    </v-flex>

                    <v-flex xs12 sm12 md12>
                      <v-textarea
                        v-model="fieldDefinitions.OtherRelevantInformation.selectedValue"
                        :rules="fieldDefinitions.OtherRelevantInformation.rules"
                        :id="fieldDefinitions.OtherRelevantInformation.id"
                        :label="fieldDefinitions.OtherRelevantInformation.label"
                        :required="fieldDefinitions.OtherRelevantInformation.required"
                        :placeholder="fieldDefinitions.OtherRelevantInformation.placeholder"
                        :type="fieldDefinitions.OtherRelevantInformation.type"
                        :max-length="fieldDefinitions.OtherRelevantInformation.maxLength"
                        :counter="fieldDefinitions.OtherRelevantInformation.maxLength"
                        :readonly="readonly"
                        :clearable="clearable"
                        auto-grow
                        outline
                        rows="2"
                      >
                        <v-tooltip slot="prepend" bottom>
                          <v-icon light medium slot="activator">info</v-icon>
                          <span>{{ fieldDefinitions.OtherRelevantInformation.description }}</span>
                        </v-tooltip>
                      </v-textarea>
                    </v-flex>
                  </v-layout>
                </v-container>
                <v-btn flat @click.native="step = 1">Previous</v-btn>
                <v-btn
                  :disabled="!valid"
                  :loading="loading"
                  outline
                  color="primary"
                  @click.prevent="save"
                >
                  Save
                  <template v-slot:loader>
                    <span class="custom-loader">
                      <v-icon light>cached</v-icon>
                    </span>
                  </template>
                </v-btn>
                <v-btn
                  :disabled="!valid"
                  :loading="loading"
                  class="white--text"
                  color="primary"
                  @click.prevent="submit"
                >
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

    data: function (vm) {
        return {
            step: 1,
            valid: true,
            loading: false,
            dialog: true,
            readonly: false,
            clearable: true,
            snackbar: false,
            submissionType: null,
            fieldDefinitions: {
                Title: {
                    id: null,
                    selectedValue: null,
                    description: null,
                    label: null,
                    maxLength: null,
                    required: null,
                    placeholder: null,
                    type: null,
                    choices: [],
                    rules: []
                },
                ComponentId: {
                    id: null,
                    selectedValue: null,
                    description: null,
                    label: null,
                    maxLength: null,
                    required: null,
                    placeholder: null,
                    type: null,
                    choices: [],
                    rules: []
                },
                ITInvestmentNameId: {
                    id: null,
                    selectedValue: null,
                    description: null,
                    label: null,
                    maxLength: null,
                    required: null,
                    placeholder: null,
                    type: null,
                    choices: [],
                    rules: []
                },
                SharedITSolution: {
                    id: null,
                    selectedValue: null,
                    description: null,
                    label: null,
                    maxLength: null,
                    required: null,
                    placeholder: null,
                    type: null,
                    choices: [],
                    rules: []
                },
                SystemNameId: {
                    id: null,
                    selectedValue: null,
                    description: null,
                    label: null,
                    maxLength: null,
                    required: null,
                    placeholder: null,
                    type: null,
                    choices: [],
                    rules: []
                },
                SystemStatusId: {
                    id: null,
                    selectedValue: null,
                    description: null,
                    label: null,
                    maxLength: null,
                    required: null,
                    placeholder: null,
                    type: null,
                    choices: [],
                    rules: []
                },
                ITServiceTypeId: {
                    id: null,
                    selectedValue: null,
                    description: null,
                    label: null,
                    maxLength: null,
                    required: null,
                    placeholder: null,
                    type: null,
                    choices: [],
                    rules: []
                },
                ITServiceId: {
                    id: null,
                    selectedValue: null,
                    description: null,
                    label: null,
                    maxLength: null,
                    required: null,
                    placeholder: null,
                    type: null,
                    choices: [],
                    rules: []
                },
                ProcurementAction: {
                    id: null,
                    selectedValue: null,
                    description: null,
                    label: null,
                    maxLength: null,
                    required: null,
                    placeholder: null,
                    type: null,
                    choices: [],
                    rules: []
                },
                AcquisitionVehicle: {
                    id: null,
                    selectedValue: null,
                    description: null,
                    label: null,
                    maxLength: null,
                    required: null,
                    placeholder: null,
                    type: null,
                    choices: [],
                    rules: []
                },
                ProcurementActionValue: {
                    id: null,
                    selectedValue: null,
                    description: null,
                    label: null,
                    maxLength: null,
                    required: null,
                    placeholder: null,
                    type: null,
                    choices: [],
                    rules: []
                },
                OverallProjectCost: {
                    id: null,
                    selectedValue: null,
                    description: null,
                    label: null,
                    maxLength: null,
                    required: null,
                    placeholder: null,
                    type: null,
                    choices: [],
                    rules: []
                },
                TargetDate: {
                    id: null,
                    selectedValue: null,
                    description: null,
                    label: null,
                    maxLength: null,
                    required: null,
                    placeholder: null,
                    type: null,
                    choices: [],
                    rules: [],
                    hint: "MM/DD/YYYY format",
                    persistentHint: true,
                    prependIcon: "event",
                    date: new Date().toISOString().substr(0, 10),
                    input: false
                },
                StartDate: {
                    id: null,
                    selectedValue: null,
                    description: null,
                    label: null,
                    maxLength: null,
                    required: null,
                    placeholder: null,
                    type: null,
                    choices: [],
                    rules: [],
                    hint: "MM/DD/YYYY format",
                    persistentHint: true,
                    prependIcon: "event",
                    date: new Date().toISOString().substr(0, 10),
                    input: false
                },
                EndDate: {
                    id: null,
                    selectedValue: null,
                    description: null,
                    label: null,
                    maxLength: null,
                    required: null,
                    placeholder: null,
                    type: null,
                    choices: [],
                    rules: [],
                    hint: "MM/DD/YYYY format",
                    persistentHint: true,
                    prependIcon: "event",
                    date: new Date().toISOString().substr(0, 10),
                    input: false
                },
                Description: {
                    id: null,
                    selectedValue: null,
                    description: null,
                    label: null,
                    maxLength: null,
                    required: null,
                    placeholder: null,
                    type: null,
                    choices: [],
                    rules: []
                },
                ContractNumber: {
                    id: null,
                    selectedValue: null,
                    description: null,
                    label: null,
                    maxLength: null,
                    required: null,
                    placeholder: null,
                    type: null,
                    choices: [],
                    rules: []
                },
                VendorName: {
                    id: null,
                    selectedValue: null,
                    description: null,
                    label: null,
                    maxLength: null,
                    required: null,
                    placeholder: null,
                    type: null,
                    choices: [],
                    rules: []
                },
                SCRM: {
                    id: null,
                    selectedValue: null,
                    description: null,
                    label: null,
                    maxLength: null,
                    required: null,
                    placeholder: null,
                    type: null,
                    choices: [],
                    rules: []
                },
                Sole_x0020_Source: {
                    id: null,
                    selectedValue: null,
                    description: null,
                    label: null,
                    maxLength: null,
                    required: null,
                    placeholder: null,
                    type: null,
                    choices: [],
                    rules: []
                },
                EquipmentLocationId: {
                    id: null,
                    selectedValue: null,
                    description: null,
                    label: null,
                    maxLength: null,
                    required: null,
                    placeholder: null,
                    type: null,
                    choices: [],
                    rules: []
                },
                ProcurementLabor: {
                    id: null,
                    selectedValue: null,
                    description: null,
                    label: null,
                    maxLength: null,
                    required: null,
                    placeholder: null,
                    type: null,
                    choices: [],
                    rules: []
                },
                ProcurementEquipment: {
                    id: null,
                    selectedValue: null,
                    description: null,
                    label: null,
                    maxLength: null,
                    required: null,
                    placeholder: null,
                    type: null,
                    choices: [],
                    rules: []
                },
                ProcurementMaintenance: {
                    id: null,
                    selectedValue: null,
                    description: null,
                    label: null,
                    maxLength: null,
                    required: null,
                    placeholder: null,
                    type: null,
                    choices: [],
                    rules: []
                },
                ProcurementOther: {
                    id: null,
                    selectedValue: null,
                    description: null,
                    label: null,
                    maxLength: null,
                    required: null,
                    placeholder: null,
                    type: null,
                    choices: [],
                    rules: []
                },
                OtherRelevantInformation: {
                    id: null,
                    selectedValue: null,
                    description: null,
                    label: null,
                    maxLength: null,
                    required: null,
                    placeholder: null,
                    type: null,
                    choices: [],
                    rules: []
                }
            },
            requestFields: [],
            components: [],
            investments: [],
            systems: [],
            systemStatuses: [],
            services: [],
            serviceTypes: [],
            equipmentLocations: [],
            projectCost: 0,
            projectCostFormatted: vm.formatProjectCost(0),
            targetDate: new Date().toISOString().substr(0, 10),
            startDate: new Date().toISOString().substr(0, 10),
            endDate: new Date().toISOString().substr(0, 10),
            targetDateFormatted: vm.formatDate(
                new Date().toISOString().substr(0, 10)
            ),
            startDateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
            endDateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10))
        };
    },

    async created() {
        this.fetchData();
    },

    // mounted: {},

    computed: {
        computedDateFormatted: function () {
            return this.formatDate(this.date);
        },

        filteredInvestments: function () {
            let that = this;
            let options = this.investments;
            return options.filter(function (i) {
                i.ComponentId == that.fieldDefinitions.ComponentId.selectedValue;
            });
        },

        filteredSystems: function () {
            let that = this;
            let options = this.systems;
            return options.filter(function (i) {
                i.ComponentId == that.fieldDefinitions.ComponentId.selectedValue;
            });
        },

        filteredSystemStatuses: function () {
            let that = this;
            let options = this.systemStatuses;
            return options.filter(function (i) {
                i.Id == that.fieldDefinitions.SystemNameId.selectedValue;
            });
        },

        filteredServices: function () {
            let that = this;
            let options = this.services;
            return options.filter(function (i) {
                i.ITServiceTypeId == that.fieldDefinitions.ITServiceTypeId.selectedValue;
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
                                this.fieldDefinitions[
                                    fieldId
                                ].selectedValue = itemFormattedValue;
                                break;
                            default:
                                itemFormattedValue = itemValue;
                                this.fieldDefinitions[fieldId].selectedValue = itemFormattedValue;
                        }
                    } else if (itemValue !== null && this.pageName === "Submitted Forecasts") {
                        switch (fieldId) {
                            case "KeyTechnologies":
                            case "Probability":
                            case "isContract":
                                break;
                            default:
                                itemFormattedValue = itemValue;
                                this.fieldDefinitions[fieldId].selectedValue = itemFormattedValue;
                        }
                    }

                }
            }
        }
    },

    methods: {
        //TODO: incorporate both Forecasts and Acquisition Requests field definitions
        getFields: function () {
            return axios.get("Request Fields.json", {}).then(function (response) {
                let that = this;
                let requestFields = response.data.value;

                function getChoices(text) {
                    let parser = new DOMParser();
                    let xmlDoc = parser.parseFromString(text, "text/xml");
                    let htmlColl = xmlDoc.getElementsByTagName("CHOICES")[0].children;
                    let htmlArr = Array.prototype.slice.call(htmlColl);

                    return htmlArr.map(function(c) { c.textContent; });
                }

                let fieldDefinitions = {};

                // `requestFields` should be a parameter referring to either Forecast or Acquisition Request field definitions
                requestFields.filter(function (f) {
                    let typeAsString = f.TypeAsString.toLowerCase();
                    let required = f.Required;
                    let defaultValue =
                        typeAsString == "nuumber" ?
                        parseInt(f.DefaultValue).toString() :
                        f.DefaultValue;

                    let choiceArr =
                        typeAsString == "choice" ? getChoices(f.SchemaXml) : null;
                    let fieldId =
                        typeAsString == "lookup" ? f.InternalName + "Id" : f.InternalName;

                    let dataType = null;

                    if (typeAsString == "datetime") {
                        dataType = "date";
                    } else if (typeAsString == "currency" || typeAsString == "lookup") {
                        dataType = "number";
                    } else if (typeAsString == "note" || typeAsString == "choice") {
                        dataType = "text";
                    } else {
                        dataType = typeAsString;
                    }

                    let rules = required ? [
                        function (v) {
                            v !== null ||
                                "Please " +
                                f.Description.charAt(0).toLowerCase() +
                                f.Description.substring(1);
                        }
                    ] : [];

                    // if (f.MaxLength) rules.push(v => (v && v.length <= f.MaxLength) || "Your entry must not have more than " + f.MaxLength +  " characters");
                    // if (f.TypeAsString === "Text") {
                    //   rules.push((v => (v && v.length >= 5) || "Your entry for this " + f.Title + " field must contain 6 or more characters"));
                    // } else if (f.TypeAsString === "Currency") {
                    //   f.TypeAsString = "Number";
                    // }

                    fieldDefinitions[fieldId] = {
                        id: fieldId,
                        selectedValue: defaultValue,
                        description: f.Description,
                        label: f.Title,
                        type: dataType,
                        choices: choiceArr,
                        required: required,
                        maxLength: f.MaxLength,
                        placeholder: f.Description,
                        rules: rules
                    };
                });
                this.fieldDefinitions = fieldDefinitions;
            });
        },

        getComponents: function() {
            let endpoint = this.vuePageContextInfo.siteAbsoluteUrl + this.vuePageContextInfo.webServerRelativeUrl + "/SiteAssets/data/" + "Components.json";
            return axios.get(endpoint, {}).then(function(response) {
                this.components = response.data.value;
            });
        },

        getInvesmtments: function() {
            return axios.get("Investments.json", {}).then(function(response) {
                this.investments = response.data.value;
            });
        },

        getSystems() {
            return axios.get("CSAM Systems.json", {}).then(function(response) {
                this.systems = response.data.value;
                this.systemStatuses = response.data.value;
            });
        },

        getServices() {
            return axios.get("IT Services.json", {}).then(function(response) {
                this.services = response.data.value;
            });
        },

        getServiceTypes() {
            return axios.get("IT Service Types.json", {}).then(function(response) {
                this.serviceTypes = response.data.value;
            });
        },

        getEquipmentLocations() {
            return axios.get("Equipment Locations.json", {}).then(function(response) {
                this.equipmentLocations = response.data.value;
            });
        },

        async fetchData() {
            this.loading = true;
            try {
                await Promise.all([
                    this.getFields(),
                    this.getComponents(),
                    this.getInvesmtments(),
                    this.getSystems(),
                    this.getServices(),
                    this.getServiceTypes(),
                    this.getEquipmentLocations()
                ]);
            } catch (error) {
                this.errormsg = error.message;
            } finally {
                this.loading = false;
            }
        },

        formatProjectCost: function(val) {
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

        formatDate: function(date) {
            if (!date) return null;

            const [year, month, day] = date.split("-");
            return `${month}/${day}/${year}`;
        },

        parseDate(date) {
            if (!date) return null;

            const [month, day, year] = date.split("/");
            return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
        },

        submit: function() {
            this.submission("Submitted");
        },

        save: function() {
            this.submission("Saved");
        },

        submission: function(submissionType) {
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