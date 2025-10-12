import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControlLabel,
  Checkbox,
  Grid,
} from "@mui/material";
import {
  EGeneral,
  EIrigationSystem,
  EAirConditioning,
  EFurnished,
  EAdditionalSpaces,
  EKitchen,
  EAccounting,
  EAppliances,
  EImmobile,
  ERecreationalSpaces,
  EExterior,
  EFinishesStatus,
  EFinishesInsulation,
  EFinishesWalls,
  EFinishesFlooring,
  EFinishesWindows,
  EFinishesLouver,
  EFinishesEnteringDoor,
  EFinishesInteriorDoors,
} from "../../../common/enums/utilities.enums";
import type { IUtilities } from "../../../common/interfaces/utilities.interface";

interface UtilityStepProps {
  data: IUtilities;
  onChange: (updated: IUtilities) => void;
}

export const UtilityStep: React.FC<UtilityStepProps> = ({ data, onChange }) => {
  const handleArrayChange = (
    key: keyof Omit<IUtilities, "finishes" | "equipment">,
    value: string,
    checked: boolean
  ) => {
    const currentArray = data[key] as string[];
    const updatedArray = checked
      ? [...currentArray, value]
      : currentArray.filter((item) => item !== value);
    onChange({ ...data, [key]: updatedArray });
  };

  const handleEquipmentChange = (
    key: keyof IUtilities["equipment"],
    value: string,
    checked: boolean
  ) => {
    const currentArray = data.equipment[key] as string[];
    const updatedArray = checked
      ? [...currentArray, value]
      : currentArray.filter((item) => item !== value);
    onChange({
      ...data,
      equipment: { ...data.equipment, [key]: updatedArray },
    });
  };

  const handleFinishesChange = (
    key: keyof IUtilities["finishes"],
    value: string,
    checked: boolean
  ) => {
    const currentArray = data.finishes[key] as string[];
    const updatedArray = checked
      ? [...currentArray, value]
      : currentArray.filter((item) => item !== value);
    onChange({ ...data, finishes: { ...data.finishes, [key]: updatedArray } });
  };

  const CheckboxGroup = ({
    title,
    values,
    selected,
    onChange,
  }: {
    title: string;
    values: readonly string[];
    selected: string[];
    onChange: (value: string, checked: boolean) => void;
  }) => (
    <Card>
      <CardContent>
        <Typography variant="subtitle1" mb={2}>
          {title}
        </Typography>
        <Grid container spacing={2}>
          {values.map((value) => (
            <Grid key={value} size={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selected.includes(value)}
                    onChange={(e) => onChange(value, e.target.checked)}
                  />
                }
                label={value}
              />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        overflow: "auto",
      }}
    >
      <CheckboxGroup
        title="Utilitati Generale"
        values={Object.values(EGeneral)}
        selected={data.generals}
        onChange={(value, checked) =>
          handleArrayChange("generals", value, checked)
        }
      />

      <CheckboxGroup
        title="Sistem de Incalzire"
        values={Object.values(EIrigationSystem)}
        selected={data.irigationSystem}
        onChange={(value, checked) =>
          handleArrayChange("irigationSystem", value, checked)
        }
      />

      <CheckboxGroup
        title="Aer Conditionat"
        values={Object.values(EAirConditioning)}
        selected={data.airConditioning}
        onChange={(value, checked) =>
          handleArrayChange("airConditioning", value, checked)
        }
      />

      <CheckboxGroup
        title="Mobilat"
        values={Object.values(EFurnished)}
        selected={data.equipment.furnished}
        onChange={(value, checked) =>
          handleEquipmentChange("furnished", value, checked)
        }
      />

      <CheckboxGroup
        title="Spatii Aditionale"
        values={Object.values(EAdditionalSpaces)}
        selected={data.equipment.additionalSpaces}
        onChange={(value, checked) =>
          handleEquipmentChange("additionalSpaces", value, checked)
        }
      />

      <CheckboxGroup
        title="Bucatarie"
        values={Object.values(EKitchen)}
        selected={data.equipment.kitchen}
        onChange={(value, checked) =>
          handleEquipmentChange("kitchen", value, checked)
        }
      />

      <CheckboxGroup
        title="Contorizare"
        values={Object.values(EAccounting)}
        selected={data.equipment.accounting}
        onChange={(value, checked) =>
          handleEquipmentChange("accounting", value, checked)
        }
      />

      <CheckboxGroup
        title="Electrocasnice"
        values={Object.values(EAppliances)}
        selected={data.equipment.appliances}
        onChange={(value, checked) =>
          handleEquipmentChange("appliances", value, checked)
        }
      />

      <CheckboxGroup
        title="Dotari Imobil"
        values={Object.values(EImmobile)}
        selected={data.equipment.immobile}
        onChange={(value, checked) =>
          handleEquipmentChange("immobile", value, checked)
        }
      />

      <CheckboxGroup
        title="Spatii Recreative"
        values={Object.values(ERecreationalSpaces)}
        selected={data.equipment.recreationalSpaces}
        onChange={(value, checked) =>
          handleEquipmentChange("recreationalSpaces", value, checked)
        }
      />

      <CheckboxGroup
        title="Exterior"
        values={Object.values(EExterior)}
        selected={data.equipment.exterior}
        onChange={(value, checked) =>
          handleEquipmentChange("exterior", value, checked)
        }
      />

      <CheckboxGroup
        title="Stare Finisaje"
        values={Object.values(EFinishesStatus)}
        selected={data.finishes.status}
        onChange={(value, checked) =>
          handleFinishesChange("status", value, checked)
        }
      />

      <CheckboxGroup
        title="Izolatie"
        values={Object.values(EFinishesInsulation)}
        selected={data.finishes.insulation}
        onChange={(value, checked) =>
          handleFinishesChange("insulation", value, checked)
        }
      />

      <CheckboxGroup
        title="Finisaje Pereti"
        values={Object.values(EFinishesWalls)}
        selected={data.finishes.walls}
        onChange={(value, checked) =>
          handleFinishesChange("walls", value, checked)
        }
      />

      <CheckboxGroup
        title="Finisaje Pardoseala"
        values={Object.values(EFinishesFlooring)}
        selected={data.finishes.flooring}
        onChange={(value, checked) =>
          handleFinishesChange("flooring", value, checked)
        }
      />

      <CheckboxGroup
        title="Ferestre"
        values={Object.values(EFinishesWindows)}
        selected={data.finishes.windows}
        onChange={(value, checked) =>
          handleFinishesChange("windows", value, checked)
        }
      />

      <CheckboxGroup
        title="Jaluzele"
        values={Object.values(EFinishesLouver)}
        selected={data.finishes.louver}
        onChange={(value, checked) =>
          handleFinishesChange("louver", value, checked)
        }
      />

      <CheckboxGroup
        title="Usa de Intrare"
        values={Object.values(EFinishesEnteringDoor)}
        selected={data.finishes.enteringDoor}
        onChange={(value, checked) =>
          handleFinishesChange("enteringDoor", value, checked)
        }
      />

      <CheckboxGroup
        title="Usi Interioare"
        values={Object.values(EFinishesInteriorDoors)}
        selected={data.finishes.interiorDoors}
        onChange={(value, checked) =>
          handleFinishesChange("interiorDoors", value, checked)
        }
      />
    </Box>
  );
};
