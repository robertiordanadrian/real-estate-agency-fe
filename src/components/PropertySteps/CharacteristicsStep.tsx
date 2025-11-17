import {
  Box,
  Card,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";

import {
  CharacteristicsEnumLabels,
  EBuildingSeismicRisk,
  EBuildingStructure,
  EBuildingType,
  EConstructionStage,
  EEnergyCertificationClass,
} from "@/common/enums/property/characteristics.enums";
import type {
  IAreas,
  ICharacteristics,
} from "@/common/interfaces/property/characteristics.interface";
import { forwardRef, useImperativeHandle, useState } from "react";
import { getEnumOptions } from "@/common/utils/utilities-step.util";

const generateNumberRange = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i);

const YEARS = generateNumberRange(1850, new Date().getFullYear());
const ROOMS_1_20 = generateNumberRange(1, 20);
const KITCHENS_1_5 = generateNumberRange(1, 5);
const FLOORS = ["Parter", ...generateNumberRange(1, 40).map((n) => n.toString())];

const areaFields = [
  { label: "Suprafata utila", key: "usableArea" as keyof IAreas },
  { label: "Suprafata construita", key: "builtupArea" as keyof IAreas },
  { label: "Suprafata utila totala", key: "totalUsableArea" as keyof IAreas },
  { label: "Suprafata balcoane", key: "balconyArea" as keyof IAreas },
  { label: "Suprafata terase", key: "terraceArea" as keyof IAreas },
  { label: "Suprafata teren", key: "gardenArea" as keyof IAreas },
];

const isAreaErrorKey = (key: keyof IAreas): key is keyof CharacteristicsErrors["areas"] => {
  return ["usableArea", "builtupArea", "gardenArea"].includes(key);
};

interface CharacteristicsStepProps {
  data: ICharacteristics;
  onChange: (updated: ICharacteristics | ((prev: ICharacteristics) => ICharacteristics)) => void;
  characteristicsStepTouched: boolean;
}

export interface CharacteristicsSteppRef {
  validate: () => boolean;
}

type CharacteristicsErrors = {
  details: {
    rooms?: boolean;
    bedrooms?: boolean;
    kitchens?: boolean;
    bathrooms?: boolean;
    yearOfConstruction?: boolean;
    yearOfRenovation?: boolean;
  };
  areas: {
    usableArea?: boolean;
    builtupArea?: boolean;
    gardenArea?: boolean;
  };
  building: {
    constructionStage?: boolean;
    type?: boolean;
    structure?: boolean;
  };
};

type NestedKey<S extends keyof CharacteristicsErrors> = {
  section: S;
  field: keyof CharacteristicsErrors[S];
};

