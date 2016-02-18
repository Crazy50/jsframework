'use strict';

/*
what does core-client need to accomplish?

handle start up
- load the config
- load RpcClient

- load all Types
- load available client-versions of the Methods, Tables, Queries (how to generate/convert these?)
  - how to load only ones that are necessary at this time?
  - and then load more at a later point as necessary?
- load all the view-models

- determine if there is window.DataContent, pre-load any stores with it
- mount React to the view
*/

var TrieRouter = require('./router/router');
//var RpcClient = require('./core/rpc-client');

var Core = {
  router: new TrieRouter(),
  //rpc: new RpcClient()
};
window.Core = Core;

// window.Type = require('./factories-client/type');
// window.Query = require('../factories-client/query');
// window.Table = require('./factories-client/table');
window.Method = require('./factories-client/method');
window.ViewModel = require('./factories-client/view-model');

function requireAll(r) { r.keys().forEach(r); }
requireAll(require.context('./example/view-models/', true, /\.js$/));
