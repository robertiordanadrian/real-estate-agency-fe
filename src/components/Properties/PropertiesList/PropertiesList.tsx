import { Grid, CircularProgress } from "@mui/material";
import { useProperties } from "../../../context/PropertyContext";
import { PropertyCard } from "../PropertyCard/PropertyCard";

export const PropertiesList = () => {
  const { properties, loading } = useProperties();

  if (loading) return <CircularProgress />;

  return (
    <Grid container spacing={2}>
      {properties.map((property) => (
        <Grid key={property._id} size={3}>
          <PropertyCard property={property} />
        </Grid>
      ))}
    </Grid>
  );
};
