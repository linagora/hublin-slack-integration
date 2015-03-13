'use strict';

var HUBLIN_URL = 'https://hubl.in';

var webhook = process.env.SLACK_WEBHOOK;
var hublin = process.env.HUBLIN_URL || HUBLIN_URL;

if (!webhook) {
  throw new Error('You need to set the SLACK_WEBHOOK env variable. You can generate one on the webhook integration page at https://YOURTEAM.slack.com/services/new/incoming-webhook');
}

require('./server')(webhook, hublin);