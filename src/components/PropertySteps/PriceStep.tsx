import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  InputAdornment,
} from "@mui/material";
import { IPrice } from "../../common/interfaces/price.interface";
import {
  EContactType,
  ECurrency,
  EPaymentMethod,
  ESignedContract,
} from "../../common/enums/price.enums";

interface PriceStepProps {
  data: IPrice;
  onChange: (updated: IPrice) => void;
}

export const PriceStep: React.FC<PriceStepProps> = ({ data, onChange }) => {
  const handlePriceChange = (key: keyof IPrice["priceDetails"], value: any) => {
    onChange({
      ...data,
      priceDetails: { ...data.priceDetails, [key]: value },
    });
  };

  const handleCommissionsChange = (
    key: keyof IPrice["commissions"],
    value: any
  ) => {
    onChange({
      ...data,
      commissions: { ...data.commissions, [key]: value },
    });
  };

  const handleContactChange = (key: keyof IPrice["contact"], value: any) => {
    onChange({
      ...data,
      contact: { ...data.contact, [key]: value },
    });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* -------------------- Detalii Preț -------------------- */}
      <Card>
        <CardContent>
          <Typography variant="subtitle1" mb={2}>
            Detalii preț
          </Typography>

          <Grid container spacing={2}>
            <Grid size={3}>
              <TextField
                label="Preț"
                value={data.priceDetails.price}
                onChange={(e) => handlePriceChange("price", e.target.value)}
                fullWidth
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">€</InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>

            <Grid size={3}>
              <FormControl fullWidth>
                <InputLabel>Monedă</InputLabel>
                <Select
                  value={data.priceDetails.currency}
                  label="Monedă"
                  onChange={(e) =>
                    handlePriceChange("currency", e.target.value)
                  }
                >
                  {Object.values(ECurrency).map((val) => (
                    <MenuItem key={val} value={val}>
                      {val}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={3}>
              <TextField
                label="Preț / mp"
                value={data.priceDetails.pricePerMp}
                onChange={(e) =>
                  handlePriceChange("pricePerMp", e.target.value)
                }
                fullWidth
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">€/mp</InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>

            <Grid size={3}>
              <FormControl fullWidth>
                <InputLabel>Metodă plată</InputLabel>
                <Select
                  value={data.priceDetails.paymentMethod}
                  label="Metodă plată"
                  onChange={(e) =>
                    handlePriceChange("paymentMethod", e.target.value)
                  }
                >
                  {Object.values(EPaymentMethod).map((val) => (
                    <MenuItem key={val} value={val}>
                      {val}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={3}>
              <TextField
                label="Ultimul preț"
                value={data.priceDetails.lastPrice}
                onChange={(e) => handlePriceChange("lastPrice", e.target.value)}
                fullWidth
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">€</InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>

            <Grid size={3}>
              <TextField
                label="Preț garaj"
                value={data.priceDetails.garagePrice}
                onChange={(e) =>
                  handlePriceChange("garagePrice", e.target.value)
                }
                fullWidth
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">€</InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>

            <Grid size={3}>
              <TextField
                label="Preț parcare"
                value={data.priceDetails.parkingPrice}
                onChange={(e) =>
                  handlePriceChange("parkingPrice", e.target.value)
                }
                fullWidth
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">€</InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>

            <Grid size={3}>
              <TextField
                label="Notițe private preț"
                value={data.priceDetails.privateNotePrice}
                onChange={(e) =>
                  handlePriceChange("privateNotePrice", e.target.value)
                }
                fullWidth
              />
            </Grid>
          </Grid>

          {/* Boolean price options */}
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid size={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={data.priceDetails.tva}
                    onChange={(e) => handlePriceChange("tva", e.target.checked)}
                  />
                }
                label="TVA inclus"
              />
            </Grid>

            <Grid size={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={data.priceDetails.negociablePrice}
                    onChange={(e) =>
                      handlePriceChange("negociablePrice", e.target.checked)
                    }
                  />
                }
                label="Preț negociabil"
              />
            </Grid>

            <Grid size={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={data.priceDetails.requestPrice}
                    onChange={(e) =>
                      handlePriceChange("requestPrice", e.target.checked)
                    }
                  />
                }
                label="Preț la cerere"
              />
            </Grid>

            <Grid size={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={data.priceDetails.showPricePerMp}
                    onChange={(e) =>
                      handlePriceChange("showPricePerMp", e.target.checked)
                    }
                  />
                }
                label="Afișează €/mp"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* -------------------- Comisioane -------------------- */}
      <Card>
        <CardContent>
          <Typography variant="subtitle1" mb={2}>
            Comisioane
          </Typography>

          <Grid container spacing={2}>
            <Grid size={3}>
              <TextField
                label="Comision cumpărător"
                value={data.commissions.buyerCommission}
                onChange={(e) =>
                  handleCommissionsChange("buyerCommission", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid size={3}>
              <TextField
                label="Valoare comision cumpărător"
                value={data.commissions.buyerCommissionValue}
                onChange={(e) =>
                  handleCommissionsChange(
                    "buyerCommissionValue",
                    e.target.value
                  )
                }
                fullWidth
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">€</InputAdornment>
                    ),
                  },
                }}
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
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">€</InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* -------------------- Detalii Contract -------------------- */}
      <Card>
        <CardContent>
          <Typography variant="subtitle1" mb={2}>
            Detalii contract
          </Typography>

          <Grid container spacing={2}>
            <Grid size={3}>
              <FormControl fullWidth>
                <InputLabel>Tip contract</InputLabel>
                <Select
                  value={data.contact.type}
                  label="Tip contract"
                  onChange={(e) => handleContactChange("type", e.target.value)}
                >
                  {Object.values(EContactType).map((val) => (
                    <MenuItem key={val} value={val}>
                      {val}
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
                  {Object.values(ESignedContract).map((val) => (
                    <MenuItem key={val} value={val}>
                      {val}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={3}>
              <TextField
                label="Număr contract"
                value={data.contact.contractNumber}
                onChange={(e) =>
                  handleContactChange("contractNumber", e.target.value)
                }
                fullWidth
              />
            </Grid>

            <Grid size={3}>
              <TextField
                label="Data semnării"
                type="date"
                value={
                  data.contact.signDate
                    ? new Date(data.contact.signDate)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  handleContactChange("signDate", new Date(e.target.value))
                }
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid size={3}>
              <TextField
                label="Data expirării"
                type="date"
                value={
                  data.contact.expirationDate
                    ? new Date(data.contact.expirationDate)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  handleContactChange(
                    "expirationDate",
                    new Date(e.target.value)
                  )
                }
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid size={3}>
              <TextField
                label="Fișier contract (nume / link)"
                value={data.contact.contractFile}
                onChange={(e) =>
                  handleContactChange("contractFile", e.target.value)
                }
                fullWidth
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};
