import React, { useEffect, useState } from "react";
import { Grid, Typography, CircularProgress, Box, Button } from "@mui/material";
import { fetchItems } from "../api/api";
import { LIST_MOVIES, MOVIE_DETAILS } from "../config/apiEndpoints";
import { useNavigate } from "react-router-dom";
import Background from "../components/background";
import MovieCard from "../components/movies/movieCard";
import DetailCard from "../components/movies/detail-card";

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

import { GENRE, MINIMUM_RATING, SORT_BY } from "../config/environment";
import Cast from "../components/movies/cast";
import LoadingScreen from "../components/loadingScreen";
import ErrorScreen from "../components/errorScreen";
import MovieHeading from "../components/movies/movieHeading";
import MainDetails from "../components/movies/mainDetails";
import Torrents from "../components/movies/torrents";
import Filtering from "../components/movies/filtering";
import YouTubeEmbed from "../components/youtube";
import Divider from "../components/divider";

import "../styles/homeStyles.css";
import "../index.css";
import localStorageService from "../utils/localStorage";

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [cast, setCast] = useState([]);
  const [activeMovie, setActiveMovie] = useState(null);
  const [activeMovieIndex, setActiveMovieIndex] = useState(0);
  const [activeMovieIMDBID, setActiveMovieIMDBID] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const [finalPageNo, setFinalPageNo] = useState(1);
  const [movieCount, setMovieCount] = useState(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState(null);
  const [isNoMovies, setIsNoMovies] = useState(false);

  const [selectedOptions, setSelectedOptions] = useState({
    minimumRating: null,
    genre: null,
    sortBy: null,
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
    minimumRating: MINIMUM_RATING,
    genre: GENRE,
    sortBy: SORT_BY,
  });
  const navigate = useNavigate();

  const moviesPerPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      if (initialLoading) {
        setLoading(true);
      }
      try {
        const { minimumRating, genre, sortBy } = selectedOptions;
        const queryParams = new URLSearchParams({
          limit: moviesPerPage,
          page: pageNo,
          query_term: query,
          minimum_rating: minimumRating || "",
          genre: genre || "",
          sort_by: sortBy || "date_added",
        }).toString();

        const moviesList = await fetchItems(`${LIST_MOVIES}?${queryParams}`);

        if (
          moviesList?.data?.movie_count > 0 &&
          moviesList?.data?.movies !== null
        ) {
          setIsNoMovies(false);
          setMovies(moviesList?.data?.movies);
          setActiveMovieIndex(0);
          setActiveMovieIMDBID(moviesList?.data?.movies[0]?.id);
          setMovieCount(moviesList?.data?.movie_count);
          setFinalPageNo(
            movieCount % moviesPerPage !== 0
              ? Math.floor(movieCount / moviesPerPage) + 1
              : Math.floor(movieCount / moviesPerPage)
          );
          console.log(finalPageNo);
        } else {
          setIsNoMovies(true);
        }
        // setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [pageNo, query, selectedOptions]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (initialLoading) {
        setLoading(true);
        setInitialLoading(false);
      }
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

        setLoading(false);
      } catch (error) {
        setLoading(false);
        setInitialLoading(false);

        setError(error.message);
      }
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

  function handleLogOut() {
    localStorageService.clear();
    navigate("/login");
  }

  const handleNextPage = () => {
    setPageNo((prevPageNo) => prevPageNo + 1);
    setActiveMovieIndex(0);
  };

  const handleFinalPage = () => {
    setPageNo(
      movieCount % moviesPerPage !== 0
        ? Math.floor(movieCount / moviesPerPage) + 1
        : Math.floor(movieCount / moviesPerPage)
    );
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

  const handleResetFilters = () => {
    setSelectedOptions({
      minimumRating: null,
      genre: null,
      sortBy: null,
    });
  };

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  return (
    <Background backgroundImage={activeMovie?.large_cover_image}>
      {loading ? (
        <LoadingScreen />
      ) : error ? (
        <ErrorScreen error={error} />
      ) : (
        <Grid container xl={12}>
          <Grid container xl={6}>
            <div className="z-1 fade-slide-up">
              <DetailCard movie={activeMovie}></DetailCard>
            </div>

            <div
              class="position-absolute fade-slide-up"
              style={{
                maxHeight: "90vh",
                overflowX: "clip",
                maxWidth: windowWidth * 0.5,
                overflowY: "auto",
                marginBottom: "10vh",
              }}
            >
              <MovieHeading activeMovie={activeMovie} />
              <MainDetails activeMovie={activeMovie} />
              <Divider />

              <Grid container xl={12} ml={5} mb={3} mt={3}>
                <Typography
                  variant="h6"
                  sx={{ color: "white", opacity: "0.3", fontSize: "2rem" }}
                >
                  Cast
                </Typography>
              </Grid>
              <Grid container xl={12} mb={5} sx={{ height: "8rem" }}>
                {cast.map((item) => (
                  <Grid item xl={1.5} mb={3} key={item.id}>
                    <Cast image={item?.url_small_image} name={item?.name} />
                  </Grid>
                ))}
              </Grid>

              <Torrents activeMovie={activeMovie} />
              <Typography
                variant="h6"
                m={5}
                sx={{ color: "white", opacity: "0.5", fontSize: "2rem" }}
              >
                Trailer
              </Typography>
              <YouTubeEmbed ytId={activeMovie?.yt_trailer_code} />
              <Grid container mt={2} ml={3} mb={10}>
                <Typography variant="h5" sx={{ color: "grey" }}>
                  {activeMovie?.title_english} - Official Trailer
                </Typography>
              </Grid>
            </div>
          </Grid>
          <Grid
            container
            xl={5}
            ml={12}
            className="z2"
            style={{
              maxHeight: "95vh",
              overflowX: "clip",
              overflowY: "auto",
            }}
          >
            {/* Heading */}
            <Grid container spacing={2} xl={12}>
              <Grid xl={4} sx={{ alignContent: "center" }}>
                <h1 className="z0 color-white w-100 fw-700 text-center m-0 align-content-end">
                  Xillica Movies
                </h1>
                <h4 className="z0 color-white w-100 fw-200 text-center bg font-small m-0">
                  Surf Your Favorite Movies
                </h4>
              </Grid>
              <Grid item xl={4} sx={{ alignContent: "center" }}>
                <Button
                  fullWidth
                  onClick={() => {
                    navigate("/tv");
                  }}
                >
                  <Grid>
                    <h3 className="z0 color-white  w-100 fw-700 text-center m-0 align-content-end">
                      Xillica Series
                    </h3>
                  </Grid>
                </Button>
              </Grid>
              <Grid item xl={2} sx={{ alignContent: "center" }}>
                <Button fullWidth>
                  <Grid>
                    <h3 className="z0 color-white w-100 fw-700 text-center m-0 align-content-end">
                      Profile
                    </h3>
                  </Grid>
                </Button>
              </Grid>
              <Grid item xl={2} sx={{ alignContent: "center" }}>
                <Button fullWidth onClick={handleLogOut}>
                  <Grid>
                    <h3 className="z0 color-white w-100 fw-700 text-center m-0">
                      Log Out
                    </h3>
                  </Grid>
                </Button>
              </Grid>
            </Grid>

            {/* Heading */}

            <Grid xl={12}>
              <Filtering
                options={options}
                selectedOptions={selectedOptions}
                handleSearch={handleSearch}
                handleSelectionChange={handleSelectionChange}
                handleReload={handleResetFilters}
              />
            </Grid>

            {isNoMovies ? (
              <Grid xl={12}>
                <Typography sx={{ color: "grey", textAlign: "left" }}>
                  Nothing Found yet! Keep typing..
                </Typography>
              </Grid>
            ) : (
              <Grid
                container
                xl={12}
                spacing={2}
                style={{
                  maxHeight: "60vh",
                  overflowX: "clip",
                  overflowY: "auto",
                }}
              >
                {movies.map((item, index) => (
                  <Grid item xl={3} mb={1} key={item.id}>
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
                onClick={() => setPageNo(1)}
                disabled={pageNo === 1}
                sx={{ marginRight: 1, backgroundColor: "grey", color: "black" }}
              >
                <KeyboardDoubleArrowLeftIcon />
              </Button>
              <Button
                variant="contained"
                onClick={handlePreviousPage}
                disabled={pageNo === 1}
                sx={{
                  backgroundColor: "white",
                  color: "black",
                }}
              >
                <KeyboardArrowLeftIcon />
              </Button>
              <Typography
                ml={1}
                mr={1}
                sx={{ color: "grey", textAlign: "center", fontSize: "0.7rem" }}
              >
                Page {pageNo}
              </Typography>
              <Button
                variant="contained"
                onClick={handleNextPage}
                disabled={moviesPerPage * pageNo >= movieCount}
                sx={{
                  marginRight: 1,
                  backgroundColor: "white",
                  color: "black",
                }}
              >
                <KeyboardArrowRightIcon />
              </Button>
              <Button
                variant="contained"
                onClick={handleFinalPage}
                disabled={moviesPerPage * pageNo >= movieCount}
                sx={{ backgroundColor: "grey", color: "black" }}
              >
                <KeyboardDoubleArrowRightIcon />
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
