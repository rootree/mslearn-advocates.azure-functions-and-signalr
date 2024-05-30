import { app, input } from '@azure/functions';

const inputSignalR = input.generic({
    type: 'signalRConnectionInfo',
    name: 'connectionInfo',
    hubName: 'default',
    connectionStringSetting: 'Endpoint=https://msl-sigr-signalrad6ea0e79f.service.signalr.net;AccessKey=KpHHWAIAEVWtXlAfbbvTEfzeSWOawr8J/GunqKDjkTc=;Version=1.0;',
});

app.http('open-signalr-connection', {
    authLevel: 'anonymous',
    handler: (request, context) => {
        return { body: JSON.stringify(context.extraInputs.get(inputSignalR)) }
    },
    route: 'negotiate',
    extraInputs: [inputSignalR]
});