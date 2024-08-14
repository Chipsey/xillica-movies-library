import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Typography,
  CircularProgress,
  Box,
  Button,
  Table,
  TextField,
} from "@mui/material";
import { fetchItems } from "../api/api";
import { LIST_MOVIES, MOVIE_DETAILS_TMDB } from "../config/apiEndpoints";
import Background from "../components/background";
import MovieCard from "../components/movieCard";
import DetailCard from "../components/detail-card";

import "../styles/homeStyles.css";
import "../index.css";
import { TMDB_API_KEY } from "../config/environment";

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [activeMovie, setActiveMovie] = useState(null);
  const [activeMovieIndex, setActiveMovieIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [error, setError] = useState(null);

  const moviesPerPage = 8;
  const [pageNo, setPageNo] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const moviesList = await fetchItems(
          `${LIST_MOVIES}?limit=${moviesPerPage}&page=${pageNo}&query_term=${query}`
        );
        if (moviesList?.data?.movie_count > 0) {
          setMovies(moviesList?.data?.movies);
          setActiveMovie(moviesList?.data?.movies[0]);
        }
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [pageNo, query]);

  const handleMovieClick = async (movie, index) => {
    setActiveMovie(movie);
    setActiveMovieIndex(index);
  };

  const handleSearch = (text) => {
    const processedQuery = replaceSpacesWithPlus(text);
    setQuery(processedQuery);
  };

  function replaceSpacesWithPlus(sentence) {
    return sentence.split(" ").join("+");
  }

  const handleNextPage = () => {
    setPageNo((prevPageNo) => prevPageNo + 1);
  };

  const handlePreviousPage = () => {
    if (pageNo > 1) {
      setPageNo((prevPageNo) => prevPageNo - 1);
    }
  };

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const primaryWidth = windowWidth / 30;
  const primaryHeight = windowHeight / 40;

  return (
    <Background backgroundImage={activeMovie?.large_cover_image}>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Container
          maxWidth="lg"
          sx={{
            padding: { xs: 0, sm: 0, md: 0 },
            marginTop: { xs: 4, sm: 4, md: 4 },
          }}
        >
          <Typography
            color="error"
            sx={{ fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem" } }}
          >
            Failed to fetch items: {error}
          </Typography>
        </Container>
      ) : (
        /////////////////////////////////////////////////////////////////////////////////////////
        <Grid container xl={12}>
          <Grid container xl={6}>
            <div className="z-1">
              <DetailCard movie={activeMovie}></DetailCard>
            </div>
          </Grid>

          {/* <div class="home_back_gradient z-1"></div> */}

          {/* Movie Details */}
          <div
            class="position-absolute"
            style={{
              maxHeight: "90vh", // Set the maximum height
              overflowX: "clip", // Enable vertical scrolling
              overflowY: "auto", // Enable vertical scrolling
            }}
          >
            <Typography
              sx={{
                marginTop: primaryHeight * 0.5,
                marginLeft: primaryWidth * 0.1,
                maxWidth: windowWidth * 0.45,
              }}
            >
              <div
                class="color-white align-content-end m-0 w-100 fw-600"
                style={{ fontSize: primaryWidth }}
              >
                {activeMovie?.title_english}
                <div
                  class="opacity-50"
                  style={{ fontSize: primaryWidth * 0.5 }}
                >
                  {activeMovie?.year}
                </div>
              </div>
              <h4
                class="color-white w-100 mt-3 mb-3 fw-100"
                style={{
                  maxHeight: "170px",
                  overflowY: "auto",
                }}
              >
                {activeMovie?.description_full}
              </h4>
            </Typography>
            <Grid container xl={12} m={primaryWidth * 0.1} mb={5}>
              <Grid xl={3}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "left",
                    minWidth: "100px",
                  }}
                >
                  <Typography
                    className="opacity-75"
                    sx={{ color: "white", textAlign: "left" }}
                  >
                    IMDB
                  </Typography>
                  <Typography
                    sx={{
                      color: "orange",
                      textAlign: "left",
                      fontSize: "larger",
                      fontWeight: "bold",
                    }}
                  >
                    {activeMovie?.rating}
                  </Typography>
                </Box>
              </Grid>
              <Grid xl={3}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "left",
                    minWidth: "100px",
                  }}
                >
                  <Typography
                    className="opacity-75"
                    sx={{ color: "white", textAlign: "left" }}
                  >
                    Language
                  </Typography>
                  <Typography
                    sx={{
                      color: "white",
                      textAlign: "left",
                      fontSize: "larger",
                      fontWeight: "bold",
                    }}
                  >
                    {activeMovie?.language}
                  </Typography>
                </Box>
              </Grid>
              <Grid xl={6}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "left",
                    minWidth: "100px",
                  }}
                >
                  <Typography
                    className="opacity-75"
                    sx={{ color: "white", textAlign: "left" }}
                  >
                    Genres
                  </Typography>
                  <div
                    class="mt-1 w-75"
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      color: "white",
                    }}
                  >
                    {activeMovie?.genres.map((genre, index) => (
                      <span key={index}>
                        {genre}
                        <span class="opacity-0">--</span>{" "}
                      </span>
                    ))}
                  </div>
                </Box>
              </Grid>
            </Grid>
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
              class="w-100"
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
                mt={3}
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
                <Grid xl={4}>
                  <a href={torrent?.url}>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor:
                          torrent?.type === "bluray" ? "green" : "white",
                        color: torrent?.type === "bluray" ? "white" : "black",
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
                    opacity: "0.4",
                  }}
                ></div>
              </Grid>
            ))}
          </div>
          {/*  */}
          <Grid container xl={5} spacing={2} mt={0} ml={8} className="z2">
            <h1 class="z0 color-white w-100 fw-700 text-center m-0 align-content-end">
              Xillica Movies
            </h1>
            <h4 class="z0 color-white w-100 fw-200 text-center bg font-small m-0">
              Surf Your Favorite Movies
            </h4>
            <Grid container xl={12} mt={3} mb={1}>
              <Grid xl={12}>
                <input
                  onChange={(event) => handleSearch(event.target.value)}
                  type="text"
                  placeholder="Let's Start Searching.."
                  style={{
                    width: "100%",
                    backgroundColor: "transparent",
                    color: "white",
                    border: "2px solid grey",
                    borderRadius: "50px",
                    padding: windowWidth * 0.008,
                    outline: "none",
                  }}
                  class="font-small"
                />
              </Grid>
            </Grid>
            {movies.map((item, index) => (
              <Grid item xl={3} key={item.id}>
                <MovieCard
                  movie={item}
                  onClick={() => handleMovieClick(item, index)}
                  isActive={index === activeMovieIndex}
                />
              </Grid>
            ))}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 2,
                marginBottom: 2,
                width: "100%", // Ensure the Box stretches the full width of the container
              }}
            >
              <Button
                variant="contained"
                onClick={handlePreviousPage}
                disabled={pageNo === 1}
                sx={{ marginRight: 1, backgroundColor: "grey", color: "black" }}
              >
                Previous
              </Button>
              <Button
                variant="contained"
                onClick={handleNextPage}
                sx={{ marginLeft: 1, backgroundColor: "white", color: "black" }}
              >
                Next
              </Button>
              {loading && <CircularProgress />}
            </Box>
          </Grid>
        </Grid>
      )}
    </Background>
  );
};

export default HomePage;
