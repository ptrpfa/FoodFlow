import React, { useState, useEffect } from "react";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import { useParams } from "react-router-dom"; // Import useParams to access route parameters

// You may want to import your service for fetching detailed listing data
import ListingService from "services/listing-service"; 

function DetailedListing() {
  const { listingId } = useParams(); // Get the listing ID from the URL

  const [listingData, setListingData] = useState(null); // State to hold the listing data

  useEffect(() => {
    // Use your service to fetch the detailed listing data based on 'listingId'
    // Replace the following with your actual service call
    ListingService.getListing({ListingID : listingId})
      .then((data) => {
        setListingData(data);
      })
      .catch((error) => {
        console.error("Error fetching detailed listing:", error);
      });

    

    // Simulated data for demonstration
    const simulatedListingData = {
      id: listingId,
      name: "test",
      description: "This is a sample listing description.",
      // Add other details you want to display
    };
    setListingData(simulatedListingData);
  }, [listingId]); // Fetch data when 'listingId' changes

  return (
    <div>
      <MDBox p={2}>
        <MDTypography variant="h6">Detailed Listing Page</MDTypography>
        {listingData ? (
          <div>
            <MDTypography variant="h4">{listingData.name}</MDTypography>
            <MDTypography>{listingData.description}</MDTypography>
            {/* Render other details of the listing */}
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </MDBox>
    </div>
  );
}

export default DetailedListing;
