/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'require', 'csui/lib/jquery',
      'csui/lib/backbone'],
    function (module, _require, $, Backbone) {
      var SkypeAttributeModel = {
        accessToken: null,
        applicationsURL: null,
        batchURL: null,
        autoDiscoverURL: null,
        iFrameURL: null,
        serverURL: null,
        pluginEnabled: false,
        internalServerURL: null,
        externalServerURL: null,
        nameCtrl: null,
        chatEnabled: false,
        presenceEnabled: false,
        chatDomain: null,
        eventHandling: false,
        loginUserSIP:null,

        setLoginUserSIP:function(sip) {
          this.loginUserSIP = sip;
        },

        getLoginUserSIP:function() {
          return this.loginUserSIP;
        },

        setPluginEnabled: function (pluginEnabled) {
          this.pluginEnabled = pluginEnabled;
        },

        isPluginEnabled: function () {
          return this.pluginEnabled;
        },

        setChatDomain: function (chatDomain) {
          this.chatDomain = chatDomain;
        },

        getChatDomain: function () {
          return this.chatDomain;
        },

        setChatEnabled: function (chatEnabled) {
          this.chatEnabled = chatEnabled;
        },

        getChatEnabled: function () {
          return this.chatEnabled;
        },

        setPresenceEnabled: function (presenceEnabled) {
          this.presenceEnabled = presenceEnabled;
        },

        getPresenceEnabled: function () {
          return this.presenceEnabled;
        },

        setInternalServerURL: function (internalServerURL) {
          this.internalServerURL = internalServerURL;
        },

        getInternalServerURL: function () {
          return this.internalServerURL;
        },

        setExternalServerURL: function (externalServerURL) {
          this.externalServerURL = externalServerURL;
        },

        getExternalServerURL: function () {
          return this.externalServerURL;
        },

        setAccessToken: function (accessToken) {
          this.accessToken = accessToken;
        },

        getAccessToken: function () {
          return this.accessToken;
        },

        setApplicationsURL: function (applicationsURL) {
          this.applicationsURL = applicationsURL;
        },

        getApplicationsURL: function () {
          return this.applicationsURL;
        },

        setBatchURL: function (batchURL) {
          this.batchURL = batchURL;
        },
        getBatchURL: function () {
          return this.batchURL;
        },

        setEventURL: function (eventURL) {
          this.eventURL = eventURL;
        },

        getEventURL: function () {
          return this.eventURL;
        },

        setpresenceSubscriptionURL: function (presenceSubscriptionURL) {
          this.presenceSubscriptionURL = presenceSubscriptionURL;
        },

        getpresenceSubscriptionURL: function () {
          return this.presenceSubscriptionURL;
        },

        setCurrentSubscriptionURL: function (currentSubscriptionURL) {
          this.currentSubscriptionURL = currentSubscriptionURL;
        },
        getCurrentSubscriptionURL: function () {
          return this.currentSubscriptionURL;
        },

        setAutoDiscoverURL: function (autoDiscoverURL) {
          this.autoDiscoverURL = autoDiscoverURL;
        },

        getAutoDiscoverURL: function (autoDiscoverURL) {
          return this.autoDiscoverURL;
        },

        setIFrameURL: function (iFrameURL) {
          this.iFrameURL = iFrameURL;
        },

        getIFrameURL: function () {
          return this.iFrameURL;
        },

        setServerURL: function (serverURL) {
          if (this.internalServerURL.indexOf("https://") > -1) {
            this.serverURL = "https://" + serverURL;
          } else {
            this.serverURL = "http://" + serverURL;
          }
        },

        getServerURL: function () {
          return this.serverURL;
        },

        setNameCtrl: function (nameCtrl) {
          this.nameCtrl = nameCtrl;
        },

        getNameCtrl: function () {
          return this.nameCtrl;
        }
      }
      return SkypeAttributeModel;
    });