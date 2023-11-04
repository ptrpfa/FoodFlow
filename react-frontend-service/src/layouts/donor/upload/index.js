import{ useState, useRef, useContext } from "react";
import { Link } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import AWSS3Service from "services/aws-s3-service";
import { useUploadImageContext } from "context";

function DonorForm() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadResponse, setUploadResponse] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { setUploadImageId } = useUploadImageContext();
  const inputRef = useRef(null);

  const convertBlobToUint8Array = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const arrayBuffer = reader.result;
        const uint8Array = new Uint8Array(arrayBuffer);
        resolve(uint8Array);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsArrayBuffer(blob);
    });
  };

  const handleImageUpload = async () => {
    setUploadingImage(true);
    if (selectedImage) {
      try {
        const imageArray = await convertBlobToUint8Array(selectedImage);
        const uploadResponse = await AWSS3Service.uploadImage({ imageData: imageArray });
        
        setUploadImageId(uploadResponse.imageId);
        setUploadResponse(uploadResponse);
      } catch (error) {
        console.error("Error converting image to Uint8Array:", error);
      }
    }
    setUploadingImage(false);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setUploadResponse(null);
    }
  };

  return (
    <div>
      <Card>
        <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info">
          <MDTypography variant="h6" color="white">
            {"(1/2)"} Photo of Food item
          </MDTypography>
        </MDBox>
        <MDBox pt={3} ml={2}>
          <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} ref={inputRef} />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <MDButton
              variant="gradient"
              color="info"
              style={{ marginRight: "10px" }}
              onClick={() => inputRef.current.click()}
            >
              Choose Image
            </MDButton>
            { 
              selectedImage && (
                uploadingImage ? (
                  <MDButton variant="gradient" disabled>
                    Uploading Image...
                  </MDButton>
                ) : (
                  <MDButton variant="gradient" color="info" onClick={handleImageUpload}>
                    Upload Image
                  </MDButton>
                )
              )
            }
          </div>
        </MDBox>
        <MDBox pt={3} ml={2} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {
            selectedImage && uploadResponse ? (
              <>
                <div>
                  <p style={{ color: uploadResponse.valid ? "green" : "red" }}>
                    {uploadResponse.valid ? "Image is a valid food item." : "Image is not a valid food item."}
                  </p>
                </div>
                <div>
                  <p style={{ textAlign: "center" }}>Selected Image:</p>
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Selected Image"
                    style={{ maxWidth: "100%", maxHeight: "200px" }} />
                </div>
              </>
            ) : !selectedImage ? (
              <p style={{ color: "red" }}>No image selected.</p>
            ) : (
              <>
                <p style={{ color: "red" }}>Click "Upload Image" to continue</p>
                <div>
                  <p style={{ textAlign: "center" }}>Selected Image:</p>
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Selected Image"
                    style={{ maxWidth: "100%", maxHeight: "200px" }} />
                </div>
              </>
            )
          }
        </MDBox>
        <Grid item xs={12} style={{ display: "flex", justifyContent: "flex-end", margin: "20px 20px 20px 0" }}>
          <Link to="/upload/donate">
            <MDButton
              variant="gradient"
              color="info"
              disabled={!uploadResponse || !uploadResponse.valid}
            >
              Next
            </MDButton>
          </Link>
        </Grid>
      </Card>
    </div>
  );
}

function Donor() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <MDTypography variant="h3">Donor's Page</MDTypography>
          </Grid>
          <Grid item xs={12}>
            <DonorForm/>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Donor;
