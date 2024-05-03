export async function fetchS3Details() {
    try {
        const response = await fetch('http://127.0.0.1:8000/operations/aws/s3');
        const data = await response.json(); // Assuming the response is correctly formatted JSON object
        console.log("Fetched S3 data:", data);
        const dataObject = JSON.parse(data);


        // Transforming the data structure to fit your table layout
        const detailArray = Object.entries(dataObject).map(([key, value]) => ({
            Name: key,
            TotalSizeGB: value.TotalSizeGB || 'No data',
            ServerAccessLogging: value.ServerAccessLogging || 'No data',
            EncryptionAlgorithm: value.SSEAlgorithm || 'None',
            AccountID: value.AccountID || 'No data',
            CreationDate: value.CreationDate || 'No data',
        }));

        console.log("Processed S3 detailArray:", detailArray);
        return detailArray;
    } catch (error) {
        console.error('Error fetching S3 data:', error);
        return []; // Return an empty array in case of error
    }
}

export async function fetchEbsDetails() {
    try {
        const response = await fetch('http://127.0.0.1:8000/operations/aws/ebs');
        const data = await response.json(); // Assuming the response is correctly formatted JSON object

        console.log("Fetched EBS data:", data);

        // Transforming the EBS data structure to fit your table layout
        const detailArray = Object.entries(data).map(([volumeId, value]) => ({
            VolumeId: volumeId,
            EncryptionStatus: value.EncryptionStatus || 'No data',
            Type: value.Type || 'Unknown',
            AccountID: value.AccountID || 'No data',
            CreationDate: value.CreationDate || 'No data',
            Size: value.Size || 'No data',
            AvailabilityZone: value.AvailabilityZone || 'No data',
            SnapshotStatus: value.SnapshotStatus || 'No data',
            DataClassificationTag: value.DataClassificationTag || 'No data',
        }));

        console.log("Processed EBS detailArray:", detailArray);
        return detailArray;
    } catch (error) {
        console.error('Error fetching EBS data:', error);
        return []; // Return an empty array in case of error
    }
}

export async function fetchStorageCombinedDetails() {
    const s3Details = await fetchS3Details();
    const ebsDetails = await fetchEbsDetails();

    // Combine and transform data from both S3 and EBS into a common format
    const combinedDetails = [
        ...s3Details.map(detail => ({
            Service: 'S3',
            ResourceName: detail.Name,
            EncryptionStatus: detail.EncryptionAlgorithm,
            TotalDataStored: detail.TotalSizeGB,
        })),
        ...ebsDetails.map(detail => ({
            Service: 'EBS',
            ResourceName: detail.VolumeId,
            EncryptionStatus: detail.EncryptionStatus,
            TotalDataStored: detail.Size,
        }))
    ];

    console.log("Processed combined storage details:", combinedDetails);
    return combinedDetails;
}
