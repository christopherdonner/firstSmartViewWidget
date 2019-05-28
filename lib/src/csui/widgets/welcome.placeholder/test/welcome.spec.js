/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/marionette',
  'csui/widgets/welcome.placeholder/welcome.placeholder.view',
  'csui/widgets/welcome.placeholder/impl/welcome.video/welcome.video.view',
  'csui/utils/contexts/page/page.context',
  'csui/utils/contexts/factories/user',
  'i18n!csui/widgets/welcome.placeholder/impl/nls/lang',
  './welcome.mock.data.js'
], function ($, _, Marionette, WelcomeView, WelcomeVideo, PageContext,
    UserModelFactory, lang, mockData) {
  'use strict';

  describe('Welcome Widget', function () {
    var context, welcomeRegion;

    beforeAll(function () {
      mockData.enable();
    });

    afterAll(function () {
      mockData.disable();
    });

    it('Initialize context', function (done) {
      context = new PageContext();
      context.fetch().done(function () {
        var welcomeViewHtml = $('<div id="wrapper" style="height:600px; width:600px">');
        $('body').append(welcomeViewHtml);
        $('head').append(
            '<style type="text/css">div#wrapper div.csui-message {margin: 1.5em 10%;margin-bottom: 0;}</style>');

        welcomeRegion = new Marionette.Region({
          el: '#wrapper'
        });
        done();
      });
    });

    it('Open welcome tile with all default settings', function () {
      var welcomeView = new WelcomeView({context: context});
      welcomeRegion.show(welcomeView);

      var welcomeEl = welcomeView.$el;
      expect(welcomeEl.find('.csui-message').length).toBe(1);
      expect(welcomeEl.find('.csui-videoButton').length).toBe(1);
      expect(welcomeEl.find('.csui-message > p').text() === lang.message).toBe(true);
      welcomeEl.remove();
      welcomeView.destroy();
    });

    it('Open welcome tile with video and message removed.', function () {
      var welcomeView = new WelcomeView({
        context: context,
        data: {includeVideo: false, includeMessage: false}
      });
      welcomeRegion.show(welcomeView);

      var welcomeEl = welcomeView.$el;
      expect(welcomeEl.find('.csui-message').length).toBe(0);
      expect(welcomeEl.find('.csui-videoButton').length).toBe(0);
      welcomeEl.remove();
      welcomeView.destroy();
    });

    it('Open welcome tile with message that is too long for being displayed and an elipsis' +
       ' should appear but no whitespace found', function () {
      var longMessage = 'Ultimately,_Enterprise_World_is_about_the_people_who_use_our_software,' +
                        '_partner_with_us_to_develop_it_and_those_who_share_our_vision_of_deve' +
                        'loping_technologies_that_enable_a_better_way_to_work_You_spoke_and_we' +
                        '_listened._So,_in_addition_to_a_new_venue,_we’ve_overhauled_this_year’' +
                        's_event_based_on_your_feedback_This_year’s_conference_boasts_100_per' +
                        'cent_more_breakout_sessions_and_technical_speakers,_75_percent_more_t' +
                        'echnical_sessions,_and_50_percent_more_networking_opportunities—to_d' +
                        'eliver_100_percent_value.';

      var longMessageShortened =
              'Ultimately,_Enterprise_World_is_about_the_people_who_use_our_software,_partner_with_us_to_develop_it_and_those_who_share_our_vision_of_developing_technologies_that_enable_a_better_way_to_work_You_spoke_and_we_listened._So,_in_addition_to_a_new_venue,_we’ve_overhauled_this_year’s_event_based_on_your_feedback_This_year’s_conference_boasts_100_percent_more_breakout_sessions_and_technical_speakers,_75_percent_more_technical_sessions,_and_50_percent_more_networking_opportunities—to_deliver_100_percent_value.';
      var welcomeView = new WelcomeView({context: context, data: {message: longMessage}});

      var container = $('body>div#wrapper');
      container.width('603px');
      container.height('300px');

      welcomeRegion.show(welcomeView);
      var welcomeEl = welcomeView.$el;

      expect(welcomeEl.find('.csui-message').length).toBe(1);
      expect(welcomeEl.find('.csui-videoButton').length).toBe(1);
      var longMessageDisplayed = welcomeEl.find('.csui-message > p').text();
      expect(longMessageDisplayed === longMessageShortened).toBe(true);
      welcomeEl.remove();
      welcomeView.destroy();
    });

    it('Open welcome tile with message that is too long for being displayed and an elipsis' +
       ' should appear', function () {
      var longMessage = 'Ultimately, Enterprise World is about the people who use our software,' +
                        ' partner with us to develop it and those who share our vision of deve' +
                        'loping technologies that enable a better way to work You spoke and we' +
                        ' listened. So, in addition to a new venue, we’ve overhauled this year’' +
                        's event based on your feedback This year’s conference boasts 100 per' +
                        'cent more breakout sessions and technical speakers, 75 percent more t' +
                        'echnical sessions, and 50 percent more networking opportunities—to d' +
                        'eliver 100 percent value.';

      var longMessageShortened = 'Ultimately, Enterprise World is about the people who use our...';
      var welcomeView = new WelcomeView({context: context, data: {message: longMessage}});

      var container = $('body>div#wrapper');
      container.width('603px');
      container.height('300px');

      welcomeRegion.show(welcomeView);
      var welcomeEl = welcomeView.$el;

      var welcomeMessage = $('.csui-hero-tile .csui-message > p');

      var welcomeMessageContainer = $('.csui-hero-tile .csui-message');
      welcomeView.trigger('dom:refresh');

      expect(welcomeEl.find('.csui-message').length).toBe(1);
      expect(welcomeEl.find('.csui-videoButton').length).toBe(1);
      var longMessageDisplayed = welcomeEl.find('.csui-message > p').text();
      expect(longMessageDisplayed.length).toBeLessThan(longMessage.length);

      expect(longMessageDisplayed.indexOf('...')).toBeGreaterThan(0);
      welcomeEl.remove();
      welcomeView.destroy();
    });

    describe('No server options provided', function () {
      it('Message option maintains default value', function () {
        var welcomeView = new WelcomeView({
          context: context,
          data: {}
        });
        welcomeRegion.show(welcomeView);
        var welcomeEl = welcomeView.$el;
        expect(welcomeView.options.data.message).toBe(lang.message);
        welcomeEl.remove();
        welcomeView.destroy();
      });

      it('Video options maintain default values', function () {
        var welcomeVideo = new WelcomeVideo({context: context, data: {}});
        expect(welcomeVideo.options.data.videoSrc).toBe(lang.videoSrc);
        expect(welcomeVideo.options.data.videoPoster).toBe(lang.videoPoster);
        welcomeVideo.destroy();
      });
    });

    describe('Empty server options provided', function () {
      it('Message option maintains default value', function () {
        var welcomeView = new WelcomeView({
          context: context,
          data: {message:''}
        });
        welcomeRegion.show(welcomeView);
        var welcomeEl = welcomeView.$el;
        expect(welcomeView.options.data.message).toBe(lang.message);
        welcomeEl.remove();
        welcomeView.destroy();
      });

      it('Video options maintain default values', function () {
        var welcomeVideo = new WelcomeVideo({context: context, data:{videoSrc:'', videoPoster: ''}});

        expect(welcomeVideo.options.data.videoSrc).toBe(lang.videoSrc);
        expect(welcomeVideo.options.data.videoPoster).toBe(lang.videoPoster);
        welcomeVideo.destroy();
      });
    });
  });
});
