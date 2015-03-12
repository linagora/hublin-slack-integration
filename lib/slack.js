'use strict';

var rp = require('request-promise');
var CHANNEL_PREFIX = '#';

var SlackWebHook = function(options) {
  this.options = options || {};
  if (!this.options.url) {
    throw new Error('Hook URL is required');
  }
};

SlackWebHook.prototype.sendMessage = function(channel, text, links) {

  var additionalText;
  if (links && Array.isArray(links)) {
    additionalText = '';
    links.forEach(function(link) {
      additionalText += '<' + link + '> ';
    });
  }

  var message = text;
  if (additionalText) {
    message += ' ' + additionalText;
  }

  var payload = {
    text: message
  };

  if (channel) {
    payload.channel = CHANNEL_PREFIX + channel;
  }

  if (this.options.username) {
    payload.username = this.options.username;
  }

  if (this.options.icon_url) {
    payload.icon_url = this.options.icon_url;
  }

  var r = {
    method: 'POST',
    url: this.options.url,
    json: true,
    body: payload
  };

  return rp(r);
};

module.exports = SlackWebHook;
