import { app, output, CosmosDBv4FunctionOptions, InvocationContext } from "@azure/functions";

const goingOutToSignalR = output.generic({
    type: 'signalR',
    name: 'signalR',
    hubName: 'default',
    connectionStringSetting: 'Endpoint=https://msl-sigr-signalrad6ea0e79f.service.signalr.net;AccessKey=KpHHWAIAEVWtXlAfbbvTEfzeSWOawr8J/GunqKDjkTc=;Version=1.0;',
});

export async function dataToMessage(documents: unknown[], context: InvocationContext): Promise<void> {

    try {

        context.log(`Documents: ${JSON.stringify(documents)}`);

        documents.map(stock => {
            // @ts-ignore
            context.log(`Get price ${stock.symbol} ${stock.price}`);
            context.extraOutputs.set(goingOutToSignalR,
                {
                    'target': 'updated',
                    'arguments': [stock]
                });
        });
    } catch (error) {
        context.log(`Error: ${error}`);
    }
}

const options: CosmosDBv4FunctionOptions = {
    connection: 'AccountEndpoint=https://signalr-cosmos-ab80cdf907.documents.azure.com:443/;AccountKey=jp5YoLb5Ltn9ZxzMO259YjU01xv9gK4DrifaycodlD7pPgCjpWJDs55cQ42gRsmptM5op78vxC75ACDbG5N50Q==',
    databaseName: 'stocksdb',
    containerName: 'stocks',
    createLeaseContainerIfNotExists: true,
    feedPollDelay: 500,
    handler: dataToMessage,
    extraOutputs: [goingOutToSignalR],
};

app.cosmosDB('send-signalr-messages', options);