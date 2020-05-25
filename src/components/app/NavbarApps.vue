<template lang="pug">
v-list
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
      v-icon mdi-book-open
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
  v-list-item(link to="/search")
    v-list-item-action
      v-icon mdi-magnify
    v-list-item-content
      v-list-item-title Search
  v-divider
  v-list
    v-list-item(link to="/tools")
      v-list-item-action
        v-icon mdi-tools
      v-list-item-content
        v-list-item-title Tools
    v-list-item(link to="/settings")
      v-list-item-action
        v-icon mdi-cogs
      v-list-item-content
        v-list-item-title Settings
  v-divider
  v-list
    v-list-group(
      prepend-icon="mdi-progress-wrench"
      no-action
    )
      template(v-slot:activator)
        v-list-item-content
          v-list-item-title Concepts
      v-list-item(
        v-for="link in concepts"
        link :to="{ name: link.name }"
        )
        v-list-item-action
          v-icon(v-text="link.icon")
        v-list-item-content
          v-list-item-title(
            v-text="link.name"
            style="text-transform: capitalize;"
            )

</template>

<script>
export default {
  name: 'NavbarApps',
  data: () => ({
    concepts: [
      {
        name: 'contacts',
        icon: 'mdi-account'
      },
      {
        name: 'finances',
        icon: 'mdi-cash'
      },
      {
        name: 'inventory',
        icon: 'mdi-package-variant'
      },
      {
        name: 'maps',
        icon: 'mdi-map'
      },
      {
        name: 'themes',
        icon: 'mdi-palette'
      },
    ]
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
