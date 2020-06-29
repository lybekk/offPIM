<template lang="pug">
v-card(v-if="statusList.length")
    v-card-title By status
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
                    //-v-badge(
                        v-if="statusCount(status) != 0"
                        :color="$store.getters.getStatusColors[status]"
                        :content="statusCount(status)"
                        inline
                        )
                    v-list-item-title(
                        v-text="status"
                        class="text-capitalize"
                    )
                    //-v-list-item-subtitle
                        v-progress-linear(
                            :color="$store.getters.getStatusColors[status]"
                            :value="statusCount(status) * 100 / totalOpenTasks"
                            rounded
                        )
                v-list-item-icon
                    v-chip(
                        v-if="statusCount(status) != 0"
                        color="info"
                        v-text="statusCount(status)"
                    )
                        //-:color="$store.getters.getStatusColors[status]"
        //-div(class="text-center")
            v-row
                v-col(
                    
                    v-for="status in statusList"
                    :key="status"
                )
                    v-btn(
                        block
                        outlined
                        color="secondary darken-2"
                        :to="`/tasks/list/status${status}`"
                    )
                        //-v-icon(left :color="priorityStarColor[btn.pri]") mdi-star
                        v-icon(
                            left
                            :color="$store.getters.getStatusColors[status]"
                            v-text="$store.getters.getStatusIcons[status]"
                        )
                        span(
                            v-text="status"
                            :class="`text-capitalize secondary--text`"
                        )
                            //-:class="`text-capitalize ${$store.getters.getStatusColors[status]}--text`"
                            //-:class="'text-capitalize' + $store.getters.getStatusColors[status]"
                            //-:color="$store.getters.getStatusColors[status]"
                        v-chip(
                            v-text="statusCount(status)"
                            color="info"
                            small
                        )
                            //-:color="$store.getters.getStatusColors[status]"

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