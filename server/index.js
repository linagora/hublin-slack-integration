'use strict';

var ICON_URL = 'https://hubl.in/images/hublin_64.png';
var DEFAULT_PORT = 3000;

module.exports = function(webhook, hublin) {

  var HublinClient = require('hublin-client');
  var hbClient = new HublinClient({url: hublin, source: 'slack'});

  var SlackWebHook = require('./../lib/slack');
  var slackClient = new SlackWebHook({url: webhook, username: 'hublin', icon_url: ICON_URL});

  var express = require('express');
  var app = express();

  var controllers = require('./controllers')(hbClient, slackClient);
  require('./routes')(app, controllers);

  var server = app.listen(process.env.PORT || DEFAULT_PORT, function(err) {
    if (err) {
      return console.log(err);
    }
    var host = server.address().address;
    var port = server.address().port;

    console.log('Hubl.in-Slack.com bridge is listening at http://%s:%s', host, port)
  });

};
