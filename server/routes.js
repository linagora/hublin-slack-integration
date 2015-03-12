'use strict';

module.exports = function(app, controllers) {

  app.get('/', function(req, res) {
    return res.status(200).json({
      description: 'Hubl.in to Slack.com bridge',
      information: 'https://hubl.in',
      contact: 'hublin@linagora.com'
    });
  });

  app.get('/slash', function(req, res) {
    controllers.createChannel(req.query)
      .catch(function(err) {
        console.log(err);
      })
      .finally(function() {
        return res.sendStatus(200);
      });
  });
};
