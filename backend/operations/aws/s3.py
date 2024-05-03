import boto3
from botocore.exceptions import ClientError
from fastapi import HTTPException
import json
import logging

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

def get_account_id(session):
    """Retrieve the AWS account ID using STS."""
    sts_client = session.client('sts')
    caller_identity = sts_client.get_caller_identity()
    account_id = caller_identity['Account']
    return account_id

def read_s3_config(session, service, bucket_name):
    """
    Reads a configuration file from an S3 bucket based on the AWS account ID and service type,
    then reformats the data into a specified structure using a dictionary with bucket names as keys.
    """
    try:
        account_id = get_account_id(session)
        filename = f"Configuration-AWS-{account_id}-s3.json"
        
        s3_client = session.client('s3')
        response = s3_client.get_object(Bucket=bucket_name, Key=filename)
        file_content = response['Body'].read().decode('utf-8')
        
        # Convert the JSON content to a Python dictionary
        original_data = json.loads(file_content)
        
        # Reformat the data to the desired structure
        formatted_data = {}
        for item in original_data:
            bucket_name = item["Name"]
            encryption_details = item.get("Encryption", {}).get("Rules", [{}])[0].get("ApplyServerSideEncryptionByDefault", {})
            formatted_data[bucket_name] = {
                "TotalSizeGB": item["TotalSizeGB"],
                "ServerAccessLogging": item["ServerAccessLogging"],
                "SSEAlgorithm": encryption_details.get("SSEAlgorithm", "None"),
                "AccountID": item["AccountID"],
                "CreationDate": item["CreationDate"],
                "Versioning": item["Versioning"],
                "BucketACLs": item["BucketACLs"],
                "BlockPublicAccess": item["BlockPublicAccess"]
            }

        return json.dumps(formatted_data)  # Return JSON string of the formatted dict
    
    except ClientError as e:
        if e.response['Error']['Code'] == 'NoSuchKey':
            logger.error("File not found in the S3 bucket.")
            raise HTTPException(status_code=404, detail="File not found in the S3 bucket.")
        else:
            logger.error(f"An error occurred accessing S3: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

    except Exception as e:
        logger.error(f"An unexpected error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

