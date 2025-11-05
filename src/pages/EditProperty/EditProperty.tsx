import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Step,
  StepLabel,
  Stepper,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  Paper,
  Divider,
  Container,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import { GeneralDetailsStep } from "../../components/PropertySteps/GeneralDetailsStep";
import { CharacteristicsStep } from "../../components/PropertySteps/CharacteristicsStep";
import { UtilityStep } from "../../components/PropertySteps/UtilityStep";
import { PriceStep } from "../../components/PropertySteps/PriceStep";
import { DescriptionStep } from "../../components/PropertySteps/DescriptionStep";
import { ImagesStep } from "../../components/PropertySteps/ImagesStep";

import type { IProperty } from "../../common/interfaces/property.interface";

import {
  propertiesKeys,
  usePropertyQuery,
} from "../../features/properties/propertiesQueries";
import { PropertiesApi } from "../../features/properties/propertiesApi";
import { http } from "../../services/http";
import { queryClient } from "../../services/queryClient";

const steps = [
  "Detalii generale",
  "Caracteristici",
  "Utilități",
  "Preț",
  "Descriere",
  "Imagini",
];

export const EditProperty: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDark = theme.palette.mode === "dark";
  const accent = theme.palette.primary.main;

  const { data: propertyFromQuery } = usePropertyQuery(id ?? "");

  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<IProperty | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [contractFile, setContractFile] = useState<File | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const showSnackbar = (message: string, severity: "success" | "error") =>
    setSnackbar({ open: true, message, severity });
  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  const parseToDate = (value: unknown): Date | null => {
    if (!value) return null;
    const date = new Date(value as string);
    return isNaN(date.getTime()) ? null : date;
  };

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      setIsLoading(true);

      try {
        let fetchedProperty = propertyFromQuery;

        if (!fetchedProperty) {
          const res = await http.get(`/properties/${id}`);
          fetchedProperty = res.data;
        }

        if (fetchedProperty?.price?.contact) {
          fetchedProperty.price.contact.signDate = parseToDate(
            fetchedProperty.price.contact.signDate
          );
          fetchedProperty.price.contact.expirationDate = parseToDate(
            fetchedProperty.price.contact.expirationDate
          );
        }

        setFormData(fetchedProperty ?? null);
      } catch (err) {
        console.error("Error fetching property:", err);
        showSnackbar("Eroare la incarcarea proprietatii.", "error");
        navigate("/properties");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [id, propertyFromQuery, navigate]);

  const handleSubmit = async () => {
    if (!formData || !id) return;
    setIsSubmitting(true);

    try {
      const { images, ...propertyPayload } = formData;

      await http.put(`/properties/${id}`, propertyPayload);

      if (imageFiles.length > 0) {
        await PropertiesApi.uploadImages(id, imageFiles);
      }

      if (contractFile) {
        await PropertiesApi.uploadContract(id, contractFile);
      }

      await queryClient.invalidateQueries({ queryKey: propertiesKeys.all });

      showSnackbar("Proprietate actualizată cu succes!", "success");

      setTimeout(() => navigate(`/properties`), 1500);
      setContractFile(null);
    } catch (error: any) {
      let errorMessage = "A aparut o eroare. Te rugam sa incerci din nou.";

      if (error.response) {
        const status = error.response.status;
        if (status === 413)
          errorMessage =
            "Fisierele sunt prea mari. Redu dimensiunea imaginilor.";
        else if (status === 415)
          errorMessage = "Tip de fisier neacceptat. Incearca doar imagini.";
        else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else if (status === 400) {
          errorMessage = "Date invalide. Verifica toate campurile.";
        }
      } else if (error.request) {
        errorMessage = "Eroare de retea. Verifica conexiunea la internet.";
      }

      showSnackbar(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => setActiveStep((p) => p + 1);
  const handleBack = () => setActiveStep((p) => p - 1);

  const renderStep = () => {
    if (!formData) return null;

    switch (activeStep) {
      case 0:
        return (
          <GeneralDetailsStep
            data={formData.generalDetails}
            onChange={(val) =>
              setFormData((prev) =>
                prev ? { ...prev, generalDetails: val } : null
              )
            }
          />
        );
      case 1:
        return (
          <CharacteristicsStep
            data={formData.characteristics}
            onChange={(val) =>
              setFormData((prev) =>
                prev ? { ...prev, characteristics: val } : null
              )
            }
          />
        );
      case 2:
        return (
          <UtilityStep
            data={formData.utilities}
            onChange={(val) =>
              setFormData((prev) => (prev ? { ...prev, utilities: val } : null))
            }
          />
        );
      case 3:
        return (
          <PriceStep
            data={formData.price}
            onChange={(val) => {
              if (val.contact.contractFile instanceof File) {
                setContractFile(val.contact.contractFile);
                val.contact.contractFile = "";
              }
              setFormData((prev) => (prev ? { ...prev, price: val } : null));
            }}
          />
        );
      case 4:
        return (
          <DescriptionStep
            data={formData.description}
            onChange={(val) =>
              setFormData((prev) =>
                prev ? { ...prev, description: val } : null
              )
            }
          />
        );
      case 5:
        return (
          <ImagesStep
            data={formData.images || []}
            files={imageFiles}
            onChange={(val) =>
              setFormData((prev) => (prev ? { ...prev, images: val } : null))
            }
            onFilesChange={setImageFiles}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading)
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "50vh",
          color: theme.palette.text.secondary,
        }}
      >
        <CircularProgress color="primary" />
        <Typography sx={{ ml: 2 }}>Se incarca proprietatea...</Typography>
      </Box>
    );

  if (!formData)
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" color="error">
          Proprietatea nu a putut fi gasita.
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate("/properties")}
        >
          Inapoi la lista
        </Button>
      </Box>
    );

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        boxSizing: "border-box",
      }}
    >
      <Container
        maxWidth="xl"
        disableGutters
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          flex: 1,
          boxSizing: "border-box",
          minHeight: 0,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            flex: 1,
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
            color: theme.palette.text.primary,
            boxShadow: isDark ? `0 0 25px ${accent}22` : `0 0 15px ${accent}11`,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            variant={isMobile ? "h6" : "h5"}
            mb={2}
            fontWeight={600}
            textAlign={{ xs: "center", sm: "left" }}
          >
            Editeaza proprietatea
          </Typography>

          <Divider sx={{ mb: 3, borderColor: theme.palette.divider }} />

          <Stepper
            activeStep={activeStep}
            alternativeLabel={!isMobile}
            orientation={isMobile ? "vertical" : "horizontal"}
            sx={{ mb: 3 }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ mt: 2, flex: 1, overflowY: "auto" }}>{renderStep()}</Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column-reverse", sm: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              mt: 3,
              pt: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
              fullWidth={isMobile}
              sx={{
                color: accent,
                borderColor: accent,
                "&:hover": {
                  borderColor: theme.palette.primary.dark,
                  background: `${accent}11`,
                },
              }}
            >
              Inapoi
            </Button>

            <Button
              variant="contained"
              fullWidth={isMobile}
              onClick={
                activeStep === steps.length - 1 ? handleSubmit : handleNext
              }
              disabled={isSubmitting}
              size="large"
              sx={{
                fontWeight: 600,
                bgcolor: theme.palette.primary.main,
                color: theme.palette.getContrastText(
                  theme.palette.primary.main
                ),
                "&:hover": { bgcolor: theme.palette.primary.dark },
              }}
            >
              {isSubmitting
                ? "Se actualizează..."
                : activeStep === steps.length - 1
                ? "Actualizează proprietatea"
                : "Următorul pas"}
            </Button>
          </Box>
        </Paper>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
