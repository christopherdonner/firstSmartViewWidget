/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["csui/lib/underscore", "csui/lib/jquery", "csui/utils/url", 'csui/models/node/node.model',
  'csui/utils/base', 'csui/utils/commands', 'i18n!csui/widgets/html.editor/impl/nls/lang',
  'csui/utils/log'
], function (_, $, Url, NodeModel, base, commands, lang, log) {

  var RichTextEditorUtils = {
    isEmptyContentElement: function (el) {
      return $.trim($(el).text());
    },

    checkDomain: function (view, event) {

      var domainUrl = view.connector.connection.url,
          link      = event.target.href;
      view.options.isSameDomain = link.search(new RegExp(domainUrl.split('/api')[0], 'i')) !== -1;
      return view.options.isSameDomain;
    },

    getUrl: function (view, event) {
      var deferred = $.Deferred();
      if (!!event.target.href) {
        var smartLink    = event.target.href.match(/^.*\/app\/(.+)$/i),
            absolute     = new Url(event.target.href).isAbsolute(),
            isSameDomain = absolute ? this.checkDomain(view, event) : true,
            wikiUrl      = event.target.href.match(/^.*\/wiki\/(.+)$/i),
            nodeUrl      = event.target.href.match(/^.*\/open\/(.+)$/i) ||
                           event.target.href.match(/^.*\/nodes\/(.+)$/i),
            objid        = event.target.href.match(/^.*objId\=(.+)$/i), id,
            self         = this;
        if (!smartLink && isSameDomain) { // classic urls of same domain
          if (wikiUrl || objid) { //  urls containing "wiki" or "objId" words
            self.renderLinks({
              event: event,
              connector: view.connector,
              callingViewInstance: view
            }).done(function () {
              deferred.resolve();
            });
          } else if (nodeUrl) { // classic url containing open or nodes of samedomain
            id = nodeUrl[1];
            this.updateLink(event, id);
            deferred.resolve();
          }
          else { // classic url of samedomain that doesnt contain  wiki or nodes or objid or not proper
            deferred.resolve();
          }
        } else {  // smart url or (or) and different domain url
          deferred.resolve();
        }

      }
      return deferred.promise();
    },

    renderLinks: function (args) {
      var node, deferred = $.Deferred();
      var target = !!args.event.target.href ? $(args.event.target) :
                   $(args.event.target).parents('a'),
          that   = args.callingViewInstance,
          self   = this;
      args.event.target = target[0];
      if (!!args.event.target.href.match(/^.*\/wiki\/[0-9]+\/(.+)$/i) ||
          !!args.event.target.href.match(/^.*\/wiki\/[0-9]+$/i)) {
        args.event.stopPropagation();
        args.event.preventDefault();
        if (!!args.event.target.href.match(/^.*\/wiki\/[0-9]+\/(.+)$/i)) {
          node = args.event.target.href.match(/^.*\/wiki\/(.+)\/(.+)$/i);
          node = parseInt(node[1]);
          self._getWikiPageId(args, node, args.event.target.href).done(function (res, node) {
            self.id = res;
            if (!!node) {
              self.updateLink(args.event, node.id);
            } else {
              log.info(lang.brokenLinkMessage);
            }
            deferred.resolve();
          });
        } else if (!!args.event.target.href.match(/^.*\/wiki\/[0-9]+$/i)) {
          node = args.event.target.href.match(/^.*\/wiki\/(.+)$/i);
          node = parseInt(node[1]);
          self.updateLink(args.event, node);
          deferred.resolve();
        }

      }
      else if (!!args.event.target.href.match(/^.*objId\=(.+)$/)) {
        args.event.stopPropagation();
        args.event.preventDefault();
        var objIdIndex = args.event.target.href.match(/^.*objId\=(.+)$/)[1];
        if (objIdIndex !== -1) {
          node = this.getNewNodeModel({
            attributes: {
              id: parseInt(objIdIndex)
            },
            connector: args.connector
          });
          self.updateLink(args.event, node.attributes.id);
        }
        deferred.resolve();
      }
      return deferred.promise();
    },

    getNewNodeModel: function (options) {
      return new NodeModel(options.attributes, {
        connector: options.connector,
        commands: commands.getAllSignatures(),
        fields: options.fields || {},
        expand: options.expand || {}
      });
    },

    updateLink: function (el, nodeId) {
      var cslinkPattern = /^.*\/(cs\.\w{3}|livelink\.\w{3}|llisapi\.\w{3}|llisapi|cs|livelink).*$/,
          id            = !!nodeId && nodeId,
          cslink        = el.target.href.match(cslinkPattern),
          newHref       = !!cslink && cslink.length && el.target.href.substring(0,
              el.target.href.indexOf("/".concat(cslink[1])) + "/".concat(cslink[1]).length);
      el.target.href = !!newHref && newHref.length ?
                       newHref.concat("/app/nodes/", id) : el.target.href;
    },

    _getWikiPageId: function (self, wikiId, targetHref) {
      var $wikiPageName  = decodeURIComponent(targetHref.substring(
          targetHref.lastIndexOf("/") + 1, targetHref.length)),
          dfd            = $.Deferred(),
          connector      = self.connector,
          collectOptions = connector.extendAjaxOptions({
            url: this._getWikiContainerUrl(self, wikiId),
            type: 'GET'
          });

      $.ajax(collectOptions).done(function (resp) {
        resp.targetWikiPageNode = resp.results.find(function (element) {
          if (element.name === $wikiPageName) {
            return element;
          }
        });
        if (!!resp.targetWikiPageNode && !!resp.targetWikiPageNode.id) {
          dfd.resolve(resp.targetWikiPageNode.id, resp.targetWikiPageNode);
        } else {
          dfd.resolve(-1);
        }
      }).fail(function (resp) {
        dfd.reject(resp);
      });
      return dfd.promise();
    },

    _getWikiContainerUrl: function (self, wikiContainerId) {
      return self.connector.connection.url.replace('/v1', '/v2') + '/wiki/' + wikiContainerId +
             "/wikipages";
    },

    _getNicknameId: function (self, nickName) {
      var deferred       = $.Deferred(),
          collectOptions = self.connector.extendAjaxOptions({
            url: self.connector.connection.url.replace("/api/v1", "/api/v2") +
                 "/wiki/nickname/" + nickName + "?actions=open",
            requestType: "nickname",
            view: this,
            type: "GET"
          });
      nickName && $.ajax(collectOptions).done(function (response) {
        deferred.resolve(response);
      }).fail(function(){
        deferred.reject();
      });
      return deferred.promise();
    }
  };
  return RichTextEditorUtils;

});