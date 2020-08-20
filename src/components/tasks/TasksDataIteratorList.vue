<template>
  <v-container :fluid="$vuetify.breakpoint.mdAndDown">
    <v-data-iterator
      :items="tasks"
      item-key="_id"
      :search="search"
      :loading="this.$store.getters.loaderState"
      loading-text="Getting tasks"
      no-data-text="No tasks matching request"
      :sort-by="sortBy.toLowerCase()"
      :items-per-page="25"
      :hide-default-footer="tasks.length < 25"
    >
      <template v-slot:header>
        <v-toolbar
          class="mb-1"
          dark
          color="primary darken-1"
          elevation="1"
        >
          <v-text-field
            v-model="search"
            clearable
            flat
            solo-inverted
            hide-details
            prepend-inner-icon="mdi-magnify"
            label="Filter list"
          />
          <v-spacer />
          <v-select
            v-model="sortBy"
            flat
            solo-inverted
            hide-details
            :items="keys"
            prepend-inner-icon="mdi-sort-variant"
            label="Sort"
          />
        </v-toolbar>
      </template>
      <template v-slot:default="props">
        <v-list three-line>
          <div
            v-for="doc in props.items"
            :key="doc._id"
          >
            <TasksItem
              :docid="doc._id"
              :task-score="doc.score"
            />
            <v-divider
              class="text-disabled"
              inset
            />
          </div>
        </v-list>
      </template>
      <template v-slot:loading>
        <v-skeleton-loader
          class="mx-auto"
          transition="scroll-y-reverse-transition"
          type="list-item-avatar-two-line"
        />
      </template>
    </v-data-iterator>
    <!-- 
    </v-skeleton-loader>
      -->
  </v-container>
</template>

<script>
import TasksItem from "@/components/tasks/TasksItem.vue";

export default {
  name: "TasksDataIteratorList",
  components: {
    TasksItem
  },
  props: {
    tasks: {
      type: Array,
      default: () => [],
    }
  },
  data: () => ({
    search: "",
    sortBy: "due",
    keys: ["Due", "Status", "Priority", "Project"]
  })
};
</script>