const CharacteristicsStep = forwardRef<CharacteristicsSteppRef, CharacteristicsStepProps>(
  ({ data, onChange, characteristicsStepTouched }, ref) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const [characteristicsErrors, setCharacteristicsErrors] = useState<CharacteristicsErrors>({
      details: {},
      areas: {},
      building: {},
    });

    const validateCharacteristics = () => {
      const newErrors: CharacteristicsErrors = { details: {}, areas: {}, building: {} };

      if (!data.details.rooms) newErrors.details.rooms = true;
      if (!data.details.bedrooms) newErrors.details.bedrooms = true;
      if (!data.details.kitchens) newErrors.details.kitchens = true;
      if (!data.details.bathrooms) newErrors.details.bathrooms = true;
      if (!data.details.yearOfConstruction) newErrors.details.yearOfConstruction = true;
      if (!data.details.yearOfRenovation) newErrors.details.yearOfRenovation = true;

      if (!data.areas.usableArea) newErrors.areas.usableArea = true;
      if (!data.areas.builtupArea) newErrors.areas.builtupArea = true;
      if (!data.areas.gardenArea) newErrors.areas.gardenArea = true;

      if (!data.building.constructionStage) newErrors.building.constructionStage = true;
      if (!data.building.type) newErrors.building.type = true;
      if (!data.building.structure) newErrors.building.structure = true;

      setCharacteristicsErrors(newErrors);

      const hasErrors =
        Object.values(newErrors.details).some(Boolean) ||
        Object.values(newErrors.areas).some(Boolean) ||
        Object.values(newErrors.building).some(Boolean);

      return !hasErrors;
    };

    const clearError = <S extends keyof CharacteristicsErrors>({
      section,
      field,
    }: NestedKey<S>) => {
      setCharacteristicsErrors((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: undefined,
        },
      }));
    };

    useImperativeHandle(
      ref,
      () => ({
        validate: validateCharacteristics,
      }),
      [validateCharacteristics],
    );

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
              <Typography variant="h6" mb={2} fontWeight={600}>
                Detalii
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <FormControl fullWidth>
                    <InputLabel>Etaj</InputLabel>
                    <Select
                      value={data.details.floor ?? ""}
                      label="Etaj"
                      onChange={(e) => {
                        onChange((prev) => ({
                          ...prev,
                          details: { ...prev.details, floor: e.target.value },
                        }));
                      }}
                    >
                      {FLOORS.map((etaj) => (
                        <MenuItem key={etaj} value={etaj}>
                          {etaj}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <FormControl
                    fullWidth
                    error={characteristicsStepTouched && !!characteristicsErrors.details.rooms}
                    required
                  >
                    <InputLabel>Camere</InputLabel>
                    <Select
                      value={data.details.rooms ?? ""}
                      label="Camere"
                      onChange={(e) => {
                        clearError({ section: "details", field: "rooms" });
                        onChange((prev) => ({
                          ...prev,
                          details: { ...prev.details, rooms: e.target.value },
                        }));
                      }}
                    >
                      {ROOMS_1_20.map((nr) => (
                        <MenuItem key={nr} value={nr}>
                          {nr}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <FormControl
                    fullWidth
                    error={characteristicsStepTouched && !!characteristicsErrors.details.kitchens}
                    required
                  >
                    <InputLabel>Bucatarii</InputLabel>
                    <Select
                      value={data.details.kitchens ?? ""}
                      label="Bucatarii"
                      onChange={(e) => {
                        clearError({ section: "details", field: "kitchens" });
                        onChange((prev) => ({
                          ...prev,
                          details: { ...prev.details, kitchens: e.target.value },
                        }));
                      }}
                    >
                      {KITCHENS_1_5.map((nr) => (
                        <MenuItem key={nr} value={nr}>
                          {nr}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <FormControl
                    fullWidth
                    error={characteristicsStepTouched && !!characteristicsErrors.details.bedrooms}
                    required
                  >
                    <InputLabel>Dormitoare</InputLabel>
                    <Select
                      value={data.details.bedrooms ?? ""}
                      label="Dormitoare"
                      onChange={(e) => {
                        clearError({ section: "details", field: "bedrooms" });
                        onChange((prev) => ({
                          ...prev,
                          details: { ...prev.details, bedrooms: e.target.value },
                        }));
                      }}
                    >
                      {ROOMS_1_20.map((nr) => (
                        <MenuItem key={nr} value={nr}>
                          {nr}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <FormControl
                    fullWidth
                    error={characteristicsStepTouched && !!characteristicsErrors.details.bathrooms}
                    required
                  >
                    <InputLabel>Bai</InputLabel>
                    <Select
                      value={data.details.bathrooms ?? ""}
                      label="Bai"
                      onChange={(e) => {
                        clearError({ section: "details", field: "bathrooms" });
                        onChange((prev) => ({
                          ...prev,
                          details: { ...prev.details, bathrooms: e.target.value },
                        }));
                      }}
                    >
                      {ROOMS_1_20.map((nr) => (
                        <MenuItem key={nr} value={nr}>
                          {nr}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <FormControl fullWidth>
                    <InputLabel>Balcoane</InputLabel>
                    <Select
                      value={data.details.balconies ?? ""}
                      label="Balcoane"
                      onChange={(e) => {
                        onChange((prev) => ({
                          ...prev,
                          details: { ...prev.details, balconies: e.target.value },
                        }));
                      }}
                    >
                      {ROOMS_1_20.map((nr) => (
                        <MenuItem key={nr} value={nr}>
                          {nr}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <FormControl fullWidth>
                    <InputLabel>Terase</InputLabel>
                    <Select
                      value={data.details.terraces ?? ""}
                      label="Terase"
                      onChange={(e) => {
                        onChange((prev) => ({
                          ...prev,
                          details: { ...prev.details, terraces: e.target.value },
                        }));
                      }}
                    >
                      {ROOMS_1_20.map((nr) => (
                        <MenuItem key={nr} value={nr}>
                          {nr}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <FormControl fullWidth>
                    <InputLabel>Parcari</InputLabel>
                    <Select
                      value={data.details.parkingLots ?? ""}
                      label="Parcari"
                      onChange={(e) => {
                        onChange((prev) => ({
                          ...prev,
                          details: { ...prev.details, parkingLots: e.target.value },
                        }));
                      }}
                    >
                      {ROOMS_1_20.map((nr) => (
                        <MenuItem key={nr} value={nr}>
                          {nr}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <FormControl fullWidth>
                    <InputLabel>Garaje</InputLabel>
                    <Select
                      value={data.details.garages ?? ""}
                      label="Garaje"
                      onChange={(e) => {
                        onChange((prev) => ({
                          ...prev,
                          details: { ...prev.details, garages: e.target.value },
                        }));
                      }}
                    >
                      {ROOMS_1_20.map((nr) => (
                        <MenuItem key={nr} value={nr}>
                          {nr}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <FormControl
                    fullWidth
                    error={
                      characteristicsStepTouched &&
                      !!characteristicsErrors.details.yearOfConstruction
                    }
                    required
                  >
                    <InputLabel>An constructie</InputLabel>
                    <Select
                      value={data.details.yearOfConstruction ?? ""}
                      label="An constructie"
                      onChange={(e) => {
                        clearError({ section: "details", field: "yearOfConstruction" });
                        onChange((prev) => ({
                          ...prev,
                          details: { ...prev.details, yearOfConstruction: e.target.value },
                        }));
                      }}
                    >
                      {YEARS.map((year) => (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <FormControl
                    fullWidth
                    error={
                      characteristicsStepTouched && !!characteristicsErrors.details.yearOfRenovation
                    }
                    required
                  >
                    <InputLabel>An renovare</InputLabel>
                    <Select
                      value={data.details.yearOfRenovation ?? ""}
                      label="An renovare"
                      onChange={(e) => {
                        clearError({ section: "details", field: "yearOfRenovation" });
                        onChange((prev) => ({
                          ...prev,
                          details: { ...prev.details, yearOfRenovation: e.target.value },
                        }));
                      }}
                    >
                      {YEARS.map((year) => (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      height: "56px",

                      border: "1px solid",
                      borderColor: "rgba(0,0,0,0.23)",
                      borderRadius: "8px",
                      px: 2,

                      ...(isDark && {
                        borderColor: "rgba(255,255,255,0.23)",
                      }),

                      transition: "border-color 150ms ease",

                      "&:hover": {
                        borderColor: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)",
                      },

                      "&:focus-within": {
                        borderColor: isDark ? "rgba(255,255,255,0.23)" : "rgba(0,0,0,0.23)",
                        boxShadow: "none",
                      },
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={data.details.openKitchen ?? false}
                          onChange={(e) => {
                            onChange((prev) => ({
                              ...prev,
                              details: { ...prev.details, openKitchen: e.target.checked },
                            }));
                          }}
                        />
                      }
                      label="Bucatarie deschisa"
                      sx={{ m: 0, width: "100%" }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      height: "56px",

                      border: "1px solid",
                      borderColor: "rgba(0,0,0,0.23)",
                      borderRadius: "8px",
                      px: 2,

                      ...(isDark && {
                        borderColor: "rgba(255,255,255,0.23)",
                      }),

                      transition: "border-color 150ms ease",
                      "&:hover": {
                        borderColor: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)",
                      },
                      "&:focus-within": {
                        borderColor: isDark ? "rgba(255,255,255,0.23)" : "rgba(0,0,0,0.23)",
                        boxShadow: "none",
                      },
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={data.details.bathroomWindow ?? false}
                          onChange={(e) => {
                            onChange((prev) => ({
                              ...prev,
                              details: { ...prev.details, bathroomWindow: e.target.checked },
                            }));
                          }}
                        />
                      }
                      label="Geam la baie"
                      sx={{ m: 0, width: "100%" }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      height: "56px",
                      border: "1px solid",
                      borderColor: "rgba(0,0,0,0.23)",
                      borderRadius: "8px",
                      px: 2,
                      ...(isDark && {
                        borderColor: "rgba(255,255,255,0.23)",
                      }),
                      transition: "border-color 150ms ease",
                      "&:hover": {
                        borderColor: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)",
                      },
                      "&:focus-within": {
                        borderColor: isDark ? "rgba(255,255,255,0.23)" : "rgba(0,0,0,0.23)",
                        boxShadow: "none",
                      },
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={data.details.petFriendly ?? false}
                          onChange={(e) => {
                            onChange((prev) => ({
                              ...prev,
                              details: { ...prev.details, petFriendly: e.target.checked },
                            }));
                          }}
                        />
                      }
                      label="Pet friendly"
                      sx={{ m: 0, width: "100%" }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      height: "56px",
                      border: "1px solid",
                      borderColor: "rgba(0,0,0,0.23)",
                      borderRadius: "8px",
                      px: 2,
                      ...(isDark && {
                        borderColor: "rgba(255,255,255,0.23)",
                      }),
                      transition: "border-color 150ms ease",
                      "&:hover": {
                        borderColor: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)",
                      },
                      "&:focus-within": {
                        borderColor: isDark ? "rgba(255,255,255,0.23)" : "rgba(0,0,0,0.23)",
                        boxShadow: "none",
                      },
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={data.details.keyInAgency ?? false}
                          onChange={(e) => {
                            onChange((prev) => ({
                              ...prev,
                              details: { ...prev.details, keyInAgency: e.target.checked },
                            }));
                          }}
                        />
                      }
                      label="Cheia in agentie"
                      sx={{ m: 0, width: "100%" }}
                    />
                  </Box>
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
                {areaFields.map((field) => {
                  const hasError = isAreaErrorKey(field.key);

                  return (
                    <Grid key={field.key} size={{ xs: 12, sm: 6, md: 4 }}>
                      <TextField
                        label={field.label}
                        value={data.areas[field.key] ?? ""}
                        required={hasError}
                        error={
                          hasError &&
                          characteristicsStepTouched &&
                          !!characteristicsErrors.areas[
                            field.key as keyof CharacteristicsErrors["areas"]
                          ]
                        }
                        onChange={(e) => {
                          if (hasError) {
                            clearError({
                              section: "areas",
                              field: field.key as keyof CharacteristicsErrors["areas"],
                            });
                          }

                          onChange((prev) => ({
                            ...prev,
                            areas: {
                              ...prev.areas,
                              [field.key]: e.target.value,
                            },
                          }));
                        }}
                        fullWidth
                        slotProps={{
                          input: {
                            endAdornment: <InputAdornment position="end">m²</InputAdornment>,
                          },
                        }}
                      />
                    </Grid>
                  );
                })}
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
                  <FormControl
                    fullWidth
                    error={
                      characteristicsStepTouched &&
                      !!characteristicsErrors.building.constructionStage
                    }
                    required
                  >
                    <InputLabel>Stadiu constructie</InputLabel>
                    <Select
                      value={data.building.constructionStage}
                      label="Stadiu constructie"
                      onChange={(e) => {
                        clearError({ section: "building", field: "constructionStage" });
                        onChange((prev) => ({
                          ...prev,
                          building: {
                            ...prev.building,
                            constructionStage: e.target.value as EConstructionStage,
                          },
                        }));
                      }}
                    >
                      {getEnumOptions(
                        EConstructionStage,
                        CharacteristicsEnumLabels.EConstructionStage,
                      ).map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <FormControl
                    fullWidth
                    error={characteristicsStepTouched && !!characteristicsErrors.building.type}
                    required
                  >
                    <InputLabel>Tip cladire</InputLabel>
                    <Select
                      value={data.building.type}
                      label="Tip cladire"
                      onChange={(e) => {
                        clearError({ section: "building", field: "type" });
                        onChange((prev) => ({
                          ...prev,
                          building: { ...prev.building, type: e.target.value as EBuildingType },
                        }));
                      }}
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
                  <FormControl
                    fullWidth
                    error={characteristicsStepTouched && !!characteristicsErrors.building.structure}
                    required
                  >
                    <InputLabel>Structura</InputLabel>
                    <Select
                      value={data.building.structure}
                      label="Structura"
                      onChange={(e) => {
                        clearError({ section: "building", field: "structure" });
                        onChange((prev) => ({
                          ...prev,
                          building: {
                            ...prev.building,
                            structure: e.target.value as EBuildingStructure,
                          },
                        }));
                      }}
                    >
                      {getEnumOptions(
                        EBuildingStructure,
                        CharacteristicsEnumLabels.EBuildingStructure,
                      ).map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
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
                      onChange={(e) => {
                        onChange((prev) => ({
                          ...prev,
                          building: {
                            ...prev.building,
                            seismicRisk: e.target.value as EBuildingSeismicRisk,
                          },
                        }));
                      }}
                    >
                      {Object.values(EBuildingSeismicRisk).map((val) => (
                        <MenuItem key={val} value={val}>
                          {val}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 12, md: 8, lg: 8 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      height: 56,

                      px: 2,

                      borderRadius: 1,
                      border: "1px solid",
                      borderColor: "rgba(0,0,0,0.23)",
                      backgroundColor: "background.paper",

                      "&:hover": {
                        borderColor: "rgba(0,0,0,0.87)",
                      },
                    }}
                  >
                    <FormControlLabel
                      sx={{ m: 0 }}
                      control={
                        <Checkbox
                          checked={data.building.basement ?? false}
                          onChange={(e) => {
                            onChange((prev) => ({
                              ...prev,
                              building: { ...prev.building, basement: e.target.checked },
                            }));
                          }}
                          size="small"
                        />
                      }
                      label="S+"
                    />

                    <FormControlLabel
                      sx={{ m: 0 }}
                      control={
                        <Checkbox
                          checked={data.building.demiBasement ?? false}
                          onChange={(e) => {
                            onChange((prev) => ({
                              ...prev,
                              building: { ...prev.building, demiBasement: e.target.checked },
                            }));
                          }}
                          size="small"
                        />
                      }
                      label="D+"
                    />

                    <FormControlLabel
                      sx={{ m: 0 }}
                      control={
                        <Checkbox
                          checked={data.building.groundFloor ?? false}
                          onChange={(e) => {
                            onChange((prev) => ({
                              ...prev,
                              building: { ...prev.building, groundFloor: e.target.checked },
                            }));
                          }}
                          size="small"
                        />
                      }
                      label="P+"
                    />

                    <TextField
                      placeholder="Etaje"
                      value={data.building.floors ?? ""}
                      onChange={(e) => {
                        onChange((prev) => ({
                          ...prev,
                          building: { ...prev.building, floors: Number(e.target.value) },
                        }));
                      }}
                      size="small"
                      sx={{
                        width: 70,
                        "& .MuiOutlinedInput-root": {
                          height: 36,
                        },
                      }}
                    />

                    <FormControlLabel
                      sx={{ m: 0 }}
                      control={
                        <Checkbox
                          checked={data.building.attic ?? false}
                          onChange={(e) => {
                            onChange((prev) => ({
                              ...prev,
                              building: { ...prev.building, attic: e.target.checked },
                            }));
                          }}
                          size="small"
                        />
                      }
                      label="M+"
                    />

                    <FormControlLabel
                      sx={{ m: 0 }}
                      control={
                        <Checkbox
                          checked={data.building.pod ?? false}
                          onChange={(e) => {
                            onChange((prev) => ({
                              ...prev,
                              building: { ...prev.building, pod: e.target.checked },
                            }));
                          }}
                          size="small"
                        />
                      }
                      label="Pod"
                    />
                  </Box>
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
                      onChange={(e) => {
                        onChange((prev) => ({
                          ...prev,
                          energyPerformance: {
                            ...prev.energyPerformance,
                            energyClass: e.target.value as EEnergyCertificationClass,
                          },
                        }));
                      }}
                    >
                      {getEnumOptions(
                        EEnergyCertificationClass,
                        CharacteristicsEnumLabels.EEnergyCertificationClass,
                      ).map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField
                    label="Consum anual specific"
                    value={data.energyPerformance.specificAnnualConsumption}
                    onChange={(e) => {
                      onChange((prev) => ({
                        ...prev,
                        energyPerformance: {
                          ...prev.energyPerformance,
                          specificAnnualConsumption: e.target.value,
                        },
                      }));
                    }}
                    fullWidth
                    slotProps={{
                      input: {
                        endAdornment: <InputAdornment position="end">kWh/m²an</InputAdornment>,
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField
                    label="Indice emisii CO₂"
                    value={data.energyPerformance.co2EquivalentEmissionIndex}
                    onChange={(e) => {
                      onChange((prev) => ({
                        ...prev,
                        energyPerformance: {
                          ...prev.energyPerformance,
                          co2EquivalentEmissionIndex: e.target.value,
                        },
                      }));
                    }}
                    fullWidth
                    slotProps={{
                      input: {
                        endAdornment: <InputAdornment position="end">kgCO₂/m²an</InputAdornment>,
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField
                    label="Consum surse regenerabile"
                    value={data.energyPerformance.specificConsumptionFromRenewableSources}
                    onChange={(e) => {
                      onChange((prev) => ({
                        ...prev,
                        energyPerformance: {
                          ...prev.energyPerformance,
                          specificConsumptionFromRenewableSources: e.target.value,
                        },
                      }));
                    }}
                    fullWidth
                    slotProps={{
                      input: {
                        endAdornment: <InputAdornment position="end">kWh/m²an</InputAdornment>,
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
  },
);

export default CharacteristicsStep;
