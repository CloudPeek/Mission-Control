import boto3
from botocore.exceptions import ClientError
from fastapi import HTTPException
import json
import logging

# Configure logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

def get_account_id(session):
    """Retrieve the AWS account ID using STS."""
    sts_client = session.client('sts')
    caller_identity = sts_client.get_caller_identity()
    account_id = caller_identity['Account']
    return account_id

def fetch_billing_info(session, bucket_name):
    """
    Reads a configuration file from an S3 bucket based on the AWS account ID and service type,
    then reformats the data into a specified structure using a dictionary with volume IDs as keys.
    """
    try:
        account_id = get_account_id(session)
        filename = f"Configuration-AWS-{account_id}-billing.json"
        
        s3_client = session.client('s3')
        response = s3_client.get_object(Bucket=bucket_name, Key=filename)
        file_content = response['Body'].read().decode('utf-8')        
        original_data = json.loads(file_content)
        service_costs = {}
        # Loop through each item in the 'cost' array
        for cost_info in original_data['cost']:
            for group in cost_info['Groups']:
                service_name = group['Keys'][0]
                cost_amount = group['Metrics']['BlendedCost']['Amount']
                service_costs[service_name] = cost_amount
        return service_costs  # Returning a dictionary of service costs
    
    
    except ClientError as e:
        logger.error(f"An error occurred accessing S3: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"An unexpected error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
