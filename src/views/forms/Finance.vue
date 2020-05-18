<template lang="pug">
    v-container
        v-card(flat)
            v-card-title
                v-spacer
                submit-button(:doc="doc")
            v-card-text
                v-container
                    v-row
                        v-col(cols="12")
                            h2(class="error--text title mb-2") Work in progress - Do not use
                        v-col(cols="12")
                            h2(class="title mb-2") Entry type
                            v-chip-group(
                                v-model="formType" 
                                mandatory
                                active-class="primary--text"
                            )
                                v-chip(
                                    v-for="(ft, i) in formTypes" 
                                    :key="i" 
                                    :value="ft.type" 
                                )
                                    v-avatar(left)
                                        v-icon(v-text="ft.icon")
                                    span(
                                        v-text="ft.type"
                                        style="text-transform:capitalize;"
                                        )
                    v-row
                        //- Budget specific
                        v-row(v-if="formType == 'budget'")
                            v-col(cols="6")
                                v-row
                                    v-text-field(
                                        v-model="newEntry.name"
                                        :label="`${newEntry.type} label`"
                                        hint="Label distinguishing it from the rest"
                                    )
                                    v-text-field(
                                        v-model="newEntry.institution"
                                        label="Institution"
                                        hint="If entry relates to an institution"
                                    )

                                    v-text-field(
                                        v-model="newEntry.amount"
                                        label="Amount"
                                        type="number"
                                        hint="Enter a positive value in your local currency"
                                    )
                        //- Transaction specific
                        v-row(v-if="formType == 'transaction'")
                            v-col(cols="6")
                                v-row
                                    v-text-field(
                                        v-model="newEntry.sender"
                                        hint="What account sent the dough"
                                        label="Sender"
                                    )
                                    v-text-field(
                                        v-model="newEntry.recipient"
                                        hint="What account received the dough"
                                        label="Recipient"
                                    )
                                    v-text-field(
                                        v-model="newEntry.amount"
                                        hint="Enter a positive value in your local currency"
                                        type="number"
                                        label="Amount"
                                    )
                            v-col(cols="12" md="6")
                                p Transaction date
                                v-date-picker(
                                    v-model="newEntry.date"
                                    full-width
                                    landscape
                                )
                        //- Account specific
                        v-row(v-if="formType == 'account'")
                            v-text-field(
                                v-model="newEntry.name"
                                hint="Name distinguishing this account from the rest"
                                label="Name"
                            )
                            v-text-field(
                                v-model="newEntry.number"
                                hint="Unique account identifier given by the institution. May contain letters"
                                label="Account number"
                            )
                            v-text-field(
                                v-model="newEntry.institution"
                                hint="The financial institution/company name the bank account belongs to"
                                label="Institution/Company"
                            )
                            v-text-field(
                                v-model="newEntry.balance"
                                label="Balance"
                                type="number"
                            )
                            v-col(cols="3")
                                //-:filter="customFilter"
                                v-autocomplete(
                                    v-model="newEntry.currency"
                                    :items="this.currencies"
                                    item-text="name"
                                    item-value="code"
                                    label="Currency"
                                )
                                    template(v-slot:item="data")
                                        v-list-item-content {{ data.item.code }} - {{ data.item.name }}
                            v-text-field(
                                v-model="newEntry.balanceUpdatedDate"
                                hint="When was balance updated? Format: YYYY-MM-DD"
                                label="Balance updated date"
                            )
                            v-col(cols="3")
                                v-switch(v-model="newEntry.active" label="Active")
                        // Common properties
                        v-row
                            v-col(
                                v-if="formType != 'transaction'"
                                cols="6"
                            )
                                v-select(
                                    v-model="newEntry.type"
                                    :items="financeTypeList"
                                    :label="`${formType} type`"
                                    class="text-capitalize"
                                )
                            v-col(cols="6")
                                v-select(
                                    v-model="newEntry.category"
                                    :items="categoryList"
                                    label="Category"
                                )
                                v-textarea(
                                    v-model="newEntry.description"
                                    label="Description"
                                    rows="3"
                                    filled
                                    dense
                                )

</template>

