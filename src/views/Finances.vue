<template lang="pug">
  v-content
    //-v-container(fluid)
    v-toolbar
      //- v-if="$vuetify.breakpoint.mdAndDown"
      v-tabs(
        v-model="tab"
        center-active
        icons-and-text
        show-arrows
        )
        v-tab(
          v-for="link in links"
          :key="link.name"
          :to="link.route"
          ) {{ link.name }}
          v-icon {{ link.icon }}
          //-span 
          //-span(v-if="link.route == tab") {{ link.name }}
      //-v-spacer
      //- TODO - New finance entry needs placement
    v-container(fluid)
      v-scroll-y-transition(mode="out-in")
        router-view
        //-v-toolbar-title(
          v-text="routeName"
          class="text-capitalize"
          )
        //-v-btn(
          @click="refreshData"
          color="primary"
          ) Refresh
        //-v-scale-transition(mode="out-in")
  //-v-bottom-navigation(
    app
    :input-value="showNav"
    grow
    )
    v-spacer
    form-new
    v-spacer
  //-v-bottom-navigation(
    app
    v-model="bottomNav"
    :input-value="showNav"
    grow
    )
    //- Bottom navigation -> mobile only
    v-btn(value="financesOverview" to="/finances/overview")
      span Overview
      v-icon mdi-poll
    v-btn(value="budget" to="/finances/budget")
      span Budget
      v-icon mdi-finance
    v-btn(value="transactions"  to="/finances/transactions")
      span Transactions
      v-icon mdi-transfer
    v-btn(value="accounts"  to="/finances/accounts")
      span Accounts
      v-icon mdi-bank
    v-btn(value="assets"  to="/finances/assets")
      span Assets
      v-icon mdi-cash
</template>
<script>

export default {
  name: 'Finances',
  data: () => ({
    tab: null,
    links: [
      {
        name: 'Overview',
        route: '/finances/overview',
        icon: 'mdi-poll',
      },
      {
        name: 'Budget',
        route: '/finances/budget',
        icon: 'mdi-finance',
      },
      {
        name: 'Transactions',
        route: '/finances/transactions',
        icon: 'mdi-transfer',
      },
      {
        name: 'Accounts',
        route: '/finances/accounts',
        icon: 'mdi-bank',
      },
      {
        name: 'Assets',
        route: '/finances/assets',
        icon: 'mdi-cash',
      },
    ]
  }),
  computed: {
    routeName: function() {
      const x = this.$route.name;
      return x.replace("finances", "")
    }
  },
  mounted () {
    setTimeout(()=>{
      this.showNav = true;
    }, 300);
    /* Reimplement
    this.$store.dispatch('getFinancialAggregates')
    */
  },
  beforeDestroy() {
    this.showNav = false; 
  },
  methods: {
    refreshData: function() {
      let r = this.routeName;
      //let q = r;
      if (r=='accounts') {
        r = 'account'
      }
      if (r=='transactions') {
        r = 'transaction'
      }

      if (r == 'budget') {
        this.$store.dispatch('getFinancialData', 'income')
        this.$store.dispatch('getFinancialData', 'expense')
      } else {
        this.$store.dispatch('getFinancialData', r)
      }
      //this.$store.dispatch('getFinancialData', 'account');
    }
  }
}

</script>

