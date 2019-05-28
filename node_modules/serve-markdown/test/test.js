var request = require('supertest')
  , serveMarkdown = require('../')
  , path = require('path')
  , http = require('http')
  , fs = require('fs');


describe('Server-markdown', function () {
  describe('common function', function() {
    it('url contains invalid chars', function(done) {
      var app = createServer();
      request(app)
        .get('/%EA.md')
        .expect(404)
        .end(function (err, res) {
          if (err) {
             done(err);
          }
          done();
        });
    })
  });
  describe('title', function () {
    it('title is a string', function (done) {
      var option = {
        template: '{{content}}',
        title: 'test-server'
      };
      var app = createServer(option);

      request(app)
        .get('/p.md')
        .expect(200, '<p>serve-markdown</p>\n', done)
    });
    it('title is a function', function (done) {
      var option = {
        template: '{{title}}{{content}}',
        title: function (name) {
          return name + '-fun';
        }
      };
      var app = createServer(option);

      request(app)
        .get('/p.md')
        .expect(200, 'p.md-fun<p>serve-markdown</p>\n', done)
    });
    it('use default title', function (done) {
      var option = {
        template: '{{title}}{{content}}'
      };
      var app = createServer(option);

      request(app)
        .get('/p.md')
        .expect(200, 'p.md<p>serve-markdown</p>\n', done);
    });
  });

  describe('use path in option', function () {
    it('Both template and style are path', function (done) {
      var option = {
        template: path.resolve(__dirname, './fixtures/template.html'),
        style: path.resolve(__dirname, './fixtures/screen.css')
      };
      var app = createServer(option);

      var expPath = path.resolve(__dirname, './expected/p.html');
      // trim the \n
      // TODO why the \n
      var expected = fs.readFileSync(expPath, 'utf8')
        .replace(/\n/g, '')
        .replace(/ +/g, ' ');

      request(app)
        .get('/p.md')
        .expect(function (res) {
          res.text
            .replace(/\n/g, '')
            .replace(/ +/g, ' ')
            .should.equal(expected);
        })
        .end(done);
    });
  });
});

function createServer(option) {
  var root = path.resolve(__dirname, './fixtures/');
  var _serveMarkdown = serveMarkdown(root, option || {});

  return http.createServer(function (req, res) {
    _serveMarkdown(req, res, function(err) {
      res.statusCode = err ? (err.status || 500) : 404;
      res.end(err ? err.message : 'Not Found');
    })

  })
}
