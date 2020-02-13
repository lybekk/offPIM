<template lang="pug">
  v-tabs(
    fixed-tabs
    background-color="transparent"
    show-arrows
  ) 
    v-tab(to="/dashboard") Dashboard
    v-tab(to="/tasks") Tasks
      v-badge(
        :content="this.$store.getters.getTasksAggregate.today"
        :value="this.$store.getters.getTasksAggregate.today != 0"
        bordered
      )
    v-tab(to="/notes") Notes
    v-tab(to="/logbook") Logbook
    v-tab(to="/messages") Messages
      v-badge(
        :content="badgeMessagesUnread"
        :value="badgeMessagesUnread != 0"
        bordered
      )
    v-menu(
      bottom
      left
    )
      template(v-slot:activator="{ on }")
        v-btn(
          text
          class="align-self-center mr-4"
          v-on="on"
        ) More
          v-icon(right) mdi-menu-down
      v-list(class="grey lighten-3")
        v-list-item(to="/tools") Tools
        //-v-list-item Work in progress
        v-menu(
          bottom
          left
        )
          template(v-slot:activator="{ on }")
            v-btn(
              text
              class="align-self-center mr-4"
              v-on="on"
            ) Work in progress
              v-icon(right) mdi-menu-down
          v-list(class="grey lighten-3")
            v-list-item(to="/finances") Finances

</template>

<script>
export default {
  name: 'NavbarApps',
  data: () => ({
  }),
  computed: {
    badgeMessagesUnread: function () {
      let x = this.$store.getters.getMessagesUnreadCount;
      if (x > 10) {return '10+'}
      return x
    }
  }
};
</script>
