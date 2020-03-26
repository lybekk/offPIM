<template lang="pug">
v-content(fluid)
    v-speed-dial(
        v-model="fab"
        absolute
        right
        direction="left"
        transition="slide-y-reverse-transition"
    )
        template(v-slot:activator)
            v-btn(
                v-model="fab"
                color="primary"
                fab
            )
                v-icon(v-if="fab") mdi-close
                v-icon(v-else) mdi-plus
        v-tooltip(
          v-for="(ft, i) in formTypes" 
          top
          :key="i"
        )
            template(v-slot:activator="{ on }")
                v-btn(
                    fab
                    small
                    @click.stop="openForm(ft.type)"
                    v-on="on"
                    color="primary"
                )
                    v-icon {{ ft.icon }}
            span(
                v-text="ft.type"
                class="text-capitalize"
            )
    v-dialog(
        v-model="dialog" 
        fullscreen 
        hide-overlay 
        transition="dialog-bottom-transition"
    )
        v-card
            v-toolbar(color="secondary" class="text--secondary")
                v-btn(icon @click="dialog = false")
                    v-icon mdi-close
                v-toolbar-title(class="headline") New {{ formType }} entry
                v-spacer
                v-toolbar-items
                    v-btn(color="error" text @click="dialog = false") Close
                    v-btn(color="primary" text @click="insertNewEntry") Save
                    v-btn(color="info" text @click="saveAndInsertNew") Save and insert new
            v-card-text
                v-container
                    v-row
                        v-col(cols="12")
                    v-row
                        //- Budget specific
                        v-row(v-if="formType == 'budget'")
                            v-col(cols="6")
                                v-row
                                    form-textfield(
                                        v-model="newEntry.name"
                                        hint="Label distinguishing it from the rest"
                                        :label="`${newEntry.type} label`"
                                    )
                                    form-textfield(
                                        v-model="newEntry.institution"
                                        hint="If entry relates to an institution"
                                        label="Institution"
                                    )
                                    form-numberfield(
                                        v-model="newEntry.amount"
                                        hint="Enter a positive value in your local currency"
                                        label="Amount"
                                    )
                        //- Transaction specific
                        v-row(v-if="formType == 'transaction'")
                            v-col(cols="6")
                                v-row
                                    form-textfield(
                                        v-model="newEntry.sender"
                                        hint="What account sent the dough"
                                        label="Sender"
                                    )
                                    form-textfield(
                                        v-model="newEntry.recipient"
                                        hint="What account received the dough"
                                        label="Recipient"
                                    )
                                    form-numberfield(
                                        v-model="newEntry.amount"
                                        hint="Enter a positive value in your local currency"
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
                            form-textfield(
                                v-model="newEntry.name"
                                hint="Name distinguishing this account from the rest"
                                label="Name"
                            )
                            form-textfield(
                                v-model="newEntry.number"
                                hint="Unique account identifier given by the institution. May contain letters"
                                label="Account number"
                            )
                            form-textfield(
                                v-model="newEntry.institution"
                                hint="The financial institution/company name the bank account belongs to"
                                label="Institution/Company"
                            )
                            form-numberfield(
                                v-model="newEntry.balance"
                                label="Balance"
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
                                //:hint="`${select.state}, ${select.abbr}`"
                                    :item-text="`${code} ${name}`"
                                    :item-text="name" // search
                                    item-value="code"
                                //v-select(
                                    v-model="newEntry.currency"
                                    :items="items"
                                    item-text="state"
                                    item-value="abbr"
                                    label="Currency"
                                    persistent-hint
                                    return-object
                                    single-line
                                    )
                            form-textfield(
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
                            form-textareafield(
                                v-model="newEntry.description"
                                label="Description"
                            )
            v-card-actions
                v-container
                    v-btn(color="error" text @click="dialog = false") Close
                    v-btn(color="primary" text @click="insertNewEntry") Save
                    v-btn(color="info" text @click="saveAndInsertNew") Save and insert new
</template>

<script>
import newDocumentMixin from '@/mixins/newDocumentMixin'
import formNumberfield from '@/components/form/number'
import formTextfield from '@/components/form/text'
import formTextareafield from '@/components/form/textarea'

export default {
    name: 'formNew',
    components: {
        formNumberfield,
        formTextfield,
        formTextareafield
    },
    mixins: [newDocumentMixin],
    data: () => ({
        fab: false,
        dialog: false,
        saveAndInsert: false,
        formType: 'account',
        formTypes: [
            { type: 'account', icon: 'mdi-bank' },
            { type: 'transaction', icon: 'mdi-transfer' },
            { type: 'income/expense', icon: 'mdi-finance' },
        ],
        newEntry: {
        },
        currencies: []
    }),
    computed: {
        financeTypeList: function () {
            const x = this.$store.getters.financeTypes;
            //return Object.keys(x["account"])
            let f = this.formType;
            if (this.formType == 'income/expense') {
                f = 'budget'
            }
            return Object.keys(x[f])
            //return Object.keys(x[ this.formType ])
        },
        categoryList: function () {
            const x = this.$store.getters.financeTypes;
            return x[this.formType][this.newEntry.type]
        }
    },
    created () {
        this.resetForm()
    },
    methods: {
        saveAndInsertNew: function () {
            this.saveAndInsert = true
            this.insertNewEntry()
        },
        resetForm: function () {
            this.newEntry = {
                // common properties/fields
                //realm:'finance',
                finance: true,
                description: null,
                type: null, // type: {string} - The account type in the list ['none', 'bank', 'cash', 'asset', 'credit card', 'liability'] //savings?
                category: null,
                // type:Account specific
                name:null,
                institution:null,
                number:null, //account number
                balance: 0.00, // balance: {number} - The current account balance //may be calculated from currency?
                active: true,
                balanceUpdatedDate: null,
                currency: null,
                // type:Transaction specific
                sender: null, //from //company: (plan for lookup here)
                recipient: null, //to //company: (plan for lookup here)
                amount: 0,
                date: new Date().toISOString().substring(0,10)
            }
        },
        openForm: function (val) {
            this.resetForm()
            const n = this.newEntry
            n.type = val
            this.formType = val
            if (this.formType == 'account') {
                n.type = 'bank'
                if (this.currencies.length == 0) {
                    this.getCurrencies()
                }
            }
            if (this.formType == 'budget' || this.formType == 'income/expense') {
                n.type = 'expense'
                this.formType = 'budget'
            }
            this.dialog = true
        },
        getCurrencies: async function () {
            this.currencies = []
            const response = await fetch('/data/currencies.json')
            const object = await response.json()
            for (const property in object) {
                this.currencies.push(
                    { code: property, name: object[property] }
                )
            }
        },
        insertNewEntry: async function () {
            var now = new Date().toISOString();
            let n = this.newEntry;

           let j = {
               _id: this.generateUUID(),
                //realm: 'finance',
                finance: true,
                type: n.type, // type: {string} - The account type in the list ['none', 'bank', 'cash', 'asset', 'credit card', 'liability'] //savings?
                created: now,
                description: n.description,
                category: n.category
            };

            const propertyArray = [];

            if ( ["income","expense"].includes(n.type) ) {
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

            let result = await this.$store.dispatch(
                'insertDocument', { doc: j, snackbarText:`Added ${j.type} entry`}
                );
            if (result.ok) {
                this.dialog = false;
                if (this.saveAndInsert) {
                    this.saveAndInsert = false
                    setTimeout(()=>{
                        this.openForm(this.formType)
                    }, 600);
                }
            }
        }
    }
}

</script>