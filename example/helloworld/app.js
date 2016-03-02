var Core = require('lagannjs')();
require('lagannjs-viewengine-react')();
//require('../../')().start();

require('./view-models/Hello');
require('./methods/call-maybe');

Core.start();
