import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
  Grid,
  Paper,
  useTheme,
} from "@mui/material";
import type { IUtilities } from "../../common/interfaces/utilities.interface";
import {
  EAirConditioning,
  EFinishesFlooring,
  EFinishesInsulation,
  EFinishesInteriorDoors,
  EFinishesLouver,
  EFinishesStatus,
  EFinishesWalls,
  EFinishesWindows,
  EFinishesEnteringDoor,
  EGeneral,
  EIrigationSystem,
  EFurnished,
  EKitchen,
  EAppliances,
  EImmobile,
  ERecreationalSpaces,
  EExterior,
  EAccounting,
  EAdditionalSpaces,
} from "../../common/enums/utilities.enums";

interface UtilityStepProps {
  data: IUtilities;
  onChange: (updated: IUtilities) => void;
}

const UtilityStep = ({ data, onChange }: UtilityStepProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const handleChangeArray = <K extends keyof IUtilities>(
    key: K,
    value: string[]
  ) => {
    onChange({ ...data, [key]: value as any });
  };

  const handleNestedChange = <
    K extends keyof IUtilities,
    N extends keyof IUtilities[K]
  >(
    key: K,
    nestedKey: N,
    value: string[]
  ) => {
    onChange({
      ...data,
      [key]: {
        ...data[key],
        [nestedKey]: value,
      },
    });
  };

  const renderMultiSelect = (
    label: string,
    options: string[],
    value: string[],
    onChange: (value: string[]) => void
  ) => (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        multiple
        value={value}
        onChange={(e) => onChange(e.target.value as string[])}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((val) => (
              <Chip key={val} label={val} />
            ))}
          </Box>
        )}
      >
        {options.map((opt) => (
          <MenuItem key={opt} value={opt}>
            {opt}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 3,
        background: isDark
          ? theme.palette.background.paper
          : theme.palette.background.default,
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" mb={2} fontWeight={600}>
              Utilitati generale
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                {renderMultiSelect(
                  "Utilitati generale",
                  Object.values(EGeneral),
                  data.generals,
                  (v) => handleChangeArray("generals", v)
                )}
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                {renderMultiSelect(
                  "Sistem de incalzire",
                  Object.values(EIrigationSystem),
                  data.irigationSystem,
                  (v) => handleChangeArray("irigationSystem", v)
                )}
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                {renderMultiSelect(
                  "Aer conditionat",
                  Object.values(EAirConditioning),
                  data.airConditioning,
                  (v) => handleChangeArray("airConditioning", v)
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" mb={2} fontWeight={600}>
              Finisaje
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                {renderMultiSelect(
                  "Stadiu finisaje",
                  Object.values(EFinishesStatus),
                  data.finishes.status,
                  (v) => handleNestedChange("finishes", "status", v)
                )}
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                {renderMultiSelect(
                  "Izolatii",
                  Object.values(EFinishesInsulation),
                  data.finishes.insulation,
                  (v) => handleNestedChange("finishes", "insulation", v)
                )}
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                {renderMultiSelect(
                  "Pereti",
                  Object.values(EFinishesWalls),
                  data.finishes.walls,
                  (v) => handleNestedChange("finishes", "walls", v)
                )}
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                {renderMultiSelect(
                  "Pardoseli",
                  Object.values(EFinishesFlooring),
                  data.finishes.flooring,
                  (v) => handleNestedChange("finishes", "flooring", v)
                )}
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                {renderMultiSelect(
                  "Ferestre",
                  Object.values(EFinishesWindows),
                  data.finishes.windows,
                  (v) => handleNestedChange("finishes", "windows", v)
                )}
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                {renderMultiSelect(
                  "Obloane",
                  Object.values(EFinishesLouver),
                  data.finishes.louver,
                  (v) => handleNestedChange("finishes", "louver", v)
                )}
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                {renderMultiSelect(
                  "Usi intrare",
                  Object.values(EFinishesEnteringDoor),
                  data.finishes.enteringDoor,
                  (v) => handleNestedChange("finishes", "enteringDoor", v)
                )}
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                {renderMultiSelect(
                  "Usi interioare",
                  Object.values(EFinishesInteriorDoors),
                  data.finishes.interiorDoors,
                  (v) => handleNestedChange("finishes", "interiorDoors", v)
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" mb={2} fontWeight={600}>
              Echipamente
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                {renderMultiSelect(
                  "Mobilier",
                  Object.values(EFurnished),
                  data.equipment.furnished,
                  (v) => handleNestedChange("equipment", "furnished", v)
                )}
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                {renderMultiSelect(
                  "Spatii aditionale",
                  Object.values(EAdditionalSpaces),
                  data.equipment.additionalSpaces,
                  (v) => handleNestedChange("equipment", "additionalSpaces", v)
                )}
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                {renderMultiSelect(
                  "Bucatarie",
                  Object.values(EKitchen),
                  data.equipment.kitchen,
                  (v) => handleNestedChange("equipment", "kitchen", v)
                )}
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                {renderMultiSelect(
                  "Aparate electrocasnice",
                  Object.values(EAppliances),
                  data.equipment.appliances,
                  (v) => handleNestedChange("equipment", "appliances", v)
                )}
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                {renderMultiSelect(
                  "Imobile incluse",
                  Object.values(EImmobile),
                  data.equipment.immobile,
                  (v) => handleNestedChange("equipment", "immobile", v)
                )}
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                {renderMultiSelect(
                  "Spatii recreative",
                  Object.values(ERecreationalSpaces),
                  data.equipment.recreationalSpaces,
                  (v) =>
                    handleNestedChange("equipment", "recreationalSpaces", v)
                )}
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                {renderMultiSelect(
                  "Exterior",
                  Object.values(EExterior),
                  data.equipment.exterior,
                  (v) => handleNestedChange("equipment", "exterior", v)
                )}
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                {renderMultiSelect(
                  "Contorizare",
                  Object.values(EAccounting),
                  data.equipment.accounting,
                  (v) => handleNestedChange("equipment", "accounting", v)
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
