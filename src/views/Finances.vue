<template lang="pug">
v-container(fluid)
  v-content
    v-container(fluid)
      v-toolbar
        v-toolbar-title(
          v-text="routeName"
          class="text-capitalize"
        )
        v-spacer
        v-btn(
          @click="refreshData"
          color="primary"
        ) Refresh
        form-new
      //v-scale-transition(mode="out-in")
      v-scroll-y-transition(mode="out-in")
        router-view
      p One-time expenses go in transactions(href)
      p recurring expenses go in (subscriptions or liabilities?)
  v-bottom-navigation(
    app
    v-model="bottomNav"
    :input-value="showNav"
    grow
  )
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
import FormNew from '@/components/finances/FormNew.vue'

export default {
  name: 'finances',
  components: {
    FormNew
  },
  props: {
    source: String,
  },
  data: () => ({
    showNav: false,
    bottomNav:null,
  }),
  computed: {
    routeName: function() {
      const x = this.$route.name;
      return x.replace("finances", "")
    }
  },
  created: function () {
  },
  mounted () {
    setTimeout(()=>{
      this.showNav = true;
    }, 300);
  },
  beforeDestroy() {
    this.showNav = false; 
  },
  methods: {
    refreshData: function() {
      let r = this.routeName;
      let q;
      if (r=='accounts') {
        q = 'account'
      }
      if (r=='transactions') {
        q = 'transaction'
      }
      this.$store.dispatch('getFinancialData', q);
      //this.$store.dispatch('getFinancialData', 'account');
    }
  }
}

</script>

