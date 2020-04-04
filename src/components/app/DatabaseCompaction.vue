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
              result = await window.db.compact();
            }
            if (result.ok) {
              this.compactingDone = true;
            }
            this.compactInProgress = false;
            console.log(result)
          } catch (err) {
            console.log(err);
            this.compactInProgress = false;
          }
        },

    }


}
</script>