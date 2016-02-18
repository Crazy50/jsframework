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

var TrieRouter = require('../router/router');
//var Client = require('./core/client');
//var RpcClient = require('./core/rpc');

var Core = {
  router: new TrieRouter(),
  //client: Client,
  //rpc: new RpcClient()
};
global.Core = Core;

// window.Type = require('./core/factories/type');
// window.Query = require('./core/factories/query');
// window.Table = require('/core./factories/table');
global.Method = require('/core./factories/method');
global.ViewModel = require('./core/factories/view-model');

function requireAll(r) { r.keys().forEach(r); }
requireAll(require.context('view-models/', true, /\.js$/));
