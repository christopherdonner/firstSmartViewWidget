/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */



'use strict';

var path = require('path'),
    fontFace = /@font-face\s*\{[^\}]*}/g,
    fontUrl = /url\(["']?([^\?#"'\)]+\.(?:eot|svg|ttf|woff|woff2))((?:\?[^#"'\)]*)?(?:#[^"'\)]*))?["']?\)/g,
    fontType = /\.([a-zA-Z]+)2?$/;

module.exports = function (grunt) {

  function getDataUri(fontFile) {
    var typeMatch = fontType.exec(fontFile),
        faceContent = grunt.file.read(fontFile),
        fontEncoded = new Buffer(faceContent).toString('base64');
    return 'data:font/' + typeMatch[1] + ';base64,' + fontEncoded;
  }

  function embedFontUrls(faceContent, options) {
    var urlMatch;
    while ((urlMatch = fontUrl.exec(faceContent))) {
      var fontFile = urlMatch[1];
      if (fontFile.indexOf(':') < 0) {
        if (!path.isAbsolute(fontFile)) {
          fontFile = path.join(options.baseDir, fontFile);
        }
        var fontAnchor = urlMatch[2] || '',
            fontEmbedded = 'url("' + getDataUri(fontFile) + fontAnchor + '")';
        faceContent = faceContent.substr(0, urlMatch.index) + fontEmbedded +
          faceContent.substr(urlMatch.index + urlMatch[0].length);
      }
    }
    return faceContent;
  }

  function updateFontFaces(fileContent, options) {
    var faceMatch;
    while ((faceMatch = fontFace.exec(fileContent))) {
      var faceContent = embedFontUrls(faceMatch[0], options);
      fileContent = fileContent.substr(0, faceMatch.index) + faceContent +
        fileContent.substr(faceMatch.index + faceMatch[0].length);
    }
    return fileContent;
  }

  function processStylesheet(fileSrc, fileDest, options) {
    try {
      grunt.log.subhead('Processing stylesheet "' + fileSrc + '"');
      if (!options.baseDir) {
        options.baseDir = path.dirname(fileSrc);
      }
      var fileContent = grunt.file.read(fileSrc);
      fileContent = updateFontFaces(fileContent, options);
      grunt.file.write(fileDest, fileContent);
    } catch (error) {
      grunt.log.error(error);
      grunt.fail.warn('Processing stylesheet "' + fileSrc + '" failed\n');
    }
  }
  
  grunt.registerMultiTask('embedFonts', "Replace font URLs in stylesheets with data URIs including base64-encoded file content", function () {
    var options = this.options();
    this.files.forEach(function (file) {
      processStylesheet(file.src[0], file.dest, options);
    });
  });
};
