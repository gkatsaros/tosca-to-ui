#!/bin/bash

#echo $1
#echo "http://192.168.100.15/api/v3.1/deployments/"$1"?_include=id"

curl -X PUT --header "Tenant: default_tenant" --header "Content-Type: application/json" -u "greg:1nferno$" -d @data.json "http://192.168.100.15/api/v3.1/deployments/"$1"?_include=id">>deployments.txt

#sed -i '$s/}/,\n$DEPLOYMENT}/' deployments.json

#echo "Waiting for deployment to be created"
sleep 20

#echo "Start deployment"


data='{"deployment_id": "'$1'", "workflow_id": "install", "queue": "true"}'
#echo $data

curl -X POST --header "Tenant: default_tenant" --header "Content-Type: application/json" -u "greg:1nferno$" -d "$data" "http://192.168.100.15/api/v3/executions?_include=id"
