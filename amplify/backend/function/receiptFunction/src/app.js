/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/
const AWS = require('aws-sdk')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
var bodyParser = require('body-parser')
var express = require('express')
const uuid = require('node-uuid');
AWS.config.update({ region: process.env.TABLE_REGION });
const async = require('async');
const dynamodb = new AWS.DynamoDB.DocumentClient();
var url = require('url');
let tableName = "UserReceipts";

const userIdPresent = true; // TODO: update in case is required to use that definition
const partitionKeyName = "userSub";
const partitionKeyType = "S";
const sortKeyName = "receiptKey";
const sortKeyType = "";
const hasSortKey = sortKeyName !== "";
const path = "/receipts";
const UNAUTH = 'UNAUTH';
const hashKeyPath = '/:' + partitionKeyName;
const sortKeyPath = hasSortKey ? '/:' + sortKeyName : '';
// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});

// convert url string param to expected Type
const convertUrlType = (param, type) => {
  switch(type) {
    case "N":
      return Number.parseInt(param);
    default:
      return param;
  }
}

/********************************
 * HTTP Get method for list objects *
 ********************************/

app.get(path, function(req, res) {
  var condition = {}
  
  condition[partitionKeyName] = {
    ComparisonOperator: 'EQ'
  }
  

 // const userSub = req.apiGateway.event.requestContext.identity.cognitoAuthenticationProvider.split(':CognitoSignIn:')[1]
   const userId=req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;

   let queryParams ={};
   console.log('fetching filter categories');
   console.log(req.query);

   console.log(req.query.filterCategories);

   
if(req.query.filterCategories){
const categories =decodeURI(req.query.filterCategories);
console.log(categories);
let catArray=categories.split("~");
console.log(catArray);
var titleObject = {};
var index = 0;
catArray.forEach(function(value) {
    index++;
    var titleKey = ":categoryValue"+index;
    titleObject[titleKey.toString()] = value;
});

  queryParams = {
    TableName: tableName,
  // IndexName: 'createdDate-index',
    KeyConditions: {
      userSub: {
        ComparisonOperator: 'EQ',                                                                                                                        
        AttributeValueList: [userId || UNAUTH],
      },
    },
    FilterExpression : "category IN ("+Object.keys(titleObject).toString()+ ")",
    ExpressionAttributeValues : titleObject,
    ScanIndexForward:false,

  } 
}else {
  queryParams = {
    TableName: tableName,
    //IndexName: 'createdDate-index',
   // ScanIndexForward:false,
    KeyConditions: {
      userSub: {
        ComparisonOperator: 'EQ',                                                                                                                        
        AttributeValueList: [userId || UNAUTH],
      },
    },
    ScanIndexForward:false,

  } 
}


  

  dynamodb.query(queryParams, (err, data) => {
    if (err) {
      res.json({error: 'Could not load items: ' + err});
    } else {
      res.json(data.Items);
    }
  });
});

/*****************************************
 * HTTP Get method for get single object *
 *****************************************/

app.get(path + '/object' + hashKeyPath + sortKeyPath, function(req, res) {
  var params = {};
  
  const userSub = req.apiGateway.event.requestContext.identity.cognitoAuthenticationProvider.split(':CognitoSignIn:')[1]
  const userId=req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;



  if (userIdPresent && req.apiGateway) {
    params[partitionKeyName] = userId|| UNAUTH;
  } else {
    params[partitionKeyName] = req.params[partitionKeyName];
    try {
      params[partitionKeyName] = convertUrlType(req.params[partitionKeyName], partitionKeyType);
    } catch(err) {
      res.json({error: 'Wrong column type ' + err});
    }
  }
  if (hasSortKey) {
    try {
      params[sortKeyName] = convertUrlType(req.params[sortKeyName], sortKeyType);
    } catch(err) {
      res.json({error: 'Wrong column type ' + err});
    }
  }
  
  let getItemParams = {
    TableName: tableName,
    Key: params
  }
  console.log('parameters for querying');
console.log(getItemParams);
  dynamodb.get(getItemParams,(err, data) => {
    if(err) {
      res.json({error: 'Could not load items: ' + err.message});
    } else {
      if (data.Item) {
        res.json(data.Item);
      } else {
        res.json(data) ;
      }
    }
  });
});


/************************************
* HTTP put method for insert object *
*************************************/

