const { app } = require('@azure/functions');

app.http('httpTrigger', {
methods: ['POST'],
    authLevel: 'anonymous', // Set to anonymous for easier initial testing
    handler: async (request, context) => {
        const body = await request.json();
        return { body: `Hello ${body.name}, the Function received your request!` };
    }
});
