import {
  Apartment,
  ChevronLeft,
  ChevronRight,
  Close,
  Description,
  Download,
  Edit,
  Email,
  Euro,
  History,
  LocationOn,
  Person,
  Phone,
  PhotoLibrary,
  Wifi,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Modal,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getCustomChipStyle } from "@/common/utils/get-custom-chip-style.util";
import { getRoleColor } from "@/common/utils/get-role-color.util";
import PropertyMap from "@/components/PropertyMap/PropertyMap";
import { useOwnerByIdQuery } from "@/features/owners/ownersQueries";
import { usePropertyBySkuQuery } from "@/features/properties/propertiesQueries";
import { useUserByIdQuery, useUserQuery } from "@/features/users/usersQueries";
import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
import { AxiosError } from "axios";
import * as React from "react";

import { CharacteristicsEnumLabels } from "@/common/enums/property/characteristics.enums";
import { EGeneralDetailsEnumLabels, EStatus } from "@/common/enums/property/general-details.enums";
import { UtilitiesLabels } from "@/common/enums/property/utilities.enums";
import { IBuilding } from "@/common/interfaces/property/characteristics.interface";
import { formatBuildingLevels } from "@/common/utils/format-building-levels.util";
import { formatDateTime } from "@/common/utils/format-date-time.util";
import { formatPrice } from "@/common/utils/format-price.util";
import { useToast } from "@/context/ToastContext";

export const mapCharacteristicLabel = (
  group: keyof typeof CharacteristicsEnumLabels,
  value: string | null | undefined,
): string => {
  if (!value) return "N/A";

  const groupMap = CharacteristicsEnumLabels[group] as Record<string, string>;

  return groupMap[value] ?? value;
};

export const mapGeneralDetailsLabel = (
  group: keyof typeof EGeneralDetailsEnumLabels,
  value: string | null | undefined,
): string => {
  if (!value) return "N/A";

  const groupMap = EGeneralDetailsEnumLabels[group] as Record<string, string>;

  return groupMap[value] ?? value;
};

export type AmenityLabelGroups =
  | "EAmenityGeneral"
  | "EAmenityHeating"
  | "EAmenityConditioning"
  | "EAmenityInternet"
  | "EAmenityDoublePaneWindows"
  | "EAmenityInteriorCondition"
  | "EAmenityInteriorDoors"
  | "EAmenityEntranceDoor"
  | "EAmenityShutters"
  | "EAmenityBlind"
  | "EAmenityThermalInsulation"
  | "EAmenityFlooring"
  | "EAmenityWalls"
  | "EAmenityUtilitySpaces"
  | "EAmenityKitchen"
  | "EAmenityFurnished"
  | "EAmenityAppliances"
  | "EAmenityMeters"
  | "EAmenityMiscellaneous"
  | "EAmenityRealEstateFacilities"
  | "EAmenityRealEstateServices"
  | "EAmenityHotelServices"
  | "EAmenityStreetDevelopment"
  | "EAmenityFeatures"
  | "EAmenityAccess"
  | "EAmenityOtherCharacteristics";

