from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse

import boto3
import json
import logging
from configuration.aws import s3 as s3_audit, ec2, ebs, vpc, security_groups, iam
from operations.aws import s3, all,ebs,ec2
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allows all origins, or specify your frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)
# Initialize a Boto3 Session
session = boto3.Session(profile_name='ob')
s3_client = session.client('s3')
sts_client = session.client('sts')
bucket_name = 'cloudstatustesting'  # Replace with your actual S3 bucket name

@app.get("/configuration/aws/{service}")
async def get_aws_configuration(service: str):
    service_map = {
        "s3": s3_audit.audit_s3_buckets,
        "ec2": ec2.audit_ec2_instances,
        "ebs": ebs.audit_ebs_volumes,
        "vpc": vpc.audit_vpc,
        "sg": security_groups.audit_security_groups,
        "iam": iam.audit_iam_practices,
    }

    if service not in service_map:
        raise HTTPException(status_code=404, detail="Service not supported")

    try:
        # Call the corresponding function from the service module
        response = service_map[service](session)
        
        # Convert the response data to JSON
        response_json = json.dumps(response, default=str)  # Ensuring datetime is converted to string if present
        
        # Retrieve the AWS account ID from the caller identity
        caller_identity = sts_client.get_caller_identity()
        account_id = caller_identity['Account']
        
        # Construct the filename
        filename = f"Configuration-AWS-{account_id}-{service}.json"
        # Write the JSON data to S3
        s3_client.put_object(Bucket=bucket_name, Key=filename, Body=response_json)
        
        return {"message": f"Data written successfully to {filename} in bucket {bucket_name}"}
    except Exception as e:
        # Catch any other exception and raise an HTTPException
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/operations/aws/{service}")
async def get_ops_data(service: str):
    service_map = {
        "s3": s3.read_s3_config,  # Assuming read_s3_config is correctly accepting required parameters
        "all": all.list_aws_configurations,
        "ebs": ebs.read_ebs_config,  # This needs correction
        "ec2": ec2.read_ec2_config
    }

    if service not in service_map:
        raise HTTPException(status_code=404, detail="Service not supported")

    try:
        # Since list_s3_objects doesn't need 'service' as a parameter, remove it from the function call
        if service == 'all':
            config_data = service_map[service](session, bucket_name) 
        elif service == 'ebs': 
            config_data = service_map[service](session, bucket_name)
        elif service == 'ec2':
            config_data = service_map[service](session, bucket_name)
        else:
            config_data = service_map[service](session, service, bucket_name)  # Assuming other functions need 'service'
        return JSONResponse(content=config_data)
    except HTTPException as http_err:
        raise HTTPException(status_code=http_err.status_code, detail=http_err.detail)
    except Exception as e:
        logger.error(f"An error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, loglevel="debug")