app.put(path, function(req, res) {
  
  if (userIdPresent) {
    const userSub = req.apiGateway.event.requestContext.identity.cognitoAuthenticationProvider.split(':CognitoSignIn:')[1]
    const userId=req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;

    req.body['userSub'] = userId|| UNAUTH;
    if(req.body['createdDate']===null ||req.body['createdDate']===undefined){
    req.body['createdDate'] = ''+new Date();
    }
    req.body['title_category']= req.body['title']+'-'+req.body['category']
  }

  let putItemParams = {
    TableName: tableName,
    Item: req.body
  }
  dynamodb.put(putItemParams, (err, data) => {
    if(err) {
      res.json({error: err, url: req.url, body: req.body});
    } else{
      res.json({success: 'put call succeed!', url: req.url, data: data})
    }
  });
});

/************************************
* HTTP post method for insert object *
*************************************/

app.post(path, function(req, res) {
  
  if (userIdPresent) {
    const userSub = req.apiGateway.event.requestContext.identity.cognitoAuthenticationProvider.split(':CognitoSignIn:')[1]
    const userId=req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;

    req.body['userSub'] = userId || UNAUTH;
  }

  let putItemParams = {
    TableName: tableName,
    Item: req.body
  }
  dynamodb.put(putItemParams, (err, data) => {
    if(err) {
      res.json({error: err, url: req.url, body: req.body});
    } else{
      res.json({success: 'post call succeed!', url: req.url, data: data})
    }
  });
});


/************************************
* HTTP post method for pulk updating object *
*************************************/

app.post(path+"/bulk",async function(req, res) {
  
  if (userIdPresent) {
    const userSub = req.apiGateway.event.requestContext.identity.cognitoAuthenticationProvider.split(':CognitoSignIn:')[1]
    const userId=req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;

    req.body['userSub'] = userId || UNAUTH;
  }

const receipts=req.body['receipts'];
let succededReceipts=[];
let failedReceipts=[];

for (var i = 0; i < receipts.length; i++) {
    const receipt = req.body.receipts[i];
    //FOR EACH RECEIPT create an update statement
    const titleCategory= receipt.title+'_'+req.body['category']
    let putItemParams = {
      TableName: tableName,
     Key:{
      'userSub':req.body['userSub'],
      'createdDate':receipt.createdDate,
     },
    
     UpdateExpression:"set category = :cat,title_category = :titleCat",
     ConditionExpression:"receiptKey = :val",
    ExpressionAttributeValues:{
      ":cat":req.body['category'],
      ":titleCat":titleCategory,
      ":val": receipt.receiptKey
     
  },
 
  
  ReturnValues:"UPDATED_NEW"
  }
  console.log('updatable record**');
  console.log(putItemParams);
   try{
    console.log('before update');
   const data= await dynamodb.update(putItemParams).promise();
   console.log('after update successful');
      console.log(data);
      receipt['category']=req.body['category'];
      receipt['title_category']=titleCategory;
      succededReceipts.push(receipt);
   }catch(err){
    console.log('error in updating DB');
    console.log(err);
  failedReceipts.push(receipt);

   }
    
}
  const finalResponse ={
    succededReceipts:succededReceipts,
    failedReceipts:failedReceipts
  }
  let message="post call succeed!";
  if(succededReceipts.length==0){
    message="Post call failed!";
  }
  else if(failedReceipts.length>0){
    message="Post call partially succeeded!";
  }
  res.json({success: message, url: req.url, data: finalResponse})

});


/**************************************
* HTTP remove method to delete object *
***************************************/

app.delete(path + '/object' + hashKeyPath + sortKeyPath, function(req, res) {
  var params = {};
  const userSub = req.apiGateway.event.requestContext.identity.cognitoAuthenticationProvider.split(':CognitoSignIn:')[1]
  const userId=req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;

    req.body['userSub'] = userId|| UNAUTH;
  if (userIdPresent && req.apiGateway) {
    params[partitionKeyName] = userId || UNAUTH;
    params['createdDate']=req.body['createdDate'];
  } else {
    params[partitionKeyName] = req.params[partitionKeyName];
     try {
      params[partitionKeyName] = convertUrlType(req.params[partitionKeyName], partitionKeyType);
    } catch(err) {
      res.json({error: 'Wrong column type ' + err});
    }
  }
  /*if (hasSortKey) {
    try {
      params[sortKeyName] = convertUrlType(req.params[sortKeyName], sortKeyType);
    } catch(err) {
      res.json({error: 'Wrong column type ' + err});
    }
  }*/

  let removeItemParams = {
    TableName: tableName,
    Key: params,
    ConditionExpression:sortKeyName+"= :val",
    ExpressionAttributeValues: {
        ":val": convertUrlType(req.params[sortKeyName], sortKeyType)
    }
  }
  console.log('Delete Receipt***');
  console.log(removeItemParams);
  dynamodb.delete(removeItemParams, (err, data)=> {
    if(err) {
      res.json({error: err, url: req.url});
    } else {
      res.json({url: req.url, data: data});
    }
  });
});
app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
