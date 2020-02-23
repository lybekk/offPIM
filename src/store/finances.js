const finances = {
    state: {
        financialAggregates: {
            valueAccounts: 0
        },
        budget: {
            income: []
        },
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
                "asset":[],
                "liability":[],
                "investment":[],
                "loan":["mortgage payable"] //liability
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
            },
            "budget": {
                "income":["salary"],
                "expense":[
                    "Clothing",
                    "Debt",
                    "Food",
                    "Giving",
                    "Health",
                    "Housing",
                    "Insurance",
                    "Miscellaneous",
                    "Personal",
                    "Recreation",
                    "Savings",
                    "Transportation",
                    "Utilities",
                ]
            }
        }
    },
    mutations: {
        addBudgetDataArray (state, payload) {
            state.budget[payload.type] = payload.data
        },
        setFinancialAggregates (state, payload) {
            state.financialAggregates[payload.key] = payload.value.toFixed(2);
        },
    },
    actions: {
        getFinancialData: async function (context, type) {
            context.commit('flushData');
            const mango = {
                "selector": {
                    "realm": "finance",
                    "type": type
                    //"type": "transaction"
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

            if (["income", "expense"].includes(type)) {
                context.commit('addBudgetDataArray', {
                    type: type, data: data.docs
                });
            } else {
                context.commit('addDataArray', data.docs);
            }
        },
        async getFinancialAggregates (context) {
            let url = context.getters.urlDB;
            const response = await fetch(url + `_design/pimpim/_view/finance-totals-sum?group=true`)
            const result = await response.json();
            result.rows.forEach( (aggregate) => {
                context.commit('setFinancialAggregates', aggregate)
            });
        }
    },
    getters: {
        financeTypes: state => {
            return state.financeTypes
        },
        getBudget: (state) => (val) => {
            //let task = state.data.find(task => task._id === id)
            return state.budget[val]
        },
        getFinancialAggregates: state => {
            return state.financialAggregates
        },
    },
}

export default finances