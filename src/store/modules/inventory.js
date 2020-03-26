const inventory = {
    state: {
    },
    mutations: {
    },
    actions: {
        getInventory: async function (context, type) {
            context.commit('flushData');
            console.log('Inventory prints this',type); //placeholder to avoid EsLint
            const mango = {
                "selector": {
                    "realm": "inventory"
                    //"type": type
                    //"type": "transaction"
                },
                "limit": 100
            };
            /*
            if (type == 'transaction') {
                mango.selector.type = 'transaction'
            }
            if (type == 'account') {
                mango.selector.type = {
                    "$in" : ["bank","cash","credit card","mortgage payable"]
                }
            }
            */
            let data = await context.dispatch('postData', {
                url: context.getters.urlMango, 
                data:mango
            });
            
            context.commit('addDataArray', data.docs);
            /*
            if (["income", "expense"].includes(type)) {
                context.commit('addBudgetDataArray', {
                    type: type, data: data.docs
                });
            } else {
                context.commit('addDataArray', data.docs);
            }
            */
        },
    },
    getters: {
    },
}

export default inventory