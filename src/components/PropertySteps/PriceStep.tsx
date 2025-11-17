import { AttachFile } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
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
import { DatePicker } from "@mui/x-date-pickers";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

import {
  EContactType,
  ECurrency,
  EPaymentMethod,
  ESignedContract,
} from "@/common/enums/property/price.enums";
import { IPrice } from "@/common/interfaces/property/price.interface";

interface PriceStepProps {
  usableArea: number;
  data: IPrice;
  onChange: (updated: IPrice | ((prev: IPrice) => IPrice)) => void;
  priceTouched: boolean;
}

export interface PriceStepRef {
  validate: () => boolean;
}

type PriceErrors = {
  priceDetails: {
    price?: boolean;
  };
};

type NestedKey<S extends keyof PriceErrors> = {
  section: S;
  field: keyof PriceErrors[S];
};

const PriceStep = forwardRef<PriceStepRef, PriceStepProps>(
  ({ usableArea, data, onChange, priceTouched }, ref) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const [selectedContractName, setSelectedContractName] = useState<string>("");
    const [pricePerMp, setPricePerMp] = useState<string>("");
    const [priceErrors, setPriceErrors] = useState<PriceErrors>({
      priceDetails: {},
    });

    const validatePrice = () => {
      const newErrors: PriceErrors = { priceDetails: {} };

      if (!data.priceDetails.price) newErrors.priceDetails.price = true;

      setPriceErrors(newErrors);

      const hasErrors = Object.values(newErrors.priceDetails).some(Boolean);

      return !hasErrors;
    };

    const clearError = <S extends keyof PriceErrors>({ section, field }: NestedKey<S>) => {
      setPriceErrors((prev) => ({
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
        validate: validatePrice,
      }),
      [validatePrice],
    );

    const handlePriceChange = (key: keyof IPrice["priceDetails"], value: any) => {
      onChange({
        ...data,
        priceDetails: { ...data.priceDetails, [key]: value },
      });
    };

    const handleCommissionsChange = (key: keyof IPrice["commissions"], value: any) => {
      onChange({
        ...data,
        commissions: { ...data.commissions, [key]: value },
      });
    };

    const handleContactChange = (
      key: keyof IPrice["contact"],
      value: IPrice["contact"][typeof key],
    ) => {
      onChange((prev) => ({
        ...prev,
        contact: {
          ...prev.contact,
          [key]: value,
        },
      }));
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
                Detalii pret
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <FormControl fullWidth required>
                    <TextField
                      label="Pret"
                      required
                      error={priceTouched && !!priceErrors.priceDetails.price}
                      value={data.priceDetails.price ?? ""}
                      onChange={(e) => {
                        const newPrice = e.target.value;

                        clearError({ section: "priceDetails", field: "price" });

                        onChange((prev) => {
                          const numericPrice = Number(newPrice);
                          const mp = usableArea ?? 0;

                          const pricePerMp =
                            numericPrice > 0 && mp > 0 ? (numericPrice / mp).toFixed(2) : null;

                          return {
                            ...prev,
                            priceDetails: {
                              ...prev.priceDetails,
                              price: newPrice,
                              pricePerMp,
                            },
                          };
                        });
                      }}
                      fullWidth
                      slotProps={{
                        input: {
                          endAdornment: <InputAdornment position="end">€</InputAdornment>,
                        },
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      height: "56px",

                      border: "1px solid",
                      borderColor: "rgba(0,0,0,0.23)",
                      borderRadius: "8px",

                      ...(isDark && {
                        borderColor: "rgba(255,255,255,0.23)",
                      }),

                      px: 2,
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
                          checked={data.priceDetails.tva ?? false}
                          onChange={(e) => {
                            onChange((prev) => ({
                              ...prev,
                              priceDetails: { ...prev.priceDetails, tva: e.target.checked },
                            }));
                          }}
                        />
                      }
                      label="+ TVA"
                      sx={{ m: 0 }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField
                    label="Pret / mp"
                    value={
                      data.priceDetails.pricePerMp !== null &&
                      data.priceDetails.pricePerMp !== undefined
                        ? data.priceDetails.pricePerMp
                        : ""
                    }
                    fullWidth
                    slotProps={{
                      input: {
                        readOnly: true,
                        endAdornment: <InputAdornment position="end">€/mp</InputAdornment>,
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField
                    label="Pret garaj"
                    value={data.priceDetails.garagePrice}
                    onChange={(e) => {
                      onChange((prev) => ({
                        ...prev,
                        priceDetails: { ...prev.priceDetails, garagePrice: e.target.value },
                      }));
                    }}
                    fullWidth
                    slotProps={{
                      input: {
                        endAdornment: <InputAdornment position="end">€</InputAdornment>,
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField
                    label="Pret parcare"
                    value={data.priceDetails.parkingPrice}
                    onChange={(e) => {
                      onChange((prev) => ({
                        ...prev,
                        priceDetails: { ...prev.priceDetails, parkingPrice: e.target.value },
                      }));
                    }}
                    fullWidth
                    slotProps={{
                      input: {
                        endAdornment: <InputAdornment position="end">€</InputAdornment>,
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" mb={2} fontWeight={600}>
                Comisioane
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    label="Comision cumparator"
                    value={data.commissions.buyerCommission}
                    onChange={(e) => {
                      onChange((prev) => ({
                        ...prev,
                        commissions: { ...prev.commissions, buyerCommission: e.target.value },
                      }));
                    }}
                    fullWidth
                    slotProps={{
                      input: {
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    label="Valoare comision cumparator"
                    value={data.commissions.buyerCommissionValue}
                    onChange={(e) => {
                      onChange((prev) => ({
                        ...prev,
                        commissions: { ...prev.commissions, buyerCommissionValue: e.target.value },
                      }));
                    }}
                    fullWidth
                    slotProps={{
                      input: {
                        endAdornment: <InputAdornment position="end">€</InputAdornment>,
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    label="Comision proprietar"
                    value={data.commissions.ownerCommission}
                    onChange={(e) => {
                      onChange((prev) => ({
                        ...prev,
                        commissions: { ...prev.commissions, ownerCommission: e.target.value },
                      }));
                    }}
                    fullWidth
                    slotProps={{
                      input: {
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    label="Valoare comision proprietar"
                    value={data.commissions.ownerCommissionValue}
                    onChange={(e) => {
                      onChange((prev) => ({
                        ...prev,
                        commissions: { ...prev.commissions, ownerCommissionValue: e.target.value },
                      }));
                    }}
                    fullWidth
                    slotProps={{
                      input: {
                        endAdornment: <InputAdornment position="end">€</InputAdornment>,
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" mb={2} fontWeight={600}>
                Detalii contract
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <FormControl fullWidth>
                    <InputLabel>Tip contract</InputLabel>
                    <Select
                      value={data.contact.type || ""}
                      label="Tip contract"
                      onChange={(e) => {
                        onChange((prev) => ({
                          ...prev,
                          contact: { ...prev.contact, type: e.target.value },
                        }));
                      }}
                    >
                      {Object.values(EContactType).map((val) => (
                        <MenuItem key={val} value={val}>
                          {val}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <FormControl fullWidth>
                    <InputLabel>Contract semnat</InputLabel>
                    <Select
                      value={data.contact.signedContract ?? ""}
                      label="Contract semnat"
                      onChange={(e) => {
                        onChange((prev) => ({
                          ...prev,
                          contact: { ...prev.contact, signedContract: e.target.value },
                        }));
                      }}
                    >
                      {Object.values(ESignedContract).map((val) => (
                        <MenuItem key={val} value={val}>
                          {val}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField
                    label="Numar contract"
                    value={data.contact.contractNumber}
                    onChange={(e) => {
                      onChange((prev) => ({
                        ...prev,
                        contact: { ...prev.contact, contractNumber: e.target.value },
                      }));
                    }}
                    fullWidth
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <DatePicker
                    label="Data semnarii"
                    value={data.contact.signDate ? new Date(data.contact.signDate) : null}
                    onChange={(newValue) => {
                      handleContactChange("signDate", newValue ?? null);
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: "outlined",
                        size: "medium",
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <DatePicker
                    label="Data expirarii"
                    value={
                      data.contact.expirationDate ? new Date(data.contact.expirationDate) : null
                    }
                    onChange={(newValue) => {
                      handleContactChange("expirationDate", newValue ?? null);
                    }}
                    slotProps={{
                      textField: { fullWidth: true, variant: "outlined", size: "medium" },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    startIcon={<AttachFile />}
                    sx={{
                      height: 56,
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.text.primary,
                      justifyContent: "flex-start",
                      textTransform: "none",
                      fontSize: "0.875rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      "&:hover": {
                        borderColor: theme.palette.primary.light,
                        backgroundColor: `${theme.palette.primary.main}11`,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        flex: 1,
                        display: "block",
                      }}
                    >
                      {selectedContractName ||
                        (data.contact.contractFile instanceof File
                          ? data.contact.contractFile.name
                          : data.contact.contractFile || "Incarca fisier contract")}
                    </Box>

                    <input
                      type="file"
                      hidden
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedContractName(file.name);
                          handleContactChange("contractFile", file);
                        }
                      }}
                    />
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Paper>
    );
  },
);

export default PriceStep;
