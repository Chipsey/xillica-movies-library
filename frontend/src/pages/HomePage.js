import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Typography,
  CircularProgress,
  Box,
  Button,
} from "@mui/material";
import { fetchItems } from "../api/api";
import { LIST_MOVIES } from "../config/apiEndpoints";
import Background from "../components/background";
import MovieCard from "../components/movieCard";
import DetailCard from "../components/detail-card";

import "../styles/homeStyles.css";
import "../index.css";

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [activeMovie, setActiveMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);

  const moviesPerPage = 8;
  const [pageNo, setPageNo] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const moviesList = await fetchItems(
          `${LIST_MOVIES}?limit=${moviesPerPage}&page=${pageNo}`
        );
        setMovies(moviesList?.data?.movies);
        setActiveMovie(moviesList?.data?.movies[0]);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [pageNo]);

  const handleMovieClick = (movie) => {
    setActiveMovie(movie);
  };

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
        <Grid container xl={12}>
          <Grid container xl={6}>
            <div className="z-1">
              <DetailCard movie={activeMovie}></DetailCard>
            </div>
          </Grid>
          <div class="home_back_gradient z-1"></div>

          {/* Movie Details */}
          <div class="position-absolute">
            <Typography
              sx={{ marginTop: primaryHeight, marginLeft: primaryWidth * 0.1 }}
            >
              <h1 class="color-white align-content-end m-0">
                {activeMovie?.title_english}
              </h1>
              <h2 class="color-white m-0 opacity-50">{activeMovie?.year}</h2>
              <div
                class="w-50 "
                style={{ height: 0.5, backgroundColor: "white" }}
              ></div>
            </Typography>
          </div>
          {/*  */}
          <Grid container xl={5} spacing={2} mt={2} ml={8}>
            <h1 class="z0 color-white w-100 fw-700 text-center m-0 align-content-end">
              Xillica Movies
            </h1>
            <h4 class="z0 color-white w-100 fw-200 text-center bg font-small m-0">
              Surf Your Favorite Movies
            </h4>
            {movies.map((item) => (
              <Grid item xl={3} key={item.id}>
                <MovieCard
                  movie={item}
                  onClick={() => handleMovieClick(item)}
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
            </Box>
          </Grid>
        </Grid>
      )}
    </Background>
  );
};

export default HomePage;
