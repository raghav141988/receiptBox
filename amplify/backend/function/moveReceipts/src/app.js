/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

var express = require('express')
var mime = require('mime-types')
var uuid = require('node-uuid');
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')


// declare a new express app
var app = express()
app.use(awsServerlessExpressMiddleware.eventContext())

app.use(bodyParser.json())


const AWS = require('aws-sdk');
const async = require('async');
const bucketName = 'receiptmanagerstorage';
//const oldPrefix = 'abc/';
//const newPrefix = 'xyz/';
const dynamodb = new AWS.DynamoDB.DocumentClient();
let tableName = "Receipts";
const s3 = new AWS.S3({
    apiVersion: '2006-03-01',

    region: 'us-east-1'
});

// 1) List all the objects in the source "directory"


// Enable CORS for all methods
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
});


/**********************
 * Example get method *
 **********************/


/****************************
 * Example post method *
 ****************************/
app.post('/moveReceipts', async function (req, res) {

    const oldPrefix = req.apiGateway.event.requestContext.identity.cognitoAuthenticationProvider.split(':CognitoSignIn:')[1] ;
    const newPrefix = req.apiGateway.event.requestContext.identity.cognitoIdentityId ;
  
    let succeededReceipts = [];
    let failedReceipts = [];
    let errorObj = {};
    let paramsS3Delete = {
        Bucket: bucketName,
        Delete: {
            Objects: []
        }
    };


    const isReceiptFolder=req.body['isReceiptFolder'];
    const receiptPrefix=isReceiptFolder?'protected':'public';
    const receiptSourceBasePath=isReceiptFolder?receiptPrefix+"/"+newPrefix:receiptPrefix;

    for (var i = 0; i < req.body.receipts.length; i++) {
        const receipt = req.body.receipts[i];
       
      
        const extension = mime.extension(receipt.contentType);
        const fileName = uuid.v1() + "." + extension;
        const destinationFileName = (receiptPrefix+'/' + (receipt.receiptKey) + fileName).replace(oldPrefix, newPrefix).replace(receiptPrefix, 'private');
        const dbReceiptId = destinationFileName.replace(+"/", "");
       

        let params = {
            Bucket: bucketName,
            CopySource: bucketName + '/'+receiptSourceBasePath+'/' + encodeURIComponent(receipt.receiptKey),
            Key: destinationFileName
        };
        console.log('file to be copied to');
        console.log(params);
        //S3 COPY as async function
        try {
            const s3copyResponse = await s3.copyObject(params).promise();
            console.log('s3 copy response completed**');
            console.log(s3copyResponse);

            const titleCat = receipt.title + "-" + receipt.category;
            const titleCatKey = 'title_category';
            const dbRowData = {
                ...receipt,
                 isLatestReceipt:false,
                receiptKey: dbReceiptId.replace('private/', '').replace(newPrefix+"/",''),
                [titleCatKey]: titleCat,
                userSub:req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH,

            }
            let putItemParams = {
                TableName: tableName,
                Item: dbRowData
            }
            //SAVE THE NEW FILES TO DYNAMO DB
            try {
                const dbResponse = await dynamodb.put(putItemParams).promise();
                
                paramsS3Delete.Delete.Objects.push({
                    Key: receiptSourceBasePath+'/' + (receipt.receiptKey)
                });

                succeededReceipts.push(
                     {
                        ...receipt,

                        latestReceiptKey: dbReceiptId.replace('private/', '').replace(newPrefix+"/",'')

                    }

                );
            } catch (err) {
                failedReceipts.push({
                    receipt: receipt,
                    error: err
                })
            }
        } catch (err) {
            //S3 Copy failed and capture in failed
            failedReceipts.push({
                ...receipt,
                error: err
            })
        }


    }
    try {
    const deleteResponse = await s3.deleteObjects(paramsS3Delete).promise();
    }
    catch(err){
        console.log('Delete failure');
        console.log(err);
    }
    let operationStatus="";
    if(succeededReceipts.length==0&& failedReceipts.length>=1){
        //TOTAL FAILURE
        operationStatus='FAILURE';
    }
    else if(succeededReceipts.length>=1 && failedReceipts.length>=1){
   //PARTIAL FAILURE
   operationStatus='PARTIAL_SUCCESS';
    }
    else {
        //TOTAL SUCCESS
        operationStatus='SUCCESS';
    }
    const finalResponse ={
        operationStatus:operationStatus,
        succeededReceipts:succeededReceipts,
        failedReceipts:failedReceipts
    }
    res.json(finalResponse);

});


app.listen(3000, function () {
    console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;