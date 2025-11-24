import { PlayCircle, Tour } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";

import { IDescription } from "@/common/interfaces/property/description.interface";
import { DatePicker } from "@mui/x-date-pickers";
import { forwardRef, useImperativeHandle, useState } from "react";

interface DescriptionStepProps {
  data: IDescription;
  onChange: (updated: IDescription | ((prev: IDescription) => IDescription)) => void;
  descriptionTouched: boolean;
}

export interface DescriptionStepRef {
  validate: () => boolean;
  hasDiacriticsError?: () => boolean;
}

type DescriptionErrors = {
  title?: boolean;
  titleHasDiacritics?: boolean;
  description?: boolean;
  descriptionTooShort?: boolean;
  descriptionHasDiacritics?: boolean;
};

// =========
// ✅ READY
// =========
const DescriptionStep = forwardRef<DescriptionStepRef, DescriptionStepProps>(
  ({ data, onChange, descriptionTouched }, ref) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [descriptionErrors, setDescriptionErrors] = useState<DescriptionErrors>({});

    const validateDescription = () => {
      const newErrors: DescriptionErrors = {};

      if (!data.title) {
        newErrors.title = true;
      } else if (/[ăâîșțĂÂÎȘȚ]/.test(data.title)) {
        newErrors.titleHasDiacritics = true;
      }

      if (!data.description) {
        newErrors.description = true;
      } else if (data.description.length < 250) {
        newErrors.descriptionTooShort = true;
      } else if (/[ăâîșțĂÂÎȘȚ]/.test(data.description)) {
        newErrors.descriptionHasDiacritics = true;
      }

      setDescriptionErrors(newErrors);

      return Object.keys(newErrors).length === 0;
    };

    const clearError = (key: keyof DescriptionErrors) => {
      setDescriptionErrors((prev) => {
        if (!prev[key]) return prev;
        const newErr = { ...prev };
        delete newErr[key];
        return newErr;
      });
    };

    const handleChange = (key: keyof IDescription, value: string) => {
      onChange({ ...data, [key]: value });
    };

    const handleOpenLink = (url: string) => {
      if (url && url.startsWith("http")) {
        window.open(url, "_blank");
      }
    };

    useImperativeHandle(
      ref,
      () => ({
        validate: validateDescription,
        hasDiacriticsError: () =>
          !!descriptionErrors.titleHasDiacritics || !!descriptionErrors.descriptionHasDiacritics,
      }),
      [validateDescription, descriptionErrors],
    );

    return (
      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 3,
          background: isDark ? theme.palette.background.paper : theme.palette.background.default,
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
                  <FormControl required fullWidth>
                    <TextField
                      label="Titlu"
                      value={data.title}
                      onChange={(e) => {
                        clearError("title");
                        clearError("titleHasDiacritics");
                        onChange((prev) => ({ ...prev, title: e.target.value }));
                      }}
                      fullWidth
                      error={
                        descriptionTouched &&
                        (descriptionErrors.title || descriptionErrors.titleHasDiacritics)
                      }
                      helperText={
                        descriptionTouched && descriptionErrors.title
                          ? "Titlul este obligatoriu."
                          : descriptionTouched && descriptionErrors.titleHasDiacritics
                            ? "Titlul nu trebuie sa contina diacritice."
                            : ""
                      }
                      required
                    />
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <FormControl required fullWidth>
                    <TextField
                      label="Descriere"
                      value={data.description}
                      onChange={(e) => {
                        clearError("description");
                        clearError("descriptionTooShort");
                        clearError("descriptionHasDiacritics");
                        onChange((prev) => ({ ...prev, description: e.target.value }));
                      }}
                      fullWidth
                      multiline
                      minRows={6}
                      required
                      error={
                        descriptionTouched &&
                        (descriptionErrors.description ||
                          descriptionErrors.descriptionTooShort ||
                          descriptionErrors.descriptionHasDiacritics)
                      }
                      helperText={
                        descriptionTouched && descriptionErrors.description
                          ? "Descrierea este obligatorie."
                          : descriptionTouched && descriptionErrors.descriptionTooShort
                            ? "Descrierea trebuie sa aiba minim 250 de caractere."
                            : descriptionTouched && descriptionErrors.descriptionHasDiacritics
                              ? "Descrierea nu trebuie sa contina diacritice."
                              : ""
                      }
                    />
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <DatePicker
                    label="Disponibilitate"
                    value={data.disponibility ? new Date(data.disponibility) : null}
                    onChange={(newValue) =>
                      handleChange("disponibility", newValue ? newValue.toISOString() : "")
                    }
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: "outlined",
                        size: "medium",
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField
                    label="Link video YouTube"
                    value={data.videoYoutubeLink}
                    onChange={(e) => handleChange("videoYoutubeLink", e.target.value)}
                    fullWidth
                  />
                  {data.videoYoutubeLink && data.videoYoutubeLink.startsWith("http") && (
                    <Button
                      variant="outlined"
                      startIcon={<PlayCircle />}
                      onClick={() => handleOpenLink(data.videoYoutubeLink as string)}
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
                      onClick={() => handleOpenLink(data.virtualTour as string)}
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
  },
);

export default DescriptionStep;
