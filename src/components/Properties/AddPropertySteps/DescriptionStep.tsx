import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
} from "@mui/material";
import type { IDescription } from "../../../common/interfaces/description.interface";

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

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        overflow: "auto",
      }}
    >
      <Card>
        <CardContent>
          <Typography variant="subtitle1" mb={2}>
            Descriere
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
                multiline
                rows={6}
                fullWidth
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
                label="Video (Link YouTube)"
                value={data.videoYoutubeLink}
                onChange={(e) =>
                  handleChange("videoYoutubeLink", e.target.value)
                }
                type="url"
                fullWidth
              />
            </Grid>

            <Grid size={12}>
              <TextField
                label="Tur virtual"
                value={data.virtualTour}
                onChange={(e) => handleChange("virtualTour", e.target.value)}
                type="url"
                fullWidth
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};
