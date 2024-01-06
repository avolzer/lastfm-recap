import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useRef } from "react";
import exportImage from "./exportImage";
import Grid from "@mui/material/Grid";

const Recap = ({ data }) => {
  const graphicRef = useRef();
  const topArtist = data.artistData[0];
  const otherArtists = data.artistData.slice(1, 5);
  const topTrack = data.trackData[0];
  const otherTracks = data.trackData.slice(1, 5);

  return (
    <Box>
      <Grid
        container
        ref={graphicRef}
        sx={{
          bgcolor: "#459bdd",
          justifyItems: "center",
          color: "white",
          maxWidth: 400,
          padding: 4,
        }}
      >
        <Grid xs={12} item sx={{ pb: 4 }}>
          <Typography variant="h6" color="white">
            Top Artists
          </Typography>
        </Grid>
        <Grid xs={6} item>
          <Typography variant="h6">1. {topArtist.name}</Typography>
        </Grid>
        <Grid xs={6} item></Grid>
        <Grid xs={6} item>
          <div>
            <img alt="top artist" src={data.artistImage.url} />
          </div>
        </Grid>
        <Grid
          xs={6}
          item
          sx={{
            bgcolor: "#459bdd",
            alignItems: "center",
            color: "white",
            display: "flex",
          }}
        >
          <Box sx={{ pl: 2 }}>
            {otherArtists.map((a, idx) => {
              return (
                <Box key={idx} textAlign={"left"} color="white">
                  {idx + 2}. {a.name}
                </Box>
              );
            })}
          </Box>
        </Grid>

        <Grid xs={12} item sx={{ py: 4 }}>
          <Typography variant="h6" color="white">
            Top Tracks
          </Typography>
        </Grid>

        <Grid
          xs={6}
          item
          sx={{
            bgcolor: "#459bdd",
            alignItems: "center",
            color: "white",
            display: "flex",
          }}
        >
          <Box sx={{ pl: 2 }}>
            {otherTracks.map((a, idx) => {
              return (
                <Box key={idx} textAlign={"left"} color="white">
                  {idx + 2}. {a.name}
                </Box>
              );
            })}
          </Box>
        </Grid>
        <Grid xs={6} item>
          <div>
            <img alt="top track album art" src={data.albumImage.url} />
          </div>
          <Typography variant="h5">1. {topTrack.name}</Typography>
        </Grid>
      </Grid>
      <Button
        sx={{ mt: 2 }}
        onClick={() => exportImage(graphicRef.current, "test")}
      >
        Download
      </Button>
    </Box>
  );
};

export default Recap;
