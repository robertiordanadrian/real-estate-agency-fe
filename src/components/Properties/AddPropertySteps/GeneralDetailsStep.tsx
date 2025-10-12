import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  OutlinedInput,
  Chip,
  Grid,
} from "@mui/material";
import {
  EStatus,
  EType,
  ECategory,
  ESurroundings,
} from "../../../common/enums/general-details.enums";
import type { IGeneralDetails } from "../../../common/interfaces/general-details.interface";

interface GeneralDetailsStepProps {
  data: IGeneralDetails;
  onChange: (updated: IGeneralDetails) => void;
}

export const GeneralDetailsStep: React.FC<GeneralDetailsStepProps> = ({
  data,
  onChange,
}) => {
  const handleLocationChange = (
    key: keyof IGeneralDetails["location"],
    value: string
  ) => {
    onChange({ ...data, location: { ...data.location, [key]: value } });
  };

  const handleSurroundingsChange = (event: any) => {
    const {
      target: { value },
    } = event;
    onChange({
      ...data,
      location: {
        ...data.location,
        surroundings: typeof value === "string" ? value.split(",") : value,
      },
    });
  };

  const locationStringFields: {
    label: string;
    key: Exclude<keyof IGeneralDetails["location"], "surroundings">;
  }[] = [
    { label: "Oras", key: "city" },
    { label: "Zona", key: "zone" },
    { label: "Strada", key: "street" },
    { label: "Numar", key: "number" },
    { label: "Bloc", key: "building" },
    { label: "Scara", key: "stairwell" },
    { label: "Numar apartament", key: "apartment" },
    { label: "Puncte de interes", key: "interesPoints" },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        overflow: "auto",
      }}
    >
      <Card>
        <CardContent>
          <Typography variant="subtitle1" mb={2}>
            Detalii Generale
          </Typography>
          <Grid container spacing={2}>
            <Grid size={3}>
              <TextField
                label="Agent"
                value={data.agent}
                onChange={(e) => onChange({ ...data, agent: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid size={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={data.status}
                  label="Status"
                  onChange={(e) =>
                    onChange({ ...data, status: e.target.value })
                  }
                >
                  {Object.values(EStatus).map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={3}>
              <FormControl fullWidth>
                <InputLabel>Tipul tranzactiei</InputLabel>
                <Select
                  value={data.transactionType}
                  label="Tipul tranzactiei"
                  onChange={(e) =>
                    onChange({ ...data, transactionType: e.target.value })
                  }
                >
                  {Object.values(EType).map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={3}>
              <FormControl fullWidth>
                <InputLabel>Categorie</InputLabel>
                <Select
                  value={data.category}
                  label="Categorie"
                  onChange={(e) =>
                    onChange({ ...data, category: e.target.value })
                  }
                >
                  {Object.values(ECategory).map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={3}>
              <TextField
                label="Proprietar"
                value={data.ownerID}
                onChange={(e) => onChange({ ...data, ownerID: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid size={3}>
              <TextField
                label="Contracte aditionale"
                value={data.aditionalContactID}
                onChange={(e) =>
                  onChange({ ...data, aditionalContactID: e.target.value })
                }
                fullWidth
              />
            </Grid>
            <Grid size={3}>
              <TextField
                label="Complex rezidential"
                value={data.residentialComplex}
                onChange={(e) =>
                  onChange({ ...data, residentialComplex: e.target.value })
                }
                fullWidth
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="subtitle1" mb={2}>
            Locatie
          </Typography>
          <Grid container spacing={2}>
            {locationStringFields.map((field) => (
              <Grid key={field.key} size={3}>
                <TextField
                  label={field.label}
                  value={data.location[field.key]}
                  onChange={(e) =>
                    handleLocationChange(field.key, e.target.value)
                  }
                  fullWidth
                />
              </Grid>
            ))}
            <Grid size={3}>
              <FormControl fullWidth>
                <InputLabel>Imprejurimi</InputLabel>
                <Select
                  multiple
                  value={data.location.surroundings}
                  onChange={handleSurroundingsChange}
                  input={<OutlinedInput label="Imprejurimi" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {Object.values(ESurroundings).map((surround) => (
                    <MenuItem key={surround} value={surround}>
                      {surround}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="subtitle1" mb={2}>
            Memo Privat
          </Typography>
          <TextField
            label="Memo privat"
            value={data.privatMemo}
            onChange={(e) => onChange({ ...data, privatMemo: e.target.value })}
            multiline
            rows={3}
            fullWidth
          />
        </CardContent>
      </Card>
    </Box>
  );
};
