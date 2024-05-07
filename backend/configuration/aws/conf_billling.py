import boto3
from botocore.exceptions import ClientError
from datetime import datetime

def get_cost(billing):
    start_date = datetime.now().strftime('%Y-%m-01')  # First day of current month
    end_date = datetime.now().strftime('%Y-%m-%d')    # Today's date
    try:
        response = billing.get_cost_and_usage(
            TimePeriod={'Start': start_date, 'End': end_date},
            Granularity='MONTHLY',
            Metrics=['BlendedCost', 'UnblendedCost'],
            GroupBy=[{'Type': 'DIMENSION', 'Key': 'SERVICE'}]
        )
        return response['ResultsByTime']
    except ClientError as e:
        return {'error': str(e)}

def get_usage(billing):
    start_date = datetime.now().strftime('%Y-%m-01')  # First day of current month
    end_date = datetime.now().strftime('%Y-%m-%d')    # Today's date
    try:
        response = billing.get_cost_and_usage(
            TimePeriod={'Start': start_date, 'End': end_date},
            Granularity='MONTHLY',
            Metrics=['UsageQuantity'],
            GroupBy=[{'Type': 'DIMENSION', 'Key': 'SERVICE'}]
        )
        return response['ResultsByTime']
    except ClientError as e:
        return {'error': str(e)}

def get_billing(session):
    billing = session.client('ce')
    results = {
        'cost': [],
        'usage': []
    }

    try:
        # Get cost and usage
        results['cost'] = get_cost(billing)
        results['usage'] = get_usage(billing)

        return results

    except ClientError as e:
        return {'error': str(e)}


