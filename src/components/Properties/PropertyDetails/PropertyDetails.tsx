// app/pages/PropertyDetail/PropertyDetail.tsx
import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Chip,
  Divider,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  TextField,
  Stack,
  Avatar,
  Button,
  Modal,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  LocationOn,
  Person,
  Apartment,
  Construction,
  Security,
  Wifi,
  Description,
  Tour,
  Euro,
  Assignment,
  Close,
  ZoomIn,
  Edit,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { EStatus, EType } from "../../../common/enums/general-details.enums";
import { useProperties } from "../../../context/PropertyContext";

// Image Modal Component
const ImageModal = ({
  open,
  onClose,
  image,
  title,
}: {
  open: boolean;
  onClose: () => void;
  image: string;
  title: string;
}) => (
  <Modal
    open={open}
    onClose={onClose}
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backdropFilter: "blur(4px)",
    }}
  >
    <Box
      sx={{
        position: "relative",
        maxWidth: "90vw",
        maxHeight: "90vh",
        outline: "none",
        bgcolor: "background.paper",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: 24,
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          bgcolor: "rgba(0,0,0,0.5)",
          color: "white",
          zIndex: 1,
          "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
        }}
      >
        <Close />
      </IconButton>
      <img
        src={image}
        alt={title}
        style={{
          width: "100%",
          height: "auto",
          maxHeight: "90vh",
          display: "block",
        }}
      />
    </Box>
  </Modal>
);

