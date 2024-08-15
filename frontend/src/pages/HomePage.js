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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { fetchItems } from "../api/api";
import {
  LIST_MOVIES,
  MOVIE_DETAILS,
  MOVIE_DETAILS_TMDB,
} from "../config/apiEndpoints";
import Background from "../components/background";
import MovieCard from "../components/movieCard";
import DetailCard from "../components/detail-card";

import "../styles/homeStyles.css";
import "../index.css";
import {
  GENRE,
  MINIMUM_RATING,
  QUALITY,
  SORT_BY,
  TMDB_API_KEY,
} from "../config/environment";
import Cast from "../components/cast";

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [cast, setCast] = useState([]);
  const [activeMovie, setActiveMovie] = useState(null);
  const [activeMovieIndex, setActiveMovieIndex] = useState(0);
  const [activeMovieIMDBID, setActiveMovieIMDBID] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [movieCount, setMovieCount] = useState(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState(null);
  const [isNoMovies, setIsNoMovies] = useState(false);

  const [selectedOptions, setSelectedOptions] = useState({
    quality: "",
    minimumRating: null,
    genre: "",
    sortBy: "",
  });

  // Function to handle selection change
  const handleSelectionChange = (event, dropdown) => {
    console.log(dropdown);

    setSelectedOptions((prevState) => ({
      ...prevState,
      [dropdown]: event.target.value,
    }));
  };

  // Data fetching example
  const [options, setOptions] = useState({
    quality: QUALITY,
    minimumRating: MINIMUM_RATING,
    genre: GENRE,
    sortBy: SORT_BY,
  });

  const moviesPerPage = 8;
  const [pageNo, setPageNo] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { quality, minimumRating, genre, sortBy } = selectedOptions;
        const queryParams = new URLSearchParams({
          limit: moviesPerPage,
          page: pageNo,
          query_term: query,
          quality: quality || "",
          minimum_rating: minimumRating || "",
          genre: genre || "",
          sort_by: sortBy || "date_added",
        }).toString();

        const moviesList = await fetchItems(`${LIST_MOVIES}?${queryParams}`);

        if (
          moviesList?.data?.movie_count > 0 &&
          moviesList?.data?.movies != null
        ) {
          setIsNoMovies(false);
          setMovies(moviesList?.data?.movies);
          setActiveMovieIndex(0);
          setActiveMovieIMDBID(moviesList?.data?.movies[0]?.id);
          setMovieCount(moviesList?.data?.movie_count);
        } else {
          setIsNoMovies(true);
        }
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [pageNo, query, selectedOptions]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      // setLoading(true);
      setCast([]);
      try {
        const movieDetails = await fetchItems(
          `${MOVIE_DETAILS}?movie_id=${activeMovieIMDBID}&with_cast=true`
        );
        setActiveMovie(movieDetails?.data?.movie);
        if (movieDetails?.data?.movie?.cast !== undefined) {
          setCast(movieDetails?.data?.movie?.cast);
          console.log(cast);
        }

        // setLoading(false);
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    };

    fetchMovieDetails();
  }, [activeMovieIMDBID]);

  const handleMovieClick = async (movie, index) => {
    setActiveMovieIndex(index);
    setActiveMovieIMDBID(movie.id);
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
    setActiveMovieIndex(0);
  };

  const handlePreviousPage = () => {
    if (pageNo > 1) {
      setPageNo((prevPageNo) => prevPageNo - 1);
      setActiveMovieIndex(0);
    }
  };

  const handleReload = () => {
    window.location.reload();
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
            sx={{
              fontSize: {
                xs: "0.875rem",
                sm: "1rem",
                md: "1.125rem",
              },
            }}
            className="color-white z2"
          >
            Failed to fetch items: {error}
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={handleReload}
            sx={{ marginTop: 2 }}
          >
            Retry
          </Button>
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
              maxHeight: "90vh",
              overflowX: "clip",
              overflowY: "auto",
            }}
          >
            <Grid container ml={5} mb={5}>
              <Typography
                sx={{
                  marginTop: primaryHeight * 0.3,
                  maxWidth: windowWidth * 0.45,
                }}
              >
                <div
                  class="color-white align-content-end m-0 w-100 fw-600"
                  style={{ fontSize: primaryWidth * 0.6 }}
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
            </Grid>

            <Grid container xl={12} ml={5} mb={5}>
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
                    style={{ fontSize: primaryWidth * 0.5 }}
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

            <Grid container xl={12} ml={5} mb={3}>
              <Typography variant="h6" sx={{ color: "white", opacity: "0.75" }}>
                Cast
              </Typography>
            </Grid>
            <Grid container mb={5}>
              {cast.map((item) => (
                <Grid item xl={2} mb={3} key={item.id}>
                  <Cast image={item?.url_small_image} name={item?.name} />
                </Grid>
              ))}
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
                mb={5}
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
          <Grid
            container
            xl={5}
            spacing={2}
            mt={0}
            ml={8}
            className="z2"
            style={{
              maxHeight: "90vh",
              overflowX: "clip",
              overflowY: "auto",
            }}
          >
            <h1 class="z0 color-white w-100 fw-700 text-center m-0 align-content-end">
              Xillica Movies
            </h1>
            <h4 class="z0 color-white w-100 fw-200 text-center bg font-small m-0">
              Surf Your Favorite Movies
            </h4>
            <Grid container xl={12} mt={3} mb={1} mr={6}>
              <Grid xl={12}>
                <input
                  onChange={(event) => handleSearch(event.target.value)}
                  type="text"
                  placeholder="Let's Start Searching.."
                  style={{
                    width: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    color: "white",
                    border: "1px solid white",
                    borderRadius: "50px",
                    padding: windowWidth * 0.008,
                    outline: "none",
                  }}
                  class="font-small"
                />
              </Grid>
            </Grid>
            <Grid
              container
              spacing={2}
              mb={5}
              justifyContent="center"
              alignItems="center"
            >
              {Object.keys(options).map((key, index) => (
                <Grid item xs={3} key={index}>
                  <FormControl
                    variant="filled"
                    sx={{ backgroundColor: "grey", borderRadius: "10px" }}
                    fullWidth
                  >
                    <InputLabel id={`${key}-label`}>
                      {options[key].title}
                    </InputLabel>
                    <Select
                      sx={{
                        color: "white",
                        backgroundColor: "rgba(230, 230, 230, 0.3)",
                      }}
                      labelId={`${key}-label`}
                      id={key}
                      value={selectedOptions[key] || ""}
                      onChange={(event) => handleSelectionChange(event, key)}
                    >
                      {options[key].values.map((optionValue, optionIndex) => (
                        <MenuItem value={optionValue} key={optionIndex}>
                          {optionValue}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              ))}
              <Button
                variant="contained"
                color="success"
                onClick={handleReload}
                sx={{
                  marginTop: 1,
                  color: "white",
                }}
              >
                Reset Search
              </Button>
            </Grid>

            {isNoMovies ? (
              <Grid xl={3}>
                <Typography sx={{ color: "grey", textAlign: "left" }}>
                  Nothing Found yet! Keep typing..
                </Typography>
              </Grid>
            ) : (
              <Grid container>
                {movies.map((item, index) => (
                  <Grid item xl={3} mb={3} key={item.id}>
                    <MovieCard
                      movie={item}
                      onClick={() => handleMovieClick(item, index)}
                      isActive={index === activeMovieIndex}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
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
                disabled={movieCount <= 8}
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
