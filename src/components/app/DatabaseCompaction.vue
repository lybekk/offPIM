<template lang="pug">
  v-list-item(
    :disabled="compactingDone || compactInProgress"
    @click="compactDB"
  )
    v-list-item-content
      v-list-item-title Compact database
        v-progress-linear(  
          v-if="compactInProgress"
          color="info"
          buffer-value="0"
          stream
        )
    v-list-item-icon
      v-icon(v-if="compactingDone" color="success") mdi-check    
</template>

<script>
export default {
    name: 'DatabaseCompaction',
    props: ["whatdb"],
    data: () => ({
        compactInProgress: false,
        compactingDone: false,
    }),
    methods: {

        compactDB: async function() {
          try {
            console.log('Attempting compaction on: ', this.whatdb);
            this.compactInProgress = true;
            var result;
            if ( this.whatdb == 'remoteDB') {
              result = await window.remoteDB.compact();
            } else {
              this.$store.commit('showSnackbar', {
                text: 'Local compaction may take a while. Feel free to get things done. Just don\'t close the browser.', 
                color: 'info' 
              })
              result = await window.db.compact();
            }
            if (result.ok) {
              this.compactingDone = true;
            }
            this.compactInProgress = false;
          } catch (err) {
            console.log(err);
            //- TODO send to system/debug log
            this.compactInProgress = false;
          }
        },

    }


}
</script>