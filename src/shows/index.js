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
                    A quick and dirty Personal Information Manager
                </h2>
                </div>
            </div>
        </section>
        <div class="section">
            <div class="columns">
                <div class="column is-one-quarter">
                    <aside class="menu">
                        <p class="menu-label">
                            General
                        </p>
                        <ul class="menu-list">
                            <li><a>Dashboard</a></li>
                            <li><a>Customers</a></li>
                        </ul>
                        <p class="menu-label">
                            Administration
                        </p>
                        <ul class="menu-list">
                            <li><a>Team Settings</a></li>
                            <li>
                            <a class="is-active">Manage Your Team</a>
                            <ul>
                                <li><a>Members</a></li>
                                <li><a>Plugins</a></li>
                                <li><a>Add a member</a></li>
                            </ul>
                            </li>
                            <li><a>Invitations</a></li>
                            <li><a>Cloud Storage Environment Settings</a></li>
                            <li><a>Authentication</a></li>
                        </ul>
                    </aside>
                </div>
                <div class="column">
                    In total disregard of the recommendations from CouchDB. should not be used in a production environment used by plenty of people. It is personal
                    To access show: http://localhost:5984/vault/_design/pimpim/_show/post_office/
                    <details>
                        <summary>Design</summary>
                        Bulma CSS is used
                        https://bulma.io/
                    </details>
                    <details>
                        <summary>Modules</summary>
                        <details>
                            <summary>Post Office</summary>
                            Email is best kept in files, it is said. While that is said. Does it replicate? Does it work offline? Oh.. Right. Anyway, this may come in handy anyway (for machines sending to a common place or something)
                        </details>
                    </details>
                    <!-- <p>Consider fetching module information from knowledge base.</p> -->
                </div>
            </div>
        </div>
    </div>
    `,
    data: {
    }
});

