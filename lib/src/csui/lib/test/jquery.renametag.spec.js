/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/jquery.renametag'], function ($, _) {
  'use strict';

  describe('jQuery.renameTag', function () {
    beforeEach(function () {
      this.parent = $('<div>');
    });

    it('Should properly return jQuery object', function() {
      this.parent.append('<div></div>');
      var result = this.parent.find('div').renameTag('span');
      expect(result.hasClass).toBeTruthy();
    });

    it('Should replace tag names', function () {
      this.parent.append('<div></div>');
      this.parent.find('div').renameTag('span');
      expect(this.parent.find('span').length).not.toEqual(0);
      expect(this.parent.find('div').length).toEqual(0);
    });

    it('Should perserve innerHTML text', function () {
      this.parent.append('<div>innerHTML</div>');
      this.parent.find('div').renameTag('span');
      expect(this.parent.find('span').html()).toEqual('innerHTML');
    });

    it('Should perserve innerHTML elements', function () {
      this.parent.append('<div><p>test</p></div>');
      this.parent.find('div').renameTag('span');
      expect(this.parent.find('span').html()).toEqual('<p>test</p>');
    });

    it('Should perserve attributes of innerHTML elements', function () {
      this.parent.append('<div class="testing-div"><p class="attr" id="test-paragraph">test</p></div>');
      this.parent.find('div').renameTag('span');
      expect(this.parent.find('span').html()).toEqual('<p class="attr" id="test-paragraph">test</p>');
    });

    it('Should perserve attributes of the element being changed', function () {
      this.parent.append('<div class="testing-div"><p class="attr" id="test-paragraph">test</p></div>');
      this.parent.find('div').renameTag('span');
      expect(this.parent.html()).toEqual('<span class="testing-div"><p class="attr" id="test-paragraph">test</p></span>');
    });

    it('Should work as expected with passed a jQuery selector', function () {
      this.parent.append('<div class="testing-div"><p class="attr" id="test-paragraph">test</p></div>');
      this.parent.find('.attr').renameTag('span');
      expect(this.parent.find('> div').hasClass('testing-div')).toBeTruthy();
      expect(this.parent.find('> div > span').hasClass('attr')).toBeTruthy();
      expect(this.parent.find('> div > span.attr#test-paragraph').length).toEqual(1);
      expect(this.parent.find('> div > span.attr#test-paragraph').html()).toEqual('test');
    });
  });
});