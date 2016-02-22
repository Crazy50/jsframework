var axios = require('axios');

var historyModule = require('history');
var createHistory = historyModule.createHistory;
var useQueries = historyModule.useQueries;

var CoreRequest = require('../../core/request');
var CoreResponse = require('./response');

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

var Client = function Client() {
  Client.history = useQueries(createHistory)();
  // TODO: cookies
  // session
  // Flash
  // error handlers
  // 404 not found handlers?

  // TODO: need to load the stores
  // pre-load the current route/view
  // how to skip a re-fetch? already had the data anyway
  if (window.stores) {
    for (var p in Core.stores) {
      var store = Core.stores[p];
      var storename = store.name;
      if (window.stores[storename]) {
        console.log('preload', storename, 'with:', window.stores[storename]);
        store.data = window.stores[storename];
      }
    }
    window.stores = null;
  }

  Client.prefetch = window.prefetch;
  window.prefetch = null;

  // setting listener must be last, since the current route will act immediately
  Client.stopHistory = Client.history.listen(_handler);

  return Client;
};

function _handler(location) {
  var path = location.pathname;
  var method = 'get'; // the client is only going to emit GET history

  console.log(method, ':', path);
  // TODO: figure out query strings and optionals/validation
  var routeInfo = Core.router.handle(method, path);

  var request = new CoreRequest({
    request: location,

    // TODO: the cookies?
    // maybe cookies don't matter to the developer using this?
    // cookies: req.cookies,
    // signedCookies: req.signedCookies,

    method: method,
    path: path,
    protocol: window.location.protocol,
    hostname: window.location.host,

    // no such thing as body params on client side
    params: routeInfo ? routeInfo.params : {},
    query: location.query,

    isServer: false,
    isClient: true,
    isFullRequest: false
  });

  if (!routeInfo) {
    // TODO: need configurable 404s and other errors, especially client side
    console.log('404 client side')
    return;
  }

  var handlers = routeInfo.route.handlers;

  // TODO: have to get with the method? no bueno
  if (!handlers || !handlers[method]) {
    // TODO: need configurable 404s and other errors
    console.log('404 client side')
    return;
  }

  handlers[method](request, function(err) {
    if (err) {
      console.log(err);
      console.log('the main error handler');
    } else {
      console.log('the 404 handler');
    }
  });
}

module.exports = Client;
