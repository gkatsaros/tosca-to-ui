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

const exec = require('child_process').exec;
var yourscript = exec(["sh post.sh",deployment_id].join(' '),
        (error, stdout, stderr) => {
            console.log(`${stdout}`);
            //console.log(`${stderr}`);
            console.log(stdout.id);
            res.send(stdout);
         
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
     });


   
   res.send("This is the PUT reply");


 });
