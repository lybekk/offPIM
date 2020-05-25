<template lang="pug">
v-content
    v-container(
    :fluid="$vuetify.breakpoint.mdAndDown"
    )
        v-skeleton-loader(
            :loading="this.$store.getters.loaderState"
            class="mx-auto"
            transition="scroll-y-reverse-transition"
            type="list-item-avatar-two-line"        
        )
            v-data-iterator(
                :items="this.$store.getters.getData"
                item-key="_id"
                :items-per-page="10"
                :search="search"
                :loading="this.$store.getters.loaderState"
                loading-text="Getting Contacts"
                no-data-text="No contacts matching request"
            )
                template(v-slot:header)
                    v-toolbar(
                    color="transparent"
                    class="mb-1"
                    flat
                    )
                        v-text-field(
                            v-model="search"
                            clearable
                            flat
                            solo-inverted
                            hide-details
                            prepend-inner-icon="mdi-magnify"
                            label="Filter list"
                        )
                        v-spacer
                template(v-slot:default="props")
                    v-list
                        contacts-item(
                            v-for="doc in props.items"
                            :key="doc._id"
                            v-bind:doc="doc"
                        )
        contacts-item-detailed

</template>

<script>
import ContactsItem from "@/components/contacts/ContactsItem.vue";
import ContactsItemDetailed from "@/components/contacts/ContactsItemDetailed.vue";
import pouchMixin from "@/mixins/pouchMixin";

export default {
    name: 'contacts',
    components: {
        ContactsItem,
        ContactsItemDetailed
    },
    mixins: [pouchMixin],
    data: () => ({
        search: "",
        sortBy: "due",
    }),
    mounted() {
        this.getContacts();
    },
    methods: {
        getContacts: async function() {
          try {
            let data = await this.getQuery(
              "offpim/contacts-all",
              null,
              null,
              true
            );
            this.$store.commit("addDataArray", data);
          } catch (error) {
            this.$store.dispatch(
                "infoBridge", {
                    color: 'error',
                    text: 'Unable to get contacts',
                    error: error
                    }
            );
          }
        }
    },

}
</script>