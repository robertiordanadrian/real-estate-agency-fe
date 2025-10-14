import { Grid, CircularProgress } from "@mui/material";
import { PropertyCard } from "../PropertyCard/PropertyCard";
import { usePropertiesQuery } from "../../features/properties/propertiesQueries";

export const PropertiesList = () => {
  const { data: properties, isLoading, error } = usePropertiesQuery();

  if (isLoading) return <CircularProgress />;
  if (error) return <div>Eroare la incarcarea proprietatilor</div>;
  if (!properties || properties.length === 0)
  return <div>Nu exista proprietati.</div>;

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
