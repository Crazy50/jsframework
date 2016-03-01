var Core = require('lagann-bundle-express-react')();
//require('../../bundles/express-react/')().start();

require('./view-models/Hello');
require('./methods/call-maybe');

Core.start();
