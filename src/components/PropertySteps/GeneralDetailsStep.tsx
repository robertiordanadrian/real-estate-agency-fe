import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";

import {
  ECategory,
  EGeneralDetailsEnumLabels,
  EStatus,
  ESurroundings,
  EType,
} from "@/common/enums/property/general-details.enums";
import type { IGeneralDetails } from "@/common/interfaces/property/general-details.interface";
import { useAllUsersQuery } from "@/features/users/usersQueries";
import { IUser } from "@/common/interfaces/user/user.interface";
import { EOwnerType, IOwner } from "@/common/interfaces/owner/owner.interface";
import { GoogleAddressAutocomplete } from "@/components/GoogleAddressAutocomplete/GoogleAddressAutocomplete";
import { useCreateOwner, useOwnersQuery } from "@/features/owners/ownersQueries";
import { getEnumOptions } from "@/common/utils/utilities-step.util";
import { AxiosError } from "axios";
import { useToast } from "@/context/ToastContext";

const defaultOwnerForm: IOwner = {
  _id: "",
  createdAt: "",
  updatedAt: "",
  agentId: "",
  type: null,
  surname: "",
  lastname: "",
  companyName: "",
  cui: "",
  phone: "",
  representative: "",
  email: "",
};

const locationFields: {
  label: string;
  key: Exclude<keyof IGeneralDetails["location"], "surroundings">;
}[] = [
  { label: "Zona", key: "zone" },
  { label: "Bloc", key: "building" },
  { label: "Scara", key: "stairwell" },
  { label: "Apartament", key: "apartment" },
];
interface GeneralDetailsStepProps {
  data: IGeneralDetails;
  onChange: (updated: IGeneralDetails | ((prev: IGeneralDetails) => IGeneralDetails)) => void;
  generalDetailsTouched: boolean;
  isEdit: boolean;
}

export interface GeneralDetailsStepRef {
  validate: () => boolean;
}

type GeneralDetailsErrors = {
  transactionType?: boolean;
  category?: boolean;
  city?: boolean;
  street?: boolean;
  number?: boolean;
  ownerID?: boolean;
};

type CreateOwnerError = {
  type?: boolean;
  surname?: boolean;
  lastname?: boolean;
  phone?: boolean;
  companyName?: boolean;
  cui?: boolean;
  representative?: boolean;
};

