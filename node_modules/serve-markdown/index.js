var marked = require('marked')
  , merge = require('util-merge')
  , debug = require('debug')('serve-markdown')
  , createError = require('http-errors')
  , path = require('path')
  , decode = require('urldecode')
  , fs = require('fs');

exports = module.exports = function serveMarkdown(root, options) {
  if (!root) {
    throw new TypeError('root path required')
  }

  options = merge({
    template: path.join(__dirname, 'public', 'template.html'),
    title: function (fileName) {
      return fileName;
    },
    classes: 'sm-content',
    style: path.join(__dirname, 'public', 'screen.css')
  }, options);

  initMarked(options.mdOptions);

  return function (req, res, next) {
    var fp = req.url;
    var ext = path.extname(fp).substr(1);

    fp = path.join(root, fp);
    fp = decode(fp);
    if (!~fp) {
      debug('path contains invalid chars.');
      return next(createError(404, 'contains invalid chars'));
    }

    var isExists = fs.existsSync(fp);
    if (isExists && (ext === 'md' || ext === 'markdown')) {
      debug('serve file : %s', path.relative(root, fp));
      var html = marked(fs.readFileSync(fp, 'utf8'));

      var template = options.template;
      debug('template path %s', options.template);
      if (fs.existsSync(template) && fs.statSync(template).isFile()) {
        template = fs.readFileSync(template, 'utf8');
      }

      var title = options.title;
      if (typeof title === 'function') {
        title = title(path.basename(fp));
      }

      var style = options.style;
      if (fs.existsSync(style) && fs.statSync(style).isFile()) {
        style = fs.readFileSync(style, 'utf8');
      }

      var classes = options.classes;
      if (Array.isArray(classes)) {
        classes = classes.join(' ')
      }

      html = template
        .replace(/{{title}}/g, title)
        .replace(/{{style}}/g, style)
        .replace(/{{classes}}/g, classes)
        .replace(/{{content}}/g, html);

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end(html);
    } else {
      return next();
    }
  }
};

// setup markdown parser
function initMarked(options) {
  var mdOptions = {
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
  };

  mdOptions = merge(mdOptions, options);
  marked.setOptions(mdOptions);
}
