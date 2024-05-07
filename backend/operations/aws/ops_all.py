import boto3
from botocore.exceptions import ClientError
from fastapi import HTTPException
import json
import logging

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

def parse_s3_json(json_data):
    # Example parsing logic for S3 data
    formatted_data = {}
    for item in json_data:
        bucket_name = item["Name"]
        encryption_details = item.get("Encryption", {}).get("Rules", [{}])[0].get("ApplyServerSideEncryptionByDefault", {})
        formatted_data[bucket_name] = {
            "TotalSizeGB": item["TotalSizeGB"],
            "ServerAccessLogging": item["ServerAccessLogging"],
            "SSEAlgorithm": encryption_details.get("SSEAlgorithm", "None"),
            "AccountID": item["AccountID"],
            "CreationDate": item["CreationDate"],
        }
    return formatted_data

def parse_ec2_json(json_data):
    # Example parsing logic for EC2 data
    # Here, you can further refine the structure as per your specific needs
    return json_data

def list_aws_configurations(session, bucket_name):
    s3_client = session.client('s3')
    aggregated_data = {}

    try:
        paginator = s3_client.get_paginator('list_objects_v2')
        page_iterator = paginator.paginate(Bucket=bucket_name)

        for page in page_iterator:
            if 'Contents' in page:
                for obj in page['Contents']:
                    key = obj['Key']
                    if key.startswith("Configuration-AWS"):
                        response = s3_client.get_object(Bucket=bucket_name, Key=key)
                        file_content = response['Body'].read().decode('utf-8')
                        json_data = json.loads(file_content)
                        service_name = key.split('-')[2].split('.')[0]  # Extract the service name from the filename
                        if service_name == "s3":
                            aggregated_data['s3'] = parse_s3_json(json_data)
                        elif service_name == "ec2":
                            aggregated_data['ec2'] = parse_ec2_json(json_data)
                        else:
                            # Generic handler for other services
                            aggregated_data[service_name] = json_data

        return json.dumps(aggregated_data)  # Return JSON string of the aggregated data
    except ClientError as e:import boto3
from botocore.exceptions import ClientError
from fastapi import HTTPException
import json
import logging

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

def parse_s3_json(json_data):
    formatted_data = {}
    for item in json_data:
        bucket_name = item["Name"]
        encryption_details = item.get("Encryption", {}).get("Rules", [{}])[0].get("ApplyServerSideEncryptionByDefault", {})
        formatted_data[bucket_name] = {
            "TotalSizeGB": item["TotalSizeGB"],
            "ServerAccessLogging": item["ServerAccessLogging"],
            "SSEAlgorithm": encryption_details.get("SSEAlgorithm", "None"),
            "AccountID": item["AccountID"],
            "CreationDate": item["CreationDate"],
        }
    return formatted_data



def list_aws_configurations(session, bucket_name):
    s3_client = session.client('s3')
    aggregated_data = {}

    try:
        paginator = s3_client.get_paginator('list_objects_v2')
        page_iterator = paginator.paginate(Bucket=bucket_name)

        for page in page_iterator:
            if 'Contents' in page:
                for obj in page['Contents']:
                    key = obj['Key']
                    if key.startswith("Configuration-AWS"):
                        response = s3_client.get_object(Bucket=bucket_name, Key=key)
                        file_content = response['Body'].read().decode('utf-8')
                        json_data = json.loads(file_content)
                        service_name = key.split('-')[2].split('.')[0]  # Extract the service name from the filename
                        if key.endswith('s3.json'):
                            aggregated_data['s3'] = parse_s3_json(json_data)
                        elif  key.endswith('ec2.json'):
                            aggregated_data['ec2'] = parse_ec2_json(json_data)
                        elif key.endswith('ebs.json'):
                            aggregated_data['ebs'] = parse_ec2_json(json_data)
                        elif key.endswith('iam.json'):
                            aggregated_data['iam'] = parse_ec2_json(json_data)

                        elif key.endswith('vpc.json'):
                            aggregated_data['vpcs'] = parse_ec2_json(json_data)

                        else:
                            aggregated_data[service_name] = json_data

                        logger.info(f"Processed data for {service_name}")

        logger.info("All data processed")
        return json.dumps(aggregated_data)  # Return JSON string of the aggregated data
    except ClientError as e:
        logger.error(f"An error occurred accessing S3: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"An unexpected error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Example usage
