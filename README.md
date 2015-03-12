# Hubl.in Slack.com integration

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

## About

Provides nice way to create free videoconference on [https://hubl.in](Hubl.in), a free and open source videoconference service based on webRTC.

## Howto

While waiting to have an official integration on Slack, you will need to manually create some integration steps on Slack and to run the current node-based stuff on a server or in the so-calles Cloud.

1. Create an incoming webhook, cf https://<YOURTEAM>.slack.com/services/new/incoming-webhook
2. Deploy the current Express based server somewhere (You know, git clone, npm install, ...)
3. Start the server

    SLACK_WEBHOOK=URLFROMStep1 node index.js

4. Create a slash command integration on Slack, cf https://<YOURTEAM>.slack.com/services/new/slash-commands
 - Tell slack the command name (/hublin seems a good candidate)
 - Tell slack where to send request ie where you server from step 3 is running. Append the /slash route to the URL.
 - Tell slack to use the GET method

Once all is set, you will be able to create new video conferences from Slack

    /hublin MyConference

Will send you back a message with the conference link.

## License

MIT