import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Snackbar,
  Step,
  StepLabel,
  Stepper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { IProperty } from "@/common/interfaces/property/property.interface";
import CharacteristicsStep, {
  CharacteristicsSteppRef,
} from "@/components/PropertySteps/CharacteristicsStep";
import DescriptionStep, { DescriptionStepRef } from "@/components/PropertySteps/DescriptionStep";
import GeneralDetailsStep, {
  GeneralDetailsStepRef,
} from "@/components/PropertySteps/GeneralDetailsStep";
import ImagesStep from "@/components/PropertySteps/ImagesStep";
import PriceStep, { PriceStepRef } from "@/components/PropertySteps/PriceStep";
import UtilityStep from "@/components/PropertySteps/UtilityStep";

import { PropertiesApi } from "@/features/properties/propertiesApi";
import { propertiesKeys, usePropertyQuery } from "@/features/properties/propertiesQueries";
import { http } from "@/services/http";
import { queryClient } from "@/services/queryClient";

const steps = ["Detalii generale", "Caracteristici", "Utilitati", "Pret", "Descriere", "Imagini"];

const EditProperty = () => {
  const { id } = useParams<{ id: string }>();
  const theme = useTheme();
  const accent = theme.palette.primary.main;
  const isDark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

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

  const [generalDetailsTouched, setGeneralDetailsTouched] = useState(false);
  const [characteristicsTouched, setCharacteristicsTouched] = useState(false);
  const [priceTouched, setPriceTouched] = useState(false);
  const [descriptionTouched, setDescriptionTouched] = useState(false);

  const generalDetailsStepRef = useRef<GeneralDetailsStepRef>(null);
  const characteristicsStepRef = useRef<CharacteristicsSteppRef>(null);
  const priceStepRef = useRef<PriceStepRef>(null);
  const descriptionStepRef = useRef<DescriptionStepRef>(null);

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleNext = () => {
    if (!formData) return;

    if (activeStep === 0) {
      setGeneralDetailsTouched(true);
      const isValid = generalDetailsStepRef.current?.validate();
      if (!isValid) {
        showSnackbar("Completeaza toate campurile obligatorii.", "error");
        return;
      }
    }

    if (activeStep === 1) {
      setCharacteristicsTouched(true);
      const isValid = characteristicsStepRef.current?.validate();
      if (!isValid) {
        showSnackbar("Completeaza toate campurile obligatorii.", "error");
        return;
      }
    }

    if (activeStep === 3) {
      setPriceTouched(true);
      const isValid = priceStepRef.current?.validate();
      if (!isValid) {
        showSnackbar("Completeaza toate campurile obligatorii.", "error");
        return;
      }
    }

    if (activeStep === 4) {
      setDescriptionTouched(true);
      const isValid = descriptionStepRef.current?.validate();
      if (!isValid) {
        showSnackbar("Completeaza toate campurile obligatorii.", "error");
        return;
      }
    }

    setActiveStep((p) => p + 1);
  };

  const handleBack = () => {
    setActiveStep((p) => p - 1);
  };

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

      showSnackbar("Proprietatea a fost actualizata cu succes!", "success");

      setTimeout(() => navigate(`/properties`), 1500);
      setContractFile(null);
    } catch (error: any) {
      console.error(error);
      showSnackbar("A aparut o eroare la actualizarea proprietatii.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    if (!formData) return null;

    switch (activeStep) {
      case 0:
        return (
          <GeneralDetailsStep
            ref={generalDetailsStepRef}
            data={formData.generalDetails}
            generalDetailsTouched={generalDetailsTouched}
            onChange={(updated) =>
              setFormData((prev) =>
                prev
                  ? {
                      ...prev,
                      generalDetails:
                        typeof updated === "function" ? updated(prev.generalDetails) : updated,
                    }
                  : null,
              )
            }
          />
        );
      case 1:
        return (
          <CharacteristicsStep
            ref={characteristicsStepRef}
            data={formData.characteristics}
            characteristicsStepTouched={characteristicsTouched}
            onChange={(updated) =>
              setFormData((prev) =>
                prev
                  ? {
                      ...prev,
                      characteristics:
                        typeof updated === "function" ? updated(prev.characteristics) : updated,
                    }
                  : null,
              )
            }
          />
        );
      case 2:
        return (
          <UtilityStep
            data={formData.utilities}
            onChange={(val) => setFormData((prev) => (prev ? { ...prev, utilities: val } : null))}
          />
        );
      case 3:
        return (
          <PriceStep
            ref={priceStepRef}
            priceTouched={priceTouched}
            usableArea={Number(formData.characteristics.areas.usableArea)}
            data={formData.price}
            onChange={(updated) => {
              const result = typeof updated === "function" ? updated(formData.price) : updated;

              if (result.contact.contractFile instanceof File) {
                setContractFile(result.contact.contractFile);
              }

              setFormData((prev) => (prev ? { ...prev, price: result } : null));
            }}
          />
        );
      case 4:
        return (
          <DescriptionStep
            ref={descriptionStepRef}
            descriptionTouched={descriptionTouched}
            data={formData.description}
            onChange={(updated) =>
              setFormData((prev) =>
                prev
                  ? {
                      ...prev,
                      description:
                        typeof updated === "function" ? updated(prev.description) : updated,
                    }
                  : null,
              )
            }
          />
        );
      case 5:
        return (
          <ImagesStep
            data={formData.images as string[]}
            files={imageFiles}
            onChange={(val) => setFormData((prev) => (prev ? { ...prev, images: val } : null))}
            onFilesChange={setImageFiles}
          />
        );
      default:
        return null;
    }
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

        setFormData(fetchedProperty ?? null);
      } catch (err) {
        console.error("Eroare la incarcarea proprietatii:", err);
        showSnackbar("Eroare la incarcarea proprietatii.", "error");
        navigate("/properties");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [id, propertyFromQuery, navigate]);

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
          Proprietatea nu a fost gasita.
        </Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate("/properties")}>
          Inapoi la lista
        </Button>
      </Box>
    );

  // 🔥 Layout IDENTIC cu AddProperty
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
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                  onClick={() => setActiveStep(index)}
                  sx={{
                    cursor: "pointer",
                    "& .MuiStepLabel-label": {
                      "&:hover": { color: accent },
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Content scroll EXACT ca in AddProperty */}
          <Box sx={{ mt: 2, flex: 1, overflowY: "auto" }}>{renderStep()}</Box>

          {/* Footer cu butoane fixe in Paper */}
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
              onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
              disabled={isSubmitting}
              size="large"
              sx={{
                fontWeight: 600,
                bgcolor: theme.palette.primary.main,
                color: theme.palette.getContrastText(theme.palette.primary.main),
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
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditProperty;
