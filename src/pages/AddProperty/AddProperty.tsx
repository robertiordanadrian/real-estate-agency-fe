import React, { useState } from "react";
import {
  Box,
  Button,
  Step,
  StepLabel,
  Stepper,
  Typography,
  Snackbar,
  Alert,
  Container,
  Paper,
  Divider,
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
import type { IGeneralDetails } from "../../common/interfaces/general-details.interface";
import type { ICharacteristics } from "../../common/interfaces/characteristics.interface";
import type { IUtilities } from "../../common/interfaces/utilities.interface";
import type { IPrice } from "../../common/interfaces/price.interface";
import type { IDescription } from "../../common/interfaces/description.interface";

import {
  ECategory,
  EStatus,
  EType,
} from "../../common/enums/general-details.enums";
import {
  EBuildingSeismicRisk,
  EBuildingStructure,
  EBuildingType,
  EComfort,
  ECompartmentalization,
  EConstructionStage,
  EDestination,
  EEnergyClass,
} from "../../common/enums/characteristics.enums";
import {
  ECurrency,
  EPaymentMethod,
  EContactType,
  ESignedContract,
} from "../../common/enums/price.enums";

import { propertiesKeys } from "../../features/properties/propertiesQueries";
import { PropertiesApi } from "../../features/properties/propertiesApi";
import { queryClient } from "../../services/queryClient";

const steps = [
  "Detalii generale",
  "Caracteristici",
  "Utilități",
  "Preț",
  "Descriere",
  "Imagini",
];

// ================== DEFAULT VALUES ==================
const defaultGeneralDetails: IGeneralDetails = {
  agent: "",
  status: EStatus.ACTIV_COLD,
  transactionType: EType.SALE,
  category: ECategory.APARTMENT,
  ownerID: "",
  residentialComplex: "",
  location: {
    city: "",
    zone: "",
    street: "",
    number: "",
    building: "",
    stairwell: "",
    apartment: "",
    interesPoints: "",
    surroundings: [],
  },
  privatMemo: "",
};

const defaultCharacteristics: ICharacteristics = {
  details: {
    type: "",
    destination: EDestination.RESIDENTIAL,
    rooms: "",
    bedrooms: "",
    kitchens: "",
    bathrooms: "",
    balconies: "",
    terraces: "",
    floor: "",
    orientare: "",
    yearOfConstruction: "",
    yearOfRenovation: "",
    parkingLots: "",
    garages: "",
    bathroomWindow: false,
    openKitchen: false,
    petFriendly: false,
    keyInAgency: false,
    compartmentalization: ECompartmentalization.DUPLEX,
    comfort: EComfort.LUX,
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
    constructionStage: EConstructionStage.FINALIZED,
    type: EBuildingType.BUILDING,
    structure: EBuildingStructure.CONCRETE,
    seismicRisk: EBuildingSeismicRisk.CLASS_I,
    height: "",
  },
  energyPerformance: {
    energyClass: EEnergyClass.A,
    specificAnnualConsumption: "",
    co2EquivalentEmissionIndex: "",
    specificConsumptionFromRenewableSources: "",
  },
};

const defaultUtilities: IUtilities = {
  generals: [],
  irigationSystem: [],
  airConditioning: [],
  finishes: {
    status: [],
    insulation: [],
    walls: [],
    flooring: [],
    windows: [],
    louver: [],
    enteringDoor: [],
    interiorDoors: [],
  },
  equipment: {
    furnished: [],
    additionalSpaces: [],
    kitchen: [],
    accounting: [],
    appliances: [],
    immobile: [],
    recreationalSpaces: [],
    exterior: [],
  },
};

const defaultPrice: IPrice = {
  priceDetails: {
    price: "",
    currency: ECurrency.EUR,
    tva: false,
    pricePerMp: "",
    lastPrice: "",
    negociablePrice: false,
    requestPrice: false,
    showPricePerMp: false,
    paymentMethod: EPaymentMethod.CASH,
    garagePrice: "",
    parkingPrice: "",
    privateNotePrice: "",
  },
  commissions: {
    buyerCommission: "",
    buyerCommissionValue: "",
    ownerCommission: "",
    ownerCommissionValue: "",
  },
  contact: {
    type: EContactType.BROKERAGE,
    signedContract: ESignedContract.NO,
    contractNumber: "",
    signDate: new Date(),
    expirationDate: new Date(),
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

// ================== COMPONENT ==================
export const AddProperty: React.FC = () => {
  const theme = useTheme();
  const accent = theme.palette.primary.main;
  const isDark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<IProperty>({
    generalDetails: defaultGeneralDetails,
    characteristics: defaultCharacteristics,
    utilities: defaultUtilities,
    price: defaultPrice,
    description: defaultDescription,
    images: [],
  });
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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const propertyPayload = { ...formData, images: [] };
      const newProperty = await PropertiesApi.create(propertyPayload);
      const propertyId = newProperty._id;

      if (!propertyId) throw new Error("Property ID missing");

      if (imageFiles.length)
        await PropertiesApi.uploadImages(propertyId, imageFiles);

      if (contractFile)
        await PropertiesApi.uploadContract(propertyId, contractFile);

      await queryClient.invalidateQueries({ queryKey: propertiesKeys.all });

      showSnackbar("Proprietate creată cu succes!", "success");

      setTimeout(() => {
        setFormData({
          generalDetails: defaultGeneralDetails,
          characteristics: defaultCharacteristics,
          utilities: defaultUtilities,
          price: defaultPrice,
          description: defaultDescription,
          images: [],
        });
        setImageFiles([]);
        setContractFile(null);
        setActiveStep(0);
      }, 1500);
    } catch {
      showSnackbar("A apărut o eroare. Încearcă din nou.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => setActiveStep((p) => p + 1);
  const handleBack = () => setActiveStep((p) => p - 1);

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <GeneralDetailsStep
            data={formData.generalDetails}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, generalDetails: val }))
            }
          />
        );
      case 1:
        return (
          <CharacteristicsStep
            data={formData.characteristics}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, characteristics: val }))
            }
          />
        );
      case 2:
        return (
          <UtilityStep
            data={formData.utilities}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, utilities: val }))
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
              setFormData((prev) => ({ ...prev, price: val }));
            }}
          />
        );
      case 4:
        return (
          <DescriptionStep
            data={formData.description}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, description: val }))
            }
          />
        );
      case 5:
        return (
          <ImagesStep
            data={formData.images}
            files={imageFiles}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, images: val }))
            }
            onFilesChange={setImageFiles}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "calc(100vh - 32px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        py: { xs: 2, sm: 3 },
        px: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Container maxWidth="xl" disableGutters>
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
            Adaugă o proprietate
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
              Înapoi
            </Button>

            <Button
              variant="contained"
              onClick={
                activeStep === steps.length - 1 ? handleSubmit : handleNext
              }
              disabled={isSubmitting}
              fullWidth={isMobile}
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
                ? "Se trimite..."
                : activeStep === steps.length - 1
                ? "Trimite"
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
