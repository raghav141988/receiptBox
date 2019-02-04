const awsServerlessExpress = require('aws-serverless-express');
const app = require('./app');

const server = awsServerlessExpress.createServer(app);

exports.handler =async (event, context,callback) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  context.callbackWaitsForEmptyEventLoop = false;
context.succeed = (response) => {
  console.log('is context done called?');
  console.log(response);
  if(response!==undefined){
   console.log('sending API gateway response');
  callback(null, response);
  }
    };
    const serverResponse= await awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise;
    context.succeed(serverResponse);
};
