<template lang="pug">
  v-container(fluid)
    v-navigation-drawer(
      v-model="drawer"
      app
      right
    )
      v-list(
        nav
        dense
      )
        notes-newnoteform
        v-list-item(link @click="getLastEntriesByCount(30)")
            v-list-item-icon
              v-icon mdi-account-multiple
            v-list-item-title 30 latest notes
      v-divider
      v-list(
        nav
        dense
        subheader
      )
        v-subheader Tags
        v-list-item(
          v-for="(tag, i) in tagsList"
          :key="i"
          link
          @click="getNotesByTag(tag.key)"
        )
          v-list-item-icon
            v-icon(
              color="grey lighten-1" 
              small
            ) mdi-tag
            v-icon(
              small 
              color="grey lighten-1" 
              v-text="tag.key[0]"
            ) mdi-tag
          v-list-item-content
            v-list-item-title(
              v-text="tag.key"
            )
          v-list-item-action
            v-list-item-action-text(v-text="tag.value")
    v-content
      v-container(
        class="fill-height"
        fluid
      )
        v-row
          v-container(fluid)
            v-skeleton-loader(
                :loading="this.$store.getters.loaderState"
                class="mx-auto"
                transition="scale-transition"
                type="article"
            )
              v-data-iterator(
                :items="noteList"
                item-key="_id"
                :items-per-page="10"
              )
                template(v-slot:default="props")
                  v-row
                    v-col(
                      v-for="item in props.items"
                      :key="item._id"
                      cols="12"
                      sm="6"
                      md="4"
                      lg="3"
                    )
                      notes-item(
                        v-bind:item="item"
                        @set-selected-note="setSelectedNote"
                      )
                        //-v-bind:docid="item._id"
    notes-detailed(
      :selected-note="selectedNote"
      @refresh-doc="refreshDoc"
    )

</template>

<script>
import pouchMixin from '@/mixins/pouchMixin'

import NotesItem from '@/components/notes/NotesItem.vue'
import NotesDetailed from '@/components/notes/NotesDetailed.vue'
import NotesNewnoteform from '@/components/notes/NotesNewnoteform.vue'

  export default {
    name: 'notes',
    components: {
        NotesItem,
        NotesDetailed,
        NotesNewnoteform
    },
    mixins: [pouchMixin],
    props: {
      source: String,
    },
    /*
    data () {
      return {
        noteList: [],
        drawer: false,
        selectedNote: {}
      }
    },
    */
    data: () => ({
      noteList: [],
      drawer: false,
      selectedNote: {}
    }),
    computed: {
      /*
      notesAll: function () {
          return this.$store.getters.getNotes
      },
      */
      tagsList: function () {
          return this.$store.getters.getTagList
      },
      /*
      selectedNote: function() {
          return this.$store.getters.selectedNote
      }
      */
    },
    created () {
      //this.getLastEntriesByCount(30);
      //this.$store.dispatch('populateTagsList');
    },
    beforeDestroy() {
      this.drawer = false;
    },
    mounted () {
      setTimeout(()=>{ this.drawer = true; }, 300);
      this.getLastEntriesByCount(30);
      this.$store.dispatch('populateTagsList');
    },
    methods: {
      refreshDoc: async function (id) {
        const index = this.noteList.findIndex(
          ({ _id }) => _id === id
          //({ _id }) => _id === this.selectedNote._id
        );
        //this.noteList[index].deleted = true;
        //let x = this.noteList[index];
        //console.log('Fyri',x);
        const x = await this.getDoc(id);
        this.noteList[index].title = x.title;
        this.noteList[index].description = x.description;
        this.noteList[index].archived = x.archived;
        //console.log('Efte: ',x)
        //console.log(this.noteList)
        //this.noteList[index] = this.getDoc(this.selectedNote._id)
        //await window.db.get(this.selectedNote._id);

        //let doc = await window.db.get(payload._id);
        //this.noteList.unshift(2, 11);
         //= await window.db.get(this.selectedNote._id);
      },
      setSelectedNote: async function (id) {
        //let doc = await window.db.get(payload._id);
        this.selectedNote = await window.db.get(id);
      },
      getNotesByTag: async function (tag="No tag") {
        let vstore = this.$store;
        //vstore.commit('flushNotes')
        //vstore.commit('toggleLoader');
        vstore.commit('loaderActive');
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
            "limit": 25,
            //"use_index": "pimpim_mango_indexes"
            //"fields": ["_id"]
            //"sort": [
            //    { "created": "desc" }
            //]
        };
        if (tag == "No tag") {
            mango.selector.tags = []
        }

        try {
          let data = await window.db.find(mango);
          this.noteList = data.docs;
          //vstore.commit('addNotes', data)
          vstore.commit('loaderInactive');
        } catch (error) {
          vstore.commit('showSnackbar', { text:error });
        }

          /*
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
                  vstore.commit('loaderInactive');
                  return
              }
              data.docs.forEach( (doc, index) => {
                  vstore.commit('addNote', doc)
                  if (index + 1 == data.docs.length) {
                    //loader_toggle(false)
                    vstore.commit('loaderInactive');
                  }
              });
          })
          .catch(function(error) {
              console.log(error);
              console.log(this);
          });
          */
      },
      getLastEntriesByCount: async function (count = 30) {
        let vstore = this.$store;
        //let toast = this.toast;
        //vstore.commit('flushNotes')
        vstore.commit('loaderActive');
        let now = new Date().toISOString().slice(0, 16);
        let mango = {
          selector: {
              realm: "productivity",
              type:"note",
              created: { "$lte": now },
              $or: [
                  { archived: { $exists:false } },
                  { archived: false }
              ]
          },
          limit: count,
          sort: [
              { created: "desc" }
          ]
          //use_index: "pimpim_mango_indexes"
          //"fields": ["_id"]
      };

      try {
        let data = await window.db.find(mango);
        this.noteList = data.docs;
        //let data2 = await window.db.explain(mango);
        //console.log(data2)
        //vstore.commit('addNotes', data)

        /*
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
        */
        //context.commit('setTasksAggregate', { key: 'doneToday', value: data.docs.length});
        //let txt = `Fetched ${data.docs.length} notes`;
        //vstore.commit('showSnackbar', { text:txt });
        vstore.commit('loaderInactive');
      } catch (error) {
        vstore.commit('showSnackbar', { text:error });
        //context.commit('addAlert', {type:'error',text:err})
      }

          /*
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
          */
      },
    }
  }

</script>



<style scoped>
.flip-list-move {
  transition: transform 1s;
}
</style>