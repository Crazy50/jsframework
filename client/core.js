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
var Client = require('./core/client');
//var RpcClient = require('./core/rpc');

var Core = {
  router: new TrieRouter(),
  client: Client,
  components: require('../components/'),
  rest: require('./core/rest')
};
global.Core = Core;

// global.Query = require('./core/factories/query');
// global.Table = require('./core/factories/table');
global.Method = require('./core/factories/method');
global.ViewModel = require('./core/factories/view-model');

// TODO: is this really the best way??
function requireAll(r) { r.keys().forEach(r); }
// requireAll(require.context('dbtables/', true, /\.js$/));
// requireAll(require.context('queries/', true, /\.js$/));
// requireAll(require.context('methods/', true, /\.js$/));
requireAll(require.context('view-models/', true, /\.js$/));

// TODO: could be some issues here with something expecting Client to be initialized
// maybe...
Client();
