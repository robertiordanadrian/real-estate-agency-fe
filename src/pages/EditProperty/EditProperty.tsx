import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { IProperty } from "@/common/interfaces/property/property.interface";
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

import {
  usePropertyQuery,
  useUpdateProperty,
  useUploadPropertyImages,
  useUploadPropertyContract,
  useDeletePropertyImages,
  useUpdateImagesOrder,
} from "@/features/properties/propertiesQueries";

import type { AxiosError } from "axios";
import { useToast } from "@/context/ToastContext";
import { normalizeStatus } from "@/common/utils/normalize-status.util";
import { ECategory, EStatus } from "@/common/enums/property/general-details.enums";

const steps = ["Detalii generale", "Caracteristici", "Utilitati", "Pret", "Descriere", "Imagini"];

const EditProperty = () => {
  const { id } = useParams<{ id: string }>();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const toast = useToast();

  const { data: property, isLoading, error: propertyError } = usePropertyQuery(id ?? "");

  const updateProperty = useUpdateProperty();
  const uploadImages = useUploadPropertyImages();
  const uploadContract = useUploadPropertyContract();
  const deleteImages = useDeletePropertyImages();
  const updateImagesOrder = useUpdateImagesOrder();

  const [formData, setFormData] = useState<IProperty | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [contractFile, setContractFile] = useState<File | null>(null);

  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [removedImages, setRemovedImages] = useState<string[]>([]);

  const [generalDetailsTouched, setGeneralDetailsTouched] = useState(false);
  const [characteristicsTouched, setCharacteristicsTouched] = useState(false);
  const [priceTouched, setPriceTouched] = useState(false);
  const [descriptionTouched, setDescriptionTouched] = useState(false);

  const generalDetailsRef = useRef<GeneralDetailsStepRef>(null);
  const characteristicsRef = useRef<CharacteristicsSteppRef>(null);
  const priceRef = useRef<PriceStepRef>(null);
  const descriptionRef = useRef<DescriptionStepRef>(null);

  useEffect(() => {
    if (propertyError) {
      const axiosErr = propertyError as AxiosError<{ message?: string }>;
      toast(axiosErr.response?.data?.message || "Eroare incarcare proprietate", "error");
      navigate("/properties");
    }
  }, [propertyError, toast, navigate]);

  useEffect(() => {
    if (property) {
      setFormData(property);
    }
  }, [property]);

  const statusKeyToValue = (key: EStatus | null) => {
    if (!key) return null;

    const entry = Object.entries(EStatus).find(([k]) => k === key);
    return entry ? entry[1] : null;
  };

  const handleNext = () => {
    if (!formData) return;

    if (activeStep === 0) {
      setGeneralDetailsTouched(true);
      if (!generalDetailsRef.current?.validate()) {
        toast("Completeaza campurile obligatorii", "error");
        return;
      }
    }

    if (activeStep === 1) {
      setCharacteristicsTouched(true);
      if (!characteristicsRef.current?.validate()) {
        toast("Completeaza campurile obligatorii", "error");
        return;
      }
    }

    if (activeStep === 3) {
      setPriceTouched(true);
      if (!priceRef.current?.validate()) {
        toast("Completeaza campurile obligatorii", "error");
        return;
      }
    }

    if (activeStep === 4) {
      setDescriptionTouched(true);
      if (!descriptionRef.current?.validate()) {
        if (descriptionRef.current?.hasDiacriticsError?.()) {
          toast("Titlul și descrierea nu trebuie să conțină diacritice.", "error");
        } else {
          toast("Completeaza campurile obligatorii", "error");
        }
        return;
      }
    }

    setActiveStep((s) => s + 1);
  };

  const handleBack = () => setActiveStep((s) => s - 1);

  const handleSubmit = async () => {
    if (!id || !formData) return;

    try {
      setIsSubmitting(true);

      const finalStatus =
        formData.images.length === 0 && imageFiles.length === 0
          ? EStatus.WHITE
          : formData.generalDetails.status;

      await updateProperty.mutateAsync({
        id,
        data: {
          ...formData,
          generalDetails: {
            ...formData.generalDetails,
            status: finalStatus,
          },
        },
      });

      if (contractFile) {
        await uploadContract.mutateAsync({
          id,
          file: contractFile,
        });
      }

      let updatedImagesArray = [...formData.images];

      if (updatedImagesArray.every((img) => img.startsWith("blob:"))) {
        updatedImagesArray = [];
      }

      if (imageFiles.length > 0) {
        const res = await uploadImages.mutateAsync({ id, files: imageFiles });

        updatedImagesArray = res.images;
      }

      if (removedImages.length > 0) {
        const res = await deleteImages.mutateAsync({ id, urls: removedImages });

        updatedImagesArray = res.images;
      }

      await updateImagesOrder.mutateAsync({
        id,
        images: updatedImagesArray,
      });

      toast("Proprietatea a fost actualizata", "success");
      setTimeout(() => navigate("/properties"), 800);
    } catch (err: any) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      const msg = axiosErr.response?.data?.message || "Eroare la actualizarea proprietatii";

      toast(msg, "error");

      if (msg.includes("necesară aprobare")) {
        setTimeout(() => navigate("/properties"), 1200);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveExistingImage = (url: string) => {
    setRemovedImages((prev) => [...prev, url]);
  };

  const renderStep = () => {
    if (!formData) return null;

    switch (activeStep) {
      case 0:
        return (
          <GeneralDetailsStep
            isEdit={true}
            ref={generalDetailsRef}
            generalDetailsTouched={generalDetailsTouched}
            data={formData.generalDetails}
            onChange={(val) =>
              setFormData((p) =>
                p
                  ? {
                      ...p,
                      generalDetails: typeof val === "function" ? val(p.generalDetails) : val,
                    }
                  : null,
              )
            }
          />
        );

      case 1:
        return (
          <CharacteristicsStep
            category={formData.generalDetails.category as ECategory}
            ref={characteristicsRef}
            characteristicsStepTouched={characteristicsTouched}
            data={formData.characteristics}
            onChange={(val) =>
              setFormData((p) =>
                p
                  ? {
                      ...p,
                      characteristics: typeof val === "function" ? val(p.characteristics) : val,
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
            onChange={(val) => setFormData((p) => (p ? { ...p, utilities: val } : null))}
          />
        );

      case 3:
        return (
          <PriceStep
            ref={priceRef}
            priceTouched={priceTouched}
            usableArea={Number(formData.characteristics.areas.usableArea)}
            data={formData.price}
            setContractFile={setContractFile}
            onChange={(val) => {
              const newData = typeof val === "function" ? val(formData.price) : val;
              if (newData.contact.contractFile instanceof File) {
                setContractFile(newData.contact.contractFile);
              }
              setFormData((p) => (p ? { ...p, price: newData } : null));
            }}
          />
        );

      case 4:
        return (
          <DescriptionStep
            ref={descriptionRef}
            descriptionTouched={descriptionTouched}
            data={formData.description}
            onChange={(val) =>
              setFormData((p) =>
                p
                  ? { ...p, description: typeof val === "function" ? val(p.description) : val }
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
            onChange={(val) => setFormData((p) => (p ? { ...p, images: val } : null))}
            onFilesChange={setImageFiles}
            onRemoveExistingImage={handleRemoveExistingImage}
          />
        );

      default:
        return null;
    }
  };

  // ===================================================================
  //  LOADING STATE
  // ===================================================================
  if (isLoading || !formData)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
        <CircularProgress />
      </Box>
    );

  // ===================================================================
  //  UI FINAL
  // ===================================================================
  return (
    <Box sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "center" }}>
      <Container
        maxWidth="xl"
        disableGutters
        sx={{ flex: 1, display: "flex", flexDirection: "column" }}
      >
        <Paper
          elevation={3}
          sx={{
            flex: 1,
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 3,
            background: isDark
              ? `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`
              : `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
          }}
        >
          <Typography variant="h5" fontWeight={600} mb={2}>
            Editare proprietate
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Stepper
            activeStep={activeStep}
            alternativeLabel={!isMobile}
            orientation={isMobile ? "vertical" : "horizontal"}
            sx={{ mb: 3 }}
          >
            {steps.map((label, index) => (
              <Step key={index}>
                <StepLabel sx={{ cursor: "pointer" }} onClick={() => setActiveStep(index)}>
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ flex: 1, overflowY: "auto" }}>{renderStep()}</Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column-reverse", sm: "row" },
              justifyContent: "space-between",
              mt: 3,
            }}
          >
            <Button variant="outlined" disabled={activeStep === 0} onClick={handleBack}>
              Inapoi
            </Button>

            <Button
              variant="contained"
              disabled={isSubmitting}
              onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
            >
              {isSubmitting
                ? "Se actualizeaza..."
                : activeStep === steps.length - 1
                  ? "Actualizeaza"
                  : "Urmatorul pas"}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default EditProperty;
