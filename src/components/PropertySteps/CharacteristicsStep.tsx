import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormControlLabel,
  Switch,
  InputAdornment,
  Grid,
  useTheme,
  Paper,
} from "@mui/material";
import {
  EBuildingSeismicRisk,
  EBuildingStructure,
  EBuildingType,
  EConstructionStage,
  EDestination,
  EEnergyClass,
} from "../../common/enums/characteristics.enums";
import type {
  ICharacteristics,
  IDetails,
  IAreas,
} from "../../common/interfaces/characteristics.interface";

interface CharacteristicsStepProps {
  data: ICharacteristics;
  onChange: (updated: ICharacteristics) => void;
}

export const CharacteristicsStep: React.FC<CharacteristicsStepProps> = ({
  data,
  onChange,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const handleDetailsChange = (key: keyof IDetails, value: any) => {
    onChange({
      ...data,
      details: { ...data.details, [key]: value },
    });
  };

  const handleAreasChange = (key: keyof IAreas, value: string) => {
    onChange({
      ...data,
      areas: { ...data.areas, [key]: value },
    });
  };

  const handleBuildingChange = (
    key: keyof ICharacteristics["building"],
    value: any
  ) => {
    onChange({
      ...data,
      building: { ...data.building, [key]: value },
    });
  };

  const handleEnergyChange = (
    key: keyof ICharacteristics["energyPerformance"],
    value: any
  ) => {
    onChange({
      ...data,
      energyPerformance: { ...data.energyPerformance, [key]: value },
    });
  };

  const detailFields = [
    { label: "Etaj", key: "floor" },
    { label: "Camere", key: "rooms" },
    { label: "Bucatarii", key: "kitchens" },
    { label: "Dormitoare", key: "bedrooms" },
    { label: "Bai", key: "bathrooms" },
    { label: "Balcoane", key: "balconies" },
    { label: "Terase", key: "terraces" },
    { label: "Parcari", key: "parkingLots" },
    { label: "Garaje", key: "garages" },
    { label: "An constructie", key: "yearOfConstruction" },
    { label: "An renovare", key: "yearOfRenovation" },
    { label: "Orientare", key: "orientation" },
  ];

  const areaFields = [
    { label: "Suprafata utila", key: "usableArea" as keyof IAreas },
    { label: "Suprafata construita", key: "builtupArea" as keyof IAreas },
    { label: "Suprafata utila totala", key: "totalUsableArea" as keyof IAreas },
    { label: "Suprafata balcoane", key: "balconyArea" as keyof IAreas },
    { label: "Suprafata terase", key: "terraceArea" as keyof IAreas },
    { label: "Suprafata teren", key: "gardenArea" as keyof IAreas },
  ];

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
              Detalii
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  label="Tip proprietate"
                  value={data.details.type}
                  onChange={(e) => handleDetailsChange("type", e.target.value)}
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>Destinatie</InputLabel>
                  <Select
                    value={data.details.destination}
                    label="Destinatie"
                    onChange={(e) =>
                      handleDetailsChange("destination", e.target.value)
                    }
                  >
                    {Object.values(EDestination).map((val) => (
                      <MenuItem key={val} value={val}>
                        {val}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {detailFields.map((field) => (
                <Grid key={field.key} size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField
                    label={field.label}
                    value={data.details[field.key as keyof IDetails] as string}
                    onChange={(e) =>
                      handleDetailsChange(
                        field.key as keyof IDetails,
                        e.target.value
                      )
                    }
                    fullWidth
                  />
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={data.details.openKitchen}
                      onChange={(e) =>
                        handleDetailsChange("openKitchen", e.target.checked)
                      }
                    />
                  }
                  label="Bucatarie deschisa"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={data.details.bathroomWindow}
                      onChange={(e) =>
                        handleDetailsChange("bathroomWindow", e.target.checked)
                      }
                    />
                  }
                  label="Geam la baie"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={data.details.petFriendly}
                      onChange={(e) =>
                        handleDetailsChange("petFriendly", e.target.checked)
                      }
                    />
                  }
                  label="Pet friendly"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={data.details.keyInAgency}
                      onChange={(e) =>
                        handleDetailsChange("keyInAgency", e.target.checked)
                      }
                    />
                  }
                  label="Cheia in agentie"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" mb={2} fontWeight={600}>
              Suprafete
            </Typography>

            <Grid container spacing={2}>
              {areaFields.map((field) => (
                <Grid key={field.key} size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField
                    label={field.label}
                    value={data.areas[field.key]}
                    onChange={(e) =>
                      handleAreasChange(field.key, e.target.value)
                    }
                    fullWidth
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">m²</InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" mb={2} fontWeight={600}>
              Cladire
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>Stadiu constructie</InputLabel>
                  <Select
                    value={data.building.constructionStage}
                    label="Stadiu constructie"
                    onChange={(e) =>
                      handleBuildingChange("constructionStage", e.target.value)
                    }
                  >
                    {Object.values(EConstructionStage).map((val) => (
                      <MenuItem key={val} value={val}>
                        {val}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>Tip cladire</InputLabel>
                  <Select
                    value={data.building.type}
                    label="Tip cladire"
                    onChange={(e) =>
                      handleBuildingChange("type", e.target.value)
                    }
                  >
                    {Object.values(EBuildingType).map((val) => (
                      <MenuItem key={val} value={val}>
                        {val}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>Structura</InputLabel>
                  <Select
                    value={data.building.structure}
                    label="Structura"
                    onChange={(e) =>
                      handleBuildingChange("structure", e.target.value)
                    }
                  >
                    {Object.values(EBuildingStructure).map((val) => (
                      <MenuItem key={val} value={val}>
                        {val}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>Risc seismic</InputLabel>
                  <Select
                    value={data.building.seismicRisk}
                    label="Risc seismic"
                    onChange={(e) =>
                      handleBuildingChange("seismicRisk", e.target.value)
                    }
                  >
                    {Object.values(EBuildingSeismicRisk).map((val) => (
                      <MenuItem key={val} value={val}>
                        {val}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  label="Inaltime cladire"
                  value={data.building.height}
                  onChange={(e) =>
                    handleBuildingChange("height", e.target.value)
                  }
                  fullWidth
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" mb={2} fontWeight={600}>
              Performanta energetica
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>Clasa energetica</InputLabel>
                  <Select
                    value={data.energyPerformance.energyClass}
                    label="Clasa energetica"
                    onChange={(e) =>
                      handleEnergyChange("energyClass", e.target.value)
                    }
                  >
                    {Object.values(EEnergyClass).map((val) => (
                      <MenuItem key={val} value={val}>
                        {val}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  label="Consum anual specific"
                  value={data.energyPerformance.specificAnnualConsumption}
                  onChange={(e) =>
                    handleEnergyChange(
                      "specificAnnualConsumption",
                      e.target.value
                    )
                  }
                  fullWidth
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">kWh/m²an</InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  label="Indice emisii CO₂"
                  value={data.energyPerformance.co2EquivalentEmissionIndex}
                  onChange={(e) =>
                    handleEnergyChange(
                      "co2EquivalentEmissionIndex",
                      e.target.value
                    )
                  }
                  fullWidth
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          kgCO₂/m²an
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  label="Consum surse regenerabile"
                  value={
                    data.energyPerformance
                      .specificConsumptionFromRenewableSources
                  }
                  onChange={(e) =>
                    handleEnergyChange(
                      "specificConsumptionFromRenewableSources",
                      e.target.value
                    )
                  }
                  fullWidth
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">kWh/m²an</InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Paper>
  );
};
