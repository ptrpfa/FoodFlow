import { useContext, useState } from "react";
// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";

import AuthService from "services/auth-service";
import { AuthContext } from "context";
import { InputLabel } from "@mui/material";

function Register() {
  const authContext = useContext(AuthContext);

  const [terms, setTerms] = useState(false);

  const [inputs, setInputs] = useState({
    username: "",
    firstname: "",
    lastname: "",
    role: "",
    email: "",
    password: "",
    dob: "",
    addressfirst: "",
    addresssecond: "",
    addressthird: "",
    postalcode: "",
    agree: false,
  });

  const [errors, setErrors] = useState({
    usernameError: "",
    firstnameError: "",
    lastnameError: "",
    roleError: "",
    emailError: "",
    passwordError: "",
    dobError: "",
    addressfirstError: "",
    addresssecondError: "",
    addressthirdError: "",
    postalcodeError: "",
    error: false,
    errorText: "",
  });

  const openTerms = () => {
    setTerms(true);
  }

  const closeTerms = () => {
    setTerms(false);
  }

  const changeHandler = (e) => {
    if (e.target.name === "agree") {
      setInputs({
        ...inputs,
        ["agree"]: e.target.checked,
      });
      return;
    } 
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    const newErrors = {};
    newErrors.usernameError = inputs.username.trim().length === 0;
    newErrors.firstnameError = inputs.firstname.trim().length === 0;
    newErrors.lastnameError = inputs.lastname.trim().length === 0;
    newErrors.roleError = inputs.role.trim().length === 0;

    newErrors.emailError = inputs.email.trim().length === 0 || !inputs.email.trim().match(mailFormat);
    newErrors.passwordError = inputs.password.trim().length < 8;
    newErrors.dobError = inputs.dob.trim().length === 0;
    newErrors.addressfirstError = inputs.addressfirst.trim().length === 0;
    newErrors.addresssecondError = inputs.addresssecond.trim().length === 0;
    newErrors.addressthirdError = inputs.addressthird.trim().length === 0;
    newErrors.postalcodeError = inputs.postalcode.trim().length === 0;
    newErrors.agreeError = inputs.agree === false;

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error)) {
      return;
    }

    // gRPC to create new user
    const newUser = { 
      Username: inputs.username, 
      FirstName: inputs.firstname, 
      LastName: inputs.lastname,
      DOB: inputs.dob,
      Role: inputs.role,
      Password: inputs.password,
      AddressFirst: inputs.addressfirst,
      AddressSecond: inputs.addresssecond,
      AddressThird: inputs.addressthird,
      PostalCode: inputs.postalcode,
      Email: inputs.email,
    };

    try {
      await AuthService.register(newUser);

      const loginData = {
        Username: inputs.username,
        Password: inputs.password,
      }
      const loginResponse = await AuthService.login(loginData);
    
      if (loginResponse.validated) {
        authContext.login(loginResponse.token, loginResponse.userid);
      } 

      setInputs({
        username: "",
        firstname: "",
        lastname: "",
        role: "",
        email: "",
        password: "",
        dob: "",
        addressfirst: "",
        addresssecond: "",
        addressthird: "",
        postalcode: "",
        agree: false,
      });

      setErrors({
        usernameError: "",
        firstnameError: "",
        lastnameError: "",
        roleError: "",
        emailError: "",
        passwordError: "",
        dobError: "",
        addressfirstError: "",
        addresssecondError: "",
        addressthirdError: "",
        postalcodeError: "",
        error: false,
        errorText: "",
      });
    } catch (err) {
      setErrors({ ...errors, error: true, errorText: err.message });
      console.error(err);
    }
  };

  return (
    <CoverLayout image={bgImage} >
      <div style={{ display: 'flex', justifyContent: 'center', height: '100vh' }}>
        <Card style={{maxHeight: "65vh", minWidth:"60vh" , overflowY: "auto"}}>
          <MDBox
            variant="gradient"
            bgColor="info"
            borderRadius="lg"
            coloredShadow="success"
            mx={2}
            mt={2}
            p={3}
            mb={1}
            textAlign="center"
          >
            <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
              Join us today
            </MDTypography>
            <MDTypography display="block" variant="button" color="white" my={1}>
              Enter your email and password to register
            </MDTypography>
          </MDBox>
          <MDBox pt={4} pb={3} px={3}>
            <MDBox component="form" role="form" method="POST" onSubmit={submitHandler}>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="Username"
                  variant="standard"
                  fullWidth
                  name="username"
                  value={inputs.username}
                  onChange={changeHandler}
                  error={errors.usernameError}
                />
                {errors.usernameError && (
                  <MDTypography variant="caption" color="error" fontWeight="light">
                    The username cannot be empty
                  </MDTypography>
                )}
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="First Name"
                  variant="standard"
                  fullWidth
                  name="firstname"
                  value={inputs.firstname}
                  onChange={changeHandler}
                  error={errors.firstnameError}
                  inputProps={{
                    autoComplete: "name",
                    form: {
                      autoComplete: "off",
                    },
                  }}
                />
                {errors.firstnameError && (
                  <MDTypography variant="caption" color="error" fontWeight="light">
                    The first name cannot be empty
                  </MDTypography>
                )}
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="Last Name"
                  variant="standard"
                  fullWidth
                  name="lastname"
                  value={inputs.lastname}
                  onChange={changeHandler}
                  error={errors.lastnameError}
                  inputProps={{
                    autoComplete: "name",
                    form: {
                      autoComplete: "off",
                    },
                  }}
                />
                {errors.lastnameError && (
                  <MDTypography variant="caption" color="error" fontWeight="light">
                    The last name cannot be empty
                  </MDTypography>
                )}
              </MDBox>
              <MDBox mb={2}>
                <FormControl fullWidth variant="standard">
                  <InputLabel id="role-select-label">Role</InputLabel>
                  <Select
                    style={{ height: 40 }}
                    labelId="role-select-label"
                    id="role-select"
                    label="Role"
                    name="role"
                    value={inputs.role}
                    onChange={changeHandler}
                  >
                    <MenuItem value={"donor"}>Donor</MenuItem>
                    <MenuItem value={"patron"}>Patron</MenuItem>
                  </Select>
                </FormControl>
                {errors.roleError && (
                  <MDTypography variant="caption" color="error" fontWeight="light">
                    The role cannot be empty
                  </MDTypography>
                )}
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="email"
                  label="Email"
                  variant="standard"
                  fullWidth
                  value={inputs.email}
                  name="email"
                  onChange={changeHandler}
                  error={errors.emailError}
                  inputProps={{
                    autoComplete: "email",
                    form: {
                      autoComplete: "off",
                    },
                  }}
                />
                {errors.emailError && (
                  <MDTypography variant="caption" color="error" fontWeight="light">
                    The email must be valid
                  </MDTypography>
                )}
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="password"
                  label="Password"
                  variant="standard"
                  fullWidth
                  name="password"
                  value={inputs.password}
                  onChange={changeHandler}
                  error={errors.passwordError}
                />
                {errors.passwordError && (
                  <MDTypography variant="caption" color="error" fontWeight="light">
                    The password must be of at least 8 characters
                  </MDTypography>
                )}
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="date"
                  label="Date of Birth"
                  variant="standard"
                  fullWidth
                  name="dob"
                  value={inputs.dob}
                  onChange={changeHandler}
                  error={errors.dobError}
                />
                {errors.dobError && (
                  <MDTypography variant="caption" color="error" fontWeight="light">
                    The date of birth cannot be empty
                  </MDTypography>
                )}
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="Address First Line"
                  variant="standard"
                  fullWidth
                  name="addressfirst"
                  value={inputs.addressfirst}
                  onChange={changeHandler}
                  error={errors.addressfirstError}
                />
                {errors.addressfirstError && (
                  <MDTypography variant="caption" color="error" fontWeight="light">
                    The first address line cannot be empty
                  </MDTypography>
                )}
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="Address Second Line"
                  variant="standard"
                  fullWidth
                  name="addresssecond"
                  value={inputs.addresssecond}
                  onChange={changeHandler}
                  error={errors.addresssecondError}
                />
                {errors.addresssecondError && (
                  <MDTypography variant="caption" color="error" fontWeight="light">
                    The second address line cannot be empty
                  </MDTypography>
                )}
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="Address Third Line"
                  variant="standard"
                  fullWidth
                  name="addressthird"
                  value={inputs.addressthird}
                  onChange={changeHandler}
                  error={errors.addressthirdError}
                />
                {errors.addressthirdError && (
                  <MDTypography variant="caption" color="error" fontWeight="light">
                    The third address line cannot be empty
                  </MDTypography>
                )}
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="Postal Code"
                  variant="standard"
                  fullWidth
                  name="postalcode"
                  value={inputs.postalcode}
                  onChange={changeHandler}
                  error={errors.postalcodeError}
                />
                {errors.postalcodeError && (
                  <MDTypography variant="caption" color="error" fontWeight="light">
                    The postal code cannot be empty
                  </MDTypography>
                )}
              </MDBox>
              <MDBox display="flex" alignItems="center" ml={-1}>
                <Checkbox name="agree" id="agree" onChange={changeHandler} />
                <InputLabel
                  variant="standard"
                  fontWeight="regular"
                  color="text"
                  sx={{ lineHeight: "1.5"}}
                  htmlFor="agree"
                >
                  &nbsp;&nbsp;I agree to the&nbsp;
                </InputLabel>
                <MDTypography
                  onClick={openTerms}
                  variant="button"
                  fontWeight="bold"
                  color="info"
                  textGradient
                  style={{ cursor: 'pointer' }}
                >
                  Terms and Conditions
                </MDTypography>
              </MDBox>
              {errors.agreeError && (
                <MDTypography variant="caption" color="error" fontWeight="light">
                  You must agree to the Terms and Conditions
                </MDTypography>
              )}
              {errors.error && (
                <MDTypography variant="caption" color="error" fontWeight="light">
                  {errors.errorText}
                </MDTypography>
              )}
              <MDBox mt={4} mb={1}>
                <MDButton variant="gradient" color="info" fullWidth type="submit">
                  register and sign in
                </MDButton>
              </MDBox>
              <MDBox mt={3} mb={1} textAlign="center">
                <MDTypography variant="button" color="text">
                  Already have an account?{" "}
                  <MDTypography
                    component={Link}
                    to="/auth/login"
                    variant="button"
                    color="info"
                    fontWeight="medium"
                    textGradient
                  >
                    Sign In
                  </MDTypography>
                </MDTypography>
              </MDBox>
            </MDBox>
            <Dialog
              open={terms}
              onClose={closeTerms}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                Terms of Service and Data Use
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  By checking the box below, you agree to the following:
                  <br/>
                  <br/>
                  1. Data Collection: We use federated learning to collect anonymized, aggregated data insights from your usage to improve our services.
                  <br/>
                  <br/>
                  2. Privacy: Your personal data remains on your device and is not directly accessed by our servers.
                  <br/>
                  <br/>
                  3. Consent: Clicking "I Accept" indicates your consent to these terms.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <MDButton variant="gradient" color="info" onClick={closeTerms}>Close</MDButton>
              </DialogActions>
            </Dialog>
          </MDBox>
        </Card>
      </div>
    </CoverLayout>
  );
}

export default Register;
