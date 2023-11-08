/**
=========================================================
* Food Flow
=========================================================
* Template used - Material Dashboard 2 React - v2.1.0
* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
=========================================================
*/

import{ useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CircularProgress from '@mui/material/CircularProgress';

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import DashboardLayout from "page-components/LayoutContainers/DashboardLayout";
import DashboardNavbar from "page-components/Navbars/DashboardNavbar";
import Footer from "page-components/Footer";

import AWSS3Service from "services/aws-s3-service";
import ImageClassifierService from "services/image-classification-service";
import { useUploadImageContext } from "context";

function DonorForm() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadResponse, setUploadResponse] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [validAndFresh, setValidAndFresh] = useState(false);
  const [freshResponse, setFreshResponse] = useState(false);
  const [trainingModel, setTrainingModel] = useState(false);
  const { setUploadImageId } = useUploadImageContext();

  const [openDialog, setOpenDialog] = useState(false);

  const handleArgue = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };


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
        
        const imageIdWithExtension = uploadResponse.imageId + ".jpg";
        setUploadImageId(imageIdWithExtension);
        setUploadResponse(uploadResponse);
      } catch (error) {
        console.error("Error converting image to Uint8Array:", error);
      }
    }
    setUploadingImage(false);
    setFreshResponse(false);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setUploadResponse(null);
    }
  };

  const checkFreshness = async () => {
    const freshness_prediction = await ImageClassifierService.classify_image(selectedImage, 0);
    setFreshResponse(true);
    setValidAndFresh(freshness_prediction === 0);
  }

  const disputeFreshness = async () => {
    setOpenDialog(false);
    setTrainingModel(true);

    // Train client side model
    await ImageClassifierService.train_model(selectedImage, 0);

    // Upload model
    await ImageClassifierService.upload_model();
    setTrainingModel(false);
    setValidAndFresh(true);
  }


  useEffect(() => {
    async function prepareModel(){
      try {
        await ImageClassifierService.prepare_ml();
      } catch (error) {
          console.error('Error loading models', error);
      } finally {
        setIsModelLoading(false);
      }
    }

    prepareModel();

    return () => {
      ImageClassifierService.dispose_models();
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div>
      <Card>
        <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info">
          <MDTypography variant="h6" color="white">
            {"(1/2)"} Photo of Food item
          </MDTypography>
        </MDBox>
        {
          isModelLoading ? (
            <MDBox textAlign="Center" my={2}>
              Loading Image Freshness Classifier
              <br />
              <CircularProgress />
            </MDBox>
          ) : (
            <MDBox>
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
                        !uploadResponse ? (
                          <MDButton variant="gradient" color="info" onClick={handleImageUpload}>
                            Upload Image
                          </MDButton>
                        ) : (
                          uploadResponse.valid && !freshResponse ? (
                            <MDButton variant="gradient" color="info" onClick={checkFreshness}>
                              Check Freshness
                            </MDButton>
                          )
                          : (
                            !validAndFresh && (
                              trainingModel ? (
                                <MDButton variant="gradient" disabled>
                                  Please wait...
                                </MDButton>
                              ) : (
                                <MDButton variant="gradient" color="error" onClick={handleArgue}>
                                  Nah bro looks fresh to me
                                </MDButton>
                              )
                            )
                          )
                        )
                      )
                    )
                  }
                </div>
              </MDBox>
              <MDBox pt={3} ml={2} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {
                  selectedImage && uploadResponse ? (
                    <>
                      <MDBox textAlign="center">
                        <p style={{ color: uploadResponse.valid ? "green" : "red" }}>
                          {uploadResponse.valid ? "Image is a valid food item." : "Image is not a valid food item."}
                        </p>
                        {
                        !freshResponse ? (
                          <p style={{ color: "blue" }}>
                            Check your food freshness to continue.
                          </p>
                          ) : (
                            <p style={{ color: validAndFresh ? "green" : "red" }}>
                              {validAndFresh ? "Looks fresh to me!" : "Looks nasty mate."}
                            </p>
                          )
                        }

                      </MDBox>
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
                      <p style={{ color: "blue" }}>Click "Upload Image" to continue</p>
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
                    disabled={!validAndFresh}
                  >
                    Next
                  </MDButton>
                </Link>
              </Grid>
            </MDBox>
          )
        }
        <Dialog
          open={openDialog}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Dispute Classification
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
            Our system has detected that the food is not safe for consumption. If you believe this is incorrect and the item is indeed fresh, please let us know. By doing so, you help us improve our accuracy. Would you like to proceed with classifying your item as an example of a fresh item?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <MDButton variant="gradient" color="info" onClick={handleClose}>Close</MDButton>
            <MDButton  variant="gradient" color="error" onClick={disputeFreshness} autoFocus>
              Dispute as fresh
            </MDButton>
          </DialogActions>
        </Dialog>
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
