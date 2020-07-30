<template>
  <v-container>
    <v-tabs
      :vertical="$vuetify.breakpoint.mdAndUp"
      color="primary"
      center-active
    >
      <v-tab href="#tab-income">
        Income
      </v-tab>
      <v-tab href="#tab-expenses">
        Expenses
      </v-tab>
      <v-tab href="#tab-contracts">
        Contracts
      </v-tab>
      <v-tab-item
        v-for="tab in tabsIncomeExpenses"
        :id="tab.id"
        :key="tab.name"
      >
        <v-container>
          <v-card flat="flat">
            <v-card-title>
              <v-spacer />
              <v-text-field
                v-model="tab.searchModel"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
              />
            </v-card-title>
            <v-card-text>
              <v-data-iterator
                class="elevation-0"
                :items="$store.getters.getBudget( tab.name )"
                :loading="$store.getters.loaderState"
                :items-per-page="10"
                :search="tab.searchModel"
                loading-text="Looking..."
                no-data-text="None found"
              >
                <template v-slot:default="props">
                  <v-list three-line="three-line">
                    <v-list-item
                      v-for="doc in props.items"
                      :key="doc._id"
                      @click="console.log('Work in progress')"
                    >
                      <v-list-item-content>
                        <v-list-item-title
                          class="title font-weight-regular primary--text"
                          v-text="doc.name"
                        /><v-list-item-subtitle
                          class="subtitle-1"
                          v-text="doc.institution"
                        /><v-list-item-subtitle v-text="doc.description" />
                      </v-list-item-content><v-list-item-action>
                        <v-list-item-action-text
                          :class="`body-1 ${getColor(doc.amount)}--text text--accent-2`"
                          v-text="doc.amount"
                        /><v-list-item-action-text
                          class="text-capitalize"
                          v-text="doc.category"
                        />
                      </v-list-item-action>
                    </v-list-item>
                  </v-list>
                </template>
              </v-data-iterator>
            </v-card-text><br>
          </v-card>
        </v-container>
      </v-tab-item>
      <v-tab-item id="tab-contracts">
        <v-card flat="flat">
          <v-card-title>Contracts/Subscriptions/Memberships</v-card-title>
          <v-card-text>Work in progress</v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>

    <!-- 

  v-container
    v-tabs(
        :vertical="$vuetify.breakpoint.mdAndUp"
        color="primary"
        center-active
    )
        v-tab(href="#tab-income") Income
        v-tab(href="#tab-expenses") Expenses
        v-tab(href="#tab-contracts") Contracts
        v-tab-item(
          v-for="tab in tabsIncomeExpenses"
          :key="tab.name"
          :id="tab.id"
        )
          v-container
            v-card(flat)
              v-card-title
                v-spacer
                v-text-field(
                  v-model="tab.searchModel"
                  append-icon="mdi-magnify"
                  label="Search"
                  single-line
                  hide-details
                  )
              v-card-text
                v-data-iterator(
                    :items="$store.getters.getBudget( tab.name )"
                    :loading="$store.getters.loaderState"
                    
                    class="elevation-0"
                    :items-per-page="10"
                    :search="tab.searchModel"    
                    

                    loading-text="Looking..."
                    no-data-text="None found"
                )
                  template(v-slot:default="props")
                    v-list(three-line)
                      v-list-item(
                        v-for="doc in props.items"
                        :key="doc._id"
                        @click=""
                        )
                        v-list-item-content
                          //- Label/name (in dialog)
                          v-list-item-title(v-text="doc.name" class="title font-weight-regular primary--text")
                          v-list-item-subtitle(v-text="doc.institution" class="subtitle-1")
                          v-list-item-subtitle(v-text="doc.description")
                          //- TODO - Include description field in dialog
                        v-list-item-action
                          v-list-item-action-text(
                            v-text="doc.amount"
                            :class="`body-1 ${getColor(doc.amount)}--text text--accent-2`"
                            )
                          v-list-item-action-text(
                            v-text="doc.category"
                            class="text-capitalize"
                            )
                            //- Alternative
                            //-v-chip(
                              label
                              :text-color="getColor(doc.amount) + ' lighten-5'"
                              :color="getColor(doc.amount) + ' '"
                              ) { doc.amount }}
                            //-:class="body-1 error--text"
                            //-:text-color="getColor(doc.balance) + ' darken-4'"
                            //-:color="getColor(doc.balance) + ' lighten-5'"
                      //-v-divider


              br
              //-v-data-table(
                :headers="headers"
                :items="this.$store.getters.getBudget('income')"
                :items-per-page="10"
                :search="searchIncome"
                class="elevation-1"
                :loading="this.$store.getters.loaderState"
                loading-text="Looking for transactions"
                no-data-text="No transactions matching request"
                )
                //-template(v-slot:item.description="{ item }")
                  v-btn(
                    text
                    @click="openDoc(item)"
                  )
                    v-icon mdi-text
                  span(v-text="item.description")
                //-v-card-text
                    v-list
                        v-list-item
                            v-list-item-content
                                v-switch(
                                    v-model="isDarkMode" 
                                    class="ma-2" 
                                    label="Dark mode" 
                                )
        //-v-tab-item#tab-expenses
            v-card(flat)
              v-card-title Expenses (grouped)
                v-spacer
                v-text-field(
                  v-model="searchExpense"
                  append-icon="mdi-magnify"
                  label="Search"
                  single-line
                  hide-details
                )
              v-data-table(
                :headers="headers"
                :items="this.$store.getters.getBudget('expense')"
                :items-per-page="10"
                :search="searchExpense"
                class="elevation-1"
                :loading="this.$store.getters.loaderState"
                loading-text="Looking for transactions"
                no-data-text="No transactions matching request"
              )





                //-template(v-slot:item.description="{ item }")
                  v-btn(
                    text
                    @click="openDoc(item)"
                  )
                    v-icon mdi-text
                  span(v-text="item.description")
                //-v-card-text
                    v-list
                        v-subheader Browser
                        v-list-item(@click="refreshCache")
                            v-list-item-icon
                                v-icon mdi-cached
                            v-list-item-content
                                v-list-item-title Refresh cache
                                    //v-btn(
                                        color="primary"
                                        @click="refreshCache"
                                        ) Refresh cache
                                v-list-item-subtitle Useful if a new version of offPIM is available
                        v-subheader Local Database
                        database-compaction(whatdb="localDB")
                        local-database-import
        v-tab-item#tab-contracts
          v-card(flat)
            v-card-title Contracts/Subscriptions/Memberships
            v-card-text Work in progress
    //-v-content
    //-span Under construction
    //-h3 Budgeting and cash flow forecasting
    //-p recurring expenses
    //-p historical (archived)
    //-p delete or archive (in data table)
    //-pre(v-text="budgetStructureTemporary")
    //-
      Liabilities??
      budget
      type for accounts (subscriptions/memberships? services?)
