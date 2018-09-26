var http = require("http");
const yaml = require('js-yaml');
const fs = require('fs');
var extract = require('extract-zip')
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });


// Download and unzip archive
//var URL = 'http://github.com/gkatsaros/vCPE-demo/archive/1.0.zip';
//console.log(URL);


// Running Server Details.
var server = app.listen(8082, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at %s:%s Port", host, port)
});
 
 
app.get('/add-cpe', function (req, res) {
 

  var html='';
  html +="<body>";
  
 
  try {
    const config = yaml.safeLoad(fs.readFileSync('../openstack-uc1-client-vCPE.yaml', 'utf8'));
    
    //const indentedJson = JSON.stringify(config, null, 4);
    //console.log(indentedJson);
    
    html += "<h2>"+config.description+"</h2>"
    html += "<p>This page will allow you to deploy an instance of this topology by entering the defined input parameters and pressing Submit.</p>"
    html += "<form action='/deployed'  method='post' name='form1'>";
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
  html += "<input type='submit' value='submit'> <br><br>";
  html += "</form>";
  
  //deployments table

  html+= "<h2>This is the active deployments table:</h2>";
  html+= "<table>";


  try{ 

  var lines = require('fs').readFileSync('deployments.txt', 'utf-8').split('\n').filter(Boolean);
  console.log(lines);
  for (var i = 0; i < lines.length; i++) {
  deployment=JSON.parse(lines[i]);
  //console.log(lines[i]);
  html+="<tr><td>Deployment ID</td><td><strong>"+deployment["id"]+"</strong></td></tr>"; 
  }


} catch (e){
console.log(e);
} 

  console.log("after line");
  //html+= "<h2>This is the active deployments table:</h2>";
  //html+= "<table>";
  html+= "</table>";

  html += "</body>";
  res.send(html);
});
 
app.post('/deployed', urlencodedParser, function (req, res){

var deployment_id = req.body['deployment-name'];
var inputs=req.body;
delete inputs['deployment-name'];

var input_string='{\"blueprint_id\":\"uc1-Client\",\"inputs\":{';

for (parameter in inputs) {
input_string+= '\"';
input_string+= parameter;
input_string+= '\":';
input_string+= '\"';
input_string+= inputs[parameter];
input_string+= '\",';
}
input_string = input_string.replace(/,\s*$/, "");
input_string+="}}";

console.log(deployment_id);
console.log(input_string);
console.log("uc1-Client");

var fs = require('fs');
fs.writeFile("data.json", input_string, function(err) {
    if (err) {
        console.log(err);
    }
});


const exec = require('child_process').exec;
var yourscript = exec(["sh post.sh",deployment_id].join(' '),
        (error, stdout, stderr) => {
            console.log(`${stdout}`);
            //console.log(`${stderr}`);
            
           // res.send(`${stdout}`);
         
            if (error !== null) {
                console.log(`exec error: ${error}`);
                res.send("There was an error in deployment!");
            }
     });


   var response = "<h2>The deployment with id "+deployment_id+" is being created</h2>";
   response+="Click <a href=\"/add-cpe\">here</a> to go back to the deployments overview page";

   res.send(response);


 });
