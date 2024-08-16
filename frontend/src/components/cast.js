import React from "react";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledCard = styled(Card)(({ theme }) => ({
  width: 200, // Adjust the width as needed
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[0],
  backgroundColor: "transparent", // Ensure the background color is transparent
  padding: 0, // Remove default padding if needed
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  width: "50%",
  height: 100,
  borderRadius: "50%",
  objectFit: "cover",
}));

const Cast = ({ image, name }) => {
  return (
    <StyledCard>
      <StyledCardMedia component="img" image={image} alt={name} />
      <CardContent>
        <Typography
          variant="h7"
          component="div"
          className="color-white fw-600 opacity-50"
        >
          {name}
        </Typography>
      </CardContent>
    </StyledCard>
  );
};

export default Cast;
