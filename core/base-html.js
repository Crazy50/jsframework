'use strict';

module.exports = function BaseHtml(response, pageTitle, pageMeta, pageCss, pageScript, content) {
  // TODO: maybe dot or something would be better for this
  response.send(
    '<!doctype html>\n'
    + '<html>\n'
      + '<head>\n'
        + '<meta charset="utf-8">\n'
        + '<meta http-equiv="X-UA-Compatible" content="IE=edge">\n'
        + '<title>' + pageTitle + '</title>\n' // TODO how does end user set page title?

        + pageMeta
        + pageCss

        // TODO: how does end user specify the CSS and extra JS to load?
      + '</head>\n'
      + '<body>\n'
      + '<div id="bodymount">\n'
      + content
      + '</div>\n'
      + '<script type="text/javascript" src="/public/core.js"></script>\n' // TODO: what about base urls?
      + pageScript
      + '</body>\n'
      + '</html>'
  )
}
