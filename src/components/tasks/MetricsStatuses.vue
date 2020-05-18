<template lang="pug">
    div
        //- TODO This component is planned for use in dashboard and Tasks
        //- 
        //- consider list item w/icon and count
        v-progress-linear(
            value="15"
            rounded
        )
        p {{ countOpen.totalOpen }}
</template>

<script>
export default {
    name: 'metricsstatuses',
    data: () => ({
        //taskStatuses: ['wait','plan','todo','next','doing'],
        //values: [],
        //taskStatuses: ['wait','plan','todo','next','doing'],
        //statuses: {
        //    wait() {return 'cool'},
        //}
    }),
    computed: {
        countOpen: function() {
            const v = this.$store.getters.getTaskStatuses;
            const statusList = ['wait','plan','todo','next','doing'];
            let totalOpen = 0;
            //const statuses = [];

            for (let x of statusList) {
                totalOpen += v[x]
            }

            return totalOpen

            //for (let x of statusList) {
                //totalOpen += v[x];
                //return el += v[x];
                //return el += v[x];
                //statuses.push( { x: v[x] } )
                // [x] = v[x];
                //console.log(x)
                //return v[status]
            //}

            //return y

            //return {
            //    totalOpen: totalOpen,
            //    statuses: statuses
            //}
            //return 

            //return {
                //totalOpen: function() {
                    //return 'shit'
                    //return statusList.forEach(status => { return v[status] })
                    //return function() {for (let x in statusList) {
                    //    //totalOpen++
                    //    return v[status]
                    //}}
                //},
                //totalOpen2: function() {
                //    //statusList.forEach(status => { return v[status] })
                //    for (let x in statusList) {
                //        totalOpen++
                //        console.log(x)
                //    }
                //},
                //statuses:() => (
                //    //statusList.forEach(status => {
                //    ['wait','plan','todo','next','doing'].forEach(status => {
                //        totalOpen += v[status];
                //        totalOpen++;
                //        return { jau: 'cool' }
                //    }),
                //)
            //}

            //return ['wait','plan','todo','next','doing'].forEach(status => {
            //    //return this.$store.getters.getTaskStatuses[status];
            //    return v.$store.getters.getTaskStatuses[status];
            //});
        },
/*
        statusPercent() {
            //const ts = this.$store.getters.getTaskStatuses;
            const statusesNew = ['wait','plan','todo','next','doing'].forEach(status => {
                const ts = this.$store.getters.getTaskStatuses[status];
            });
        },
        */
    },
    mounted () {
        //const ts = this.$store.getters.getTaskStatuses;
        //ts.forEach( element => {
        //this.taskStatuses.forEach( status => {
        //});
        //this.initial()
    },
    methods: {
        //fillDataTable: async function() {
        //initial: function() {
        //    //const ts = this.$store.getters.getTaskStatuses;
        //    ['wait','plan','todo','next','doing'].forEach(status => {
        //        const ts = this.$store.getters.getTaskStatuses;
        //        ts[status];
        //        this.values.push({
        //            status: status,
        //            isPercentOfOpenTasks: ,
        //        })
        //    });
        //}
    }


}
</script>