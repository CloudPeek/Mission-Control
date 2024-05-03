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

def read_ec2_config(session, bucket_name):
    """
    Reads a configuration file from an S3 bucket based on the AWS account ID and service type,
    then reformats the data into a specified structure using a dictionary with instance IDs as keys.
    """
    try:
        account_id = get_account_id(session)
        filename = f"Configuration-AWS-{account_id}-ec2.json"
        
        s3_client = session.client('s3')
        response = s3_client.get_object(Bucket=bucket_name, Key=filename)
        file_content = response['Body'].read().decode('utf-8')
        
        # Convert the JSON content to a Python dictionary
        original_data = json.loads(file_content)
        formatted_data = {}
        
        for item in original_data:
            instance_id = item['InstanceId']
            security_groups = [sg['GroupName'] for sg in item.get('SecurityGroups', [])]
            volumes = [vol['VolumeId'] for vol in item.get('Volumes', [])]
            tags = {tag['Key']: tag['Value'] for tag in item.get('Tags', [])}

            formatted_data[instance_id] = {
                'InstanceType': item['InstanceType'],
                'State': item['State'],
                'PrivateIpAddress': item['PrivateIpAddress'],
                'PublicIpAddress': item['PublicIpAddress'],
                'VpcId': item.get('VpcId', 'No data'),
                'SecurityGroupNames': security_groups,
                'VolumeIds': volumes,
                'Tags': tags
            }

        return json.dumps(formatted_data)  # Return JSON string of the formatted data
    
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

