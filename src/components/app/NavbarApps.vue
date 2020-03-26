<template lang="pug">
v-list
  //-dense?
  v-list-item(link to="/dashboard")
    v-list-item-action
      v-icon mdi-home
    v-list-item-content
      v-list-item-title Dashboard
  v-list-item(link to="/tasks/list/today")
    v-list-item-action
      v-icon mdi-check
    v-list-item-content
      v-list-item-title Tasks
        v-badge(
          :content="this.$store.getters.getTasksAggregate.today"
          :value="this.$store.getters.getTasksAggregate.today != 0"
          bordered
        )
  v-list-item(link to="/notes")
    v-list-item-action
      v-icon mdi-note
    v-list-item-content
      v-list-item-title Notes
  v-list-item(link to="/logbook")
    v-list-item-action
      v-icon mdi-home
    v-list-item-content
      v-list-item-title Logbook
  v-list-item(link to="/messages")
    v-list-item-action
      v-icon mdi-email
    v-list-item-content
      v-list-item-title Messages
        v-badge(
          :content="badgeMessagesUnread"
          :value="badgeMessagesUnread != 0"
          bordered
        )
  v-divider
  v-list(class="")
    v-list-item(to="/tools") Tools
    v-list-item(to="/themes") Themes
  v-divider
  v-list
    v-list-group(
      prepend-icon="mdi-pen"
      no-action
    )
      template(v-slot:activator)
        v-list-item-content
          v-list-item-title Unfinished
      v-list-item(to="/finances")
        v-list-item-content
          v-list-item-title Finances
      v-list-item(to="/inventory")
        v-list-item-content
          v-list-item-title Inventory
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
