/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery'], function ($) {

  // Returns binary response as a Blob or an ArrayBuffer.
  //
  // $.ajax({
  //   url: ...,
  //   dataType: 'binary',
  //   success: function (result) {
  //     ...
  //   }
  // })
  //
  // Why the default jQuery AJAX transport cannot be used by passing
  // xhrFields: {responseType: 'blob'} to $.ajax?
  //
  // Setting the responseType on the XMLHttpRequest using the xhrFields
  // doesn't work, because the default jQuery AJAX transport always
  // accesses the responseText, which fails for blob and arraybuffer.

  // Mocking:
  //
  // $.mockjax replaces the original $.ajax, but if a transport is defined
  // for the requested dataType, the alternative xhr implementation in the
  // transport "wins" and the mockjax one is not called.  To get the mockjax
  // working for binary responsesl, the binary transport has to be disabled.
  // However, that will let the original $.ajax transport process the
  // response, which fails from the reason mentioned above.  The mock handler
  // has to return a textual response to let the original $.ajax transport
  // succeed.  This is supported by having the mock handler return data URI.
  //
  // binaryAjaxTransport.setOption({
  //   enabled: false,
  //   mocked: true
  // });
  //
  // An alternative solution could be using content-type-specific converters,
  // but the artificial content type would be passed to the client.
  //
  // $.ajaxSetup({
  //   accepts: {
  //     datauri: "datauri"
  //   },
  //   contents: {
  //     datauri: /datauri/
  //   },
  //   converters: {
  //     'text datauri': dataUriToBlob
  //   }
  // });
  //
  // The original $.ajax transport could be patched to avoid the extra coding
  // in mocks, but the whole purpose of this transport and its mocking support
  // is to avoid patching jQuery...
  
  var binaryTransportOptions = {
    // Disables the binary transport globally
    enabled: true,
    // Enables response conversion gtom data URI to Blob if the binary transport is disabled;
    // this expects the response mocked to returning a textual data URI
    mocked: false
  };

  $.ajaxTransport("+binary", function (options, originalOptions, jqxhr) {
    // Check if the transport was globally disabled or locally enabled
    if (!binaryTransportOptions.enabled && !options.enableBinaryTransport) {
      // Convert data URI to Blob if the transport runs in the mocked mode
      if (binaryTransportOptions.mocked) {
        options.converters || (options.converters = {});
        options.converters['text binary'] = options.responseType === 'arraybuffer' ?
                                            dataUriToArrayBuffer : dataUriToBlob;
      }
      return undefined;
    }

    var xhr, reported;
    return {
      send: function (headers, complete) {
        xhr = options.xhr();
        xhr.open(options.type, options.url, options.async,
            options.username, options.password);
        xhr.responseType = options.responseType || 'blob';
        // Apply custom fields if provided
        if (options.xhrFields) {
          $.each(options.xhrFields, function (name, value) {
            xhr[name] = value;
          });
        }
        // Override mime type if needed
        if (options.mimeType && xhr.overrideMimeType) {
          xhr.overrideMimeType(options.mimeType);
        }
        // Ensure the X-Requested-With header even for requests to the same
        // origin for consistency on the server side
        if (!options.crossDomain && !headers['X-Requested-With']) {
          headers['X-Requested-With'] = 'XMLHttpRequest';
        }
        // Set headers
        $.each(headers, function (name, value) {
          xhr.setRequestHeader(name, value);
        });
        // Listen to events
        xhr.addEventListener('load', function () {
          if (xhr) {
            // file protocol always yields status code 0, assume 200
            complete(xhr.status || 200, xhr.statusText, {binary: xhr.response},
                xhr.getAllResponseHeaders());
            xhr = undefined;
          }
        });
        xhr.addEventListener('error', function () {
          if (xhr) {
            complete(xhr.status, xhr.statusText);
            xhr = undefined;
          }
        });
        try {
          // Do send the request (this may raise an exception)
          xhr.send(options.data);
        } catch (error) {
          // Only rethrow if this hasn't been notified as an error yet
          if (!reported) {
            throw error;
          }
        }
      },
      abort: function () {
        if (xhr) {
          xhr.abort();
          xhr = undefined;
        }
      }
    };
  });

  // Getting/Setting the binary transport options: booleans enabled and mocked

  function getOption(name) {
    return name ? binaryTransportOptions[name] : $.extend({}, true, binaryTransportOptions);
  }

  function setOption(name, value) {
    var options = name;
    if (typeof options !== 'object') {
      options = {};
      options[name] = value;
    }
    $.extend(binaryTransportOptions, true, options);
  }

  // Conversions of data URI to ArrayBuffer of Blob to support mocking

  function dataUriToArrayBuffer(response) {
    var match = /^data:([^;]+);base64,/.exec(response);
    if (match) {
      var data = response.substring(match[0].length),
          byteCharacters = atob(data),
          buffer = new ArrayBuffer(byteCharacters.length),
          bytes = new Uint8Array(buffer),
          i, length;
      for (i = 0, length = byteCharacters.length; i < length; ++i) {
        bytes[i] = byteCharacters.charCodeAt(i);
      }
      response = buffer;
    }
    return response;
  }

  function dataUriToBlob(response) {
    var match = /^data:([^;]+);base64,/.exec(response);
    if (match) {
      var data = response.substring(match[0].length),
          contentType = match[1],
          byteCharacters = atob(data),
          bytes = new Uint8Array(byteCharacters.length),
          i, length;
      for (i = 0, length = byteCharacters.length; i < length; ++i) {
        bytes[i] = byteCharacters.charCodeAt(i);
      }
      response = new Blob([bytes], {type: contentType});
    }
    return response;
  }

  return {
    getOption: getOption,
    setOption: setOption
  };

});
