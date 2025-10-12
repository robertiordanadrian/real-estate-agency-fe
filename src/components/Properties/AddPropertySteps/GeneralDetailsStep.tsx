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
import axiosClient from "../../../api/axiosClient";
import { useAuth } from "../../../auth/AuthContext";
import {
  EStatus,
  EType,
  ECategory,
  ESurroundings,
} from "../../../common/enums/general-details.enums";
import type { IGeneralDetails } from "../../../common/interfaces/general-details.interface";

interface IOwner {
  _id: string;
  agentId: string;
  surname: string;
  lastname: string;
  email: string;
  phone: string;
  companyWhereHeWorks: string;
  tags: string[];
  memo: string;
}

interface GeneralDetailsStepProps {
  data: IGeneralDetails;
  onChange: (updated: IGeneralDetails) => void;
}

export const GeneralDetailsStep: React.FC<GeneralDetailsStepProps> = ({
  data,
  onChange,
}) => {
  const { user } = useAuth();
  const agentId = user?.userId ?? "";

  // --------- NEW: owners state + dialog state ----------
  const [owners, setOwners] = React.useState<IOwner[]>([]);
  const [openOwnerDialog, setOpenOwnerDialog] = React.useState(false);
  const [newOwner, setNewOwner] = React.useState<{
    surname: string;
    lastname: string;
    email: string;
    phone: string;
    companyWhereHeWorks: string;
    tags: string; // comma separated input
    memo: string;
  }>({
    surname: "",
    lastname: "",
    email: "",
    phone: "",
    companyWhereHeWorks: "",
    tags: "",
    memo: "",
  });

  const ADD_NEW_OWNER = "__add_new_owner__";

  React.useEffect(() => {
    if (!agentId) return;
    axiosClient
      .get(`/owners`, { params: { agentId } })
      .then((res) => setOwners(res.data))
      .catch(() => setOwners([]));
  }, [agentId]);
  // -----------------------------------------------------

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
                    onChange({ ...data, status: e.target.value as EStatus })
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
                    onChange({
                      ...data,
                      transactionType: e.target.value as EType,
                    })
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
                    onChange({ ...data, category: e.target.value as ECategory })
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

            {/* --------- REPLACED: TextField ownerID -> Select cu Owners + Add dialog ---------- */}
            <Grid size={3}>
              <FormControl fullWidth>
                <InputLabel>Proprietar</InputLabel>
                <Select
                  label="Proprietar"
                  value={
                    owners.some((o) => o._id === data.ownerID)
                      ? data.ownerID
                      : ""
                  }
                  onChange={(e) => {
                    const v = String(e.target.value);
                    if (v === ADD_NEW_OWNER) {
                      setOpenOwnerDialog(true);
                      return;
                    }
                    onChange({ ...data, ownerID: v });
                  }}
                >
                  {owners.length === 0 && (
                    <MenuItem disabled value="">
                      Se încarcă proprietarii...
                    </MenuItem>
                  )}
                  {owners.map((o) => (
                    <MenuItem key={o._id} value={o._id}>
                      {o.surname} {o.lastname}
                    </MenuItem>
                  ))}
                  <MenuItem value={ADD_NEW_OWNER}>+ Adauga proprietar</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {/* ------------------------------------------------------------------------------- */}

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
                  onChange={handleSurroundingsChange}
                  input={<OutlinedInput label="Puncte de interes din jur" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {(selected as string[]).map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {Object.values(ESurroundings).map((value) => (
                    <MenuItem key={value} value={value}>
                      {value}
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

      {/* --------- Dialog Adaugare Proprietar --------- */}
      <Dialog
        open={openOwnerDialog}
        onClose={() => setOpenOwnerDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Adauga proprietar</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
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
              type="email"
              fullWidth
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
              placeholder="ex: lead, vip, investitor"
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
          <Button
            variant="contained"
            onClick={async () => {
              if (!agentId) return;
              const payload = {
                agentId,
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
                const res = await axiosClient.post("/owners", payload);
                const created: IOwner = res.data;
                setOwners((prev) => [created, ...prev]);
                onChange({ ...data, ownerID: created._id });
                setOpenOwnerDialog(false);
                setNewOwner({
                  surname: "",
                  lastname: "",
                  email: "",
                  phone: "",
                  companyWhereHeWorks: "",
                  tags: "",
                  memo: "",
                });
              } catch (e) {
                // optional: toast / error handling
              }
            }}
          >
            Salveaza
          </Button>
        </DialogActions>
      </Dialog>
      {/* ---------------------------------------------- */}
    </Box>
  );
};