-->
  </v-container>
</template>
<script>

export default {
  name: 'FinancesBudget',
  data: () => ({
    searchIncome: null,
    searchExpense: null,
    tabsIncomeExpenses: [
      {
        name: 'income',
        id: 'tab-income',
        //searchModel: 'searchIncome' // may be null?
        searchModel: null // may be null?
      },
      {
        name: 'expenses',
        id: 'tab-expenses',
        //searchModel: 'searchIncome' // may be null?
        searchModel: null // may be null?
      }
    ],

    /*
    headers: [
      { text: 'Label', value: 'name' },
      { text: 'Institution', value: 'institution' },
      { text: 'Amount', value: 'amount' },
      { text: 'Category', value: 'category' },
      { text: 'Description', value: 'description' },
    ]
    */
    
  }),
  computed: {
    /*
    budgetStructureTemporary: function () {
      const j = {
        _id: '1234-5678-91011-121314',
        //"realm": "finance" // Replace with Shcema.org
        type: 'income', //income/expense
        category: 'salary' //salary, subscription
      };
      return JSON.stringify(j, null, 2)
    }
    */
  },
  created: function () {
  },
  mounted () {
    this.$store.dispatch('getFinancialData', 'income');
    this.$store.dispatch('getFinancialData', 'expense');
  },
  beforeDestroy() {
  },
  methods: {
    getColor: function(number) {
      return (number >= 0) ? "success" : "error";
    },
  }
}


/*
                    "Bank Charges",
                    "Cable or streaming packages",
                    "Car Insurance",
                    "Car Payment",
                    "Car Repairs",
                    "Cell Phone",
                    "Clothes",
                    "Clothing, jewelry, etc.",
                    "Dining out",
                    "Electric",
                    "Entertainment",
                    "Furniture",
                    "Gardener/pool/alarm service",
                    "Gas",
                    "Gym or club memberships",
                    "Home decor items",
                    "Insurance",
                    "Internet",
                    "Misc.",
                    "Movie, concert and event tickets",
                    "Natural Gas",
                    "Other",
                    "Phone",
                    "Rent/Mortgage",
                    "School Expenses",
                    "Sewer",
                    "Special meals at home",
                    "Travel expenses",
                    "Waste Disposal",
                    "Water",
*/

</script>

