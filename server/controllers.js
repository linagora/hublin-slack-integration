'use strict';

module.exports = function(hublin, slack) {

  return {
    createChannel: function(query) {
      var name;
      if (!query.text || query.text.length === 0) {
        name = query.team_domain + '@slack.' + query.channel_name;
      } else {
        name = query.text;
      }

      var members = [];

      var createHublin = function() {
        return hublin.create(name, null, members);
      };

      var sendSlackMessage = function(channel) {
        return slack.sendMessage(query.channel_name, 'Hubl.in conference is available at', [hublin.getConferenceURL(channel._id)]);
      };

      return createHublin().then(function(channel) {
        return sendSlackMessage(channel);
      });
    }
  };
};
