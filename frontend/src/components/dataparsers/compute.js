export async function fetchEC2Details() {
    try {
        const response = await fetch('http://127.0.0.1:8000/operations/aws/ec2');
        const data = await response.json(); // Assuming the response is correctly formatted JSON object
        console.log("Fetched EC2 data:", data);
        const dataObject = JSON.parse(data);

        // Transforming the EC2 data structure to fit your table layout
        const detailArray = Object.entries(dataObject).map(([instanceId, value]) => ({
            Service: 'EC2',
            InstanceId: instanceId,
            InstanceType: value.InstanceType,
            State: value.State,
            PrivateIpAddress: value.PrivateIpAddress,
            PublicIpAddress: value.PublicIpAddress,
            VpcId: (value.SecurityGroups && value.SecurityGroups.length > 0) ? value.SecurityGroups[0].VpcId : 'No data', // Extract VpcId from the first SecurityGroup if available
            SecurityGroupNames: value.SecurityGroups ? value.SecurityGroups.map(sg => sg.GroupName).join(", ") : 'No data',
            VolumeIds: value.Volumes ? value.Volumes.map(vol => vol.VolumeId).join(", ") : 'No data',
            Tags: value.Tags ? Object.entries(value.Tags).map(([key, val]) => `${key}: ${val}`).join(", ") : 'No tags'
        }));

        console.log("Processed EC2 detailArray:", detailArray);
        return detailArray;
    } catch (error) {
        console.error('Error fetching EC2 data:', error);
        return []; // Return an empty array in case of error
    }
}

export async function fetchComputeCombinedDetails() {
    const EC2detailArray = await fetchEC2Details();
    //const ebsDetails = await fetchEbsDetails();

    // Combine and transform data from both S3 and EBS into a common format
    const combinedDetails = [
        ...EC2detailArray.map(detail => ({
            Service: 'EC2',
            InstanceId: detail.InstanceId,
            State: detail.State,
            VolumeIds: detail.VolumeIds,
        }))
    ];

    console.log("Processed combined storage details:", combinedDetails);
    return combinedDetails;
}


