<template lang="pug">
    v-content
        v-scroll-y-reverse-transition(mode="out-in")
            router-view
</template>

<script>
export default {
    name: 'forms',
    data: () => ({
        buttonToggle: null,
        buttons: [
            {
                name: 'Task',
                to: 'formsNewTask',
                icon: 'mdi-check',
            },
            {
                name: 'Note',
                to: 'formsNewNote',
                icon: 'mdi-pen',
            },
            {
                name: 'Log',
                to: 'formsNewLog',
                icon: 'mdi-book',
            },
            {
                name: 'Message',
                to: 'formsNewMessage',
                icon: 'mdi-email',
            },
            {
                name: 'Finance',
                to: 'formsNewFinance',
                icon: 'mdi-cash',
            },
        ],
    }),
    mounted () {
        this.$store.commit(
            "setGenericStateBooleanTrue",
            "buttonFormNewHidden"
        );
        this.$store.commit('appBarTabs', this.buttons)
    },
  beforeDestroy() {
        this.$store.commit(
            "setGenericStateBooleanFalse",
            "buttonFormNewHidden"
        );
        this.$store.commit('appBarTabs', [])
  },
}
</script>