const GeneralDetailsStep = forwardRef<GeneralDetailsStepRef, GeneralDetailsStepProps>(
  ({ data, onChange, generalDetailsTouched, isEdit }, ref) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const toast = useToast();

    const { data: allUsers, error: usersError } = useAllUsersQuery();
    const { data: owners = [], error: ownersError } = useOwnersQuery();
    const createOwnerMutation = useCreateOwner();

    const [generalDetailsErrors, setGeneralDetailsErrors] = useState<GeneralDetailsErrors>({});
    const [createOwnerErrors, setCreateOwnerErrors] = useState<CreateOwnerError>({});
    const [ownerForm, setOwnerForm] = useState<IOwner>(defaultOwnerForm);
    const [ownerTouched, setOwnerTouched] = useState(false);
    const [displayAddress, setDisplayAddress] = useState("");
    const [snackbar, setSnackbar] = useState({
      open: false,
      message: "",
      severity: "success" as "success" | "error",
    });
    const [openOwnerDialog, setOpenOwnerDialog] = useState(false);

    const validateGeneralDetails = () => {
      const newErrors: GeneralDetailsErrors = {};
      if (!data.transactionType) newErrors.transactionType = true;
      if (!data.category) newErrors.category = true;
      if (!data.location.latitude || !data.location.longitude) {
        newErrors.street = true;
      }
      if (!data.ownerID) newErrors.ownerID = true;
      setGeneralDetailsErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const validateCreateOwner = () => {
      const newErrors: CreateOwnerError = {};

      if (!ownerForm.type) newErrors.type = true;

      if (ownerForm.type === EOwnerType.PF) {
        if (!ownerForm.surname) newErrors.surname = true;
        if (!ownerForm.lastname) newErrors.lastname = true;
        if (!ownerForm.phone) newErrors.phone = true;
      }

      if (ownerForm.type === EOwnerType.PJ) {
        if (!ownerForm.companyName) newErrors.companyName = true;
        if (!ownerForm.cui) newErrors.cui = true;
        if (!ownerForm.representative) newErrors.representative = true;
        if (!ownerForm.phone) newErrors.phone = true;
      }

      setCreateOwnerErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const clearError = (key: keyof GeneralDetailsErrors) => {
      setGeneralDetailsErrors((prev) => {
        if (!prev[key]) return prev;
        const newErr = { ...prev };
        delete newErr[key];
        return newErr;
      });
    };

    useImperativeHandle(
      ref,
      () => ({
        validate: validateGeneralDetails,
      }),
      [validateGeneralDetails],
    );

    useEffect(() => {
      if (data.location.street || data.location.number) {
        setDisplayAddress(`${data.location.street ?? ""} ${data.location.number ?? ""}`.trim());
      }
    }, [data.location.street, data.location.number]);

    useEffect(() => {
      validateCreateOwner();
    }, [ownerForm]);

    useEffect(() => {
      if (usersError) {
        const axiosErr = usersError as AxiosError<{ message?: string }>;
        toast(axiosErr.response?.data?.message || "Eroare la incarcarea utilizatorilor", "error");
      }
    }, [usersError, toast]);

    useEffect(() => {
      if (ownersError) {
        const axiosErr = ownersError as AxiosError<{ message?: string }>;
        toast(axiosErr.response?.data?.message || "Eroare la incarcarea proprietarilor", "error");
      }
    }, [ownersError, toast]);

    const handleLocationChange = (key: keyof IGeneralDetails["location"], value: string) => {
      onChange((prev) => ({
        ...prev,
        location: { ...prev.location, [key]: value },
      }));
    };

    const handleSurroundingsChange = (event: React.ChangeEvent<{ value: unknown }>) => {
      const value = event.target.value as string[];
      const enumValues = value.map((v) => v as ESurroundings);
      onChange((prev) => ({
        ...prev,
        location: { ...prev.location, surroundings: enumValues },
      }));
    };

    const handleCreateOwner = async () => {
      setOwnerTouched(true);
      if (!validateCreateOwner()) return;

      const payload: any = {
        agentId: data.agentId,
        type: ownerForm.type,
        phone: ownerForm.phone?.trim() || "",
        email: ownerForm.email?.trim() || "",
      };

      if (ownerForm.type === EOwnerType.PF) {
        payload.surname = ownerForm.surname?.trim() || "";
        payload.lastname = ownerForm.lastname?.trim() || "";
      }

      if (ownerForm.type === EOwnerType.PJ) {
        payload.companyName = ownerForm.companyName?.trim() || "";
        payload.cui = ownerForm.cui?.trim() || "";
        payload.representative = ownerForm.representative?.trim() || "";
      }

      createOwnerMutation.mutate(payload, {
        onSuccess: (created) => {
          onChange((prev) => ({
            ...prev,
            ownerID: created._id ?? "",
          }));

          toast("Proprietarul a fost creat cu succes!", "success");

          setCreateOwnerErrors({
            type: false,
            surname: false,
            lastname: false,
            phone: false,
            companyName: false,
            cui: false,
            representative: false,
          });

          setOpenOwnerDialog(false);
        },

        onError: (err: any) => {
          console.error(err);
          toast("Eroare la crearea proprietarului. Încearcă din nou.", "error");
        },
      });
    };

    const updateOwnerForm = <K extends keyof IOwner>(key: K, value: IOwner[K]) => {
      setOwnerForm((prev) => ({ ...prev, [key]: value }));
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
              <Typography variant="h6" mb={2} fontWeight={600}>
                Detalii generale
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <FormControl fullWidth>
                    <InputLabel id="agent-filter-label" shrink>
                      Agent
                    </InputLabel>

                    <Select
                      labelId="agent-filter-label"
                      value={
                        allUsers && allUsers.some((u: IUser) => u._id === data.agentId)
                          ? data.agentId
                          : ""
                      }
                      label="Agent"
                      onChange={(e) => onChange((prev) => ({ ...prev, agentId: e.target.value }))}
                      renderValue={(selectedId) => {
                        if (!selectedId) {
                          return (
                            <Typography sx={{ color: "text.disabled" }}>
                              Selecteaza agent
                            </Typography>
                          );
                        }

                        const agent = allUsers?.find((u: IUser) => u._id === selectedId);
                        if (!agent) {
                          return (
                            <Typography sx={{ color: "text.disabled" }}>
                              Selecteaza agent
                            </Typography>
                          );
                        }

                        return (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography>{agent.name}</Typography>
                            <Chip
                              label={agent.role}
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{ fontSize: "0.7rem", height: 22 }}
                            />
                          </Box>
                        );
                      }}
                    >
                      {allUsers?.map((agent: IUser) => (
                        <MenuItem key={agent._id} value={agent._id}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography>{agent.name}</Typography>
                            <Chip
                              label={agent.role}
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{ fontSize: "0.7rem", height: 22 }}
                            />
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <FormControl
                    fullWidth
                    error={generalDetailsTouched && !!generalDetailsErrors.transactionType}
                    required
                  >
                    <InputLabel>Tip tranzactie</InputLabel>
                    <Select
                      value={data.transactionType ?? ""}
                      label="Tip tranzactie"
                      onChange={(e) => {
                        clearError("transactionType");
                        onChange((prev) => ({ ...prev, transactionType: e.target.value as EType }));
                      }}
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
                  <FormControl
                    fullWidth
                    error={generalDetailsTouched && !!generalDetailsErrors.category}
                    required
                  >
                    <InputLabel>Categorie</InputLabel>
                    <Select
                      value={data.category || ""}
                      label="Categorie"
                      onChange={(e) => {
                        clearError("category");
                        onChange((prev) => ({ ...prev, category: e.target.value as ECategory }));
                      }}
                    >
                      {getEnumOptions(ECategory, EGeneralDetailsEnumLabels.ECategory).map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  {isEdit && (
                    <FormControl fullWidth>
                      <InputLabel id="status-label">Status</InputLabel>

                      <Select
                        labelId="status-label"
                        label="Status"
                        value={data.status ?? ""}
                        onChange={(e) =>
                          onChange((prev) => ({
                            ...prev,
                            status: e.target.value as EStatus,
                          }))
                        }
                      >
                        {Object.entries(EStatus).map(([key, label]) => (
                          <MenuItem key={key} value={key}>
                            {label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
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
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <FormControl
                    fullWidth
                    error={generalDetailsTouched && !!generalDetailsErrors.street}
                    required
                  >
                    <GoogleAddressAutocomplete
                      value={displayAddress}
                      required
                      error={generalDetailsTouched && !!generalDetailsErrors.street}
                      onChange={(v) => {
                        setDisplayAddress(v);
                      }}
                      onSelect={(addr) => {
                        clearError("street");

                        setDisplayAddress(`${addr.street} ${addr.number}`.trim());

                        onChange((prev) => ({
                          ...prev,
                          location: {
                            ...prev.location,
                            street: addr.street,
                            number: addr.number,
                            city: addr.city,
                            latitude: addr.latitude,
                            longitude: addr.longitude,
                          },
                        }));
                      }}
                    />
                  </FormControl>
                </Grid>

                {locationFields.map((field) => (
                  <Grid key={field.key} size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextField
                      label={field.label}
                      value={data.location[field.key] ?? ""}
                      onChange={(e) => handleLocationChange(field.key, e.target.value)}
                      fullWidth
                    />
                  </Grid>
                ))}

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <FormControl fullWidth>
                    <InputLabel>Puncte de interes din jur</InputLabel>
                    <Select
                      multiple
                      value={data.location.surroundings}
                      onChange={handleSurroundingsChange as any}
                      input={<OutlinedInput label="Puncte de interes din jur" />}
                      renderValue={(selected) => {
                        const selectedArray = selected as string[];

                        if (selectedArray.length === 0) return "Nimic selectat";
                        if (selectedArray.length === 1) return selectedArray[0];

                        return `${selectedArray[0]} (+${selectedArray.length - 1})`;
                      }}
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
                Proprietar
              </Typography>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <FormControl
                  fullWidth
                  error={generalDetailsTouched && !!generalDetailsErrors.ownerID}
                  required
                >
                  <InputLabel>Proprietar</InputLabel>
                  <Select
                    value={data.ownerID || ""}
                    label="Proprietar"
                    onChange={(e) => {
                      clearError("ownerID");

                      const v = e.target.value as string;
                      if (v === "__add_new_owner__") return setOpenOwnerDialog(true);

                      onChange((prev) => ({ ...prev, ownerID: v }));
                    }}
                  >
                    {owners.map((o) => (
                      <MenuItem key={o._id} value={o._id}>
                        {o.surname && o.lastname
                          ? o.surname + " " + o.lastname + " " + "- PF"
                          : o.companyName + " " + "- PJ"}
                      </MenuItem>
                    ))}
                    <MenuItem value="__add_new_owner__">+ Adauga proprietar</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
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
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  {" "}
                  <FormControl fullWidth error={ownerTouched && !!createOwnerErrors.type} required>
                    {" "}
                    <InputLabel>Tip proprietar</InputLabel>{" "}
                    <Select
                      value={ownerForm.type ?? ""}
                      label="Tip proprietar"
                      onChange={(e) => updateOwnerForm("type", e.target.value as EOwnerType)}
                    >
                      {" "}
                      <MenuItem value={EOwnerType.PF}>Persoana fizica</MenuItem>{" "}
                      <MenuItem value={EOwnerType.PJ}>Persoana juridica</MenuItem>{" "}
                    </Select>{" "}
                  </FormControl>{" "}
                </Grid>
                {ownerForm.type === EOwnerType.PF && (
                  <>
                    {" "}
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      {" "}
                      <TextField
                        label="Nume"
                        value={ownerForm.surname ?? ""}
                        onChange={(e) => updateOwnerForm("surname", e.target.value)}
                        error={ownerTouched && !!createOwnerErrors.surname}
                        required
                        fullWidth
                      />{" "}
                    </Grid>{" "}
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      {" "}
                      <TextField
                        label="Prenume"
                        value={ownerForm.lastname ?? ""}
                        onChange={(e) => updateOwnerForm("lastname", e.target.value)}
                        fullWidth
                        error={ownerTouched && !!createOwnerErrors.lastname}
                        required
                      />{" "}
                    </Grid>{" "}
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      {" "}
                      <TextField
                        type="email"
                        label="Email"
                        value={ownerForm.email ?? ""}
                        onChange={(e) => updateOwnerForm("email", e.target.value)}
                        fullWidth
                      />{" "}
                    </Grid>{" "}
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      {" "}
                      <TextField
                        label="Telefon"
                        value={ownerForm.phone ?? ""}
                        onChange={(e) => updateOwnerForm("phone", e.target.value)}
                        fullWidth
                        error={ownerTouched && !!createOwnerErrors.phone}
                        required
                      />{" "}
                    </Grid>{" "}
                  </>
                )}{" "}
                {ownerForm.type === EOwnerType.PJ && (
                  <>
                    {" "}
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      {" "}
                      <TextField
                        label="Nume companie"
                        value={ownerForm.companyName ?? ""}
                        onChange={(e) => updateOwnerForm("companyName", e.target.value)}
                        fullWidth
                        error={ownerTouched && !!createOwnerErrors.companyName}
                        required
                      />{" "}
                    </Grid>{" "}
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      {" "}
                      <TextField
                        label="CUI"
                        value={ownerForm.cui ?? ""}
                        onChange={(e) => updateOwnerForm("cui", e.target.value)}
                        fullWidth
                        error={ownerTouched && !!createOwnerErrors.cui}
                        required
                      />{" "}
                    </Grid>{" "}
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      {" "}
                      <TextField
                        label="Telefon"
                        value={ownerForm.phone ?? ""}
                        onChange={(e) => updateOwnerForm("phone", e.target.value)}
                        fullWidth
                        error={ownerTouched && !!createOwnerErrors.phone}
                        required
                      />{" "}
                    </Grid>{" "}
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      {" "}
                      <TextField
                        label="Reprezentant"
                        value={ownerForm.representative ?? ""}
                        onChange={(e) => updateOwnerForm("representative", e.target.value)}
                        fullWidth
                        error={ownerTouched && !!createOwnerErrors.representative}
                        required
                      />{" "}
                    </Grid>{" "}
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      {" "}
                      <TextField
                        type="email"
                        label="Email"
                        value={ownerForm.email ?? ""}
                        onChange={(e) => updateOwnerForm("email", e.target.value)}
                        fullWidth
                      />{" "}
                    </Grid>{" "}
                  </>
                )}
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
      </Paper>
    );
  },
);

export default GeneralDetailsStep;
