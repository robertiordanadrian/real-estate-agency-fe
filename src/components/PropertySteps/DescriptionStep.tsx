import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  Button,
} from "@mui/material";
import { PlayCircle, Tour } from "@mui/icons-material";
import { IDescription } from "../../common/interfaces/description.interface";

interface DescriptionStepProps {
  data: IDescription;
  onChange: (updated: IDescription) => void;
}

export const DescriptionStep: React.FC<DescriptionStepProps> = ({
  data,
  onChange,
}) => {
  const handleChange = (key: keyof IDescription, value: string) => {
    onChange({ ...data, [key]: value });
  };

  const handleOpenLink = (url: string) => {
    if (url && url.startsWith("http")) {
      window.open(url, "_blank");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="subtitle1" mb={2}>
            Descriere proprietate
          </Typography>

          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                label="Titlu"
                value={data.title}
                onChange={(e) => handleChange("title", e.target.value)}
                fullWidth
              />
            </Grid>

            <Grid size={12}>
              <TextField
                label="Descriere"
                value={data.description}
                onChange={(e) => handleChange("description", e.target.value)}
                fullWidth
                multiline
                minRows={5}
              />
            </Grid>

            <Grid size={6}>
              <TextField
                label="Disponibilitate"
                value={data.disponibility}
                onChange={(e) => handleChange("disponibility", e.target.value)}
                fullWidth
              />
            </Grid>

            <Grid size={6}>
              <TextField
                label="Link video YouTube"
                value={data.videoYoutubeLink}
                onChange={(e) =>
                  handleChange("videoYoutubeLink", e.target.value)
                }
                fullWidth
              />
            </Grid>

            <Grid size={6}>
              <TextField
                label="Link tur virtual"
                value={data.virtualTour}
                onChange={(e) => handleChange("virtualTour", e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};
