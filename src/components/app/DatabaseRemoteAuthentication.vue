<template lang="pug">
v-expansion-panels
  // this component is not in use. Kept for reference
  v-expansion-panel
    v-expansion-panel-header(v-slot="{ open }")
      v-row(no-gutters)
        v-col Authentication
        v-col(
          cols="8"
          class="text--secondary"
        )
          v-fade-transition(leave-absolute)
            span(v-if="open") Enter credentials
            v-row(
              v-else
              no-gutters
              style="width: 100%"
            )
              v-col.text-capitalize(v-text="isAuthenticated") 
              // TODO authentication process needed
    v-expansion-panel-content
      //v-container(fluid)
      div(class="text-center")
        v-card
          //v-card-title(
            class="headline grey lighten-2"
            primary-title
            ) Authentication
          v-card-text
            v-form
              v-row(dense)
                v-col(cols="12")
                  v-text-field(
                    v-model="username"
                    label="Username"
                    outlined
                    shaped
                    dense
                  )
                //v-row
                v-col(cols="12")
                  v-text-field(
                    v-model="password"
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[rules.required, rules.min]"
                    :type="show1 ? 'text' : 'password'"
                    name="pwd"
                    label="Password"
                    outlined
                    shaped
                    dense
                    @click:append="show1 = !show1"
                  )
              v-row(v-if="authMsg")
                p(class="error--text") {{ authMsg }}
          //v-divider
          v-card-actions
            v-spacer
            v-btn(
              color="primary"
              text
              @click="requestAuthCookie"
            ) Request authentication cookie
          v-divider

</template>

<script>
export default {
  name: 'DatabaseRemoteAuthentication',
  props: ['remoteDBUrl'],
  data: () => ({
    show1: false,
    authMsg: null, //?
    username: "admin",
    password: "Password",
    rules: {
      required: value => !!value || "Required.",
      min: v => v.length >= 6 || "Min 6 characters"
      //emailMatch: () => ('The email and password you entered don\'t match'),
    },
  }),
  computed: {
    isAuthenticated: function() {
      return false;
    }
  },
  methods: {
    requestAuthCookie: async function() {
      //const urlDB = this.remoteDBUrl;

      //let url = this.remoteDBUrl;
      let urlSplit = this.remoteDBUrl.split('/');
      urlSplit.pop();
      let sessionUrl = urlSplit.join('/') + "/_session";

      //const urlDB = this.$store.getters.urlDBRoot;
      const form = { name: this.username, password: this.password };
      //const response = await fetch(urlDB + "_session", {
      const response = await fetch( sessionUrl, {
        method: "POST",
        body: JSON.stringify(form),
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const result = await response.json();
      if (response.ok) {
        //this.authenticated = true;
        //this.authMsg = null;
        this.authMsg = 'Authenticated';
        //this.authDialog = false;
        //this.pimpimDoc.authenticationRequired = false;
        //this.mangoDoc.authenticationRequired = false;
        //const cookie = await fetch(urlDB + '_session');
        //const cookieObj = await cookie.json();
        //console.log(cookieObj)
      } else if (response.status == 401) {
        this.authMsg = "Incorrect credentials";
      } else {
        console.log(result);
        this.authMsg = "Something went wrong. See console.";
      }
    }
  }
}
</script>
