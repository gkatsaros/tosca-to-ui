#!/bin/bash



sleep(5)

curl -X POST --header "Tenant: default_tenant" --header "Content-Type: application/json" -u "greg:1nferno$" -d {"deployment_id": $1, "workflow_id": "install"} http://10.52.235.3/api/v3/executions?_include=id
