var app = new Vue({
    el: "#app",
    template: `
    <div>
        <section class="hero">
            <div class="hero-body">
                <div class="container">
                <h1 class="title">
                    PIMPIM
                </h1>
                <h2 class="subtitle">
                    Dashboard
                </h2>
                <p class="has-text-weight-bold	">
                    <a href="https://lybekk.tech/pimpim" target="_blank">Documentation</a>
                </p>
                </div>
            </div>
        </section>
        <div class="section container">
            <div class="columns">
                <div class="column is-narrow">
                    <ul>
                        <li>
                            <a href="messages.html"> Messages
                                <span class="tag is-pulled-right">{{ totals.messages }}</span>
                            </a>
                        </li>
                        <li>
                            <a href="tasks.html"> Tasks
                                <span class="tag is-pulled-right">{{ totals.tasks }}</span>
                            </a>
                        </li>
                    </ul>
                </div>
                <div class="column">
                    <div class="columns">
                        <div class="column is-one-quarter">
                        </div>
                        <div class="column">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    data: {
        totals:{
            "messages":0,
            "tasks":0
        }
    },
    methods: {
        getTotals: function () {
            fetch(`${window.location.origin}/${database}/_design/pimpim/_view/totals?group=true`)
            .then((resp) => resp.json())
            .then(function(data) {
                data.rows.forEach( (aggregate) => {
                    app.totals[aggregate.key] = aggregate.value;
                });
            });
        },
    }
});

app.getTotals();