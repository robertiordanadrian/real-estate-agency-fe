import { useState } from "react";
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
  Wifi,
  Description,
  Euro,
  Close,
  ZoomIn,
  Edit,
  Download,
  Phone,
  Email,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { EStatus, EType } from "../../common/enums/general-details.enums";
import { usePropertyQuery } from "../../features/properties/propertiesQueries";
import { useOwnerByIdQuery } from "../../features/owners/ownersQueries";
import { useAppSelector } from "../../app/hook";
import { selectUser } from "../../features/auth/authSelectors";

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

const EnumChipList = ({ items }: { items: string[] }) => (
  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
    {items && items.length > 0 ? (
      items.map((item, i) => (
        <Chip
          key={i}
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

const getTransactionTypeColor = (type: EType) =>
  type === EType.SALE ? "primary" : "secondary";

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const user = useAppSelector(selectUser);

  const { data: property, isLoading, isError } = usePropertyQuery(id!);
  const ownerId = property?.generalDetails?.ownerID;
  const { data: owner } = useOwnerByIdQuery(ownerId ?? "");

  if (isLoading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
  <Typography variant="h6">Se incarca...</Typography>
      </Box>
    );
  if (isError || !property)
    return (
      <Container>
  <Typography variant="h4">Proprietate negasita</Typography>
      </Container>
    );

  const {
    generalDetails,
    characteristics,
    utilities,
    price,
    description,
    images,
  } = property;

  const locationLabels: Record<string, string> = {
    city: "Oras",
    zone: "Zona",
    street: "Strada",
    number: "Numar",
    building: "Bloc",
    stairwell: "Scara",
    apartment: "Apartament",
  };

  const utilitiesSections = [
    { label: "Utilitati generale", data: utilities.generals },
    { label: "Sisteme incalzire", data: utilities.irigationSystem },
    { label: "Aer conditionat", data: utilities.airConditioning },
    { label: "Finisaje - Stare", data: utilities.finishes.status },
    { label: "Finisaje - Izolatie", data: utilities.finishes.insulation },
    { label: "Finisaje - Pereti", data: utilities.finishes.walls },
    { label: "Finisaje - Pardoseala", data: utilities.finishes.flooring },
    { label: "Finisaje - Ferestre", data: utilities.finishes.windows },
    { label: "Finisaje - Jaluzele", data: utilities.finishes.louver },
    { label: "Finisaje - Usa intrare", data: utilities.finishes.enteringDoor },
    {
      label: "Finisaje - Usi interioare",
      data: utilities.finishes.interiorDoors,
    },
    { label: "Mobilier", data: utilities.equipment.furnished },
    {
      label: "Spatii suplimentare",
      data: utilities.equipment.additionalSpaces,
    },
    { label: "Bucatarie", data: utilities.equipment.kitchen },
    { label: "Contorizare", data: utilities.equipment.accounting },
    { label: "Electrocasnice", data: utilities.equipment.appliances },
    { label: "Imobil", data: utilities.equipment.immobile },
    {
      label: "Spatii recreationale",
      data: utilities.equipment.recreationalSpaces,
    },
    { label: "Exterior", data: utilities.equipment.exterior },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
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
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Chip
            label={`${
              price?.priceDetails?.price?.toLocaleString() + "€" || "N/A"
            }`}
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
          <Chip label={generalDetails.category} variant="outlined" />
        </Stack>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack spacing={3}>
            <DetailSection title="Galerie Proprietate" icon={<Apartment />}>
              {images?.length ? (
                <>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {images.length} fotografii • Click pentru a mari
                  </Typography>
                  <ImageList variant="masonry" cols={3} gap={12}>
                    {images.map((img, index) => (
                      <ImageListItem
                        key={index}
                        sx={{
                          cursor: "pointer",
                          borderRadius: 2,
                          overflow: "hidden",
                          boxShadow: 2,
                          "&:hover": { transform: "scale(1.02)", boxShadow: 6 },
                        }}
                        onClick={() => setSelectedImage(img)}
                      >
                        <img
                          src={img}
                          alt={`${description?.title}-${index}`}
                          loading="lazy"
                        />
                        <ImageListItemBar
                          title={`Imagine ${index + 1}`}
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
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                  <ImageModal
                    open={!!selectedImage}
                    onClose={() => setSelectedImage(null)}
                    image={selectedImage || ""}
                    title={description?.title || ""}
                  />
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Nicio imagine disponibila.
                </Typography>
              )}
            </DetailSection>

            <DetailSection title="Detalii Generale" icon={<Description />}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Agent"
                    value={generalDetails.agent || "N/A"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Status"
                    value={generalDetails.status || "N/A"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Tip tranzactie"
                    value={generalDetails.transactionType || "N/A"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Categorie"
                    value={generalDetails.category || "N/A"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="ID Proprietar"
                    value={generalDetails.ownerID || "N/A"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Complex rezidential"
                    value={generalDetails.residentialComplex || "N/A"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </DetailSection>

            <DetailSection title="Locatie" icon={<LocationOn />}>
              <Grid container spacing={2}>
                {Object.entries(generalDetails.location)
                  .filter(
                    ([key]) =>
                      !["_id", "surroundings", "interesPoints"].includes(key)
                  )
                  .map(([key, value]) => (
                    <Grid key={key} size={{ xs: 6, md: 4 }}>
                      <TextField
                        label={locationLabels[key] || key}
                        value={value || "N/A"}
                        fullWidth
                        size="small"
                        slotProps={{
                          input: {
                            readOnly: true,
                          },
                        }}
                      />
                    </Grid>
                  ))}
              </Grid>
            </DetailSection>

            <DetailSection title="Caracteristici" icon={<Apartment />}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Detalii Generale
                  </Typography>
                </Grid>

                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Tip"
                    value={characteristics.details.type || "N/A"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Compartimentare"
                    value={
                      characteristics.details.compartmentalization || "N/A"
                    }
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Destinatie"
                    value={characteristics.details.destination || "N/A"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Confort"
                    value={characteristics.details.comfort || "N/A"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Camere"
                    value={characteristics.details.rooms || "N/A"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Dormitoare"
                    value={characteristics.details.bedrooms || "N/A"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Bai"
                    value={characteristics.details.bathrooms || "N/A"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Bucatarii"
                    value={characteristics.details.kitchens || "N/A"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Balcoane"
                    value={characteristics.details.balconies || "N/A"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Terase"
                    value={characteristics.details.terraces || "N/A"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Etaj"
                    value={characteristics.details.floor || "N/A"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="An Constructie"
                    value={characteristics.details.yearOfConstruction || "N/A"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="An Renovare"
                    value={characteristics.details.yearOfRenovation || "N/A"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Locuri Parcare"
                    value={characteristics.details.parkingLots || "N/A"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Garaje"
                    value={characteristics.details.garages || "N/A"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Bai cu Geam"
                    value={characteristics.details.bathroomWindow ? "Da" : "Nu"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Bucatarie Deschisa"
                    value={characteristics.details.openKitchen ? "Da" : "Nu"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Pet Friendly"
                    value={characteristics.details.petFriendly ? "Da" : "Nu"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Cheie la Agentie"
                    value={characteristics.details.keyInAgency ? "Da" : "Nu"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                    Suprafete
                  </Typography>
                </Grid>

                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Suprafata Utila"
                    value={characteristics.areas.usableArea || "N/A"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="end">m²</InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Suprafata Construita"
                    value={characteristics.areas.builtupArea || "N/A"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="end">m²</InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Suprafata Totala Utila"
                    value={characteristics.areas.totalUsableArea || "N/A"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="end">m²</InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Suprafata Balcon"
                    value={characteristics.areas.balconyArea || "N/A"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="end">m²</InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Suprafata Terasa"
                    value={characteristics.areas.terraceArea || "N/A"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="end">m²</InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Suprafata Gradina"
                    value={characteristics.areas.gardenArea || "N/A"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="end">m²</InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                    Cladire
                  </Typography>
                </Grid>

                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Etapa Constructie"
                    value={characteristics.building.constructionStage || "N/A"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Tip Cladire"
                    value={characteristics.building.type || "N/A"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Structura"
                    value={characteristics.building.structure || "N/A"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Risc Seismic"
                    value={characteristics.building.seismicRisk || "N/A"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Inaltime"
                    value={characteristics.building.height || "N/A"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                    Performanta Energetica
                  </Typography>
                </Grid>

                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Clasa Energetica"
                    value={
                      characteristics.energyPerformance.energyClass || "N/A"
                    }
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Consum Anual Specific"
                    value={
                      characteristics.energyPerformance
                        .specificAnnualConsumption || "N/A"
                    }
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="end">
                            kWh/m²an
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Indice Emisii CO₂"
                    value={
                      characteristics.energyPerformance
                        .co2EquivalentEmissionIndex || "N/A"
                    }
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="end">
                            kgCO₂/m²an
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Consum din Surse Regenerabile"
                    value={
                      characteristics.energyPerformance
                        .specificConsumptionFromRenewableSources || "N/A"
                    }
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="end">
                            kWh/m²an
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </DetailSection>

            <DetailSection title="Utilitati si Echipamente" icon={<Wifi />}>
              <Grid container spacing={2}>
                {utilitiesSections.map(({ label, data }) => (
                  <Grid key={label} size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      {label}
                    </Typography>
                    <EnumChipList items={data || []} />
                  </Grid>
                ))}
              </Grid>
            </DetailSection>

            <DetailSection title="Pret" icon={<Euro />}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Detalii Pret
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Pret"
                    value={price.priceDetails.price || "N/A"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="end">€</InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Moneda"
                    value={price.priceDetails.currency || "N/A"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Pret"
                    value={price.priceDetails.pricePerMp || "N/A"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="end">€/mp</InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Metoda plata"
                    value={price.priceDetails.paymentMethod || "N/A"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Ultimul pret"
                    value={price.priceDetails.lastPrice || "N/A"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="end">€</InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Pret garaj"
                    value={price.priceDetails.garagePrice || "N/A"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="end">€</InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Pret parcare"
                    value={price.priceDetails.parkingPrice || "N/A"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="end">€</InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Notite private pret"
                    value={price.priceDetails.privateNotePrice || "N/A"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="TVA inclus"
                    value={price.priceDetails.tva ? "Da" : "Nu"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Pret negociabil"
                    value={price.priceDetails.negociablePrice ? "Da" : "Nu"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Pret la cerere"
                    value={price.priceDetails.requestPrice ? "Da" : "Nu"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Afiseaza €/mp"
                    value={price.priceDetails.showPricePerMp ? "Da" : "Nu"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                    Comisioane
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Comision cumparator"
                    value={price.commissions.buyerCommissionValue || "N/A"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Valoare comision cumparator"
                    value={price.commissions.buyerCommission || "N/A"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Comision proprietar"
                    value={price.commissions.ownerCommissionValue || "N/A"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Valoare comision proprietar"
                    value={price.commissions.ownerCommissionValue || "N/A"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                    Detalii Contract
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Tip contract"
                    value={price.contact.type || "N/A"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Contract semnat"
                    value={price.contact.signedContract || "N/A"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Numar contract"
                    value={price.contact.contractNumber || "N/A"}
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Data semnarii"
                    value={
                      price.contact.signDate
                        ? new Date(price.contact.signDate).toLocaleDateString(
                            "ro-RO"
                          )
                        : "N/A"
                    }
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Data Expirarii"
                    value={
                      price.contact.expirationDate
                        ? new Date(
                            price.contact.expirationDate
                          ).toLocaleDateString("ro-RO")
                        : "N/A"
                    }
                    fullWidth
                    size="small"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  {typeof price.contact.contractFile === "string" &&
                  price.contact.contractFile ? (
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<Download />}
                      fullWidth
                      onClick={() =>
                        window.open(
                          price.contact.contractFile as string,
                          "_blank"
                        )
                      }
                      sx={{
                        height: 40,
                        textTransform: "none",
                        justifyContent: "flex-start",
                        borderColor: "#90caf9",
                        "&:hover": { borderColor: "rgba(255, 255, 255)" },
                      }}
                    >
                      Descarca contract
                    </Button>
                  ) : (
                    <TextField
                      label="Fisier contract"
                      value="N/A"
                      fullWidth
                      size="small"
                      slotProps={{
                        input: {
                          readOnly: true,
                        },
                      }}
                    />
                  )}
                </Grid>
              </Grid>
            </DetailSection>
            <DetailSection title="Descriere" icon={<Description />}>
              <Stack spacing={2}>
                <TextField
                  label="Titlu"
                  value={description?.title || "N/A"}
                  fullWidth
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                />
                <TextField
                  label="Descriere"
                  value={description?.description || "Nicio descriere"}
                  fullWidth
                  multiline
                  rows={4}
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                />
                <TextField
                  label="Disponibilitate"
                  value={description?.disponibility || "N/A"}
                  fullWidth
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                />
                <TextField
                  label="Link video YouTube"
                  value={description?.videoYoutubeLink || "N/A"}
                  fullWidth
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                />
                <TextField
                  label="Link tur virtual"
                  value={description?.virtualTour || "N/A"}
                  fullWidth
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                />
              </Stack>
            </DetailSection>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack spacing={3}>
            <DetailSection title="Agent" icon={<Person />}>
              <Stack
                direction="column"
                alignItems="center"
                justifyContent="center"
                spacing={1.5}
                sx={{
                  textAlign: "center",
                  p: 2,
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #1e293b, #0f172a)",
                }}
              >
                <Avatar
                  src={user?.profilePicture || undefined}
                  sx={{
                    width: 90,
                    height: 90,
                    border: "2px solid #38bdf8",
                    bgcolor: "#1e293b",
                    boxShadow: "0 0 12px rgba(56,189,248,0.5)",
                  }}
                >
                  {!user?.profilePicture && (user?.name?.charAt(0) ?? "A")}
                </Avatar>

                <Typography
                  variant="h6"
                  sx={{ color: "#e2e8f0", fontWeight: 600 }}
                >
                  {user?.name ?? "Neatribuit"}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "#38bdf8",
                    fontWeight: 500,
                    letterSpacing: "0.5px",
                    textTransform: "capitalize",
                  }}
                >
                  {user?.role ?? "Agent imobiliar"}
                </Typography>
              </Stack>
            </DetailSection>

            <DetailSection title="Proprietar" icon={<Person />}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #1e293b, #0f172a)",
                  textAlign: "left",
                  color: "#e2e8f0",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: "#e2e8f0",
                    mb: 2,
                  }}
                >
                  {owner
                    ? `${owner.surname ?? ""} ${owner.lastname ?? ""}`.trim() ||
                      "Nespecificat"
                    : "Nespecificat"}
                </Typography>

                <Stack spacing={2}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Phone sx={{ color: "#38bdf8", fontSize: 20 }} />
                    {owner?.phone ? (
                      <Typography
                        variant="body2"
                        component="a"
                        href={`tel:${owner.phone}`}
                        sx={{
                          color: "text.secondary",
                          textDecoration: "none",
                          transition: "color 0.2s ease",
                          "&:hover": {
                            color: "#38bdf8",
                            textDecoration: "underline",
                          },
                        }}
                      >
                        {owner.phone}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Telefon nespecificat
                      </Typography>
                    )}
                  </Stack>

                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Email sx={{ color: "#38bdf8", fontSize: 20 }} />
                    {owner?.email ? (
                      <Typography
                        variant="body2"
                        component="a"
                        href={`mailto:${owner.email}`}
                        sx={{
                          color: "text.secondary",
                          textDecoration: "none",
                          transition: "color 0.2s ease",
                          "&:hover": {
                            color: "#38bdf8",
                            textDecoration: "underline",
                          },
                        }}
                      >
                        {owner.email}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Email nespecificat
                      </Typography>
                    )}
                  </Stack>
                </Stack>
              </Box>
            </DetailSection>

            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => navigate(`/properties/edit/${id}`)}
              sx={{
                textTransform: "none",
                fontWeight: 500,
                letterSpacing: 0.3,
                background: "linear-gradient(90deg, #38bdf8, #0ea5e9)",
                "&:hover": {
                  background: "linear-gradient(90deg, #0ea5e9, #0284c7)",
                },
              }}
            >
              Editeaza proprietatea
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}
