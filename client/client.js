var historyModule = require('history');
var createHistory = historyModule.createHistory;
var useQueries = historyModule.useQueries;

var Request = require('lagann-request');
var Response = require('lagann-response');

var Client = function Client(Core) {
  if (Core.Client) {
    return Core;
  }

  var history = useQueries(createHistory)();
  // TODO: cookies
  // session
  // Flash
  // error handlers
  // 404 not found handlers?

  // TODO: need to load the stores
  // pre-load the current route/view
  // how to skip a re-fetch? already had the data anyway

  Core.Client = {
    history: history,
    prefetch: window.prefetch
  };

  window.prefetch = null;

  Core.queueToStart(function() {
    // setting listener must be last, since the current route will act immediately
    Core.Client.stopHistory = history.listen(_handler);
  });

  return Core;
};

function _finalHandler(err) {
  if (err) {
    // TODO: the handling of errors
    console.log(err);
    console.log(err.stack);
    console.log('the main error handler');
  }
}

function _handler(location) {
  var path = location.pathname;
  var method = 'get'; // the client is only going to emit GET history

  console.log(method, ':', path);
  // TODO: figure out query strings and optionals/validation
  var routeInfo = Core.router.handle(method, path);

  var request = new Request({
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
  var response = new Response({
    request: request,
    response: null
  })

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

  handlers[method](request, response, _finalHandler);
}

module.exports = Client;
