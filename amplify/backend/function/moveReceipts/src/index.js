const awsServerlessExpress = require('aws-serverless-express');
const app = require('./app');
//var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
//app.use(awsServerlessExpressMiddleware.eventContext())


const server = awsServerlessExpress.createServer(app);

exports.handler = async(event, context,callback) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  console.log(`EVENT: ${JSON.stringify(event)}`);
context["callback"]=callback;
event.lambdacontext=context;
console.log(event);
  //console.log(callback);


//   var response = {
//     "statusCode": 200,
//     "headers": {
//         "my_header": "my_value"
//     },
//     "body": JSON.stringify(responseBody),
//     "isBase64Encoded": false
// };
//context.callbackWaitsForEmptyEventLoop = false;
console.log('proxy called****');
context.callbackWaitsForEmptyEventLoop = false;
context.succeed = (response) => {
  console.log('is context done called?');
  console.log(response);
  if(response!==undefined){
   console.log('sending API gateway response');
  callback(null, response);
  }
    };

 const serverResponse= await awsServerlessExpress.proxy(server, event,context, 'PROMISE').promise;

console.log('proxy done****');
console.log(serverResponse);
context.succeed(serverResponse);
//onsole.log(proxyresponse);


  

};
