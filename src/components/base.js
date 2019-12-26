module.exports = (DATABASE, appName, APPS) => `
<!DOCTYPE html>
<html class="has-navbar-fixed-top" lang="en-US">
<head>
<script type="text/javascript" charset="utf8" src="pimpim.js"></script>
<script type="text/javascript" charset="utf8" src="vue.js"></script>
<link rel="stylesheet" type="text/css" href="main.css/">
<title>pimpim</title>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="Keywords" content="pim,couchdb,pouchdb,database,personal information management">
<meta name="Description" content="Personal information manager built for CouchDB">
<style>
.notification-area {
    position: fixed;
    bottom: 0;
    right: 0;
    z-index: 1008;
}
</style>
</head>
<body>
<div id="notification-area" class="notification-area">
</div>
<div id="result_notification" class="notification is-primary" style="position: fixed;bottom: 0;right: 0; display: none;">
</div>
<script>
    let database = "${DATABASE}";
    let theme = "main";
    let modules = ${APPS};
    let moduleName = "${appName}";

    var url_mango = window.location.origin + "/" + database + "/_find";
    var url_database = window.location.origin + "/" + database;

</script>
<nav class="navbar is-fixed-top header" role="navigation" aria-label="main navigation">
    <div class="container">
        <div class="navbar-brand">
            <a id="page_name" class="navbar-item" href="../index/">PIMPIM</a>
            <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" onclick="toggleNavBarMenu(this)">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>
        <div id="nav-menu" class="navbar-menu">
            <div class="navbar-start">
            </div>
            <div class="navbar-end">
                <div class="navbar-item">
                    <div id="module_links" class="buttons">
                    </div>
                </div>
            </div>
        </div>
    </div>
</nav>

<noscript><strong>We're sorry but pimpim doesn't work properly without JavaScript enabled. Please enable it to continue.</strong></noscript>
<div id=app></div>

<script src=${appName}.js></script>
<script>
    get_settings();
</script>
    
</body>
</html>
`;