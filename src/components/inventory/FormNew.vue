<template lang="pug">
//-v-content(fluid)
v-container
    v-dialog(
        v-model="dialog"
        fullscreen 
        hide-overlay 
        transition="dialog-bottom-transition"
    )
        template(v-slot:activator="{ on }")
            v-btn(
                block 
                small 
                color="primary" 
                v-on="on"
                @click.stop="openForm()"
            ) New
        v-card
            v-toolbar(color="secondary" class="text--secondary")
                v-btn(icon @click="dialog = false")
                    v-icon mdi-close
                v-toolbar-title(class="headline") New inventory entry
                v-spacer
                v-toolbar-items
                    v-btn(color="error" text @click="dialog = false") Close
                    v-btn(color="primary" text @click="insertNewEntry") Save
                    v-btn(color="info" text @click="saveAndInsertNew") Save and insert new
            //-v-card-title
                span(class="headline") Create new
                v-spacer
                v-btn(color="error" text @click="dialog = false") Close
                v-btn(color="primary" text @click="insertNewEntry") Save
            v-card-text
                v-container
                    v-row
                        form-textfield(
                            v-model="newEntry.title" 
                            label="Title/Name"
                        )
                        form-textfield(
                            v-model="newEntry.valueUpdatedDate" 
                            label="Value updated date"
                        )
                        form-textfield(
                            v-model="newEntry.description" 
                            label="Description"
                        )
                        form-numberfield(
                            v-model="newEntry.value"
                            label="Value"
                        )
                        form-numberfield(
                            v-model="newEntry.price"
                            label="Price"
                        )
                        form-numberfield(
                            v-model="newEntry.quantity"
                            label="Quantity"
                        )
                        //quantity
            v-card-actions
                v-spacer
                v-btn(color="error" text @click="dialog = false") Close
                v-btn(color="primary" text @click="insertNewEntry") Save
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
        //fab: false,
        dialog: false,
        saveAndInsert: false,
        /*
        formType: 'account',
        formTypes: [
            { type: 'account', icon: 'mdi-bank' },
            { type: 'transaction', icon: 'mdi-transfer' },
            //{ type: 'budget', icon: 'mdi-transfer' },
            { type: 'income/expense', icon: 'mdi-finance' },
        ],
        */
        newEntry: {
        },
        currencies: []
    }),
    computed: {
        /*
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
        */
    },
    created () {
        this.resetForm()
    },
    methods: {
        openForm: function () {
            //this.$store.commit('resetForm')
            //this.resetForm()
            this.dialog = true
        },
        saveAndInsertNew: function () {
            this.saveAndInsert = true
            this.insertNewEntry()
        },
        resetForm: function () {
            this.newEntry = {
                // common properties/fields
                description: null,
                value: 0.00,
                valueUpdatedDate: null,
                price: 0.00,
                title: '',
                quantity: 0,
            }
        },
        insertNewEntry: async function () {
            // ADD REALM inventory
            var now = new Date().toISOString();
            let n = this.newEntry;

            let j = {
                _id: this.generateUUID(),
                realm: 'inventory',
                created: now,
                quantity: parseInt(n.quantity),
                value: Number(n.value),
                price: Number(n.price)
            };
            const propertyArray = [
                'description',
                'valueUpdatedDate',
                'title',
            ];

            //propertyArray.push();

            propertyArray.forEach(x => {
                j[x] = n[x]
            });

            console.log(j)
        }
        /*
        insertNewEntry: async function () {

            if ( ["income","expense"].includes(n.type) ) {
                propertyArray.push(
                    "name",
                    "institution",
                    "amount"
                )
            }

            if (this.formType == 'account') {
                propertyArray.push(
                    "name",
                    "institution",
                    "number",
                    "balance",
                    "active",
                    "balanceUpdatedDate",
                    "currency"
                )
            }

            if (n.type == 'transaction') {
                propertyArray.push(
                    "sender",
                    "recipient",
                    "amount"
                )
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
                //this.$store.dispatch('getFinancialData', this.formType);
                if (this.saveAndInsert) {
                    this.saveAndInsert = false
                    setTimeout(()=>{
                        this.openForm(this.formType)
                    }, 600);
                }
            }
        }
        */
    }
}

</script>