// app/pages/Properties/EditProperty.tsx
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
import { GeneralDetailsStep } from "../../components/Properties/AddPropertySteps/GeneralDetailsStep";
import { CharacteristicsStep } from "../../components/Properties/AddPropertySteps/CharacteristicsStep";
import { UtilityStep } from "../../components/Properties/AddPropertySteps/UtilityStep";
import { PriceStep } from "../../components/Properties/AddPropertySteps/PriceStep";
import { DescriptionStep } from "../../components/Properties/AddPropertySteps/DescriptionStep";
import { ImagesStep } from "../../components/Properties/AddPropertySteps/ImagesStep";
import { useProperties } from "../../context/PropertyContext";
import type { IProperty } from "../../common/interfaces/property.interface";
import axiosClient from "../../api/axiosClient";

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
  const { properties, fetchProperties } = useProperties(); // Use fetchProperties instead of refreshProperties
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

  // Fetch property data when component mounts
  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        // Try to find property in context first
        const existingProperty = properties.find((p) => p._id === id);

        if (existingProperty) {
          setFormData(existingProperty);
        } else {
          // If not found in context, fetch from API
          const response = await axiosClient.get(`/properties/${id}`);
          setFormData(response.data);
        }
      } catch (error) {
        console.error("Error fetching property:", error);
        showSnackbar("Eroare la incarcarea proprietatii", "error");
        navigate("/properties");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [id, properties, navigate]);

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async () => {
    if (!formData || !id) return;

    setIsSubmitting(true);

    try {
      // Update property data
      const propertyPayload = {
        ...formData,
        // Don't send images in the main update - handle them separately
        images: undefined,
      };

      await axiosClient.put(`/properties/${id}`, {
        data: JSON.stringify(propertyPayload),
      });

      // Handle image uploads if there are new files
      if (imageFiles && imageFiles.length > 0) {
        const formDataToSend = new FormData();
        imageFiles.forEach((file) => {
          formDataToSend.append("images", file);
        });

        await axiosClient.post(`/properties/${id}/images`, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      // Refresh properties in context using fetchProperties
      await fetchProperties();

      showSnackbar("Proprietate actualizată cu succes!", "success");

      setTimeout(() => {
        navigate(`/properties/${id}`);
      }, 2000);
    } catch (error: any) {
      let errorMessage = "A apărut o eroare. Te rugăm să încerci din nou.";

      if (error.response) {
        if (error.response.status === 413) {
          errorMessage =
            "Fișierul este prea mare. Te rugăm să reduci dimensiunea imaginilor.";
        } else if (error.response.status === 415) {
          errorMessage =
            "Tip de fișier neacceptat. Te rugăm să încarci doar imagini (JPEG, PNG, WebP).";
        } else if (error.response.status === 400) {
          errorMessage = "Date invalide. Te rugăm să verifici toate câmpurile.";
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        errorMessage =
          "Eroare de rețea. Te rugăm să verifici conexiunea la internet.";
      }

      showSnackbar(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

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
            onFilesChange={(files) => setImageFiles(files)}
          />
        );
      default:
        return null;
    }
  };

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
        <Typography variant="h4" color="error">
          Proprietatea nu a putut fi găsită
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
  }

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Typography variant="h4" mb={3}>
        Editeaza proprietatea
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
            {isSubmitting ? "Se actualizează..." : "Actualizează proprietate"}
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
