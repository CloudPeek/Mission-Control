export async function fetchBillingDetails() {
    try {
        // Make the request to the server
        const response = await fetch('http://127.0.0.1:8000/operations/aws/billing');
        // Parse the JSON response into a JavaScript object automatically
        const dataObject = await response.json(); // This already returns a JavaScript object
        console.log("Fetched Billing data:", dataObject);

        // Assuming dataObject contains the necessary fields directly
        const detailArray = Object.entries(dataObject).map(([Service, Cost]) => ({
            ServiceName: Service,
            TotalCost: Cost,  // Assuming the cost is directly stored as the value in each key
        }));
        console.log("Processed Billing detailArray:", detailArray);
        console.log("Array type", typeof detailArray); // Should log "object"

        return detailArray;
    } catch (error) {
        console.error('Error fetching Billing data:', error);
        return []; // Return an empty array in case of error
    }
}
