const messages = {
    state: {
        readerDialog: false,
        messagesUnreadCount: 0,
    },
    mutations: {
        setReaderDialog (state, payload) {
            state.readerDialog = payload;
        },
        setMessagesUnreadCount (state, payload) {
            state.messagesUnreadCount = payload;
        },
    },
    actions: {
        setMessagesUnreadCount: async function (context) {
            try {
                let data = await window.db.query('pimpim/messages-unread', {
                    limit: 100,
                    reduce: true,
                });
                if (data.rows.length) {
                    context.commit('setMessagesUnreadCount', data.rows[0].value);
                }
              } catch (error) {
                context.commit('showSnackbar', { text:error });
              }
        }
    },
    getters: {
        isReaderDialogOpen: state => {
            return state.readerDialog
        },
        getMessagesUnreadCount: state => {
            return state.messagesUnreadCount
        },
    },
}

export default messages