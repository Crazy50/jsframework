var historyModule = require('history');
var createHistory = historyModule.createHistory;
var useQueries = historyModule.useQueries;

var Request = require('../request/');
var RespondWith = require('../respond-with');

var Client = function Client(Core) {
  if (Core.Client) {
    return Core;
  }

  Client.history = useQueries(createHistory)();
  // TODO: cookies
  // session
  // Flash
  // error handlers
  // 404 not found handlers?

  // TODO: need to load the stores
  // pre-load the current route/view
  // how to skip a re-fetch? already had the data anyway
  Client.prefetch = window.prefetch;
  window.prefetch = null;

  // setting listener must be last, since the current route will act immediately
  Client.stopHistory = Client.history.listen(_handler);

  Core.Client = Client;

  return Core;
};

function _finalHandler(err) {
  if (err) {
    // TODO: the handling of errors
    console.log(err);
    console.log('the main error handler');
  }
}

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

  handlers[method](request, respondWith, _finalHandler);
}

module.exports = Client;
