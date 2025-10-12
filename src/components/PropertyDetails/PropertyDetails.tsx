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
  Tour,
  Euro,
  Assignment,
  Close,
  ZoomIn,
  Edit,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { EStatus, EType } from "../../common/enums/general-details.enums";
import { usePropertyQuery } from "../../features/properties/propertiesQueries";

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

  const { data: property, isLoading, isError } = usePropertyQuery(id!);

  if (isLoading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <Typography variant="h6">Se încarcă...</Typography>
      </Box>
    );
  if (isError || !property)
    return (
      <Container>
        <Typography variant="h4">Proprietate negăsită</Typography>
      </Container>
    );

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
  const modificationLogsArray = Array.isArray(modificationLogs)
    ? modificationLogs
    : modificationLogs
    ? [modificationLogs]
    : [];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          {description?.title || "Proprietate fără titlu"}
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
                    {images.length} fotografii • Click pentru a mări
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
                  Nicio imagine disponibilă.
                </Typography>
              )}
            </DetailSection>

            <DetailSection title="Descriere Proprietate" icon={<Description />}>
              <Stack spacing={2}>
                <TextField
                  label="Titlu"
                  value={description?.title || "N/A"}
                  fullWidth
                  size="medium"
                  InputProps={{ readOnly: true }}
                />
                <TextField
                  label="Descriere"
                  value={description?.description || "Nicio descriere"}
                  fullWidth
                  multiline
                  rows={4}
                  InputProps={{ readOnly: true }}
                />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      label="Disponibilitate"
                      value={description?.disponibility || "N/A"}
                      fullWidth
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      label="Link video YouTube"
                      value={
                        description?.videoYoutubeLink &&
                        description.videoYoutubeLink !== "Nimic momentan"
                          ? "Disponibil"
                          : "Indisponibil"
                      }
                      fullWidth
                      InputProps={{ readOnly: true }}
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

            {/* Locație */}
            <DetailSection title="Detalii Locație" icon={<LocationOn />}>
              <Grid container spacing={2}>
                {Object.entries(generalDetails.location)
                  .filter(
                    ([k]) => !["surroundings", "interesPoints"].includes(k)
                  )
                  .map(([key, value]) => (
                    <Grid key={key} size={{ xs: 6, md: 4 }}>
                      <TextField
                        label={key}
                        value={value || "N/A"}
                        fullWidth
                        size="small"
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                  ))}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Puncte de interes
                  </Typography>
                  <Typography variant="body2">
                    {generalDetails.location.interesPoints || "Nespecificate"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Împrejurimi
                  </Typography>
                  <EnumChipList
                    items={generalDetails.location.surroundings || []}
                  />
                </Grid>
              </Grid>
            </DetailSection>

            {/* Utilități */}
            <DetailSection title="Utilități și Echipamente" icon={<Wifi />}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2">
                    Utilități generale
                  </Typography>
                  <EnumChipList items={utilities.generals || []} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2">Aer condiționat</Typography>
                  <EnumChipList items={utilities.airConditioning || []} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2">Mobilat</Typography>
                  <EnumChipList items={utilities.equipment.furnished || []} />
                </Grid>
              </Grid>
            </DetailSection>

            {/* Pret */}
            <DetailSection title="Detalii Preț și Comisioane" icon={<Euro />}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Preț"
                    value={price.priceDetails.price || "N/A"}
                    fullWidth
                    size="small"
                    InputProps={{
                      readOnly: true,
                      endAdornment: (
                        <InputAdornment position="end">€</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Preț/mp"
                    value={price.priceDetails.pricePerMp || "N/A"}
                    fullWidth
                    size="small"
                    InputProps={{
                      readOnly: true,
                      endAdornment: (
                        <InputAdornment position="end">€/mp</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    label="Monedă"
                    value={price.priceDetails.currency || "N/A"}
                    fullWidth
                    size="small"
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
              </Grid>
            </DetailSection>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack spacing={3}>
            <DetailSection title="Rezumat Proprietate" icon={<Apartment />}>
              <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary">
                  Agent: {generalDetails.agent}
                </Typography>
                <Typography variant="body2">
                  Status:{" "}
                  <Chip
                    label={generalDetails.status}
                    size="small"
                    color={getStatusColor(generalDetails.status)}
                  />
                </Typography>
                <Typography variant="body2">
                  {characteristics.details.rooms} camere •{" "}
                  {characteristics.areas.totalUsableArea} m²
                </Typography>
              </Stack>
            </DetailSection>

            <DetailSection title="Agent" icon={<Person />}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ width: 56, height: 56 }}>
                  {generalDetails.agent?.charAt(0) || "A"}
                </Avatar>
                <Box>
                  <Typography variant="body1" fontWeight="bold">
                    {generalDetails.agent || "Neatribuit"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Agent imobiliar
                  </Typography>
                </Box>
              </Stack>
            </DetailSection>

            {publish && (
              <DetailSection title="Publicare" icon={<Assignment />}>
                <Stack spacing={1}>
                  <Typography variant="body2">
                    Arată locația exactă:{" "}
                    <Chip
                      label={publish.showExactlyLocation ? "Da" : "Nu"}
                      size="small"
                      color={
                        publish.showExactlyLocation ? "success" : "default"
                      }
                    />
                  </Typography>
                  <Typography variant="body2">
                    Arată comision standard:{" "}
                    <Chip
                      label={publish.showStandardCommission ? "Da" : "Nu"}
                      size="small"
                      color={
                        publish.showStandardCommission ? "success" : "default"
                      }
                    />
                  </Typography>
                </Stack>
              </DetailSection>
            )}

            {modificationLogsArray.length > 0 && (
              <DetailSection title="Istoric Modificări" icon={<Assignment />}>
                <Stack spacing={1}>
                  <Typography variant="body2">
                    Ultima modificare:{" "}
                    {new Date(modificationLogsArray[0].date).toLocaleDateString(
                      "ro-RO"
                    )}
                  </Typography>
                  <Typography variant="body2">
                    Agent: {modificationLogsArray[0].agentID}
                  </Typography>
                </Stack>
              </DetailSection>
            )}

            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => navigate(`/properties/edit/${id}`)}
            >
              Editează proprietatea
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}
