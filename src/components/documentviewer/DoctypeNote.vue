<template>
  <v-row>
    <v-col>
      <v-text-field
        :value="doc.title"
        label="Title"
        autofocus
        filled
        @change="setDocField('title', $event)"
      />
      <v-textarea
        :value="doc.description"
        label="Description"
        filled
        hide-details
        @change="setDocField('description', $event)"
      />
    </v-col>
    <v-col cols="12">
      <v-toolbar flat>
        <v-toolbar-title>
          Tags
        </v-toolbar-title>
        <v-fab-transition>
          <v-btn
            :key="showTagInput"
            color="secondary"
            class="ml-1"
            fab
            x-small
            @click="addTag(false)"
          >
            <v-icon v-text="showTagInput ? 'mdi-content-save' : 'mdi-plus'" />
          </v-btn>
        </v-fab-transition>
        <v-slide-x-reverse-transition>
          <v-text-field
            v-show="showTagInput"
            v-model="newTagInputValue"
            class="ma-2"
            hide-details
          />
        </v-slide-x-reverse-transition>
      </v-toolbar>
      <v-chip
        v-for="(tag,i) in doc.tags"
        :key="i"
        class="ma-1"
        close
        @click:close="removeTag(i)"
      >
        {{ tag }}
      </v-chip>
    </v-col>
    <v-col cols="12">
      <v-divider inset />
      <v-chip
        v-for="tag in globalNoteTags"
        :key="tag"
        class="ma-2"
        small
        @click="addTag(tag)"
      >
        <v-icon 
          x-small
          left
        >
          mdi-plus
        </v-icon>
        {{ tag }}
      </v-chip>
    </v-col>
  </v-row>
</template>

<script>
import pouchMixin from "@/mixins/pouchMixin";
import itemDetailedMixin from "@/mixins/itemDetailedMixin";

export default {
  name: "DoctypeNote",
  mixins: [pouchMixin, itemDetailedMixin],
  data: () => ({
    globalNoteTags: [],
    showTagInput: false,
    newTagInputValue: null,
  }),
  mounted() {
    this.getGlobalTags()
  },
  methods: {
    removeTag: function (tagIndex) {
      let tags = this.doc.tags;
      tags.splice(tagIndex, 1);
      this.setDocField('tags', tags)
    },
    addTag: function (newTag = false) {
      if (!newTag && !this.newTagInputValue) {
        this.showTagInput = true;
      } else {
        newTag = newTag ? newTag : this.newTagInputValue
        this.setDocField('tags', [...this.doc.tags, newTag])
        this.showTagInput = false
        this.newTagInputValue = null
      }
    },
    getGlobalTags: async function() {
      let tagsArray = await this.$store.dispatch(
        "getTagsFromView",
        "offpim/note-tag-count"
      );
      console.log(tagsArray)
      const prep = []
      for await (let item of tagsArray.rows) {
        if (item.key != 'No tag')
        prep.push(item.key)
      }
      prep.sort()
      this.globalNoteTags = prep
    },
  },
};
</script>