// Section wrapper component
const DetailSection = ({
  title,
  children,
  icon,
}: {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) => (
  <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
    <Typography
      variant="h6"
      gutterBottom
      fontWeight="bold"
      sx={{ display: "flex", alignItems: "center", gap: 1 }}
    >
      {icon}
      {title}
    </Typography>
    <Divider sx={{ mb: 2 }} />
    {children}
  </Paper>
);

// Chip list for enum arrays
const EnumChipList = ({ items }: { items: string[] }) => (
  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
    {items && items.length > 0 ? (
      items.map((item, index) => (
        <Chip
          key={index}
          label={item}
          size="small"
          variant="outlined"
          color="primary"
        />
      ))
    ) : (
      <Typography variant="body2" color="text.secondary">
        Niciunul
      </Typography>
    )}
  </Box>
);

// Helper function to get status color
const getStatusColor = (status: EStatus) => {
  switch (status) {
    case EStatus.ACTIV_HOT:
    case EStatus.ACTIV_WARM:
      return "success";
    case EStatus.ACTIV_RESERVED:
      return "warning";
    case EStatus.RETREAT:
    case EStatus.LOST:
      return "error";
    default:
      return "default";
  }
};

// Helper function to get transaction type color
const getTransactionTypeColor = (type: EType) => {
  return type === EType.SALE ? "primary" : "secondary";
};

// Romanian label mappings without diacritics
const ROMANIAN_LABELS = {
  // General Details
  agent: "Agent",
  status: "Status",
  transactionType: "Tip tranzactie",
  category: "Categorie",
  ownerID: "ID Proprietar",
  aditionalContactID: "Contact aditional",
  residentialComplex: "Complex rezidential",
  privatMemo: "Notite private",

  // Location
  city: "Oras",
  zone: "Zona",
  street: "Strada",
  number: "Numar",
  building: "Bloc",
  stairwell: "Scara",
  apartment: "Apartament",
  interesPoints: "Puncte de interes",
  surroundings: "Inconjurator",

  // Characteristics Details
  type: "Tip",
  compartmentalization: "Compartmentalizare",
  destination: "Destinatie",
  comfort: "Comfort",
  rooms: "Camere",
  bedrooms: "Dormitoare",
  kitchens: "Bucatarii",
  bathrooms: "Bai",
  balconies: "Balcoane",
  terraces: "Terase",
  floor: "Etaj",
  orientare: "Orientare",
  yearOfConstruction: "An constructie",
  yearOfRenovation: "An renovare",
  parkingLots: "Locuri parcare",
  garages: "Garaj",
  bathroomWindow: "Geam la baie",
  openKitchen: "Bucatarie deschisa",
  petFriendly: "Pet friendly",
  keyInAgency: "Cheia in agentie",

  // Areas
  usableArea: "Suprafata utila",
  builtupArea: "Suprafata construita",
  totalUsableArea: "Suprafata utila totala",
  balconyArea: "Suprafata balcon",
  terraceArea: "Suprafata terasa",
  gardenArea: "Suprafata gradina",

  // Building
  constructionStage: "Stadiu constructie",
  buildingType: "Tip cladire",
  structure: "Structura",
  seismicRisk: "Risc seismic",
  height: "Inaltime",

  // Energy Performance
  energyClass: "Clasa energetica",
  specificAnnualConsumption: "Consum specific anual",
  co2EquivalentEmissionIndex: "Indice emisii CO2",
  specificConsumptionFromRenewableSources: "Consum din surse regenerabile",

  // Price Details
  price: "Pret",
  currency: "Moneda",
  tva: "TVA",
  pricePerMp: "Pret/mp",
  lastPrice: "Ultimul pret",
  negociablePrice: "Pret negociabil",
  requestPrice: "Pret la cerere",
  showPricePerMp: "Arata pret/mp",
  paymentMethod: "Metoda plata",
  garagePrice: "Pret garaj",
  parkingPrice: "Pret parcare",
  privateNotePrice: "Notite private pret",

  // Commissions
  buyerCommission: "Comision cumparator",
  buyerCommissionValue: "Valoare comision cumparator",
  ownerCommission: "Comision proprietar",
  ownerCommissionValue: "Valoare comision proprietar",

  // Contact
  contactType: "Tip contact",
  signedContract: "Contract semnat",
  contractNumber: "Numar contract",
  signDate: "Data semnarii",
  expirationDate: "Data expirarii",
  contractFile: "Fisier contract",

  // Description
  title: "Titlu",
  description: "Descriere",
  disponibility: "Disponibilitate",
  videoYoutubeLink: "Video YouTube",
  virtualTour: "Tur virtual",
};

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const { properties } = useProperties();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const navigate = useNavigate();

  const property = properties.find((p) => p._id === id);

  if (!property) {
    return (
      <Container>
        <Typography variant="h4">Proprietate negasita</Typography>
      </Container>
    );
  }

  const {
    generalDetails,
    characteristics,
    utilities,
    price,
    description,
    images,
    publish,
    modificationLogs,
  } = property;

  // Handle modification logs as array
  const modificationLogsArray = Array.isArray(modificationLogs)
    ? modificationLogs
    : modificationLogs
    ? [modificationLogs]
    : [];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          {description?.title || "Proprietate fara titlu"}
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <LocationOn sx={{ mr: 1 }} />
          {generalDetails.location.zone}, {generalDetails.location.city}
          {generalDetails.location.street &&
            `, ${generalDetails.location.street}`}
          {generalDetails.location.number &&
            ` ${generalDetails.location.number}`}
        </Typography>

        {/* Status & Type Chips */}
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Chip
            label={`€${price?.priceDetails?.price?.toLocaleString() || "N/A"}`}
            color="primary"
            variant="filled"
            sx={{ fontSize: "1.1rem", fontWeight: "bold", px: 2 }}
          />
          <Chip
            label={generalDetails.status}
            color={getStatusColor(generalDetails.status)}
            variant="outlined"
          />
          <Chip
            label={generalDetails.transactionType}
            color={getTransactionTypeColor(generalDetails.transactionType)}
            variant="outlined"
          />
          <Chip
            label={generalDetails.category}
            color="default"
            variant="outlined"
          />
        </Stack>
      </Box>

      <Grid container spacing={3}>
        {/* Main Content - Images & Details */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack spacing={3}>
            {/* Enhanced Image Gallery with Masonry Layout */}
            <DetailSection title="Galerie Proprietate" icon={<Apartment />}>
              {images && images.length > 0 ? (
                <>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {images.length} fotografii • Click pentru a mari
                  </Typography>
                  <ImageList
                    variant="masonry"
                    cols={3}
                    gap={12}
                    sx={{
                      m: 0,
                      overflow: "visible",
                    }}
                  >
                    {images.map((img, index) => (
                      <ImageListItem
                        key={index}
                        sx={{
                          cursor: "pointer",
                          borderRadius: 2,
                          overflow: "hidden",
                          boxShadow: 2,
                          transition:
                            "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                          "&:hover": {
                            transform: "scale(1.02)",
                            boxShadow: 6,
                          },
                        }}
                        onClick={() => setSelectedImage(img)}
                      >
                        <img
                          src={img}
                          alt={`${description?.title} - Imagine ${index + 1}`}
                          loading="lazy"
                          style={{
                            width: "100%",
                            height: "auto",
                            display: "block",
                          }}
                        />
                        <ImageListItemBar
                          title={`Foto ${index + 1}`}
                          actionIcon={
                            <IconButton
                              sx={{ color: "white" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImage(img);
                              }}
                            >
                              <ZoomIn />
                            </IconButton>
                          }
                          sx={{
                            background:
                              "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
                            "& .MuiImageListItemBar-title": {
                              fontSize: "0.75rem",
                              fontWeight: 500,
                            },
                          }}
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>

                  {/* Image Modal */}
                  <ImageModal
                    open={!!selectedImage}
                    onClose={() => setSelectedImage(null)}
                    image={selectedImage || ""}
                    title={description?.title || "Imagine proprietate"}
                  />
                </>
              ) : (
                <Box
                  sx={{
                    textAlign: "center",
                    py: 8,
                    border: "2px dashed",
                    borderColor: "divider",
                    borderRadius: 2,
                  }}
                >
                  <Apartment
                    sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Nici o imagine disponibila
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Fotografiile proprietatii vor aparea aici odata incarcate
                  </Typography>
                </Box>
              )}
            </DetailSection>

            {/* Description */}
            <DetailSection title="Descriere Proprietate" icon={<Description />}>
              <Stack spacing={2}>
                <TextField
                  label={ROMANIAN_LABELS.title}
                  value={description?.title || "N/A"}
                  fullWidth
                  size="medium"
                  variant="outlined"
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                  sx={{
                    "& .MuiInputBase-input": {
                      color: "text.primary",
                      fontWeight: 500,
                      cursor: "not-allowed",
                    },
                    "& .MuiInputLabel-root": {
                      color: "text.secondary",
                    },
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "background.default",
                    },
                  }}
                />
                <TextField
                  label={ROMANIAN_LABELS.description}
                  value={
                    description?.description || "Nici o descriere disponibila"
                  }
                  fullWidth
                  multiline
                  rows={4}
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                  sx={{
                    "& .MuiInputBase-input": {
                      color: "text.primary",
                      cursor: "not-allowed",
                    },
                    "& .MuiInputLabel-root": {
                      color: "text.secondary",
                    },
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "background.default",
                    },
                  }}
                />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      label={ROMANIAN_LABELS.disponibility}
                      value={description?.disponibility || "N/A"}
                      fullWidth
                      size="medium"
                      variant="outlined"
                      slotProps={{
                        input: {
                          readOnly: true,
                        },
                      }}
                      sx={{
                        "& .MuiInputBase-input": {
                          color: "text.primary",
                          fontWeight: 500,
                          cursor: "not-allowed",
                        },
                        "& .MuiInputLabel-root": {
                          color: "text.secondary",
                        },
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "background.default",
                        },
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      label={ROMANIAN_LABELS.videoYoutubeLink}
                      value={
                        description?.videoYoutubeLink &&
                        description.videoYoutubeLink !== "Nimic momentan"
                          ? "Disponibil"
                          : "Indisponibil"
                      }
                      fullWidth
                      size="medium"
                      variant="outlined"
                      slotProps={{
                        input: {
                          readOnly: true,
                        },
                      }}
                      sx={{
                        "& .MuiInputBase-input": {
                          color: "text.primary",
                          fontWeight: 500,
                          cursor: "not-allowed",
                        },
                        "& .MuiInputLabel-root": {
                          color: "text.secondary",
                        },
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "background.default",
                        },
                      }}
                    />
                  </Grid>
                </Grid>
                {description?.virtualTour &&
                  description.virtualTour !== "Nimic momentan" && (
                    <Button
                      variant="outlined"
                      startIcon={<Tour />}
                      component="a"
                      href={description.virtualTour}
                      target="_blank"
                    >
                      Vezi tur virtual
                    </Button>
                  )}
              </Stack>
            </DetailSection>

            {/* Location Details */}
            <DetailSection title="Detalii Locatie" icon={<LocationOn />}>
              <Grid container spacing={2}>
                {[
                  {
                    label: ROMANIAN_LABELS.city,
                    value: generalDetails.location.city,
                  },
                  {
                    label: ROMANIAN_LABELS.zone,
                    value: generalDetails.location.zone,
                  },
                  {
                    label: ROMANIAN_LABELS.street,
                    value: generalDetails.location.street,
                  },
                  {
                    label: ROMANIAN_LABELS.number,
                    value: generalDetails.location.number,
                  },
                  {
                    label: ROMANIAN_LABELS.building,
                    value: generalDetails.location.building,
                  },
                  {
                    label: ROMANIAN_LABELS.stairwell,
                    value: generalDetails.location.stairwell,
                  },
                  {
                    label: ROMANIAN_LABELS.apartment,
                    value: generalDetails.location.apartment,
                  },
                ].map((field, index) => (
                  <Grid key={index} size={{ xs: 6, md: 4 }}>
                    <TextField
                      label={field.label}
                      value={field.value || "N/A"}
                      fullWidth
                      size="small"
                      variant="outlined"
                      slotProps={{
                        input: {
                          readOnly: true,
                        },
                      }}
                      sx={{
                        "& .MuiInputBase-input": {
                          color: "text.primary",
                          fontWeight: 500,
                          cursor: "not-allowed",
                        },
                        "& .MuiInputLabel-root": {
                          color: "text.secondary",
                        },
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "background.default",
                        },
                      }}
                    />
                  </Grid>
                ))}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    {ROMANIAN_LABELS.interesPoints}
                  </Typography>
                  <Typography variant="body2">
                    {generalDetails.location.interesPoints ||
                      "Nici un punct de interes specificat"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    {ROMANIAN_LABELS.surroundings}
                  </Typography>
                  <EnumChipList items={generalDetails.location.surroundings} />
                </Grid>
              </Grid>
            </DetailSection>

            {/* Characteristics */}
            <DetailSection
              title="Caracteristici Proprietate"
              icon={<Construction />}
            >
              <Grid container spacing={2}>
                {/* Basic Details */}
                <Grid size={{ xs: 12 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ mb: 2 }}
                  >
                    Informatii de baza
                  </Typography>
                </Grid>

                {[
                  {
                    label: ROMANIAN_LABELS.type,
                    value: characteristics.details.type,
                  },
                  {
                    label: ROMANIAN_LABELS.compartmentalization,
                    value: characteristics.details.compartmentalization,
                  },
                  {
                    label: ROMANIAN_LABELS.destination,
                    value: characteristics.details.destination,
                  },
                  {
                    label: ROMANIAN_LABELS.comfort,
                    value: characteristics.details.comfort,
                  },
                  {
                    label: ROMANIAN_LABELS.rooms,
                    value: characteristics.details.rooms,
                  },
                  {
                    label: ROMANIAN_LABELS.bedrooms,
                    value: characteristics.details.bedrooms,
                  },
                  {
                    label: ROMANIAN_LABELS.kitchens,
                    value: characteristics.details.kitchens,
                  },
                  {
                    label: ROMANIAN_LABELS.bathrooms,
                    value: characteristics.details.bathrooms,
                  },
                  {
                    label: ROMANIAN_LABELS.balconies,
                    value: characteristics.details.balconies,
                  },
                  {
                    label: ROMANIAN_LABELS.terraces,
                    value: characteristics.details.terraces,
                  },
                  {
                    label: ROMANIAN_LABELS.floor,
                    value: characteristics.details.floor,
                  },
                  {
                    label: ROMANIAN_LABELS.orientare,
                    value: characteristics.details.orientare,
                  },
                  {
                    label: ROMANIAN_LABELS.yearOfConstruction,
                    value: characteristics.details.yearOfConstruction,
                  },
                  {
                    label: ROMANIAN_LABELS.yearOfRenovation,
                    value: characteristics.details.yearOfRenovation,
                  },
                  {
                    label: ROMANIAN_LABELS.parkingLots,
                    value: characteristics.details.parkingLots,
                  },
                  {
                    label: ROMANIAN_LABELS.garages,
                    value: characteristics.details.garages,
                  },
                ].map((field, index) => (
                  <Grid key={index} size={{ xs: 6, md: 4 }}>
                    <TextField
                      label={field.label}
                      value={field.value || "N/A"}
                      fullWidth
                      size="small"
                      variant="outlined"
                      slotProps={{
                        input: {
                          readOnly: true,
                        },
                      }}
                      sx={{
                        "& .MuiInputBase-input": {
                          color: "text.primary",
                          fontWeight: 500,
                          cursor: "not-allowed",
                        },
                        "& .MuiInputLabel-root": {
                          color: "text.secondary",
                        },
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "background.default",
                        },
                      }}
                    />
                  </Grid>
                ))}

                {/* Boolean Features */}
                <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ mb: 2 }}
                  >
                    Facilitati
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {characteristics.details.bathroomWindow && (
                      <Chip
                        label={ROMANIAN_LABELS.bathroomWindow}
                        size="small"
                      />
                    )}
                    {characteristics.details.openKitchen && (
                      <Chip label={ROMANIAN_LABELS.openKitchen} size="small" />
                    )}
                    {characteristics.details.petFriendly && (
                      <Chip label={ROMANIAN_LABELS.petFriendly} size="small" />
                    )}
                    {characteristics.details.keyInAgency && (
                      <Chip label={ROMANIAN_LABELS.keyInAgency} size="small" />
                    )}
                  </Stack>
                </Grid>

                {/* Areas */}
                <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ mb: 2 }}
                  >
                    Suprafete (m²)
                  </Typography>
                </Grid>

                {[
                  {
                    label: ROMANIAN_LABELS.usableArea,
                    value: characteristics.areas.usableArea,
                    adornment: "m²",
                  },
                  {
                    label: ROMANIAN_LABELS.builtupArea,
                    value: characteristics.areas.builtupArea,
                    adornment: "m²",
                  },
                  {
                    label: ROMANIAN_LABELS.totalUsableArea,
                    value: characteristics.areas.totalUsableArea,
                    adornment: "m²",
                  },
                  {
                    label: ROMANIAN_LABELS.balconyArea,
                    value: characteristics.areas.balconyArea,
                    adornment: "m²",
                  },
                  {
                    label: ROMANIAN_LABELS.terraceArea,
                    value: characteristics.areas.terraceArea,
                    adornment: "m²",
                  },
                  {
                    label: ROMANIAN_LABELS.gardenArea,
                    value: characteristics.areas.gardenArea,
                    adornment: "m²",
                  },
                ].map((field, index) => (
                  <Grid key={index} size={{ xs: 6, md: 4 }}>
                    <TextField
                      label={field.label}
                      value={field.value || "N/A"}
                      fullWidth
                      size="small"
                      variant="outlined"
                      slotProps={{
                        input: {
                          readOnly: true,
                          endAdornment: field.adornment ? (
                            <InputAdornment position="end">
                              {field.adornment}
                            </InputAdornment>
                          ) : undefined,
                        },
                      }}
                      sx={{
                        "& .MuiInputBase-input": {
                          color: "text.primary",
                          fontWeight: 500,
                          cursor: "not-allowed",
                        },
                        "& .MuiInputLabel-root": {
                          color: "text.secondary",
                        },
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "background.default",
                        },
                      }}
                    />
                  </Grid>
                ))}

                {/* Building Information */}
                <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ mb: 2 }}
                  >
                    Informatii Cladire
                  </Typography>
                </Grid>

                {[
                  {
                    label: ROMANIAN_LABELS.constructionStage,
                    value: characteristics.building.constructionStage,
                  },
                  {
                    label: ROMANIAN_LABELS.buildingType,
                    value: characteristics.building.type,
                  },
                  {
                    label: ROMANIAN_LABELS.structure,
                    value: characteristics.building.structure,
                  },
                  {
                    label: ROMANIAN_LABELS.seismicRisk,
                    value: characteristics.building.seismicRisk,
                  },
                  {
                    label: ROMANIAN_LABELS.height,
                    value: characteristics.building.height,
                  },
                ].map((field, index) => (
                  <Grid key={index} size={{ xs: 6, md: 4 }}>
                    <TextField
                      label={field.label}
                      value={field.value || "N/A"}
                      fullWidth
                      size="small"
                      variant="outlined"
                      slotProps={{
                        input: {
                          readOnly: true,
                        },
                      }}
                      sx={{
                        "& .MuiInputBase-input": {
                          color: "text.primary",
                          fontWeight: 500,
                          cursor: "not-allowed",
                        },
                        "& .MuiInputLabel-root": {
                          color: "text.secondary",
                        },
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "background.default",
                        },
                      }}
                    />
                  </Grid>
                ))}

                {/* Energy Performance */}
                <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ mb: 2 }}
                  >
                    Performanta Energetica
                  </Typography>
                </Grid>

                {[
                  {
                    label: ROMANIAN_LABELS.energyClass,
                    value: characteristics.energyPerformance.energyClass,
                  },
                  {
                    label: ROMANIAN_LABELS.specificAnnualConsumption,
                    value:
                      characteristics.energyPerformance
                        .specificAnnualConsumption,
                    adornment: "kWh/m²an",
                  },
                  {
                    label: ROMANIAN_LABELS.co2EquivalentEmissionIndex,
                    value:
                      characteristics.energyPerformance
                        .co2EquivalentEmissionIndex,
                    adornment: "kgCO₂/m²an",
                  },
                  {
                    label:
                      ROMANIAN_LABELS.specificConsumptionFromRenewableSources,
                    value:
                      characteristics.energyPerformance
                        .specificConsumptionFromRenewableSources,
                    adornment: "kWh/m²an",
                  },
                ].map((field, index) => (
                  <Grid key={index} size={{ xs: 6, md: 4 }}>
                    <TextField
                      label={field.label}
                      value={field.value || "N/A"}
                      fullWidth
                      size="small"
                      variant="outlined"
                      slotProps={{
                        input: {
                          readOnly: true,
                          endAdornment: field.adornment ? (
                            <InputAdornment position="end">
                              {field.adornment}
                            </InputAdornment>
                          ) : undefined,
                        },
                      }}
                      sx={{
                        "& .MuiInputBase-input": {
                          color: "text.primary",
                          fontWeight: 500,
                          cursor: "not-allowed",
                        },
                        "& .MuiInputLabel-root": {
                          color: "text.secondary",
                        },
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "background.default",
                        },
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </DetailSection>

            {/* Utilities */}
            <DetailSection title="Utilitati si Echipamente" icon={<Wifi />}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Utilitati Generale
                  </Typography>
                  <EnumChipList items={utilities.generals} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Sistem de Irigatie
                  </Typography>
                  <EnumChipList items={utilities.irigationSystem} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Aer Conditionat
                  </Typography>
                  <EnumChipList items={utilities.airConditioning} />
                </Grid>

                {/* Equipment */}
                <Grid size={{ xs: 12 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ mt: 2, mb: 1 }}
                  >
                    Echipamente
                  </Typography>
                </Grid>

                {[
                  { label: "Mobilat", items: utilities.equipment.furnished },
                  {
                    label: "Spatii Aditionale",
                    items: utilities.equipment.additionalSpaces,
                  },
                  { label: "Bucatarie", items: utilities.equipment.kitchen },
                  {
                    label: "Contabilitate",
                    items: utilities.equipment.accounting,
                  },
                  {
                    label: "Electrocasnice",
                    items: utilities.equipment.appliances,
                  },
                  { label: "Imobil", items: utilities.equipment.immobile },
                  {
                    label: "Spatii Recreative",
                    items: utilities.equipment.recreationalSpaces,
                  },
                  { label: "Exterior", items: utilities.equipment.exterior },
                ].map((category, index) => (
                  <Grid key={index} size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      {category.label}
                    </Typography>
                    <EnumChipList items={category.items} />
                  </Grid>
                ))}

                {/* Finishes */}
                <Grid size={{ xs: 12 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ mt: 2, mb: 1 }}
                  >
                    Finisaje
                  </Typography>
                </Grid>

                {[
                  { label: "Stare", items: utilities.finishes.status },
                  { label: "Izolatie", items: utilities.finishes.insulation },
                  { label: "Pereti", items: utilities.finishes.walls },
                  { label: "Pardoseala", items: utilities.finishes.flooring },
                  { label: "Ferestre", items: utilities.finishes.windows },
                  { label: "Jaluzele", items: utilities.finishes.louver },
                  {
                    label: "Usa intrare",
                    items: utilities.finishes.enteringDoor,
                  },
                  {
                    label: "Usi interioare",
                    items: utilities.finishes.interiorDoors,
                  },
                ].map((category, index) => (
                  <Grid key={index} size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      {category.label}
                    </Typography>
                    <EnumChipList items={category.items} />
                  </Grid>
                ))}
              </Grid>
            </DetailSection>

            {/* Price & Commissions */}
            <DetailSection title="Detalii Pret si Comisioane" icon={<Euro />}>
              <Grid container spacing={2}>
                {/* Price Details */}
                <Grid size={{ xs: 12 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ mb: 2 }}
                  >
                    Detalii Pret
                  </Typography>
                </Grid>

                {[
                  {
                    label: ROMANIAN_LABELS.price,
                    value: price.priceDetails.price,
                    adornment: "€",
                  },
                  {
                    label: ROMANIAN_LABELS.currency,
                    value: price.priceDetails.currency,
                  },
                  {
                    label: ROMANIAN_LABELS.pricePerMp,
                    value: price.priceDetails.pricePerMp,
                    adornment: "€/mp",
                  },
                  {
                    label: ROMANIAN_LABELS.lastPrice,
                    value: price.priceDetails.lastPrice,
                    adornment: "€",
                  },
                  {
                    label: ROMANIAN_LABELS.garagePrice,
                    value: price.priceDetails.garagePrice,
                    adornment: "€",
                  },
                  {
                    label: ROMANIAN_LABELS.parkingPrice,
                    value: price.priceDetails.parkingPrice,
                    adornment: "€",
                  },
                ].map((field, index) => (
                  <Grid key={index} size={{ xs: 6, md: 4 }}>
                    <TextField
                      label={field.label}
                      value={field.value || "N/A"}
                      fullWidth
                      size="small"
                      variant="outlined"
                      slotProps={{
                        input: {
                          readOnly: true,
                          endAdornment: field.adornment ? (
                            <InputAdornment position="end">
                              {field.adornment}
                            </InputAdornment>
                          ) : undefined,
                        },
                      }}
                      sx={{
                        "& .MuiInputBase-input": {
                          color: "text.primary",
                          fontWeight: 500,
                          cursor: "not-allowed",
                        },
                        "& .MuiInputLabel-root": {
                          color: "text.secondary",
                        },
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "background.default",
                        },
                      }}
                    />
                  </Grid>
                ))}

                {/* Boolean Price Options */}
                <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {price.priceDetails.tva && (
                      <Chip label="TVA inclus" size="small" />
                    )}
                    {price.priceDetails.negociablePrice && (
                      <Chip label="Pret negociabil" size="small" />
                    )}
                    {price.priceDetails.requestPrice && (
                      <Chip label="Pret la cerere" size="small" />
                    )}
                    {price.priceDetails.showPricePerMp && (
                      <Chip label="Arata pret/mp" size="small" />
                    )}
                  </Stack>
                </Grid>

                {/* Commissions */}
                <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ mb: 2 }}
                  >
                    Comisioane
                  </Typography>
                </Grid>

                {[
                  {
                    label: ROMANIAN_LABELS.buyerCommission,
                    value: price.commissions.buyerCommission,
                  },
                  {
                    label: ROMANIAN_LABELS.buyerCommissionValue,
                    value: price.commissions.buyerCommissionValue,
                    adornment: "€",
                  },
                  {
                    label: ROMANIAN_LABELS.ownerCommission,
                    value: price.commissions.ownerCommission,
                  },
                  {
                    label: ROMANIAN_LABELS.ownerCommissionValue,
                    value: price.commissions.ownerCommissionValue,
                    adornment: "€",
                  },
                ].map((field, index) => (
                  <Grid key={index} size={{ xs: 6, md: 3 }}>
                    <TextField
                      label={field.label}
                      value={field.value || "N/A"}
                      fullWidth
                      size="small"
                      variant="outlined"
                      slotProps={{
                        input: {
                          readOnly: true,
                          endAdornment: field.adornment ? (
                            <InputAdornment position="end">
                              {field.adornment}
                            </InputAdornment>
                          ) : undefined,
                        },
                      }}
                      sx={{
                        "& .MuiInputBase-input": {
                          color: "text.primary",
                          fontWeight: 500,
                          cursor: "not-allowed",
                        },
                        "& .MuiInputLabel-root": {
                          color: "text.secondary",
                        },
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "background.default",
                        },
                      }}
                    />
                  </Grid>
                ))}

                {/* Contact */}
                <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ mb: 2 }}
                  >
                    Detalii Contract
                  </Typography>
                </Grid>

                {[
                  {
                    label: ROMANIAN_LABELS.contactType,
                    value: price.contact.type,
                  },
                  {
                    label: ROMANIAN_LABELS.signedContract,
                    value: price.contact.signedContract,
                  },
                  {
                    label: ROMANIAN_LABELS.contractNumber,
                    value: price.contact.contractNumber,
                  },
                  {
                    label: ROMANIAN_LABELS.signDate,
                    value: price.contact.signDate
                      ? new Date(price.contact.signDate).toLocaleDateString(
                          "ro-RO"
                        )
                      : "N/A",
                  },
                  {
                    label: ROMANIAN_LABELS.expirationDate,
                    value: price.contact.expirationDate
                      ? new Date(
                          price.contact.expirationDate
                        ).toLocaleDateString("ro-RO")
                      : "N/A",
                  },
                ].map((field, index) => (
                  <Grid key={index} size={{ xs: 6, md: 4 }}>
                    <TextField
                      label={field.label}
                      value={field.value || "N/A"}
                      fullWidth
                      size="small"
                      variant="outlined"
                      slotProps={{
                        input: {
                          readOnly: true,
                        },
                      }}
                      sx={{
                        "& .MuiInputBase-input": {
                          color: "text.primary",
                          fontWeight: 500,
                          cursor: "not-allowed",
                        },
                        "& .MuiInputLabel-root": {
                          color: "text.secondary",
                        },
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "background.default",
                        },
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </DetailSection>
          </Stack>
        </Grid>

        {/* Sidebar */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack spacing={3}>
            {/* Quick Summary */}
            <DetailSection title="Rezumat Proprietate" icon={<Apartment />}>
              <Stack spacing={2}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Pret
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    €{price.priceDetails.price?.toLocaleString() || "N/A"}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Categorie
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {generalDetails.category}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Tip tranzactie
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {generalDetails.transactionType}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Suprafata totala
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {characteristics.areas.totalUsableArea} m²
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Camere
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {characteristics.details.rooms}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    label={generalDetails.status}
                    size="small"
                    color={getStatusColor(generalDetails.status)}
                  />
                </Box>
              </Stack>
            </DetailSection>

            {/* Agent Information */}
            <DetailSection title="Informatii Agent" icon={<Person />}>
              <Stack spacing={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ width: 56, height: 56 }}>
                    {generalDetails.agent?.charAt(0) || "A"}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight="bold">
                      {generalDetails.agent || "Neatribuit"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Agent Imobiliar
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </DetailSection>

            {/* Additional Info */}
            <DetailSection title="Informatii Aditionale" icon={<Assignment />}>
              <Stack spacing={1}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    ID Proprietar
                  </Typography>
                  <Typography variant="body2" fontWeight="500">
                    {generalDetails.ownerID || "N/A"}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Contact aditional
                  </Typography>
                  <Typography variant="body2" fontWeight="500">
                    {generalDetails.aditionalContactID || "N/A"}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Complex rezidential
                  </Typography>
                  <Typography variant="body2" fontWeight="500">
                    {generalDetails.residentialComplex || "N/A"}
                  </Typography>
                </Box>
              </Stack>
            </DetailSection>

            {/* Publishing Options */}
            {publish && (
              <DetailSection title="Optiuni Publicare" icon={<Assignment />}>
                <Stack spacing={1}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2">
                      Arata locatia exacta
                    </Typography>
                    <Chip
                      label={publish.showExactlyLocation ? "Da" : "Nu"}
                      size="small"
                      color={
                        publish.showExactlyLocation ? "success" : "default"
                      }
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2">
                      Arata comision standard
                    </Typography>
                    <Chip
                      label={publish.showStandardCommission ? "Da" : "Nu"}
                      size="small"
                      color={
                        publish.showStandardCommission ? "success" : "default"
                      }
                    />
                  </Box>
                </Stack>
              </DetailSection>
            )}

            {/* Modification Logs */}
            {modificationLogsArray.length > 0 && (
              <DetailSection title="Istoric Modificari" icon={<Assignment />}>
                <Stack spacing={1}>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Ultima modificare
                    </Typography>
                    <Typography variant="body2" fontWeight="500">
                      {new Date(
                        modificationLogsArray[0].date
                      ).toLocaleDateString("ro-RO")}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Modificat de
                    </Typography>
                    <Typography variant="body2" fontWeight="500">
                      {modificationLogsArray[0].agentID}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Campuri modificate
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {modificationLogsArray[0].modifiedFields ||
                        "Nici un detaliu disponibil"}
                    </Typography>
                  </Box>
                </Stack>
              </DetailSection>
            )}

            {/* Private Notes */}
            {generalDetails.privatMemo &&
              generalDetails.privatMemo !== "Nimic momentan" && (
                <DetailSection title="Notite Private" icon={<Security />}>
                  <Typography variant="body2">
                    {generalDetails.privatMemo}
                  </Typography>
                </DetailSection>
              )}
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => navigate(`/properties/edit/${id}`)}
              sx={{ mt: 2 }}
            >
              Editeaza proprietatea
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}
