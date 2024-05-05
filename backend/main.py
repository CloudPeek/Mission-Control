from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import boto3
import json
import logging
from fastapi.middleware.cors import CORSMiddleware
from configuration.aws import s3 as s3_audit, ec2, ebs, vpc, security_groups, iam
from operations.aws import s3, all,ebs,ec2

# Setup the logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class AWSCredentials(BaseModel):
    access_key_id: str
    secret_access_key: str
    session_token: str

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust as needed for your frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"]  # Allows all headers
)

def create_boto_session():
    credentials_path = ".aws_credentials"
    try:
        with open(credentials_path, "r") as file:
            credentials = {}
            for line in file:
                key, value = line.strip().split('=', 1)
                credentials[key.strip()] = value.strip().strip('"')
        return boto3.Session(
            aws_access_key_id=credentials["AWS_ACCESS_KEY_ID"],
            aws_secret_access_key=credentials["AWS_SECRET_ACCESS_KEY"],
            aws_session_token=credentials["AWS_SESSION_TOKEN"],
        )
    except FileNotFoundError:
        logger.error("Credentials file not found. Using default session.")
        return boto3.Session(profile_name='default')  # Use a default session if specific credentials are not provided

bucket_name = 'cloudstatustesting'  # Replace with your actual S3 bucket name
@app.post("/self/config/iam")
async def set_aws_credentials(credentials: AWSCredentials, request: Request):
    # Log the incoming request data
    request_data = await request.json()  # Asynchronously get the JSON data from the request
    logger.info(f"Received request with data: {request_data}")

    if credentials.access_key_id == "test" and credentials.secret_access_key == "test1" and credentials.session_token == "test2":
        logger.info("Using test credentials, skipping AWS validation.")
        return {"message": "Test credentials received, skipping AWS validation."}

    try:
        session = boto3.Session(
            aws_access_key_id=credentials.access_key_id,
            aws_secret_access_key=credentials.secret_access_key,
            aws_session_token=credentials.session_token
        )
        sts_client = session.client('sts')
        caller_identity = sts_client.get_caller_identity()
        logger.info(f"Caller Identity: {caller_identity}")

        with open(".aws_credentials", "w") as file:
            file.write(f'AWS_ACCESS_KEY_ID={credentials.access_key_id}\n')
            file.write(f'AWS_SECRET_ACCESS_KEY={credentials.secret_access_key}\n')
            file.write(f'AWS_SESSION_TOKEN={credentials.session_token}\n')
        
        return {"message": "AWS credentials verified and written successfully to .aws_credentials"}
    except Exception as e:
        logger.error(f"Failed to write or verify AWS credentials: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to write or verify AWS credentials")

@app.get("/self/config/getiam")
async def get_iam_role():
    session = create_boto_session()
    if not session:
        logger.error("Failed to create AWS session")
        raise HTTPException(status_code=500, detail="Failed to create AWS session")

    try:
        sts_client = session.client('sts')
        caller_identity = sts_client.get_caller_identity()
        return {"Account": caller_identity['Account'], "UserId": caller_identity['UserId'], "Arn": caller_identity['Arn']}
    except Exception as e:
        logger.error(f"Failed to get IAM role: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get IAM role")

@app.get("/configuration/aws/{service}")
async def get_aws_configuration(service: str):
    logger.info(f"Received request to get AWS configuration for {service}")
    session = create_boto_session()
    if not session:
        logger.error("Failed to create AWS session")
        raise HTTPException(status_code=500, detail="Failed to create AWS session")

    service_map = {
        "s3": s3_audit.audit_s3_buckets,
        "ec2": ec2.audit_ec2_instances,
        "ebs": ebs.audit_ebs_volumes,
        "vpc": vpc.audit_vpc,
        "sg": security_groups.audit_security_groups,
        "iam": iam.audit_iam_practices,
    }

    if service not in service_map:
        logger.error(f"Service {service} is not supported")
        raise HTTPException(status_code=404, detail="Service not supported")

    try:
        response = service_map[service](session)
        response_json = json.dumps(response, default=str)
        sts_client = session.client('sts')
        caller_identity = sts_client.get_caller_identity()
        account_id = caller_identity['Account']
        filename = f"Configuration-AWS-{account_id}-{service}.json"
        s3_client = session.client('s3')
        s3_client.put_object(Bucket=bucket_name, Key=filename, Body=response_json)
        logger.info(f"Data written successfully to {filename} in bucket {bucket_name}")
        return {"message": f"Data written successfully to {filename} in bucket {bucket_name}"}
    except Exception as e:
        logger.error(f"Error in handling AWS {service} service: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/operations/aws/{service}")
async def get_ops_data(service: str):
    logger.info(f"Received request to get AWS configuration for {service}")
    session = create_boto_session()
    if not session:
        logger.error("Failed to create AWS session")
        raise HTTPException(status_code=500, detail="Failed to create AWS session")
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
