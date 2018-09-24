var http = require("http");
const yaml = require('js-yaml');
const fs = require('fs');
var extract = require('extract-zip')
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });


// Download and unzip archive
var URL = 'http://github.com/gkatsaros/vCPE-demo/archive/1.0.zip';
console.log(URL);





// Running Server Details.
var server = app.listen(8082, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at %s:%s Port", host, port)
});
 
 
app.get('/add-pe', function (req, res) {
 

  var html='';
  html +="<body>";
  
 
  try {
    const config = yaml.safeLoad(fs.readFileSync('openstack-uc1-client-vCPE.yaml', 'utf8'));
    
    //const indentedJson = JSON.stringify(config, null, 4);
    //console.log(indentedJson);
    
    html += "<h2>"+config.description+"</h2>"
    html += "<p>This page will allow you to deploy an instance of this topology by entering the defined input parameters and pressing Submit.</p>"
    html += "<form action='/thank'  method='post' name='form1'>";
    html += "<table>";
    html += "<tr>";
    html += "<td>Name of the deployment:"+"</td><td><input type= 'text' name='deployment-name' value=''></td>";
    html += "</tr>";
    
    for (input in config.inputs) {
        console.log(input);
        html += "<tr>";
        html += "<td>"+input+":</td><td><input type= 'text' name='"+input+"' value='"+config.inputs[input].default+"'></td>";
        html += "</tr>";
    }
} catch (e) {
    console.log(e);
}
  html += "</table><br>";
  html += "<input type='submit' value='submit'> <br>";
  html += "<INPUT type='reset'  value='reset'>";
  html += "</form>";
  html += "</body>";
  res.send(html);
});
 
app.post('/thank', urlencodedParser, function (req, res){

var deployment_id = req.body['deployment-name'];
var inputs=req.body;
delete inputs['deployment-name'];

var bodyString = new Object();
bodyString.blueprint_id = 'uc1-Client';
bodyString.inputs = inputs;


var options = {
  hostname: '10.52.235.3',
  port: 80,
  path: "/api/v3.1/deployments/"+deployment_id+"?_include=id",
  method: 'PUT',
  headers: { 
   "Authorization": "Basic Z3JlZzoxbmZlcm5vJA==", 
   "Tenant":"default_tenant", 
   "Content-Type": "application/json"}
  };  

  console.log(bodyString);
  console.log(options);

//  http.request(options, callback).write(bodyString)

//PUT REQUEST START
var req = http.request(options, function(ress) {
  console.log('Status: ' + ress.statusCode);
  console.log('Headers: ' + JSON.stringify(ress.headers));
  ress.setEncoding('utf8');

  //PUT REQUEST SUCCESSULL
  ress.on('data', function (body) {
    console.log('PUT Body: ' + body);
   
   var post_data = new Object();
   post_data.deployment_id = deployment_id;
   post_data.workflow_id = 'install';
   post_data.queue = 'true';

   var post_options = {
   hostname: '10.52.235.3',
   port: 80,
   path: "api/v3.1/executions?_include=id",
   method: 'POST',
   headers: {
   "Authorization": "Basic Z3JlZzoxbmZlcm5vJA==",
   "Tenant":"default_tenant",
   "Content-Type": "application/json"}
   };


   console.log(post_data);
   console.log(post_options);


   //wait some secs
   console.log('waiting 5 sec');

   let counter = 0;
   function foo() {
    console.log(`foo ${counter}`);
    counter ++;
    if (counter < 10) {
     "use strict";
     setTimeout(foo, 1000);
     }
   }
   foo();
  
   console.log('Back to execution');  
 
   // POST REQUEST START
   var reqq = http.request(post_options, function(resss) {   
   resss.setEncoding('utf8');

   //POST REQUEST OUTPUT
   resss.on('data', function (bbody) {
   console.log('POST Body: ' + bbody);

   res.send("This is the submit request reply");

   });

 
 });

 reqq.on('error', function(e) {
    console.log('problem with request: ' + e.message);
   });

 console.log("SENDING NEW POST");
 reqq.write(JSON.stringify(post_data));
 reqq.end();
   
//   res.send("This is the PUT reply");

  });
});
req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});
// write data to request body


console.log("SENDING NEW PUT");
req.write(JSON.stringify(bodyString));
req.end();



//res.send("This is the PUT reply");

 });
