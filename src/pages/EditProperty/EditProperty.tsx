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
} from "@mui/material";
import { GeneralDetailsStep } from "../../components/PropertySteps/GeneralDetailsStep";
import { CharacteristicsStep } from "../../components/PropertySteps/CharacteristicsStep";
import { UtilityStep } from "../../components/PropertySteps/UtilityStep";
import { PriceStep } from "../../components/PropertySteps/PriceStep";
import { DescriptionStep } from "../../components/PropertySteps/DescriptionStep";
import { ImagesStep } from "../../components/PropertySteps/ImagesStep";
import type { IProperty } from "../../common/interfaces/property.interface";

import {
  usePropertiesQuery,
  usePropertyQuery,
} from "../../features/properties/propertiesQueries";
import { PropertiesApi } from "../../features/properties/propertiesApi";
import { http } from "../../services/http";

const steps = [
  "Detalii generale",
  "Caracteristici",
  "Utilitati",
  "Pret",
  "Descriere",
  "Imagini",
];

export const EditProperty: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: propertyFromQuery } = usePropertyQuery(id ?? "");
  const { refetch } = usePropertiesQuery(); // pentru invalidare la final

  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<IProperty | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => setSnackbar((s) => ({ ...s, open: false }));

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
          const res = await http.get(`/${id}`);
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
        showSnackbar("Eroare la incarcarea proprietatilor", "error");
        navigate("");
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

      await refetch();
      showSnackbar("Proprietate actualizată cu succes!", "success");

      setTimeout(() => navigate(`/${id}`), 2000);
    } catch (error: any) {
      let errorMessage = "A apărut o eroare. Te rugăm să încerci din nou.";

      if (error.response) {
        const status = error.response.status;
        if (status === 413)
          errorMessage =
            "Fișierele sunt prea mari. Redu dimensiunea imaginilor.";
        else if (status === 415)
          errorMessage =
            "Tip de fișier neacceptat. Doar imagini (JPEG, PNG, WebP).";
        else if (status === 400)
          errorMessage = "Date invalide. Verifică toate câmpurile.";
        else if (error.response.data?.message)
          errorMessage = error.response.data.message;
      } else if (error.request) {
        errorMessage = "Eroare de rețea. Verifică conexiunea la internet.";
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
            onChange={(val) =>
              setFormData((prev) => (prev ? { ...prev, price: val } : null))
            }
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

  // 🔹 Loading & errors
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Se încarcă proprietatea...</Typography>
      </Box>
    );
  }

  if (!formData) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" color="error">
          Proprietatea nu a putut fi găsită.
        </Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate("")}>
          Înapoi la listă
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Typography variant="h4" mb={3}>
        Editează proprietatea
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 4 }}>{renderStep()}</Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          variant="outlined"
        >
          Înapoi
        </Button>
        {activeStep === steps.length - 1 ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
            size="large"
          >
            {isSubmitting ? "Se actualizează..." : "Actualizează proprietatea"}
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handleNext}>
            Următorul pas
          </Button>
        )}
      </Box>

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
