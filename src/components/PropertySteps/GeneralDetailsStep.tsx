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
} from "@mui/material";
import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";
import {
  EStatus,
  EType,
  ECategory,
  ESurroundings,
} from "../../common/enums/general-details.enums";
import type { IGeneralDetails } from "../../common/interfaces/general-details.interface";
import { OwnersApi } from "../../features/owners/ownersApi";
import { IOwner } from "../../common/interfaces/owner.interface";
import { useAppSelector } from "../../app/hook";
import { selectUser } from "../../features/auth/authSelectors";

interface GeneralDetailsStepProps {
  data: IGeneralDetails;
  onChange: (updated: IGeneralDetails) => void;
}

const AddressAutocomplete: React.FC<{
  onAddressSelect: (address: {
    street: string;
    number: string;
    city: string;
  }) => void;
}> = ({ onAddressSelect }) => {
  const [inputValue, setInputValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const places = useMapsLibrary("places");

  React.useEffect(() => {
    if (!places || !inputRef.current) return;

    
    const autocomplete = new places.Autocomplete(inputRef.current, {
      fields: ["address_components", "formatted_address"],
      types: ["address"],
      componentRestrictions: { country: "ro" },
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.address_components) return;

      let street = "";
      let streetNumber = "";
      let city = "";

      for (const component of place.address_components) {
        const type = component.types[0];
        if (type === "route") street = component.long_name;
        else if (type === "street_number") streetNumber = component.long_name;
        else if (type === "locality") city = component.long_name;
      }

      onAddressSelect({ street, number: streetNumber, city });
    });
  }, [places, onAddressSelect]);

  return (
    <TextField
  inputRef={inputRef}
  label="Cauta adresa (Strada si Numar)"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      fullWidth
  placeholder="Incepe sa tastezi o adresa din Romania..."
    />
  );
};

export const GeneralDetailsStep: React.FC<GeneralDetailsStepProps> = ({
  data,
  onChange,
}) => {
  const [owners, setOwners] = React.useState<IOwner[]>([]);
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
  const ADD_NEW_OWNER = "__add_new_owner__";
  const agentId = user?.id;
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  React.useEffect(() => {
    const fetchOwners = async () => {
      try {
        const ownersList = await OwnersApi.getAllByAgent(agentId || "");
        setOwners(ownersList);
      } catch {
        setOwners([]);
      }
    };
    fetchOwners();
  }, [agentId]);

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
    // Update multiple location fields at once
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
      agentId: agentId ? agentId : "",
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
      setOwners((prev) => [created, ...prev]);
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

  // Wrap your component with APIProvider
  return (
    <APIProvider apiKey={apiKey}>
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
              Detalii generale
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
                      onChange({ ...data, status: e.target.value as EStatus })
                    }
                  >
                    {Object.values(EStatus).map((opt) => (
                      <MenuItem key={opt} value={opt}>
                        {opt}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={3}>
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

              <Grid size={3}>
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

              <Grid size={3}>
                <FormControl fullWidth>
                  <InputLabel>Proprietar</InputLabel>
                  <Select
                    value={data.ownerID || ""}
                    label="Proprietar"
                    onChange={(e) => {
                      const v = e.target.value as string;
                      if (v === ADD_NEW_OWNER) return setOpenOwnerDialog(true);
                      onChange({ ...data, ownerID: v });
                    }}
                  >
                    {owners.map((o) => (
                      <MenuItem key={o._id} value={o._id}>
                        {o.surname} {o.lastname}
                      </MenuItem>
                    ))}
                    <MenuItem value={ADD_NEW_OWNER}>
                      + Adauga proprietar
                    </MenuItem>
                  </Select>
                </FormControl>
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
              {/* Autocomplete Input */}
              <Grid size={6}>
                <AddressAutocomplete onAddressSelect={handleAddressSelect} />
                <Typography variant="caption" color="textSecondary">
                  Începe să tastezi o adresă pentru sugestii automate
                </Typography>
              </Grid>

              {/* Existing location fields */}
              {locationFields.map((field) => (
                <Grid size={3} key={field.key}>
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

              <Grid size={6}>
                <FormControl fullWidth>
                  <InputLabel>Puncte de interes din jur</InputLabel>
                  <Select
                    multiple
                    value={data.location.surroundings}
                    onChange={handleSurroundingsChange as any}
                    input={<OutlinedInput label="Puncte de interes din jur" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
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

        {/* Rest of your existing components (Memo card and Owner Dialog) remain unchanged */}
        <Card>
          <CardContent>
            <Typography variant="subtitle1" mb={2}>
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
            <Button onClick={() => setOpenOwnerDialog(false)}>Anuleaza</Button>
            <Button variant="contained" onClick={handleCreateOwner}>
              Salveaza
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </APIProvider>
  );
};