<script>
import currencies from '@/assets/data/currencies.json'
import SubmitButton from "@/components/form/submit";

function getCurrencies() {
    //this.currencies = [];
    //const response = await fetch("/data/currencies.json");
    //const object = await response.json();
    const currencyArray = [];
    for (const property in currencies) {
    currencyArray.push({ code: property, name: currencies[property] });
    }
    return currencyArray
}

export default {
  name: "formsNewFinance",
  components: {
    SubmitButton
  },
  data: () => ({
    fab: false,
    dialog: false,
    saveAndInsert: false,
    formType: "account",
    formTypes: [
      { type: "account", icon: "mdi-bank" },
      { type: "transaction", icon: "mdi-transfer" },
      //{ type: "income/expense", icon: "mdi-finance" }
      { type: "budget", icon: "mdi-finance" }
    ],
    newEntry: {
        // common properties/fields
        finance: true,
        description: null,
        // TODO - type: null, // type: {string} - The account type in the list ['none', 'bank', 'cash', 'asset', 'credit card', 'liability'] //savings?
        type: 'transaction',
        //type: this.financeType,
        category: null,
        // type:Account specific
        name: null,
        institution: null,
        number: null, //account number
        balance: 0.0, // balance: {number} - The current account balance //may be calculated from currency?
        active: true,
        balanceUpdatedDate: null,
        currency: null,
        // type:Transaction specific
        sender: null, //from //company: (plan for lookup here)
        recipient: null, //to //company: (plan for lookup here)
        amount: 0,
        date: new Date().toISOString().substring(0, 10)
    },
  
    currencies: getCurrencies(),
  }),
  computed: {

      typeComputed: {
            get() {
                return this.formType == 'account' ? 'bank'
                    : this.formType == 'budget' ? 'expense'
                    : 'transaction';
          },
          set(value) {
              this.newEntry.type = value
          }
      },

    //financeType() {

        //this.financeType


        //if (this.formType == "account") {
        //    //n.type = "bank";
        //    return "bank"
        //} else {
        //    return 'transaction'
        //}

        //const n = this.newEntry
        //n.type = val
        //this.formType = val
        //if (this.formType == 'account') {
        //    n.type = 'bank'
        //}
        //if (this.formType == 'budget' || this.formType == 'income/expense') {
        //if (this.formType == 'budget') {
        //    n.type = 'expense'
        //    //this.formType = 'budget'
        //}

        //return this.formType == 'account' ? 'bank'
        //    : this.formType == 'budget' ? 'expense'
        //    : 'transaction';

    //},



    financeTypeList: function() {
        const x = this.$store.getters.financeTypes;
        let f = this.formType;
        //let f = this.financeType;
        //if (this.formType == "income/expense") {
        //  f = "budget";
        //}
        return Object.keys(x[f]);
    },

    categoryList: function() {
      const x = this.$store.getters.financeTypes;
      return x[this.formType][this.newEntry.type];
    },

    doc() {
        var now = new Date().toISOString();
        let n = this.newEntry;

        //const j = {...this.newEntry}

        let j = {
            finance: true,
            type: n.type, // type: {string} - The account type in the list ['none', 'bank', 'cash', 'asset', 'credit card', 'liability'] //savings?
            created: now,
            description: n.description,
            category: n.category
        };


        //type: n.type; // type: {string} - The account type in the list ['none', 'bank', 'cash', 'asset', 'credit card', 'liability'] //savings?

        const propertyArray = [];

        //if ( ["income","expense"].includes(n.type) ) {
        if (this.formType == 'budget') {
            propertyArray.push(
                "active",
                "currency",
                "amount",
                "name",
                "institution"
            );
        }

        if (this.formType == 'account') {
            propertyArray.push(
                "active",
                "currency",
                "balance",
                "name",
                "institution",
                "number",
                "balanceUpdatedDate"
            );
        }

        if (n.type == 'transaction') {
            propertyArray.push(
                "amount",
                "sender",
                "recipient"
            );
            j.date = new Date( n.date );
        }

        propertyArray.forEach(x => {
            j[x] = n[x]
        });

        return j //doc

    }

    },
  methods: {
  }
};
</script>