import "./App.css";
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";

import CssBaseline from "@mui/material/CssBaseline";

import Recap from "./Recap";
import { useFetchData } from "./getUserData";

function App() {
  const [user, setUser] = useState("");

  const { loading, error, userData, getUserData, authorizeSpotify } =
    useFetchData(user);

  useEffect(() => {
    authorizeSpotify();
  }, []);

  return (
    <Box className="App" bgcolor="white">
      <CssBaseline />
      <Typography
        variant="h1"
        sx={{
          "&:hover": {
            cursor: "pointer",
          },
        }}
        color="#459bdd"
        onClick={() => {
          window.location.reload(false);
        }}
      >
        Last.fm Recap
      </Typography>
      <Box
        display="flex"
        alignItems="center"
        minHeight="100vh"
        flexDirection="column"
        pt={4}
      >
        {userData ? (
          <Recap data={userData} />
        ) : (
          <>
            <Typography variant="h6">
              Enter your last.fm username to view your yearly recap
            </Typography>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="center"
              alignItems="center"
              gap={4}
              p={4}
            >
              <TextField
                variant="standard"
                label="username"
                value={user}
                onChange={(event) => {
                  setUser(event.target.value);
                }}
              />
              <LoadingButton
                loading={loading}
                variant="contained"
                onClick={() => {
                  getUserData(user);
                  // setShowRecap(true);
                }}
              >
                Go
              </LoadingButton>
            </Box>
            {error && <p>{error}</p>}
          </>
        )}
      </Box>
    </Box>
  );
}

export default App;
