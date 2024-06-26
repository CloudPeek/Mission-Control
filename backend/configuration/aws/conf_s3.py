import boto3
from botocore.exceptions import ClientError
from fastapi import HTTPException
import json

def audit_s3_buckets(session):
    client = session.client('s3')
    

    bucket_details = []

    try:
        buckets = client.list_buckets()['Buckets']

        for bucket in buckets:
            bucket_name = bucket['Name']
            details = {
                'AccountID': get_account_id(session),
                'Name': bucket_name,
                'CreationDate': bucket['CreationDate'].isoformat(),
                'TotalSizeGB': get_bucket_size(client, bucket_name),  # Size of the bucket in gigabytes
                'BucketPolicy': check_bucket_policy(client, bucket_name),
                'BlockPublicAccess': check_block_public_access(client, bucket_name),
                'BucketACLs': check_bucket_acls(client, bucket_name),
                'Versioning': check_versioning(client, bucket_name),
                'ServerAccessLogging': check_server_access_logging(client, bucket_name),
                'Encryption': check_encryption(client, bucket_name)
            }
            bucket_details.append(details)

        # Optionally, write details to a file
        return bucket_details
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def get_account_id(session):
    sts_client = session.client('sts')
    caller_identity = sts_client.get_caller_identity()
    account_id = caller_identity['Account']
    return(account_id)

def get_bucket_size(client, bucket_name):
    """Calculate the total size of all objects in an S3 bucket in megabytes."""
    total_size = 0
    try:
        paginator = client.get_paginator('list_objects_v2')
        page_iterator = paginator.paginate(Bucket=bucket_name)
        for page in page_iterator:
            if "Contents" in page:
                for obj in page['Contents']:
                    total_size += obj['Size']
    except ClientError as e:
        print(f"Error retrieving objects for bucket {bucket_name}: {e}")
        return None
    return round(total_size / (1024 ** 2), 2)  # Convert bytes to megabytes and round to two decimal places


def check_bucket_policy(client, bucket_name):
    try:
        policy = client.get_bucket_policy(Bucket=bucket_name)
        return policy['Policy']
    except ClientError as e:
        if e.response['Error']['Code'] == 'NoSuchBucketPolicy':
            return "No policy"
        else:
            raise

def check_block_public_access(client, bucket_name):
    try:
        access_block = client.get_public_access_block(Bucket=bucket_name)
        return access_block['PublicAccessBlockConfiguration']
    except ClientError as e:
        if e.response['Error']['Code'] == 'NoSuchPublicAccessBlockConfiguration':
            return "Public access block not configured"
        else:
            raise

def check_bucket_acls(client, bucket_name):
    try:
        acl = client.get_bucket_acl(Bucket=bucket_name)
        return acl['Grants']
    except ClientError as e:
        raise

def check_versioning(client, bucket_name):
    try:
        versioning = client.get_bucket_versioning(Bucket=bucket_name)
        # Check if 'Status' is in the response and return it, otherwise indicate versioning is not enabled
        return versioning.get('Status', "Versioning not enabled")
    except ClientError as e:
        raise HTTPException(status_code=500, detail=str(e))


def check_server_access_logging(client, bucket_name):
    try:
        logging = client.get_bucket_logging(Bucket=bucket_name)
        return logging['LoggingEnabled'] if 'LoggingEnabled' in logging else "Logging not enabled"
    except ClientError as e:
        raise

def check_encryption(client, bucket_name):
    try:
        encryption = client.get_bucket_encryption(Bucket=bucket_name)
        return encryption['ServerSideEncryptionConfiguration']
    except ClientError as e:
        if e.response['Error']['Code'] == 'ServerSideEncryptionConfigurationNotFoundError':
            return "Encryption not configured"
        else:
            raise
