import { useContext, useState } from "react";

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayoutLanding from "layouts/authentication/components/BasicLayoutLanding";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

import AuthService from "services/auth-service";
import { AuthContext } from "context";

function Login() {
  const authContext = useContext(AuthContext);

  const [user, setUser] = useState({});
  const [credentialsErrors, setCredentialsError] = useState(null);

  const [inputs, setInputs] = useState({
    username: "exampleUser",
    password: "password123",
  });

  const [errors, setErrors] = useState({
    usernameError: false,
    passwordError: false,
  });

  const addUserHandler = (newUser) => setUser(newUser);


  const changeHandler = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    
    e.preventDefault();

    if (inputs.username.trim().length < 6) {
      setErrors({ ...errors, usernameError: true });
      return;
    }

    if (inputs.password.trim().length < 6) {
      setErrors({ ...errors, passwordError: true });
      return;
    }

    const newUser = { username: inputs.username, password: inputs.password };
    addUserHandler(newUser);

    const myData = {
      Username: inputs.username,
      Password: inputs.password,
    };

    let response = null;
    try {
      response = await AuthService.login(myData);
    } catch (error) {
      console.log(error);
      setCredentialsError("An error has occured. Please try again later.");
      return;
    }
    
    if (response.validated) {
      setCredentialsError("");
      authContext.login(response.token, response.userid);
    } 
    else {
      setCredentialsError("Invalid login!");
    }

    return () => {
      setInputs({
        username: "",
        password: "",
      });

      setErrors({
        usernameError: false,
        passwordError: false,
      }); 
    };
  };

  return (
    <BasicLayoutLanding image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
          <Grid
            container
            spacing={3}
            justifyContent="center"
            sx={{ mt: 1, mb: 1 }}
          >
          </Grid>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox
            component="form"
            role="form"
            method="POST"
            onSubmit={submitHandler}
          >
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Username"
                fullWidth
                value={inputs.username}
                name="username"
                onChange={changeHandler}
                error={errors.usernameError}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                fullWidth
                name="password"
                value={inputs.password}
                onChange={changeHandler}
                error={errors.passwordError}
              />
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit">
                sign in
              </MDButton>
            </MDBox>
            {credentialsErrors && (
              <MDTypography variant="caption" color="error" fontWeight="light">
                {credentialsErrors}
              </MDTypography>
            )}
            <MDBox mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&apos;t have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/auth/register"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign up
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayoutLanding>
  );
}

export default Login;
