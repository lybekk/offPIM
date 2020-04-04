<template lang="pug">
    v-container
        p This search does not use a pre-built index. This may take a while, as it looks through all documents. Max 50 tasks at a time
        v-btn(
            @click="getTasks2"
        ) Get tasks
        v-data-table(
            :headers="headers"
            :items="tasks"
            :loading="gettingTasks"
            loading-text="Loading... Please wait"
            :items-per-page="10"
        )
            template(v-slot:item.actions="{ item }")
                v-btn(
                    :disabled="item.archived"
                    @click="archiveDoc(item._id)"
                )
                    v-icon(
                        small
                        class="mr-2"
                    ) mdi-archive

</template>

<script>
import pouchMixin from '@/mixins/pouchMixin'

export default {
    name: 'completedProjectless',
    mixins: [pouchMixin],
    data: () => ({
        headers: [
            {
                text: 'Title',
                align: 'start',
                sortable: false,
                value: 'title',
            },
        { text: 'Status', value: 'status' },
        { text: 'Action', align: 'end', value: 'actions' },
        ],
        tasks: [],
        gettingTasks: false,
    }),
    mounted () {
    },
    methods: {
        getTasks2: async function () {
            this.gettingTasks = true;
            let mango = {
                selector: {
                    productivity: true,
                    type: "task",
                    project: null,
                    $or: [
                        { status: "done" },
                        { status: "cancelled" }
                    ],
                    archived : { $exists : false}
                },
                limit: 50
            };
            const data = await this.getMango(mango);
            this.tasks = data.docs;
            this.gettingTasks = false;
        },

        archiveDoc: async function(docId) {
            const index = this.tasks.findIndex( ({ _id }) => _id === docId );
            this.tasks[index].archived = true;
            //disable button
            let doc = await this.getDoc(docId);
            doc.archived = true;
            let result = await this.putDoc(doc);
            if (result.ok) {
                this.tasks.splice( index, 1);
            }
        }

    }
}
</script>