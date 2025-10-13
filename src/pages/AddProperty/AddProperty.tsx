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
import { usePropertiesQuery } from "../../features/properties/propertiesQueries";
import { PropertiesApi } from "../../features/properties/propertiesApi";

const steps = [
  "Detalii generale",
  "Caracteristici",
  "Utilitati",
  "Pret",
  "Descriere",
  "Imagini",
];

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
    contractFile: null, // 🔹 implicit null
  },
};

const defaultDescription: IDescription = {
  title: "",
  description: "",
  disponibility: "",
  videoYoutubeLink: "",
  virtualTour: "",
};

export const AddProperty: React.FC = () => {
  const { refetch } = usePropertiesQuery();

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
  const [contractFile, setContractFile] = useState<File | null>(null); // 🔹 nou
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };
  const handleCloseSnackbar = () => setSnackbar((s) => ({ ...s, open: false }));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const propertyPayload = {
        ...formData,
        images: [],
      };

      const newProperty = await PropertiesApi.create(propertyPayload);
      const propertyId = newProperty._id;

      if (!propertyId) {
        throw new Error("Property ID not returned from backend");
      }

      if (imageFiles.length > 0) {
        await PropertiesApi.uploadImages(propertyId, imageFiles);
      }

      if (contractFile) {
        await PropertiesApi.uploadContract(propertyId, contractFile);
      }

      await refetch();
      showSnackbar("Proprietate creata cu succes!", "success");

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
    } catch (error: any) {
      let errorMessage = "A aparut o eroare. Te rugam sa incerci din nou.";

      if (error.response) {
        const status = error.response.status;
        if (status === 413)
          errorMessage =
            "Fisierul este prea mare. Redu dimensiunea imaginilor.";
        else if (status === 415)
          errorMessage =
            "Tip de fisier neacceptat. Incarca doar imagini (JPEG, PNG, WebP).";
        else if (status === 400)
          errorMessage = "Date invalide. Verifica toate campurile.";
        else if (error.response.data?.message)
          errorMessage = error.response.data.message;
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
    <Box sx={{ width: "100%", p: 2 }}>
      <Typography variant="h4" mb={3}>
        Adauga o proprietate
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
          Inapoi
        </Button>
        {activeStep === steps.length - 1 ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
            size="large"
          >
            {isSubmitting ? "Se trimite..." : "Finalizează"}
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handleNext}>
            Urmatorul pas
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
