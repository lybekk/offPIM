<template lang="pug">
v-list
  v-list-item(
    v-for="link in apps"
    :key="link.name"
    link :to="{ name: link.to, params: link.params }"
  )
    v-list-item-icon
      v-icon(v-text="link.icon")
    v-list-item-content
      v-list-item-title(
        v-text="link.name"
        style="text-transform: capitalize;"
      )
    v-list-item-action
      v-badge(
        v-if="link.name == 'Tasks'"
        :content="$store.getters.getTasksAggregate.today"
        :value="$store.getters.getTasksAggregate.today != 0"
        bordered
        overlap
      )
      v-badge(
        v-if="link.name == 'Messages'"
        :content="badgeMessagesUnread"
        :value="badgeMessagesUnread != 0"
        bordered
      )
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
        :key="link.name"
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
  name: "NavbarApps",
  data: () => ({
    apps: [
      {
        name: "Dashboard",
        icon: "mdi-home",
        to: "dashboard"
      },
      {
        name: "Tasks",
        icon: "mdi-check",
        to: "tasksOverview",
      },
      {
        name: "Notes",
        icon: "mdi-note",
        to: "notes",
      },
      {
        name: "Logbook",
        icon: "mdi-book-open",
        to: "logbook",
      },
      {
        name: "Messages",
        icon: "mdi-email",
        to: "messages",
      },
      {
        name: "Search",
        icon: "mdi-magnify",
        to: "search",
      },
      {
        name: "Contacts",
        icon: "mdi-account",
        to: "contacts",
      },
    ],
    concepts: [
      {
        name: "finances",
        icon: "mdi-cash"
      },
      {
        name: "inventory",
        icon: "mdi-package-variant"
      },
      {
        name: "maps",
        icon: "mdi-map"
      },
      {
        name: "themes",
        icon: "mdi-palette"
      }
    ]
  }),
  computed: {
    badgeMessagesUnread: function() {
      console.log('Fix this')
      let x = this.$store.getters.getMessagesUnreadCount;
      if (x > 10) {
        return "10+";
      }
      return x;
    }
  }
};
</script>
