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
                        // Transaction specific
                        v-row(v-if="formType == 'transaction'")
                            v-col(cols="6")
                                v-row
                                    v-col(cols="6")
                                        v-text-field(
                                            v-model="newEntry.sender"
                                            label="Sender"
                                            hint="What account sent the dough"
                                        )
                                    v-col(cols="6")
                                        v-text-field(
                                            v-model="newEntry.recipient"
                                            label="Recipient"
                                            hint="What account received the dough"
                                        )
                                    v-col(cols="4")
                                        v-text-field(
                                            v-model="amountParser"
                                            label="Amount transferred"
                                            hint="Enter a positive value in your local currency"
                                            type="number"
                                        )
                            v-col(cols="12" md="6")
                                p Transaction date
                                v-date-picker(
                                    v-model="newEntry.date"
                                    full-width
                                    landscape
                                )
                        // Account specific
                        v-row(v-if="formType == 'account'")
                            v-col(cols="4")
                                v-text-field(
                                    v-model="newEntry.name"
                                    label="Account name"
                                    hint="Label distinguishing this account from the rest"
                                )
                            v-col(cols="4")
                                v-text-field(
                                    v-model="newEntry.number"
                                    label="Account number"
                                    hint="Unique account identifier given by the institution"
                                )
                            v-col(cols="4")
                                v-text-field(
                                    v-model="newEntry.institution"
                                    label="Institution/Company"
                                    hint="The financial institution name the bank account belongs to"
                                )
                            v-col(cols="3")
                                v-text-field(
                                    v-model="balanceParser"
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
                            v-col(cols="3")
                                v-text-field(
                                    v-model="newEntry.balanceUpdatedDate"
                                    label="Balance updated date"
                                    hint="When was balance updated? Format: YYYY-MM-DD"
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
                                    :items="accountTypeList"
                                    label="Account type"
                                )
                            v-col(cols="6")
                                v-select(
                                    v-model="newEntry.category"
                                    :items="categoryList"
                                    label="Category"
                                )
                            v-col(cols="12")
                                v-textarea(
                                    v-model="newEntry.description"
                                    label="Description"
                                    rows="3"
                                    filled
                                    dense
                                )
            v-card-actions
                v-container
                    v-btn(color="error" text @click="dialog = false") Close
                    v-btn(color="primary" text @click="insertNewEntry") Save
                    v-btn(color="info" text @click="saveAndInsertNew") Save and insert new
</template>

<script>
import newDocumentMixin from '@/mixins/newDocumentMixin'

export default {
    name: 'formNew',
    mixins: [newDocumentMixin],
    data: () => ({
        fab: false,
        dialog: false,
        saveAndInsert: false,
        formType: 'account',
        formTypes: [
            { type: 'account', icon: 'mdi-bank' },
            { type: 'transaction', icon: 'mdi-transfer' },
        ],
        newEntry: {
        },
        currencies: []
    }),
    computed: {
        amountParser: {
            get () {
                return this.newEntry.amount
            },
            set (val) {
                this.newEntry.amount = Number(val);
            }
        },
        balanceParser: {
            get () {
                return this.newEntry.balance
            },
            set (val) {
                this.newEntry.balance = Number(val);
            }
        },
        accountTypeList: function () {
            const x = this.$store.getters.financeTypes;
            return Object.keys(x["account"])
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
                realm:'finance',
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
            /*
            class Base {
                constructor(id) {
                    this._id = id;
                    this.realm = 'finance';
                    this.created = now;
                    this.description = n.description;
                    this.type = n.type; // type: {string} - The account type in the list ['none', 'bank', 'cash', 'asset', 'credit card', 'liability'] //savings?
                    this.category = n.category;
                }
            }

            class Account extends Base {
                constructor(id) {
                    super(id); // call the super class constructor and pass in the name parameter
                    this.name = n.name;
                    this.institution = n.institution;
                    this.number = n.number; //account number
                    this.balance = n.balance; // balance: {number} - The current account balance //may be calculated from currency
                    this.active = n.active;
                }
            }

            class Transaction extends Base {
                constructor(id) {
                    super(id); // call the super class constructor and pass in the name parameter
                    this.sender = n.sender;
                    this.recipient = n.recipient;
                    this.amount = n.amount;
                    //this.date = n.date;
                    this.date = new Date( n.date );
                }
            }

            const p = new Account(newID); // ReferenceError
            */

            let j = {
                _id: this.generateUUID(),
                realm: 'finance',
                type: n.type, // type: {string} - The account type in the list ['none', 'bank', 'cash', 'asset', 'credit card', 'liability'] //savings?
                created: now,
                description: n.description,
                category: n.category
            };

            if (this.formType == 'account') {
                const accArr = [
                    "name",
                    "institution",
                    "number",
                    "balance",
                    "active",
                    "balanceUpdatedDate",
                    "currency"
                ];
                accArr.forEach(x => {
                    j[x] = n[x]
                });
            }

            if (n.type == 'transaction') {
                j.sender = n.sender;
                j.recipient = n.recipient;
                j.amount = n.amount;
                j.date = new Date( n.date );
            }

            let result = await this.$store.dispatch(
                'insertDocument', { doc: j, snackbarText:`Added ${j.type} entry`}
                );
            if (result.ok) {
                this.dialog = false;
                //this.$store.dispatch('getFinancialData', this.formType);
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