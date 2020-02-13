const finances = {
    state: {
        financeTypes: {
            "account": {
                // consider using asset, liability, as lvl2
                "bank":[ //asset
                    "checking account",
                    "savings account",
                    "investment account",
                    "individual retirement account",
                    "brokerage account",
                ],
                "cash":["wallet","piggy bank","safe"], //asset
                "credit card":["standard","rewards","prepaid","business"], //liability
                "mortgage payable":["standard"] //liability
            },
            "transaction": {
                "transaction": [
                    "Uncategorized",
                    "Clothing",
                    "Collectibles",
                    "Collecting supplies",
                    "Electronics & Software",
                    "Groceries",
                    "Hobbies",
                    "Household appliances",
                    "Utilities",
                ]
            }
        }
    },
    mutations: {
    },
    actions: {
        getFinancialData: async function (context, type) {
            context.commit('flushData');
            const mango = {
                "selector": {
                    "realm": "finance",
                    "type": "transaction"
                },
                "limit": 100
            };
            if (type == 'transaction') {
                mango.selector.type = 'transaction'
            }
            if (type == 'account') {
                mango.selector.type = {
                    "$in" : ["bank","cash","credit card","mortgage payable"]
                }
            }
            let data = await context.dispatch('postData', {
                url: context.getters.urlMango, 
                data:mango
            });
            context.commit('addDataArray', data.docs);
        }
    },
    getters: {
        financeTypes: state => {
            return state.financeTypes
          },
    },
}

export default finances