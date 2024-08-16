import React from "react";
import { Grid, Typography, Box, Button } from "@mui/material";

const windowWidth = window.innerWidth;

const handleSeedr = async (torrentUrl) => {
  try {
    // Copy the torrent URL to the clipboard
    await navigator.clipboard.writeText(torrentUrl);
    window.open("https://www.seedr.cc", "_blank");
    alert(
      "1 => Press ok and log into seedr.\n2=> Simply press the 'Paste link URL here' Field."
    );
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
};

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
            </a>
            <Button
              variant="contained"
              sx={{
                backgroundColor: torrent?.type === "bluray" ? "green" : "white",
                color: torrent?.type === "bluray" ? "white" : "black",
                marginLeft: "10px",
                fontSize: "0.7rem",
              }}
            >
              Magnet
            </Button>
            <Button
              variant="contained"
              onClick={() => handleSeedr(torrent?.url)}
              sx={{
                backgroundColor: torrent?.type === "bluray" ? "green" : "white",
                color: torrent?.type === "bluray" ? "white" : "black",
                marginLeft: "10px",
                fontSize: "0.7rem",
              }}
            >
              Seedr
            </Button>
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
