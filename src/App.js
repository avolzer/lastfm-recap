import "./App.css";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import CssBaseline from "@mui/material/CssBaseline";

import Recap from "./Recap";
import { useFetchData } from "./getUserData";

function App() {
  const [user, setUser] = useState("");

  const { loading, error, userData, getUserData } = useFetchData(user);

  return (
    <Box className="App" bgcolor="white">
      <CssBaseline />
      <Typography variant="h1" color="#459bdd">
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
              <Button variant="contained" onClick={() => getUserData(user)}>
                Go
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}

export default App;
