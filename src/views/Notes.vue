<template>
  <v-container fluid>
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <v-list
          nav
          dense
      >
          <notes-newnoteform />

          <v-list-item link @click="getLastEntriesByCount(30)">
              <v-list-item-icon>
              <v-icon>mdi-account-multiple</v-icon>
              </v-list-item-icon>
              <v-list-item-title>30 latest notes</v-list-item-title>
          </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list
          nav
          dense
          subheader
      >
          <v-subheader>Tags</v-subheader>
              <v-list-item
                  v-for="(tag, i) in tagsList"
                  :key="i"
                  link
                  @click="getNotesByTag(tag.key)"
              >
                  <v-list-item-icon>
                      <v-icon color="grey lighten-1" small>mdi-tag</v-icon>
                      <v-icon small color="grey lighten-1" v-text="tag.key[0]" >mdi-tag</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                      <v-list-item-title v-text="tag.key"></v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                      <v-list-item-action-text v-text="tag.value"></v-list-item-action-text>
                  </v-list-item-action>
              </v-list-item>
      </v-list>
    </v-navigation-drawer>

      <v-content>
        <v-container
          class="fill-height"
          fluid
        >
          <v-row>
            <notes-items />
          </v-row>
        </v-container>
      </v-content>

      <notes-detailed :selected-note="selectedNote"/>

  </v-container>
</template>

<script>
import NotesItems from '@/components/NotesItems.vue'
import NotesDetailed from '@/components/NotesDetailed.vue'
import NotesNewnoteform from '@/components/NotesNewnoteform.vue'

  export default {
    name: 'notes',
    components: {
        NotesItems,
        NotesDetailed,
        NotesNewnoteform
    },
    props: {
      source: String,
    },
    data: () => ({
      drawer: false
    }),
    computed: {
      notesAll: function () {
          return this.$store.getters.getNotes
      },
      tagsList: function () {
          return this.$store.getters.getTagsList
      },
      selectedNote: function() {
          return this.$store.getters.selectedNote
      }
    },
    created () {
      this.getLastEntriesByCount(30);
      this.$store.commit('populateTagsList');
    },
    beforeDestroy() {
      this.drawer = false;
    },
    mounted () {
      setTimeout(()=>{ this.drawer = true; }, 300);
    },
    methods: {
      getNotesByTag: function (tag="No tag") {
          let vstore = this.$store;
          vstore.commit('flushNotes')
          vstore.commit('toggleLoader');
          let mango = {
                          "selector": {
                              "realm": "productivity",
                              "type":"note",
                              "tags": {
                                  "$in": [tag]
                              },
                              "$or": [
                                  { "archived": { "$exists":false } },
                                  { "archived": false }
                              ]                                
                          },
                          "limit": 25
                          //"sort": [
                          //    { "created": "desc" }
                          //]
                      };
          if (tag == "No tag") {
              mango.selector.tags = []
          }
          fetch(this.$store.getters.urlMango, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify(mango)
          })
          .then((resp) => resp.json())
          .then(function(data) {
              if (data.docs.length == 0) {
                  vstore.commit('toggleLoader')
                  return
              }
              data.docs.forEach( (doc, index) => {
                  vstore.commit('addNote', doc)
                  if (index + 1 == data.docs.length) {
                    //loader_toggle(false)
                    vstore.commit('toggleLoader')
                  }
              });
          })
          .catch(function(error) {
              console.log(error);
              console.log(this);
          });
      },
      getLastEntriesByCount: function (count = 30) {
          let vstore = this.$store;
          //let toast = this.toast;
          vstore.commit('flushNotes')
          vstore.commit('toggleLoader');
          let now = new Date().toISOString().slice(0, 16);
          let mango = {
                          "selector": {
                              "realm": "productivity",
                              "type":"note",
                              "created": { "$lte": now },
                              "$or": [
                                  { "archived": { "$exists":false } },
                                  { "archived": false }
                              ]
                          },
                          "limit": count,
                          "sort": [
                              { "created": "desc" }
                          ]
                      };
          fetch(this.$store.getters.urlMango, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify(mango)
          })
          .then((resp) => resp.json())
          .then(function(data) {
              
              if (data.docs.length == 0) {
                  vstore.commit('toggleLoader');
                  return
              }
              data.docs.forEach( (doc, index) => {
                  vstore.commit('addNote', doc)
                  if (index + 1 == data.docs.length) {
                    vstore.commit('toggleLoader');
                    let txt = `Fetched ${data.docs.length} notes`;
                    vstore.commit('showSnackbar', { text:txt });
                  }
              });
          })
          .catch(function(error) {
            vstore.commit('showSnackbar', { text:error });
          });
      }
    }
  }

</script>



<style scoped>
.flip-list-move {
  transition: transform 1s;
}
</style>