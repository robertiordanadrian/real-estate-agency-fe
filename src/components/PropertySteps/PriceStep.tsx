import React, { useState } from "react";
import { AttachFile } from "@mui/icons-material";
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
  Button,
  Paper,
  useTheme,
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
  const [selectedContractName, setSelectedContractName] = useState<string>("");
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

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
        {/* === DETALII PREȚ === */}
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" mb={2} fontWeight={600}>
              Detalii preț
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  label="Ultimul preț"
                  value={data.priceDetails.lastPrice}
                  onChange={(e) =>
                    handlePriceChange("lastPrice", e.target.value)
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

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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

            {/* Switches */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={data.priceDetails.tva}
                      onChange={(e) =>
                        handlePriceChange("tva", e.target.checked)
                      }
                    />
                  }
                  label="TVA inclus"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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

        {/* === COMISIOANE === */}
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" mb={2} fontWeight={600}>
              Comisioane
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  label="Comision cumpărător %"
                  value={data.commissions.buyerCommission}
                  onChange={(e) =>
                    handleCommissionsChange("buyerCommission", e.target.value)
                  }
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  label="Comision proprietar %"
                  value={data.commissions.ownerCommission}
                  onChange={(e) =>
                    handleCommissionsChange("ownerCommission", e.target.value)
                  }
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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

        {/* === DETALII CONTRACT === */}
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
                    value={data.contact.type}
                    label="Tip contract"
                    onChange={(e) =>
                      handleContactChange("type", e.target.value)
                    }
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

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  label="Număr contract"
                  value={data.contact.contractNumber}
                  onChange={(e) =>
                    handleContactChange("contractNumber", e.target.value)
                  }
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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
                        : data.contact.contractFile ||
                          "Încarcă fișier contract")}
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
};
