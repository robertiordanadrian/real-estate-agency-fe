import {
  Box,
  Button,
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
import { useNavigate } from "react-router-dom";
import { ECategory, EStatus } from "@/common/enums/property/general-details.enums";
import type { ICharacteristics } from "@/common/interfaces/property/characteristics.interface";
import type { IDescription } from "@/common/interfaces/property/description.interface";
import type { IGeneralDetails } from "@/common/interfaces/property/general-details.interface";
import type { IPrice } from "@/common/interfaces/property/price.interface";
import type { IProperty } from "@/common/interfaces/property/property.interface";
import type { IUtilities } from "@/common/interfaces/property/utilities.interface";
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
import {
  propertiesKeys,
  useCreateProperty,
  useUploadPropertyContract,
  useUploadPropertyImages,
} from "@/features/properties/propertiesQueries";
import { queryClient } from "@/services/queryClient";
import { useAppSelector } from "@/app/hook";
import { selectUser } from "@/features/auth/authSelectors";
import { useToast } from "@/context/ToastContext";
import { AxiosError } from "axios";

const steps = ["Detalii generale", "Caracteristici", "Utilitati", "Pret", "Descriere", "Imagini"];

const defaultGeneralDetails: IGeneralDetails = {
  agentId: "",
  status: EStatus.GREEN,
  transactionType: null,
  category: null,
  ownerID: "",
  cadastralNumber: "",
  location: {
    city: "",
    zone: "",
    street: "",
    number: "",
    building: "",
    stairwell: "",
    apartment: "",
    surroundings: [],
    latitude: null,
    longitude: null,
  },
};

const defaultCharacteristics: ICharacteristics = {
  details: {
    rooms: "",
    bedrooms: "",
    kitchens: "",
    bathrooms: "",
    balconies: "",
    terraces: "",
    floor: "",
    yearOfConstruction: "",
    yearOfRenovation: "",
    parkingLots: "",
    garages: "",
    bathroomWindow: false,
    openKitchen: false,
    petFriendly: false,
    keyInAgency: false,
  },
  areas: {
    usableArea: "",
    builtupArea: "",
    totalUsableArea: "",
    balconyArea: "",
    terraceArea: "",
    gardenArea: "",
  },
  building: {
    constructionStage: null,
    structure: null,
    seismicRisk: null,
    basement: false,
    demiBasement: false,
    groundFloor: false,
    floors: null,
    attic: false,
    pod: false,
  },
  energyPerformance: {
    energyClass: null,
    specificAnnualConsumption: "",
    co2EquivalentEmissionIndex: "",
    specificConsumptionFromRenewableSources: "",
  },
};

const defaultUtilities: IUtilities = {
  amenities_general: [],
  amenities_heating: [],
  amenities_conditioning: [],
  amenities_internet: [],
  amenities_double_pane_windows: [],
  amenities_interior_condition: [],
  amenities_interior_doors: [],
  amenities_entrance_door: [],
  amenities_shutters: [],
  amenities_blind: [],
  amenities_thermal_insulation: [],
  amenities_flooring: [],
  amenities_walls: [],
  amenities_utility_spaces: [],
  amenities_kitchen: [],
  amenities_furnished: [],
  amenities_appliances: [],
  amenities_meters: [],
  amenities_miscellaneous: [],
  amenities_real_estate_facilities: [],
  amenities_real_estate_services: [],
  amenities_hotel_services: [],
  amenities_street_development: [],
  amenities_features: [],
  amenities_access: [],
  amenities_other_characteristics: [],
};

const defaultPrice: IPrice = {
  priceDetails: {
    price: "",
    tva: false,
    pricePerMp: "",
    garagePrice: "",
    parkingPrice: "",
  },
  commissions: {
    buyerCommission: "",
    buyerCommissionValue: "",
    ownerCommission: "",
    ownerCommissionValue: "",
  },
  contact: {
    type: null,
    signedContract: null,
    contractNumber: "",
    signDate: null,
    expirationDate: null,
    contractFile: null,
  },
};

const defaultDescription: IDescription = {
  title: "",
  description: "",
  disponibility: "",
  videoYoutubeLink: "",
  virtualTour: "",
};

const AddProperty = () => {
  const theme = useTheme();
  const accent = theme.palette.primary.main;
  const isDark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();
  const toast = useToast();

  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [generalDetailsTouched, setGeneralDetailsTouched] = useState(false);
  const generalDetailsStepRef = useRef<GeneralDetailsStepRef>(null);

  const [characteristicsTouched, setCharacteristicsTouched] = useState(false);
  const characteristicsStepRef = useRef<CharacteristicsSteppRef>(null);

  const [priceTouched, setPriceTouched] = useState(false);
  const priceStepRef = useRef<PriceStepRef>(null);

  const [descriptionTouched, setDescriptionTouched] = useState(false);
  const descriptionStepRef = useRef<DescriptionStepRef>(null);

  const [formData, setFormData] = useState<IProperty>({
    generalDetails: defaultGeneralDetails,
    characteristics: defaultCharacteristics,
    utilities: defaultUtilities,
    price: defaultPrice,
    description: defaultDescription,
    images: [],
    modificationLogs: [],
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [contractFile, setContractFile] = useState<File | null>(null);

  const createProperty = useCreateProperty();
  const uploadImages = useUploadPropertyImages();
  const uploadContract = useUploadPropertyContract();

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const finalStatus = imageFiles.length === 0 ? EStatus.WHITE : formData.generalDetails.status;

      const payload = {
        ...formData,
        generalDetails: {
          ...formData.generalDetails,
          status: finalStatus,
        },
        images: [],
      };

      const newProperty = await createProperty.mutateAsync(payload);
      const propertyId = newProperty._id;

      if (!propertyId) throw new Error("Lipsește _id-ul proprietății.");
      if (imageFiles.length) {
        await uploadImages.mutateAsync({ id: propertyId, files: imageFiles });
      }

      if (contractFile) {
        await uploadContract.mutateAsync({ id: propertyId, file: contractFile });
      }

      toast("Proprietatea a fost creată cu succes!", "success");

      setTimeout(() => navigate("/properties"), 1500);
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      toast(axiosErr.response?.data?.message || "A apărut o eroare.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (activeStep === 0) {
      setGeneralDetailsTouched(true);
      const isValid = generalDetailsStepRef.current?.validate();
      if (!isValid) {
        toast("Completeaza toate campurile obligatorii.", "error");
        return;
      }
    }
    if (activeStep === 1) {
      setCharacteristicsTouched(true);
      const isValid = characteristicsStepRef.current?.validate();
      if (!isValid) {
        toast("Completeaza toate campurile obligatorii.", "error");
        return;
      }
    }
    if (activeStep === 3) {
      setPriceTouched(true);
      const isValid = priceStepRef.current?.validate();
      if (!isValid) {
        toast("Completeaza toate campurile obligatorii.", "error");
        return;
      }
    }
    if (activeStep === 4) {
      setDescriptionTouched(true);
      const isValid = descriptionStepRef.current?.validate();
      if (!isValid) {
        if (descriptionStepRef.current?.hasDiacriticsError?.()) {
          toast("Titlul și descrierea nu trebuie să conțină diacritice.", "error");
        } else {
          toast("Completeaza toate campurile obligatorii.", "error");
        }
        return;
      }
    }
    setActiveStep((p) => p + 1);
  };
  const handleBack = () => {
    setActiveStep((p) => p - 1);
  };
  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <GeneralDetailsStep
            isEdit={false}
            ref={generalDetailsStepRef}
            data={formData.generalDetails}
            onChange={(updater) =>
              setFormData((prev) => ({
                ...prev,
                generalDetails:
                  typeof updater === "function" ? updater(prev.generalDetails) : updater,
              }))
            }
            generalDetailsTouched={generalDetailsTouched}
          />
        );
      case 1:
        return (
          <CharacteristicsStep
            category={formData.generalDetails.category as ECategory}
            ref={characteristicsStepRef}
            data={formData.characteristics}
            onChange={(updater) =>
              setFormData((prev) => ({
                ...prev,
                characteristics:
                  typeof updater === "function" ? updater(prev.characteristics) : updater,
              }))
            }
            characteristicsStepTouched={characteristicsTouched}
          />
        );
      case 2:
        return (
          <UtilityStep
            data={formData.utilities}
            onChange={(val) => setFormData((prev) => ({ ...prev, utilities: val }))}
          />
        );
      case 3:
        return (
          <PriceStep
            usableArea={Number(formData.characteristics.areas.usableArea)}
            data={formData.price}
            onChange={(updated) => {
              setFormData((prev) => ({
                ...prev,
                price: typeof updated === "function" ? updated(prev.price) : updated,
              }));
            }}
            priceTouched={priceTouched}
            ref={priceStepRef}
            setContractFile={setContractFile}
          />
        );
      case 4:
        return (
          <DescriptionStep
            ref={descriptionStepRef}
            data={formData.description}
            onChange={(updater) =>
              setFormData((prev) => ({
                ...prev,
                description: typeof updater === "function" ? updater(prev.description) : updater,
              }))
            }
            descriptionTouched={descriptionTouched}
          />
        );
      case 5:
        return (
          <ImagesStep
            data={formData.images as string[]}
            files={imageFiles}
            onChange={(val) => setFormData((prev) => ({ ...prev, images: val }))}
            onFilesChange={setImageFiles}
          />
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        generalDetails: {
          ...prev.generalDetails,
          agentId: user._id,
        },
      }));
    }
  }, [user]);

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
            Adauga proprietate
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
                color: theme.palette.primary.main,
                borderColor: theme.palette.primary.main,
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
              onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
              disabled={isSubmitting}
              fullWidth={isMobile}
              size="large"
              sx={{
                fontWeight: 600,
                bgcolor: theme.palette.primary.main,
                color: theme.palette.getContrastText(theme.palette.primary.main),
                "&:hover": { bgcolor: theme.palette.primary.dark },
              }}
            >
              {isSubmitting
                ? "Se trimite..."
                : activeStep === steps.length - 1
                  ? "Trimite"
                  : "Urmatorul pas"}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AddProperty;
