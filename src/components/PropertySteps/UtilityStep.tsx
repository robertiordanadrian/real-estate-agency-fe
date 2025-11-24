import {
  Box,
  Card,
  CardContent,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Typography,
  useTheme,
} from "@mui/material";

import type { IUtilities } from "@/common/interfaces/property/utilities.interface";
import {
  EAmenityGeneral,
  EAmenityHeating,
  EAmenityConditioning,
  EAmenityInternet,
  EAmenityDoublePaneWindows,
  EAmenityInteriorCondition,
  EAmenityInteriorDoors,
  EAmenityEntranceDoor,
  EAmenityShutters,
  EAmenityBlind,
  EAmenityThermalInsulation,
  EAmenityFlooring,
  EAmenityWalls,
  EAmenityUtilitySpaces,
  EAmenityKitchen,
  EAmenityFurnished,
  EAmenityMeters,
  EAmenityRealEstateFacilities,
  EAmenityAppliances,
  EAmenityMiscellaneous,
  EAmenityRealEstateServices,
  EAmenityHotelServices,
  EAmenityStreetDevelopment,
  EAmenityFeatures,
  EAmenityAccess,
  EAmenityOtherCharacteristics,
} from "@/common/enums/property/utilities.enums";

import { UtilitiesLabels } from "@/common/enums/property/utilities.enums";
import { getEnumLabel, getEnumOptions } from "@/common/utils/utilities-step.util";

interface UtilityStepProps {
  data: IUtilities;
  onChange: (_updated: IUtilities) => void;
}

