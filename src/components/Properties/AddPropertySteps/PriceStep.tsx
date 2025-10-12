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
  Grid,
  FormControlLabel,
  Switch,
  InputAdornment,
} from "@mui/material";
import {
  ECurrency,
  EPaymentMethod,
  EContactType,
  ESignedContract,
} from "../../../common/enums/price.enums";
import type { IPrice } from "../../../common/interfaces/price.interface";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

interface PriceStepProps {
  data: IPrice;
  onChange: (updated: IPrice) => void;
}

export const PriceStep: React.FC<PriceStepProps> = ({ data, onChange }) => {
  const handlePriceDetailsChange = (
    key: keyof IPrice["priceDetails"],
    value: any
  ) => {
    onChange({ ...data, priceDetails: { ...data.priceDetails, [key]: value } });
  };

  const handleCommissionsChange = (
    key: keyof IPrice["commissions"],
    value: string
  ) => {
    onChange({ ...data, commissions: { ...data.commissions, [key]: value } });
  };

  const handleContactChange = (key: keyof IPrice["contact"], value: any) => {
    onChange({ ...data, contact: { ...data.contact, [key]: value } });
  };

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
            Detalii Pret
          </Typography>
          <Grid container spacing={2}>
            <Grid size={3}>
              <TextField
                label="Pret"
                value={data.priceDetails.price}
                onChange={(e) =>
                  handlePriceDetailsChange("price", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid size={3}>
              <FormControl fullWidth>
                <InputLabel>Moneda</InputLabel>
                <Select
                  value={data.priceDetails.currency}
                  label="Moneda"
                  onChange={(e) =>
                    handlePriceDetailsChange("currency", e.target.value)
                  }
                >
                  {Object.values(ECurrency).map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={3}>
              <TextField
                label="Pret per mp"
                value={data.priceDetails.pricePerMp}
                onChange={(e) =>
                  handlePriceDetailsChange("pricePerMp", e.target.value)
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
            <Grid size={3}>
              <TextField
                label="Ultimul pret"
                value={data.priceDetails.lastPrice || ""}
                onChange={(e) =>
                  handlePriceDetailsChange("lastPrice", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid size={3}>
              <TextField
                label="Pret garaj"
                value={data.priceDetails.garagePrice}
                onChange={(e) =>
                  handlePriceDetailsChange("garagePrice", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid size={3}>
              <TextField
                label="Pret parcare"
                value={data.priceDetails.parkingPrice}
                onChange={(e) =>
                  handlePriceDetailsChange("parkingPrice", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid size={3}>
              <FormControl fullWidth>
                <InputLabel>Metoda de plata</InputLabel>
                <Select
                  value={data.priceDetails.paymentMethod}
                  label="Metoda de plata"
                  onChange={(e) =>
                    handlePriceDetailsChange("paymentMethod", e.target.value)
                  }
                >
                  {Object.values(EPaymentMethod).map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={3}>
              <TextField
                label="Nota privata pret"
                value={data.priceDetails.privateNotePrice}
                onChange={(e) =>
                  handlePriceDetailsChange("privateNotePrice", e.target.value)
                }
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid size={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={data.priceDetails.tva}
                    onChange={(e) =>
                      handlePriceDetailsChange("tva", e.target.checked)
                    }
                  />
                }
                label="TVA"
              />
            </Grid>
            <Grid size={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={data.priceDetails.negociablePrice}
                    onChange={(e) =>
                      handlePriceDetailsChange(
                        "negociablePrice",
                        e.target.checked
                      )
                    }
                  />
                }
                label="Pret negociabil"
              />
            </Grid>
            <Grid size={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={data.priceDetails.requestPrice}
                    onChange={(e) =>
                      handlePriceDetailsChange("requestPrice", e.target.checked)
                    }
                  />
                }
                label="Cerere pret"
              />
            </Grid>
            <Grid size={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={data.priceDetails.showPricePerMp}
                    onChange={(e) =>
                      handlePriceDetailsChange(
                        "showPricePerMp",
                        e.target.checked
                      )
                    }
                  />
                }
                label="Arata pret per mp"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="subtitle1" mb={2}>
            Comisioane
          </Typography>
          <Grid container spacing={2}>
            <Grid size={3}>
              <TextField
                label="Comision cumparator"
                value={data.commissions.buyerCommission}
                onChange={(e) =>
                  handleCommissionsChange("buyerCommission", e.target.value)
                }
                fullWidth
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
            <Grid size={3}>
              <TextField
                label="Valoare comision cumparator"
                value={data.commissions.buyerCommissionValue}
                onChange={(e) =>
                  handleCommissionsChange(
                    "buyerCommissionValue",
                    e.target.value
                  )
                }
                fullWidth
              />
            </Grid>
            <Grid size={3}>
              <TextField
                label="Comision proprietar"
                value={data.commissions.ownerCommission}
                onChange={(e) =>
                  handleCommissionsChange("ownerCommission", e.target.value)
                }
                fullWidth
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
            <Grid size={3}>
              <TextField
                label="Valoare comision proprietar"
                value={data.commissions.ownerCommissionValue}
                onChange={(e) =>
                  handleCommissionsChange(
                    "ownerCommissionValue",
                    e.target.value
                  )
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
            Contact
          </Typography>
          <Grid container spacing={2}>
            <Grid size={3}>
              <FormControl fullWidth>
                <InputLabel>Tip contact</InputLabel>
                <Select
                  value={data.contact.type}
                  label="Tip contact"
                  onChange={(e) => handleContactChange("type", e.target.value)}
                >
                  {Object.values(EContactType).map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={3}>
              <FormControl fullWidth>
                <InputLabel>Contract semnat</InputLabel>
                <Select
                  value={data.contact.signedContract}
                  label="Contract semnat"
                  onChange={(e) =>
                    handleContactChange("signedContract", e.target.value)
                  }
                >
                  {Object.values(ESignedContract).map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={3}>
              <TextField
                label="Numar contract"
                value={data.contact.contractNumber}
                onChange={(e) =>
                  handleContactChange("contractNumber", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid size={3}>
              <TextField
                label="Fisier contract"
                value={data.contact.contractFile}
                onChange={(e) =>
                  handleContactChange("contractFile", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid size={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Data semnare"
                  value={data.contact.signDate}
                  onChange={(newValue) =>
                    handleContactChange("signDate", newValue)
                  }
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid size={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Data expirare"
                  value={data.contact.expirationDate}
                  onChange={(newValue) =>
                    handleContactChange("expirationDate", newValue)
                  }
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};
