<template lang="pug">
v-card
    v-card-title Tasks by status
    v-card-text
        v-list
            v-list-item(
                v-for="status in statusList"
                :key="status"
                :to="`/tasks/list/status${status}`"
            )
                v-list-item-icon
                    v-icon(
                        :color="$store.getters.getStatusColors[status]"
                        v-text="$store.getters.getStatusIcons[status]"
                    )
                v-list-item-content
                    v-badge(
                        v-if="statusCount(status) != 0"
                        :color="$store.getters.getStatusColors[status]"
                        :content="statusCount(status)"
                        inline
                    )
                        v-list-item-title(
                            v-text="status"
                            class="text-capitalize"
                        )
                    v-list-item-subtitle
                        v-progress-linear(
                            :color="$store.getters.getStatusColors[status]"
                            :value="statusCount(status) * 100 / totalOpenTasks"
                            rounded
                        )
</template>

<script>
export default {
    name: 'metricsstatuses',
    data: () => ({
    }),
    computed: {

        statusList() {
            const list = [
                'doing',
                'next',
                'todo',
                'plan',
                'wait'
            ];
            const s = this.$store.getters.getTaskStatuses;
            return list.filter(function (status) {
                return s[status]
            })
        },

        totalOpenTasks() {
            const s = this.$store.getters.getTaskStatuses;
            let sum = s.wait + s.plan + s.todo + s.next + s.doing;
            return sum
        },
    },
    mounted () {
        const s = this.$store.getters.getTaskStatuses;
        let total = Object.values(s).reduce(
            ( accumulator, currentValue ) => accumulator + currentValue, 0
        )

        if (!total) {
            this.$store.dispatch('getTaskStatuses');
        }

    },
    methods: {
        statusCount: function(status) {
            let list = this.$store.getters.getTaskStatuses;
            return list[status]
        },

    }


}
</script>