// =========
// ✅ READY
// =========
const UtilityStep = ({ data, onChange }: UtilityStepProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const handleChange = <K extends keyof IUtilities>(key: K, value: string[]) => {
    onChange({ ...data, [key]: value });
  };

  const Multi = (
    label: string,
    groupKey: keyof typeof UtilitiesLabels,
    enumObj: Record<string, string>,
    field: keyof IUtilities,
    value: string[],
  ) => {
    const options = getEnumOptions(enumObj, UtilitiesLabels[groupKey]);

    return (
      <FormControl fullWidth>
        <InputLabel>{label}</InputLabel>

        <Select
          multiple
          value={value ?? []}
          input={<OutlinedInput label={label} />}
          onChange={(e) => handleChange(field, e.target.value as string[])}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((v) => (
                <Chip key={v} label={getEnumLabel(UtilitiesLabels[groupKey], v)} />
              ))}
            </Box>
          )}
        >
          {options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 3,
        background: isDark ? theme.palette.background.paper : theme.palette.background.default,
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Utilitati generale
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                {Multi(
                  "Utilitati generale",
                  "EAmenityGeneral",
                  EAmenityGeneral,
                  "amenities_general",
                  data.amenities_general ?? [],
                )}
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                {Multi(
                  "Sistem incalzire",
                  "EAmenityHeating",
                  EAmenityHeating,
                  "amenities_heating",
                  data.amenities_heating ?? [],
                )}
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                {Multi(
                  "Climatizare",
                  "EAmenityConditioning",
                  EAmenityConditioning,
                  "amenities_conditioning",
                  data.amenities_conditioning ?? [],
                )}
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                {Multi(
                  "Internet",
                  "EAmenityInternet",
                  EAmenityInternet,
                  "amenities_internet",
                  data.amenities_internet ?? [],
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Tamplarie / Usi
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                {Multi(
                  "Geamuri / Termopan",
                  "EAmenityDoublePaneWindows",
                  EAmenityDoublePaneWindows,
                  "amenities_double_pane_windows",
                  data.amenities_double_pane_windows ?? [],
                )}
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                {Multi(
                  "Stare interior",
                  "EAmenityInteriorCondition",
                  EAmenityInteriorCondition,
                  "amenities_interior_condition",
                  data.amenities_interior_condition ?? [],
                )}
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                {Multi(
                  "Usi interioare",
                  "EAmenityInteriorDoors",
                  EAmenityInteriorDoors,
                  "amenities_interior_doors",
                  data.amenities_interior_doors ?? [],
                )}
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                {Multi(
                  "Usa intrare",
                  "EAmenityEntranceDoor",
                  EAmenityEntranceDoor,
                  "amenities_entrance_door",
                  data.amenities_entrance_door ?? [],
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Finisaje
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                {Multi(
                  "Obloane",
                  "EAmenityShutters",
                  EAmenityShutters,
                  "amenities_shutters",
                  data.amenities_shutters ?? [],
                )}
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                {Multi(
                  "Jaluzele",
                  "EAmenityBlind",
                  EAmenityBlind,
                  "amenities_blind",
                  data.amenities_blind ?? [],
                )}
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                {Multi(
                  "Izolatii",
                  "EAmenityThermalInsulation",
                  EAmenityThermalInsulation,
                  "amenities_thermal_insulation",
                  data.amenities_thermal_insulation ?? [],
                )}
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                {Multi(
                  "Pardoseli",
                  "EAmenityFlooring",
                  EAmenityFlooring,
                  "amenities_flooring",
                  data.amenities_flooring ?? [],
                )}
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                {Multi(
                  "Pereti",
                  "EAmenityWalls",
                  EAmenityWalls,
                  "amenities_walls",
                  data.amenities_walls ?? [],
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Spatii utilitare
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                {Multi(
                  "Spatii utilitare",
                  "EAmenityUtilitySpaces",
                  EAmenityUtilitySpaces,
                  "amenities_utility_spaces",
                  data.amenities_utility_spaces ?? [],
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Echipamente
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                {Multi(
                  "Bucatarie",
                  "EAmenityKitchen",
                  EAmenityKitchen,
                  "amenities_kitchen",
                  data.amenities_kitchen ?? [],
                )}
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                {Multi(
                  "Mobilier",
                  "EAmenityFurnished",
                  EAmenityFurnished,
                  "amenities_furnished",
                  data.amenities_furnished ?? [],
                )}
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                {Multi(
                  "Electrocasnice",
                  "EAmenityAppliances",
                  EAmenityAppliances,
                  "amenities_appliances",
                  data.amenities_appliances ?? [],
                )}
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                {Multi(
                  "Contorizare",
                  "EAmenityMeters",
                  EAmenityMeters,
                  "amenities_meters",
                  data.amenities_meters ?? [],
                )}
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                {Multi(
                  "Diverse / Securitate",
                  "EAmenityMiscellaneous",
                  EAmenityMiscellaneous,
                  "amenities_miscellaneous",
                  data.amenities_miscellaneous ?? [],
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Facilitati imobiliare
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                {Multi(
                  "Facilitati",
                  "EAmenityRealEstateFacilities",
                  EAmenityRealEstateFacilities,
                  "amenities_real_estate_facilities",
                  data.amenities_real_estate_facilities ?? [],
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Servicii
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                {Multi(
                  "Servicii imobiliare",
                  "EAmenityRealEstateServices",
                  EAmenityRealEstateServices,
                  "amenities_real_estate_services",
                  data.amenities_real_estate_services ?? [],
                )}
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                {Multi(
                  "Servicii hotel",
                  "EAmenityHotelServices",
                  EAmenityHotelServices,
                  "amenities_hotel_services",
                  data.amenities_hotel_services ?? [],
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Infrastructura
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                {Multi(
                  "Dezvoltare stradala",
                  "EAmenityStreetDevelopment",
                  EAmenityStreetDevelopment,
                  "amenities_street_development",
                  data.amenities_street_development ?? [],
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Acces
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                {Multi(
                  "Acces",
                  "EAmenityAccess",
                  EAmenityAccess,
                  "amenities_access",
                  data.amenities_access ?? [],
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Caracteristici speciale
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                {Multi(
                  "Caracteristici",
                  "EAmenityOtherCharacteristics",
                  EAmenityOtherCharacteristics,
                  "amenities_other_characteristics",
                  data.amenities_other_characteristics ?? [],
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Dotari speciale / Caracteristici tehnice
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                {Multi(
                  "Dotari speciale",
                  "EAmenityFeatures",
                  EAmenityFeatures,
                  "amenities_features",
                  data.amenities_features ?? [],
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Paper>
  );
};

export default UtilityStep;
