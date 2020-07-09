<template>
  <v-container :fluid="$vuetify.breakpoint.mdAndDown">
    <v-skeleton-loader
      class="mx-auto"
      :loading="this.$store.getters.loaderState"
      transition="scroll-y-reverse-transition"
      type="list-item-avatar-two-line"
    >
      <v-data-iterator
        :items="tasks"
        item-key="_id"
        :search="search"
        :loading="this.$store.getters.loaderState"
        loading-text="Getting tasks"
        no-data-text="No tasks matching request"
        :sort-by="sortBy.toLowerCase()"
        :items-per-page="25"
        :hide-default-footer="tasks.length &lt; 25"
      >
        <template v-slot:header>
          <v-toolbar class="mb-1" color="transparent" flat="flat">
            <v-text-field
              v-model="search"
              clearable="clearable"
              flat="flat"
              hide-details="hide-details"
              prepend-inner-icon="mdi-magnify"
              label="Filter list"
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-select
              v-model="sortBy"
              flat="flat"
              solo="solo"
              hide-details="hide-details"
              :items="keys"
              prepend-inner-icon="mdi-sort-variant"
              label="Sort"
            ></v-select>
          </v-toolbar>
        </template>
        <template v-slot:default="props">
          <v-list three-line="three-line">
            <tasks-item v-for="doc in props.items" :key="doc._id" v-bind:docid="doc._id"></tasks-item>
            <v-divider inset />
          </v-list>
        </template>
      </v-data-iterator>
    </v-skeleton-loader>
  </v-container>
</template>

<script>
import TasksItem from "@/components/tasks/TasksItem.vue";

export default {
  name: "TasksDataIteratorList",
  components: {
    TasksItem
  },
  props: ["tasks"],
  data: () => ({
    search: "",
    sortBy: "due",
    keys: ["Due", "Status", "Priority", "Project"]
  })
};
</script>