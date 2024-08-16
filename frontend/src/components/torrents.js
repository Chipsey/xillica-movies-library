import React from "react";
import { Grid, Typography, Box, Button } from "@mui/material";

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
const primaryWidth = windowWidth / 30;
const primaryHeight = windowHeight / 40;

const Torrents = ({ activeMovie }) => {
  return (
    <Box mb={12}>
      <Grid
        container
        xl={12}
        ml={5}
        mb={2}
        mt={3}
        sx={{ color: "white", opacity: 0.5 }}
      >
        <Grid xl={4}>
          <span class="font-small">Quality</span>
        </Grid>
        <Grid xl={3}>
          {" "}
          <span class="font-small">Size</span>
        </Grid>
        <Grid xl={3}>
          {" "}
          <span class="font-small">Links</span>
        </Grid>
      </Grid>
      <div
        class="w-100 mb-3"
        style={{
          height: 0.5,
          backgroundColor: "grey",
          width: windowWidth * 0.5,
          opacity: "0.4",
        }}
      ></div>
      {activeMovie?.torrents.map((torrent) => (
        <Grid
          container
          xl={12}
          mb={3}
          key={torrent.id}
          sx={{ alignItems: "center" }}
        >
          <Grid xl={4} mb={3} ml={5}>
            <Typography sx={{ color: "white", textAlign: "left" }}>
              {torrent?.quality}
            </Typography>
            <Typography sx={{ color: "white", textAlign: "left" }}>
              {torrent?.type} {torrent?.video_codec}
            </Typography>
            <Typography
              fontSize="small"
              sx={{ color: "grey", textAlign: "left" }}
            >
              {torrent?.audio_channels} audio Channels
            </Typography>
            <Typography
              fontSize="small"
              sx={{ color: "grey", textAlign: "left" }}
            >
              {torrent?.bit_depth} bit depth
            </Typography>
          </Grid>
          <Grid xl={3}>
            <Typography sx={{ color: "grey", textAlign: "left" }}>
              {torrent?.size}
            </Typography>
          </Grid>
          <Grid xl={4} sx={{ fontSize: "0.75rem" }}>
            <a href={torrent?.url}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor:
                    torrent?.type === "bluray" ? "green" : "white",
                  color: torrent?.type === "bluray" ? "white" : "black",
                  fontSize: "0.7rem",
                }}
              >
                Download
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor:
                    torrent?.type === "bluray" ? "green" : "white",
                  color: torrent?.type === "bluray" ? "white" : "black",
                  marginLeft: "10px",
                  fontSize: "0.7rem",
                }}
              >
                Magnet
              </Button>
            </a>
          </Grid>
          <div
            class="w-100"
            style={{
              height: 0.5,
              backgroundColor: "grey",
              opacity: "0.5",
            }}
          ></div>
        </Grid>
      ))}{" "}
    </Box>
  );
};

export default Torrents;
