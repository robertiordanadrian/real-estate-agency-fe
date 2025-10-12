import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from "@mui/material";
import { LocationOn } from "@mui/icons-material";
import type { IProperty } from "../../../common/interfaces/property.interface";
import { useNavigate } from "react-router-dom";

interface PropertyCardProps {
  property: IProperty;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const navigate = useNavigate();
  const { description, images, generalDetails, characteristics } = property;

  const handleClick = () => {
    navigate(`/properties/${property._id}`);
  };
  return (
    <Card sx={{ cursor: "pointer" }} onClick={handleClick}>
      <CardMedia
        component="img"
        alt={description?.title}
        image={images ? images[0] : ""}
        sx={{ height: 200, objectFit: "cover" }}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div" sx={{ mb: 0.5 }}>
          {description?.title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            mb: 2,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <LocationOn /> {generalDetails.location.zone}
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          <Chip
            label={`${characteristics.details.bedrooms} camere`}
            size="small"
          />
          <Chip
            label={`${characteristics.areas.totalUsableArea} mp`}
            size="small"
          />
          <Chip label={`Etaj ${characteristics.details.floor}`} size="small" />
          <Chip
            label={`An de constructie ${characteristics.details.yearOfConstruction}`}
            size="small"
          />
          <Chip label={`Agent - ${generalDetails.agent}`} size="small" />
        </Box>
      </CardContent>
    </Card>
  );
};
