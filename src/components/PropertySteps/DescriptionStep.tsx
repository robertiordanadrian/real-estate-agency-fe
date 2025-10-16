import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  Button,
  Paper,
  useTheme,
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
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const handleChange = (key: keyof IDescription, value: string) => {
    onChange({ ...data, [key]: value });
  };

  const handleOpenLink = (url: string) => {
    if (url && url.startsWith("http")) {
      window.open(url, "_blank");
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 3,
        background: isDark
          ? theme.palette.background.paper
          : theme.palette.background.default,
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" mb={2} fontWeight={600}>
              Descriere proprietate
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Titlu"
                  value={data.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Descriere"
                  value={data.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  fullWidth
                  multiline
                  minRows={6}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  label="Disponibilitate"
                  value={data.disponibility}
                  onChange={(e) =>
                    handleChange("disponibility", e.target.value)
                  }
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  label="Link video YouTube"
                  value={data.videoYoutubeLink}
                  onChange={(e) =>
                    handleChange("videoYoutubeLink", e.target.value)
                  }
                  fullWidth
                />
                {data.videoYoutubeLink &&
                  data.videoYoutubeLink.startsWith("http") && (
                    <Button
                      variant="outlined"
                      startIcon={<PlayCircle />}
                      onClick={() => handleOpenLink(data.videoYoutubeLink)}
                      sx={{
                        mt: 1,
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        "&:hover": {
                          backgroundColor: `${theme.palette.primary.main}11`,
                        },
                      }}
                    >
                      Deschide video
                    </Button>
                  )}
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  label="Link tur virtual"
                  value={data.virtualTour}
                  onChange={(e) => handleChange("virtualTour", e.target.value)}
                  fullWidth
                />
                {data.virtualTour && data.virtualTour.startsWith("http") && (
                  <Button
                    variant="outlined"
                    startIcon={<Tour />}
                    onClick={() => handleOpenLink(data.virtualTour)}
                    sx={{
                      mt: 1,
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                      "&:hover": {
                        backgroundColor: `${theme.palette.primary.main}11`,
                      },
                    }}
                  >
                    Deschide tur virtual
                  </Button>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Paper>
  );
};
