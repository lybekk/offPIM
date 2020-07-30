<template>
  <v-dialog
    v-model="dialog"
    scrollable
    max-width="400px"
  >
    <template v-slot:activator="{ on }">
      <span
        :class="[status == 'done' ? 'subheading success--text' : 'subheading font-weight-regular']"
        v-on="on"
        v-text="titleFormatted"
      />
    </template>
    <v-card>
      <v-card-title><span class="headline">Edit title</span></v-card-title>
      <v-card-text>
        <v-container>
          <v-text-field
            v-model="value"
            autofocus
            label="Title"
            @change="setTaskField"
          />
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import pouchMixin from '@/mixins/pouchMixin'

export default {
  name: 'TasksItemsTitle',
  components: {
  },
  mixins: [pouchMixin],
  props: {
    id: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      default: '',
    }
  },
  data: () => ({
    dialog:false,
    newValue: null
  }),
  computed: {
    value: {
        get () {
          return this.title
        },
        set (val) {
          this.newValue = val;
        }
    },
    titleFormatted() {
      let t = this.title;
      if (t == null || t.length == 0) {
          t = "No title";
      }
      return t
    }
  },
  methods: {
    setTaskField: async function () {
      await this.setFieldGeneric({
        _id: this.id,
        field: 'title',
        value: this.newValue
      });
      this.dialog = false;
      this.$emit('set-doc')
    },
  }
};

</script>