const GalleryModal = ({
  open,
  onClose,
  images,
  startIndex = 0,
  title,
}: {
  open: boolean;
  onClose: () => void;
  images: string[];
  startIndex?: number;
  title: string;
}) => {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [loadedSrc, setLoadedSrc] = useState("");

  useEffect(() => {
    const src = images[currentIndex];
    setIsLoadingImage(true);

    const img = new Image();
    img.src = src;
    img.onload = () => {
      setLoadedSrc(src);
      setIsLoadingImage(false);
    };
  }, [currentIndex, images]);

  useEffect(() => {
    if (open) {
      setCurrentIndex(startIndex);
    }
  }, [open, startIndex]);

  if (!images || images.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
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
          bgcolor: theme.palette.background.paper,
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            bgcolor: "rgba(0,0,0,0.5)",
            color: "#fff",
            zIndex: 2,
            "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
          }}
        >
          <Close />
        </IconButton>

        <IconButton
          onClick={handlePrev}
          sx={{
            position: "absolute",
            left: 8,
            top: "50%",
            transform: "translateY(-50%)",
            bgcolor: "rgba(0,0,0,0.4)",
            color: "#fff",
            "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
            zIndex: 2,
          }}
        >
          <ChevronLeft />
        </IconButton>

        <IconButton
          onClick={handleNext}
          sx={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
            bgcolor: "rgba(0,0,0,0.4)",
            color: "#fff",
            "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
            zIndex: 2,
          }}
        >
          <ChevronRight />
        </IconButton>

        <Box
          sx={{
            width: "100%",
            height: "100%",
            maxHeight: "90vh",
            maxWidth: "90vw",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            key={currentIndex}
            src={loadedSrc}
            alt={`${title}-${currentIndex + 1}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              opacity: isLoadingImage ? 0 : 1,
              transition: "opacity 0.25s ease-in-out",
            }}
          />
        </Box>

        <Box
          sx={{
            position: "absolute",
            bottom: 8,
            left: "50%",
            transform: "translateX(-50%)",
            bgcolor: "rgba(0,0,0,0.6)",
            color: "#fff",
            px: 2,
            py: 0.5,
            borderRadius: 999,
            fontSize: 12,
          }}
        >
          {currentIndex + 1} / {images.length}
        </Box>
      </Box>
    </Modal>
  );
};

const DetailSection = ({
  title,
  children,
  icon,
}: {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const accent = theme.palette.primary.main;
  return (
    <Paper
      elevation={1}
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        boxShadow: isDark ? `0 0 14px ${accent}14` : `0 0 8px ${accent}0F`,
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        fontWeight="bold"
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        {icon}
        {title}
      </Typography>
      <Divider sx={{ mb: 2, borderColor: theme.palette.divider }} />
      {children}
    </Paper>
  );
};

const EnumChipList = ({ items }: { items: string[] }) => {
  const theme = useTheme();
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
      {items && items.length > 0 ? (
        items.map((item, i) => (
          <Chip
            key={i}
            label={item}
            size="small"
            variant="outlined"
            color="primary"
            sx={{
              borderColor: theme.palette.primary.main,
            }}
          />
        ))
      ) : (
        <Typography variant="body2" color="text.secondary">
          N/A
        </Typography>
      )}
    </Box>
  );
};

// =========
// ✅ READY
// =========
const PropertyDetail = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const accent = theme.palette.primary.main;

  const navigate = useNavigate();
  const toast = useToast();

  const { sku } = useParams<{ sku: string }>();
  const { data: propertyBySku, error: skuError } = usePropertyBySkuQuery(sku ?? "");

  const agentId = propertyBySku?.generalDetails?.agentId;
  const { data: agent, error: agentError } = useUserByIdQuery(agentId ?? "");

  const ownerId = propertyBySku?.generalDetails?.ownerID;
  const { data: owner, error: ownerError } = useOwnerByIdQuery(ownerId ?? "");

  const { data: currentUser } = useUserQuery();

  const canSeeDetails = () => {
    if (!currentUser || !agent) return false;
    const myRole = currentUser.role;
    const agentRole = agent.role;
    const agentId = agent._id;
    if (myRole === "CEO") return true;
    if (myRole === "MANAGER") {
      return agentRole !== "CEO";
    }
    if (myRole === "TEAM_LEAD") {
      return agentId === currentUser._id;
    }
    if (myRole === "AGENT") {
      return agentId === currentUser._id;
    }

    return false;
  };

  useEffect(() => {
    if (skuError) {
      toast("Proprietatea nu a fost gasita dupa SKU", "error");
      navigate("/properties");
    }
  }, [skuError]);

  useEffect(() => {
    if (agentError) {
      const axiosErr = agentError as AxiosError<{ message?: string }>;
      toast(axiosErr.response?.data?.message || "Eroare la incarcarea agentului", "error");
    }
  }, [agentError]);

  useEffect(() => {
    if (ownerError) {
      const axiosErr = ownerError as AxiosError<{ message?: string }>;
      toast(axiosErr.response?.data?.message || "Eroare la incarcarea proprietarului", "error");
    }
  }, [ownerError]);

  const { generalDetails, characteristics, utilities, price, description, images } =
    propertyBySku ?? {};

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
    { label: "Utilitati generale", data: utilities?.amenities_general },
    { label: "Sisteme incalzire", data: utilities?.amenities_heating },
    { label: "Climatizare", data: utilities?.amenities_conditioning },
    { label: "Internet", data: utilities?.amenities_internet },
    { label: "Geamuri / Termopan", data: utilities?.amenities_double_pane_windows },
    { label: "Stare interior", data: utilities?.amenities_interior_condition },
    { label: "Usi interioare", data: utilities?.amenities_interior_doors },
    { label: "Usa intrare", data: utilities?.amenities_entrance_door },
    { label: "Obloane", data: utilities?.amenities_shutters },
    { label: "Jaluzele", data: utilities?.amenities_blind },
    { label: "Izolatii", data: utilities?.amenities_thermal_insulation },
    { label: "Pardoseli", data: utilities?.amenities_flooring },
    { label: "Pereti", data: utilities?.amenities_walls },
    { label: "Spatii utilitare", data: utilities?.amenities_utility_spaces },
    { label: "Bucatarie", data: utilities?.amenities_kitchen },
    { label: "Mobila", data: utilities?.amenities_furnished },
    { label: "Electrocasnice", data: utilities?.amenities_appliances },
    { label: "Contorizare", data: utilities?.amenities_meters },
    { label: "Diverse / Securitate", data: utilities?.amenities_miscellaneous },
    { label: "Facilitati imobiliare", data: utilities?.amenities_real_estate_facilities },
    { label: "Servicii imobiliare", data: utilities?.amenities_real_estate_services },
    { label: "Servicii hotel", data: utilities?.amenities_hotel_services },
    { label: "Dezvoltare stradala", data: utilities?.amenities_street_development },
    { label: "Dotari speciale", data: utilities?.amenities_features },
    { label: "Acces", data: utilities?.amenities_access },
    { label: "Caracteristici speciale", data: utilities?.amenities_other_characteristics },
  ];

  const utilitiesLabelMap: Record<string, AmenityLabelGroups> = {
    "Utilitati generale": "EAmenityGeneral",
    "Sisteme incalzire": "EAmenityHeating",
    Climatizare: "EAmenityConditioning",
    Internet: "EAmenityInternet",
    "Geamuri / Termopan": "EAmenityDoublePaneWindows",
    "Stare interior": "EAmenityInteriorCondition",
    "Usi interioare": "EAmenityInteriorDoors",
    "Usa intrare": "EAmenityEntranceDoor",
    Obloane: "EAmenityShutters",
    Jaluzele: "EAmenityBlind",
    Izolatii: "EAmenityThermalInsulation",
    Pardoseli: "EAmenityFlooring",
    Pereti: "EAmenityWalls",
    "Spatii utilitare": "EAmenityUtilitySpaces",
    Bucatarie: "EAmenityKitchen",
    Mobila: "EAmenityFurnished",
    Electrocasnice: "EAmenityAppliances",
    Contorizare: "EAmenityMeters",
    "Diverse / Securitate": "EAmenityMiscellaneous",
    "Facilitati imobiliare": "EAmenityRealEstateFacilities",
    "Servicii imobiliare": "EAmenityRealEstateServices",
    "Servicii hotel": "EAmenityHotelServices",
    "Dezvoltare stradala": "EAmenityStreetDevelopment",
    "Dotari speciale": "EAmenityFeatures",
    Acces: "EAmenityAccess",
    "Caracteristici speciale": "EAmenityOtherCharacteristics",
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "calc(100vh - 32px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        py: 1,
      }}
    >
      <Container
        maxWidth="xl"
        disableGutters
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            flex: 1,
            p: 4,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
            color: theme.palette.text.primary,
            width: "100%",
            height: "100%",
            boxShadow: isDark ? `0 0 25px ${accent}22` : `0 0 15px ${accent}11`,
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Typography
              variant="h5"
              fontWeight={600}
              sx={{
                flex: 1,
                textAlign: "left",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {description?.title || "Proprietate fara titlu"}
            </Typography>

            <Button
              variant="outlined"
              color="info"
              startIcon={<History />}
              onClick={() => navigate(`/properties/${propertyBySku?._id}/logs`)}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                borderColor: theme.palette.info.main,
                color: theme.palette.info.main,
                whiteSpace: "nowrap",
                "&:hover": {
                  borderColor: theme.palette.info.dark,
                  backgroundColor: theme.palette.info.dark + "11",
                },
              }}
            >
              Vezi istoric modificari
            </Button>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <LocationOn sx={{ mr: 1 }} />
              {generalDetails?.location.zone} {generalDetails?.location.city}
              {generalDetails?.location.street && `, ${generalDetails.location.street}`}
              {generalDetails?.location.number && ` ${generalDetails.location.number}`}
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Chip
                label={`${formatPrice(price?.priceDetails?.price) + " €" || "N/A"}`}
                color="primary"
                variant="filled"
                sx={{
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  px: 2,
                  color: theme.palette.getContrastText(theme.palette.primary.main),
                }}
              />
              <Chip
                label={generalDetails?.status}
                sx={{
                  ...getCustomChipStyle(generalDetails?.status as EStatus),
                }}
                variant="filled"
              />
            </Stack>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, lg: 8 }}>
              <Stack spacing={3}>
                <DetailSection title="Galerie Proprietate" icon={<Apartment />}>
                  {images?.length ? (
                    <>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {images.length} fotografii disponibile
                      </Typography>

                      <Button
                        variant="outlined"
                        startIcon={<PhotoLibrary />}
                        onClick={() => {
                          setCurrentImageIndex(0);
                          setGalleryOpen(true);
                        }}
                        sx={{
                          textTransform: "none",
                          fontWeight: 600,
                          borderRadius: 2,
                        }}
                      >
                        Deschide galeria
                      </Button>
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
                        label="Status"
                        value={generalDetails?.status || "N/A"}
                        fullWidth
                        size="small"
                        slotProps={{ input: { readOnly: true } }}
                      />
                    </Grid>

                    <Grid size={{ xs: 6, md: 4 }}>
                      <TextField
                        label="Tip tranzactie"
                        value={generalDetails?.transactionType || "N/A"}
                        fullWidth
                        size="small"
                        slotProps={{ input: { readOnly: true } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                      <TextField
                        label="Categorie"
                        value={mapGeneralDetailsLabel("ECategory", generalDetails?.category)}
                        fullWidth
                        size="small"
                        slotProps={{ input: { readOnly: true } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                      <TextField
                        label="Numar Cadastral"
                        value={canSeeDetails() ? generalDetails?.cadastralNumber : "Confidential"}
                        fullWidth
                        size="small"
                        slotProps={{ input: { readOnly: true } }}
                      />
                    </Grid>
                  </Grid>
                </DetailSection>
                {canSeeDetails() && (
                  <DetailSection title="Locatie" icon={<LocationOn />}>
                    <Grid container spacing={2}>
                      {Object.entries(generalDetails?.location ?? {})
                        .filter(
                          ([key]) =>
                            ![
                              "_id",
                              "surroundings",
                              "interesPoints",
                              "latitude",
                              "longitude",
                            ].includes(key),
                        )
                        .map(([key, value]) => (
                          <Grid key={key} size={{ xs: 6, md: 4 }}>
                            <TextField
                              label={locationLabels[key] || key}
                              value={value || "N/A"}
                              fullWidth
                              size="small"
                              slotProps={{ input: { readOnly: true } }}
                            />
                          </Grid>
                        ))}
                    </Grid>
                  </DetailSection>
                )}

                <DetailSection title="Caracteristici" icon={<Apartment />}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Detalii generale
                      </Typography>
                    </Grid>

                    <Grid size={{ xs: 6, md: 4 }}>
                      <TextField
                        label="Camere"
                        value={characteristics?.details.rooms || "N/A"}
                        fullWidth
                        size="small"
                        slotProps={{ input: { readOnly: true } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                      <TextField
                        label="Dormitoare"
                        value={characteristics?.details.bedrooms || "N/A"}
                        fullWidth
                        size="small"
                        slotProps={{ input: { readOnly: true } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                      <TextField
                        label="Bai"
                        value={characteristics?.details.bathrooms || "N/A"}
                        fullWidth
                        size="small"
                        slotProps={{ input: { readOnly: true } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                      <TextField
                        label="Bucatarii"
                        value={characteristics?.details.kitchens || "N/A"}
                        fullWidth
                        size="small"
                        slotProps={{ input: { readOnly: true } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                      <TextField
                        label="Balcoane"
                        value={characteristics?.details.balconies || "N/A"}
                        fullWidth
                        size="small"
                        slotProps={{ input: { readOnly: true } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                      <TextField
                        label="Terase"
                        value={characteristics?.details.terraces || "N/A"}
                        fullWidth
                        size="small"
                        slotProps={{ input: { readOnly: true } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                      <TextField
                        label="Etaj"
                        value={characteristics?.details.floor || "N/A"}
                        fullWidth
                        size="small"
                        slotProps={{ input: { readOnly: true } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                      <TextField
                        label="An Constructie"
                        value={characteristics?.details.yearOfConstruction || "N/A"}
                        fullWidth
                        size="small"
                        slotProps={{ input: { readOnly: true } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                      <TextField
                        label="An Renovare"
                        value={characteristics?.details.yearOfRenovation || "N/A"}
                        fullWidth
                        size="small"
                        slotProps={{ input: { readOnly: true } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                      <TextField
                        label="Locuri Parcare"
                        value={characteristics?.details.parkingLots || "N/A"}
                        fullWidth
                        size="small"
                        slotProps={{ input: { readOnly: true } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                      <TextField
                        label="Garaje"
                        value={characteristics?.details.garages || "N/A"}
                        fullWidth
                        size="small"
                        slotProps={{ input: { readOnly: true } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                      <TextField
                        label="Bai cu Geam"
                        value={characteristics?.details.bathroomWindow ? "Da" : "Nu"}
                        fullWidth
                        size="small"
                        slotProps={{ input: { readOnly: true } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                      <TextField
                        label="Bucatarie Deschisa"
                        value={characteristics?.details.openKitchen ? "Da" : "Nu"}
                        fullWidth
                        size="small"
                        slotProps={{ input: { readOnly: true } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                      <TextField
                        label="Pet Friendly"
                        value={characteristics?.details.petFriendly ? "Da" : "Nu"}
                        fullWidth
                        size="small"
                        slotProps={{ input: { readOnly: true } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                      <TextField
                        label="Cheie la Agentie"
                        value={characteristics?.details.keyInAgency ? "Da" : "Nu"}
                        fullWidth
                        size="small"
                        slotProps={{ input: { readOnly: true } }}
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
                        value={characteristics?.areas.usableArea || "N/A"}
                        fullWidth
                        size="small"
                        slotProps={{
                          input: {
                            readOnly: true,
                            endAdornment: <InputAdornment position="end">m²</InputAdornment>,
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                      <TextField
                        label="Suprafata Construita"
                        value={characteristics?.areas.builtupArea || "N/A"}
                        fullWidth
                        size="small"
                        slotProps={{
                          input: {
                            readOnly: true,
                            endAdornment: <InputAdornment position="end">m²</InputAdornment>,
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                      <TextField
                        label="Suprafata Totala Utila"
                        value={characteristics?.areas.totalUsableArea || "N/A"}
                        fullWidth
                        size="small"
                        slotProps={{
                          input: {
                            readOnly: true,
                            endAdornment: <InputAdornment position="end">m²</InputAdornment>,
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                      <TextField
                        label="Suprafata Balcon"
                        value={characteristics?.areas.balconyArea || "N/A"}
                        fullWidth
                        size="small"
                        slotProps={{
                          input: {
                            readOnly: true,
                            endAdornment: <InputAdornment position="end">m²</InputAdornment>,
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                      <TextField
                        label="Suprafata Terasa"
                        value={characteristics?.areas.terraceArea || "N/A"}
                        fullWidth
                        size="small"
                        slotProps={{
                          input: {
                            readOnly: true,
                            endAdornment: <InputAdornment position="end">m²</InputAdornment>,
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                      <TextField
                        label="Suprafata Gradina"
                        value={characteristics?.areas.gardenArea || "N/A"}
                        fullWidth
                        size="small"
                        slotProps={{
                          input: {
                            readOnly: true,
                            endAdornment: <InputAdornment position="end">m²</InputAdornment>,
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
                        value={mapCharacteristicLabel(
                          "EConstructionStage",
                          characteristics?.building.constructionStage,
                        )}
                        fullWidth
                        size="small"
                        slotProps={{ input: { readOnly: true } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                      <TextField
                        label="Structura"
                        value={mapCharacteristicLabel(
                          "EBuildingStructure",
                          characteristics?.building.structure,
                        )}
                        fullWidth
                        size="small"
                        slotProps={{ input: { readOnly: true } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                      <TextField
                        label="Risc Seismic"
                        value={characteristics?.building.seismicRisk || "N/A"}
                        fullWidth
                        size="small"
                        slotProps={{ input: { readOnly: true } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                      <TextField
                        label="Regim inaltime"
                        value={formatBuildingLevels(characteristics?.building as IBuilding)}
                        fullWidth
                        size="small"
                        slotProps={{ input: { readOnly: true } }}
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
                        value={mapCharacteristicLabel(
                          "EEnergyCertificationClass",
                          characteristics?.energyPerformance.energyClass,
                        )}
                        fullWidth
                        size="small"
                        slotProps={{ input: { readOnly: true } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                      <TextField
                        label="Consum Anual Specific"
                        value={
                          characteristics?.energyPerformance.specificAnnualConsumption || "N/A"
                        }
                        fullWidth
                        size="small"
                        slotProps={{
                          input: {
                            readOnly: true,
                            endAdornment: <InputAdornment position="end">kWh/m²an</InputAdornment>,
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                      <TextField
                        label="Indice Emisii CO2"
                        value={
                          characteristics?.energyPerformance.co2EquivalentEmissionIndex || "N/A"
                        }
                        fullWidth
                        size="small"
                        slotProps={{
                          input: {
                            readOnly: true,
                            endAdornment: (
                              <InputAdornment position="end">kgCO2/m²an</InputAdornment>
                            ),
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                      <TextField
                        label="Consum din Surse Regenerabile"
                        value={
                          characteristics?.energyPerformance
                            .specificConsumptionFromRenewableSources || "N/A"
                        }
                        fullWidth
                        size="small"
                        slotProps={{
                          input: {
                            readOnly: true,
                            endAdornment: <InputAdornment position="end">kWh/m²an</InputAdornment>,
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
                        <EnumChipList
                          items={(data || []).map((item: any) => {
                            const enumKey = utilitiesLabelMap[label];
                            const group = UtilitiesLabels[enumKey] as Record<string, string>;
                            return group[item] ?? item;
                          })}
                        />
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
                        value={price?.priceDetails.pricePerMp || "N/A"}
                        fullWidth
                        size="small"
                        slotProps={{
                          input: {
                            readOnly: true,
                            endAdornment: <InputAdornment position="end">€/mp</InputAdornment>,
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                      <TextField
                        label="Pret garaj"
                        value={price?.priceDetails.garagePrice || "N/A"}
                        fullWidth
                        size="small"
                        slotProps={{
                          input: {
                            readOnly: true,
                            endAdornment: <InputAdornment position="end">€</InputAdornment>,
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                      <TextField
                        label="Pret parcare"
                        value={price?.priceDetails.parkingPrice || "N/A"}
                        fullWidth
                        size="small"
                        slotProps={{
                          input: {
                            readOnly: true,
                            endAdornment: <InputAdornment position="end">€</InputAdornment>,
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                      <TextField
                        label="TVA inclus"
                        value={price?.priceDetails.tva ? "Da" : "Nu"}
                        fullWidth
                        size="small"
                        slotProps={{ input: { readOnly: true } }}
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
                        value={price?.commissions.buyerCommissionValue || "N/A"}
                        fullWidth
                        size="small"
                        slotProps={{
                          input: {
                            readOnly: true,
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                      <TextField
                        label="Valoare comision cumparator"
                        value={price?.commissions.buyerCommission || "N/A"}
                        fullWidth
                        size="small"
                        slotProps={{ input: { readOnly: true } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                      <TextField
                        label="Comision proprietar"
                        value={price?.commissions.ownerCommissionValue || "N/A"}
                        fullWidth
                        size="small"
                        slotProps={{
                          input: {
                            readOnly: true,
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                      <TextField
                        label="Valoare comision proprietar"
                        value={price?.commissions.ownerCommissionValue || "N/A"}
                        fullWidth
                        size="small"
                        slotProps={{ input: { readOnly: true } }}
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
                        value={price?.contact.type || "N/A"}
                        fullWidth
                        size="small"
                        slotProps={{ input: { readOnly: true } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                      <TextField
                        label="Contract semnat"
                        value={price?.contact.signedContract || "N/A"}
                        fullWidth
                        size="small"
                        slotProps={{ input: { readOnly: true } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                      <TextField
                        label="Numar contract"
                        value={price?.contact.contractNumber || "N/A"}
                        fullWidth
                        size="small"
                        slotProps={{ input: { readOnly: true } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                      <TextField
                        label="Data semnarii"
                        value={
                          price?.contact.signDate
                            ? new Date(price?.contact.signDate).toLocaleDateString("ro-RO")
                            : "N/A"
                        }
                        fullWidth
                        size="small"
                        slotProps={{ input: { readOnly: true } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                      <TextField
                        label="Data expirarii"
                        value={
                          price?.contact.expirationDate
                            ? new Date(price?.contact.expirationDate).toLocaleDateString("ro-RO")
                            : "N/A"
                        }
                        fullWidth
                        size="small"
                        slotProps={{ input: { readOnly: true } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                      {typeof price?.contact.contractFile === "string" &&
                      price?.contact.contractFile ? (
                        <Button
                          variant="outlined"
                          color="primary"
                          startIcon={<Download />}
                          fullWidth
                          onClick={() =>
                            window.open(price?.contact.contractFile as string, "_blank")
                          }
                          sx={{
                            height: 40,
                            textTransform: "none",
                            justifyContent: "flex-start",
                            borderColor: theme.palette.primary.light,
                            "&:hover": {
                              borderColor: theme.palette.primary.main,
                            },
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
                          slotProps={{ input: { readOnly: true } }}
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
                      slotProps={{ input: { readOnly: true } }}
                    />
                    <TextField
                      label="Descriere"
                      value={description?.description || "Nicio descriere"}
                      fullWidth
                      multiline
                      rows={4}
                      slotProps={{ input: { readOnly: true } }}
                    />
                    <TextField
                      label="Disponibilitate"
                      value={formatDateTime(description?.disponibility as string)}
                      fullWidth
                      slotProps={{ input: { readOnly: true } }}
                    />
                    <TextField
                      label="Link video YouTube"
                      value={description?.videoYoutubeLink || "N/A"}
                      fullWidth
                      slotProps={{ input: { readOnly: true } }}
                    />
                    <TextField
                      label="Link tur virtual"
                      value={description?.virtualTour || "N/A"}
                      fullWidth
                      slotProps={{ input: { readOnly: true } }}
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
                      bgcolor: isDark ? theme.palette.background.paper : theme.palette.grey[50],
                      color: theme.palette.text.primary,
                      boxShadow: isDark ? `0 0 10px ${accent}22` : `0 0 8px ${accent}11`,
                    }}
                  >
                    <Avatar
                      src={agent?.profilePicture || undefined}
                      sx={{
                        width: 90,
                        height: 90,
                        border: `3px solid ${getRoleColor(agent?.role || "")}`,
                        bgcolor: blue[400],
                        boxShadow: `0 0 20px ${getRoleColor(agent?.role || "")}44`,
                        fontSize: "2rem",
                        fontWeight: "bold",
                        color: "#fff",
                      }}
                    >
                      {!agent?.profilePicture && (agent?.name?.charAt(0).toUpperCase() ?? "A")}
                    </Avatar>

                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {agent?.name ?? "Agent nespecificat"}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.primary.main,
                        fontWeight: 500,
                        letterSpacing: "0.5px",
                        textTransform: "capitalize",
                      }}
                    >
                      {agent?.role ?? "—"}
                    </Typography>

                    <Stack spacing={1.5} mt={2}>
                      {agent?.phone && (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Phone sx={{ color: accent, fontSize: 20 }} />
                          <Typography
                            variant="body2"
                            component="a"
                            href={`tel:${agent.phone}`}
                            sx={{
                              textDecoration: "none",
                              color: theme.palette.text.secondary,
                            }}
                          >
                            {agent.phone}
                          </Typography>
                        </Stack>
                      )}

                      {agent?.email && (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Email sx={{ color: accent, fontSize: 20 }} />
                          <Typography
                            variant="body2"
                            component="a"
                            href={`mailto:${agent.email}`}
                            sx={{
                              textDecoration: "none",
                              color: theme.palette.text.secondary,
                            }}
                          >
                            {agent.email}
                          </Typography>
                        </Stack>
                      )}
                    </Stack>
                  </Stack>
                </DetailSection>

                {canSeeDetails() && (
                  <DetailSection title="Proprietar" icon={<Person />}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: isDark ? theme.palette.background.paper : theme.palette.grey[50],
                        color: theme.palette.text.primary,
                        boxShadow: isDark ? `0 0 10px ${accent}22` : `0 0 8px ${accent}11`,
                        transition: "background-color 0.3s ease",
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        {owner
                          ? `${owner.surname ?? ""} ${owner.lastname ?? ""}`.trim() ||
                            "Nespecificat"
                          : "Nespecificat"}
                      </Typography>

                      <Stack spacing={2}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Phone sx={{ color: accent, fontSize: 20 }} />
                          {owner?.phone ? (
                            <Typography
                              variant="body2"
                              component="a"
                              href={`tel:${owner.phone}`}
                              sx={{
                                color: theme.palette.text.secondary,
                                textDecoration: "none",
                                "&:hover": { color: accent },
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
                          <Email sx={{ color: accent, fontSize: 20 }} />
                          {owner?.email ? (
                            <Typography
                              variant="body2"
                              component="a"
                              href={`mailto:${owner.email}`}
                              sx={{
                                color: theme.palette.text.secondary,
                                textDecoration: "none",
                                "&:hover": { color: accent },
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
                )}
                {canSeeDetails() && (
                  <DetailSection title="Harta" icon={<LocationOn />}>
                    <PropertyMap
                      lat={Number(generalDetails?.location.latitude)}
                      lng={Number(generalDetails?.location.longitude)}
                      apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                    />
                  </DetailSection>
                )}
                {canSeeDetails() && (
                  <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={() => navigate(`/properties/edit/${propertyBySku?._id}`)}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      bgcolor: theme.palette.primary.main,
                      color: theme.palette.getContrastText(theme.palette.primary.main),
                      "&:hover": { bgcolor: theme.palette.primary.dark },
                    }}
                  >
                    Editeaza proprietatea
                  </Button>
                )}
              </Stack>
            </Grid>
          </Grid>
          {images?.length ? (
            <GalleryModal
              open={galleryOpen}
              onClose={() => setGalleryOpen(false)}
              images={images}
              startIndex={currentImageIndex}
              title={description?.title || "Galerie proprietate"}
            />
          ) : null}
        </Paper>
      </Container>
    </Box>
  );
};

export default PropertyDetail;
