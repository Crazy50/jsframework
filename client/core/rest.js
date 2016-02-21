'use strict';

var axios = require('axios');

module.exports = {
  createCaller: function(method, url) {
    return function(data) {
      return axios[method](url, data)
        .then(function(res) {
          // TODO: populate stores
          return res.data;
        })
        .catch(function(res) {
          // TODO: error handling is needed all over the place
          // TODO: might be a good idea to reformat the error and throw back
        });
    };
  }
};
