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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Paper,
  useTheme,
} from "@mui/material";
import { APIProvider } from "@vis.gl/react-google-maps";
import {
  EStatus,
  EType,
  ECategory,
  ESurroundings,
} from "../../common/enums/general-details.enums";
import type { IGeneralDetails } from "../../common/interfaces/general-details.interface";
import { OwnersApi } from "../../features/owners/ownersApi";
import { useAppSelector } from "../../app/hook";
import { selectUser } from "../../features/auth/authSelectors";
import { useOwnersQuery } from "../../features/owners/ownersQueries";
import { queryClient } from "../../services/queryClient";

interface GeneralDetailsStepProps {
  data: IGeneralDetails;
  onChange: (updated: IGeneralDetails) => void;
}

export const GeneralDetailsStep: React.FC<GeneralDetailsStepProps> = ({
  data,
  onChange,
}) => {
  const isEditing = Boolean(data && (data as any)._id);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [openOwnerDialog, setOpenOwnerDialog] = React.useState(false);
  const [newOwner, setNewOwner] = React.useState({
    surname: "",
    lastname: "",
    email: "",
    phone: "",
    companyWhereHeWorks: "",
    tags: "",
    memo: "",
  });

  const user = useAppSelector(selectUser);
  const getAllowedStatuses = (role?: string): EStatus[] => {
    switch (role) {
      case "CEO":
        return Object.values(EStatus);
      case "MANAGER":
      case "TEAM_LEAD":
      case "AGENT":
        return [EStatus.WHITE, EStatus.RED, EStatus.BLUE, EStatus.RESERVED];
      default:
        return [EStatus.RESERVED];
    }
  };

  const allowedStatuses = getAllowedStatuses(user?.role);

  React.useEffect(() => {
    if (!data.status || !data.agent || !data.agentId) {
      const updated = { ...data };

      if (!updated.status) updated.status = EStatus.GREEN;
      if (!updated.agent && user)
        updated.agent = user.name || user.email || "Agent necunoscut";
      if (!updated.agentId && (user?._id || user?.id))
        updated.agentId = user._id || user.id;

      onChange(updated);
    }
  }, []);
  const agentId = user?._id || user?.id;
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const { data: owners = [] } = useOwnersQuery();

  const handleLocationChange = (
    key: keyof IGeneralDetails["location"],
    value: string
  ) => {
    onChange({ ...data, location: { ...data.location, [key]: value } });
  };

  const handleAddressSelect = (address: {
    street: string;
    number: string;
    city: string;
  }) => {
    onChange({
      ...data,
      location: {
        ...data.location,
        street: address.street,
        number: address.number,
        city: address.city,
      },
    });
  };

  const handleSurroundingsChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const value = event.target.value as string[];
    const enumValues = value.map((v) => v as ESurroundings);
    onChange({
      ...data,
      location: { ...data.location, surroundings: enumValues },
    });
  };

  const locationFields: {
    label: string;
    key: Exclude<keyof IGeneralDetails["location"], "surroundings">;
  }[] = [
    { label: "Oras", key: "city" },
    { label: "Zona", key: "zone" },
    { label: "Strada", key: "street" },
    { label: "Numar", key: "number" },
    { label: "Bloc", key: "building" },
    { label: "Scara", key: "stairwell" },
    { label: "Apartament", key: "apartment" },
    { label: "Puncte de interes", key: "interesPoints" },
  ];

  const handleCreateOwner = async () => {
    const payload = {
      agentId: agentId ?? "",
      surname: newOwner.surname.trim(),
      lastname: newOwner.lastname.trim(),
      email: newOwner.email.trim(),
      phone: newOwner.phone.trim(),
      companyWhereHeWorks: newOwner.companyWhereHeWorks.trim(),
      tags: newOwner.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      memo: newOwner.memo.trim(),
    };

    try {
      const created = await OwnersApi.create(payload);
      await queryClient.invalidateQueries({ queryKey: ["owners", "all"] });
      onChange({ ...data, ownerID: created._id });
      setNewOwner({
        surname: "",
        lastname: "",
        email: "",
        phone: "",
        companyWhereHeWorks: "",
        tags: "",
        memo: "",
      });
      setOpenOwnerDialog(false);
    } catch {}
  };

  return (
    <APIProvider apiKey={apiKey} libraries={["places"]}>
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
                Detalii generale
              </Typography>

              <Grid container spacing={2}>
                <TextField
                  label="Agent"
                  value={user?.name || user?.email || "—"}
                  fullWidth
                  InputProps={{ readOnly: true }}
                />

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={data.status ?? EStatus.GREEN}
                      label="Status"
                      onChange={(e) =>
                        onChange({ ...data, status: e.target.value as EStatus })
                      }
                      disabled={!isEditing}
                    >
                      {isEditing ? (
                        allowedStatuses.map((opt) => (
                          <MenuItem key={opt} value={opt}>
                            {opt}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value={EStatus.GREEN}>
                          {EStatus.GREEN}
                        </MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <FormControl fullWidth>
                    <InputLabel>Tip tranzactie</InputLabel>
                    <Select
                      value={data.transactionType}
                      label="Tip tranzactie"
                      onChange={(e) =>
                        onChange({
                          ...data,
                          transactionType: e.target.value as EType,
                        })
                      }
                    >
                      {Object.values(EType).map((opt) => (
                        <MenuItem key={opt} value={opt}>
                          {opt}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <FormControl fullWidth>
                    <InputLabel>Categorie</InputLabel>
                    <Select
                      value={data.category}
                      label="Categorie"
                      onChange={(e) =>
                        onChange({
                          ...data,
                          category: e.target.value as ECategory,
                        })
                      }
                    >
                      {Object.values(ECategory).map((opt) => (
                        <MenuItem key={opt} value={opt}>
                          {opt}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <FormControl fullWidth>
                    <InputLabel>Proprietar</InputLabel>
                    <Select
                      value={data.ownerID || ""}
                      label="Proprietar"
                      onChange={(e) => {
                        const v = e.target.value as string;
                        if (v === "__add_new_owner__")
                          return setOpenOwnerDialog(true);
                        onChange({ ...data, ownerID: v });
                      }}
                    >
                      {owners.map((o) => (
                        <MenuItem key={o._id} value={o._id}>
                          {o.surname} {o.lastname}
                        </MenuItem>
                      ))}
                      <MenuItem value="__add_new_owner__">
                        + Adauga proprietar
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField
                    label="Complex rezidential"
                    value={data.residentialComplex}
                    onChange={(e) =>
                      onChange({
                        ...data,
                        residentialComplex: e.target.value,
                      })
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
                Locatie
              </Typography>

              <Grid container spacing={2}>
                {locationFields.map((field) => (
                  <Grid key={field.key} size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextField
                      label={field.label}
                      value={data.location[field.key] ?? ""}
                      onChange={(e) =>
                        handleLocationChange(field.key, e.target.value)
                      }
                      fullWidth
                    />
                  </Grid>
                ))}

                <Grid size={{ xs: 12 }}>
                  <FormControl fullWidth>
                    <InputLabel>Puncte de interes din jur</InputLabel>
                    <Select
                      multiple
                      value={data.location.surroundings}
                      onChange={handleSurroundingsChange as any}
                      input={
                        <OutlinedInput label="Puncte de interes din jur" />
                      }
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {(selected as string[]).map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )}
                    >
                      {Object.values(ESurroundings).map((val) => (
                        <MenuItem key={val} value={val}>
                          {val}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" mb={2} fontWeight={600}>
                Memo privat
              </Typography>
              <TextField
                label="Memo privat"
                value={data.privatMemo}
                onChange={(e) =>
                  onChange({ ...data, privatMemo: e.target.value })
                }
                multiline
                rows={3}
                fullWidth
              />
            </CardContent>
          </Card>

          <Dialog
            open={openOwnerDialog}
            onClose={() => setOpenOwnerDialog(false)}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle>Adauga proprietar</DialogTitle>
            <DialogContent>
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
              >
                <TextField
                  label="Nume"
                  fullWidth
                  value={newOwner.surname}
                  onChange={(e) =>
                    setNewOwner((s) => ({ ...s, surname: e.target.value }))
                  }
                />
                <TextField
                  label="Prenume"
                  fullWidth
                  value={newOwner.lastname}
                  onChange={(e) =>
                    setNewOwner((s) => ({ ...s, lastname: e.target.value }))
                  }
                />
                <TextField
                  label="Email"
                  fullWidth
                  type="email"
                  value={newOwner.email}
                  onChange={(e) =>
                    setNewOwner((s) => ({ ...s, email: e.target.value }))
                  }
                />
                <TextField
                  label="Telefon"
                  fullWidth
                  value={newOwner.phone}
                  onChange={(e) =>
                    setNewOwner((s) => ({ ...s, phone: e.target.value }))
                  }
                />
                <TextField
                  label="Companie"
                  fullWidth
                  value={newOwner.companyWhereHeWorks}
                  onChange={(e) =>
                    setNewOwner((s) => ({
                      ...s,
                      companyWhereHeWorks: e.target.value,
                    }))
                  }
                />
                <TextField
                  label="Tag-uri (separate prin virgula)"
                  fullWidth
                  value={newOwner.tags}
                  onChange={(e) =>
                    setNewOwner((s) => ({ ...s, tags: e.target.value }))
                  }
                />
                <TextField
                  label="Memo"
                  fullWidth
                  multiline
                  minRows={3}
                  value={newOwner.memo}
                  onChange={(e) =>
                    setNewOwner((s) => ({ ...s, memo: e.target.value }))
                  }
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenOwnerDialog(false)}>
                Anuleaza
              </Button>
              <Button variant="contained" onClick={handleCreateOwner}>
                Salveaza
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Paper>
    </APIProvider>
  );
};
