export default {
    methods: {
        setFieldGeneric: async function (payload) {
            try {
                let doc;
                doc = await window.db.get(payload._id);
                doc[payload.field] = payload.value;
                this.putDoc(doc)
                /*
                var response = await window.db.put(doc);
                if (response.ok) {
                  // Consider using global snackbar for response.ok instead. Less invasive
                  let txt;
                  if (payload.snackbarText) {
                    txt = payload.snackbarText
                  } else {
                    txt = 'Document update OK'
                  }
                  this.$store.commit('showSnackbar', { text:txt, color:'success' })
                } else {
                    this.$store.commit('addAlert', {type:'error',text:'Document update failed' + response })
                }
                */
            } catch (error) {
                console.log(error);
                this.$store.commit('addAlert', {type:'error',text:error})
            }    
        },

        getDoc: async function (id) {
            try {
                const result = await window.db.get(id);
                return result
            } catch (err) {
                console.error(err);
            }
        },

        putDoc: async function (doc, snackbarText = false) {
            const response = await window.db.put(doc);
            if (response.ok) {
              // Consider using global snackbar for response.ok instead. Less invasive
              let txt;
              if (snackbarText) {
                txt = snackbarText
              } else {
                txt = 'Document update OK'
              }
              this.$store.commit('showSnackbar', { text:txt, color:'success' })
              return response
            } else {
                this.$store.commit('addAlert', {type:'error',text:'Document update failed' + response })
            }
        },

        deleteDoc: async function (id) {
            this.$store.dispatch('deleteDocument', id)
        },

        setFieldDate: async function (payload) {
            try {
                let doc = await window.db.get(payload._id);
                if (doc.type == 'task' && payload.field == 'due') {
                    doc.postponed++;
                }
                let dateString = doc[payload.field];
                if (typeof dateString == 'undefined') {
                    dateString = '2020-01-01T00:00:00.000Z';
                }
                let currentDate = new Date(dateString);
                let newDate = new Date(payload.value);
                currentDate.setFullYear(newDate.getFullYear());
                currentDate.setMonth(newDate.getMonth());
                currentDate.setDate(newDate.getDate());
                doc[payload.field] = currentDate.toISOString();
                this.putDoc(doc)
            } catch (error) {
                this.$store.commit('addAlert', {type:'error',text:error})
            }

        },

        setFieldNull: async function (payload) {
            try {
                let doc = await window.db.get(payload._id);
                doc[payload.field] = null;
                this.putDoc(doc)
            } catch (error) {
                this.$store.commit('addAlert', {type:'error',text:error})
            }
        },

        setFieldTime: async function (payload) {
            let doc = await window.db.get(payload._id);
            let dateString = doc[payload.field];
            if (typeof dateString == 'undefined') {
                let d = new Date();
                dateString = d.toISOString();
            }
            let newDate = new Date(dateString);
            let TZ = newDate.getTimezoneOffset() / 60;
            let h = parseInt( payload.value.slice(0,2) );
            newDate.setHours(h - TZ);
            newDate.setMinutes(payload.value.slice(3,5));
            newDate.setMilliseconds(0);
            newDate.setSeconds(0);
            doc[payload.field] = newDate.toISOString();
            this.putDoc(doc)
        },

        getMango: async function (mango) {
            // Future feature: if using remote instead of local db (vuex state?), switch to window.remoteDB
            try {
                const data = await window.db.find(mango);
                this.$store.commit('loaderInactive');

                // debugging
                window.db.explain(mango)
                  .then(function (explained) {
                      console.log('Mango query explained: ',explained)
                    // detailed explained info can be viewed
                  });
                  

                return data
            } catch (error) {
                //this.$store.commit('addAlert', {type:'error',text:error});
                this.$store.commit("showSnackbar", { text: error });
                console.log(error);
            }
        },

    }
};