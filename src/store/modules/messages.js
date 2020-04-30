const messages = {
    state: {
        messagesUnreadCount: 0,
    },
    mutations: {
        setMessagesUnreadCount(state, payload) {
            state.messagesUnreadCount = payload;
        },
    },
    actions: {
        setMessagesUnreadCount: async function (context) {
            try {
                let data = await window.db.query('offpim/messages-unread', {
                    limit: 100,
                    reduce: true,
                });
                if (data.rows.length) {
                    context.commit('setMessagesUnreadCount', data.rows[0].value);
                }
            } catch (error) {
                context.commit('showSnackbar', { text: error });
            }
        }
    },
    getters: {
        getMessagesUnreadCount: state => {
            return state.messagesUnreadCount
        },
    },
}

export default messages