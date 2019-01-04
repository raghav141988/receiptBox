/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

var express = require('express')
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())


const AWS = require('aws-sdk');
const async = require('async');
const bucketName = 'receiptmanagerstorage';
//const oldPrefix = 'abc/';
//const newPrefix = 'xyz/';

const s3 = new AWS.S3({
    params: {
        Bucket: bucketName
    },
    region: 'us-east-1'
});


// 1) List all the objects in the source "directory"


// Enable CORS for all methods
app.use(function(req, res, next) {
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

app.post('/moveItems', function(req, res) {
  // Add your code here
  //GET THE USER SUB HERE
  const oldPrefix = req.apiGateway.event.requestContext.identity.cognitoAuthenticationProvider.split(':CognitoSignIn:')[1]
  const newPrefix = req.apiGateway.event.requestContext.identity.cognitoIdentityId


  s3.listObjects({
    Prefix: 'public/'+oldPrefix
}, function (err, data) {



    if (data.Contents.length) {

        // Build up the paramters for the delete statement
        let paramsS3Delete = {
            Bucket: bucketName,
            Delete: {
                Objects: []
            }
        };

        // Expand the array with all the keys that we have found in the ListObjects function call, so that we can remove all the keys at once after we have copied all the keys
        data.Contents.forEach(function (content) {
            paramsS3Delete.Delete.Objects.push({
                Key: content.Key
            });
        });

        // 2) Copy all the source files to the destination
        async.each(data.Contents, function (file, cb) {
            var params = {
                CopySource: bucketName + '/' + file.Key,
                Key: file.Key.replace(oldPrefix, newPrefix)
            };
            console.log('file to be copied to');
            console.log(params);
            
            s3.copyObject(params, function (copyErr, copyData) {

                if (copyErr) {
                    console.log(err);
                } else {
                    console.log('Copied: ', params.Key);
                }
                cb();
            });
        }, function (asyncError, asyncData) {
            // All the requests for the file copy have finished
            if (asyncError) {
                return console.log(asyncError);
            } else {
                console.log(asyncData);

                // 3) Now remove the source files - that way we effectively moved all the content
                s3.deleteObjects(paramsS3Delete, (deleteError, deleteData) => {
                    if (deleteError) return console.log(deleteError);

                    return console.log(deleteData);
                })

            }
        });
    }
});

  res.json({success: 'post call succeed!', url: req.url, body: req.body})
});


app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
