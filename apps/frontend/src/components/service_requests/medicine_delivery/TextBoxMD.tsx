import * as React from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { useEffect } from "react";
import axios from "axios";

const filter = createFilterOptions<MedicineOptionType>();

interface FreeSoloCreateOptionDialogProps {
  nameMedicine: string;
  setNameMedicine: React.Dispatch<React.SetStateAction<string>>;
}

export default function FreeSoloCreateOptionDialog(
  prop: FreeSoloCreateOptionDialogProps,
) {
  const [value, setValue] = React.useState<MedicineOptionType | null>(null);
  const [open, toggleOpen] = React.useState(false);
  const [medicineData, setMedicineData] =
    React.useState<MedicineOptionType[]>(medicineDataOriginal);

  const handleClose = () => {
    setDialogValue({
      genericName: "",
      synName: "",
    });
    toggleOpen(false);
  };

  const [dialogValue, setDialogValue] = React.useState({
    genericName: "",
    synName: "",
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const createMedicineAttempt = {
      genericName: dialogValue.genericName,
      synName: dialogValue.synName,
    };

    try {
      // Make a POST request to your route with the medicine data
      await axios.post("/api/meds-autofill", createMedicineAttempt);
      console.log("Successfully saved medicine to autofill");

      // Add the new medicine data to the array
      setMedicineData((prevData) => [...prevData, createMedicineAttempt]);

      prop.setNameMedicine(dialogValue.synName + dialogValue.genericName);
      handleClose();
    } catch (error) {
      console.error("Error saving medicine to autofill:", error);
    }
  };

  useEffect(() => {
    if (value != null) {
      prop.setNameMedicine(value.genericName);
    }
  }, [value, prop, dialogValue]);

  return (
    <React.Fragment>
      <Autocomplete
        value={value}
        onChange={(event, newValue) => {
          if (typeof newValue === "string") {
            // timeout to avoid instant validation of the dialog's form.
            setTimeout(() => {
              toggleOpen(true);
              setDialogValue({
                genericName: newValue,
                synName: "",
              });
            });
          } else if (newValue && newValue.inputValue) {
            toggleOpen(true);
            setDialogValue({
              genericName: newValue.inputValue,
              synName: "",
            });
          } else {
            setValue(newValue);
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          if (params.inputValue !== "") {
            filtered.push({
              synName: "",
              inputValue: params.inputValue,
              genericName: `Add "${params.inputValue}"`,
            });
          }

          return filtered;
        }}
        id="Name of Medicine"
        options={medicineData}
        getOptionLabel={(option) => {
          // for example value selected with enter, right from the input
          if (typeof option === "string") {
            return option;
          }
          if (option.inputValue) {
            return option.inputValue;
          }
          return option.genericName;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        renderOption={(props, option) => (
          <li {...props}>{option.genericName}</li>
        )}
        sx={{ width: 300 }}
        freeSolo
        renderInput={(params) => (
          <TextField {...params} label="Medicine Name" />
        )}
      />
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Add a new medicine</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Only add a new medicine if it doesn't appear on the list
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              value={dialogValue.genericName}
              onChange={(event) =>
                setDialogValue({
                  ...dialogValue,
                  genericName: event.target.value,
                })
              }
              label="Generic Brand"
              type="text"
              variant="standard"
            />
            <TextField
              margin="dense"
              id="name"
              value={dialogValue.synName}
              onChange={(event) =>
                setDialogValue({
                  ...dialogValue,
                  synName: event.target.value,
                })
              }
              label="Synomyn Name"
              type="text"
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Add</Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
}

interface MedicineOptionType {
  inputValue?: string;
  genericName: string;
  synName: string;
}

// export const GenericName = "Generic Name";

// https://rxtechexam.com/top-100-drugs/
// This is a list of the top 100 used drugs in the world
// In later iterations want to add a connection to backend so there can be more
const medicineDataOriginal: MedicineOptionType[] = [
  {
    genericName: "zolpidem",
    synName: "Ambien",
  },
  {
    genericName: "Yaz (drospirenone and ethinyl estradiol)",
    synName: "Yaz",
  },
  {
    genericName: "viagra (sildenafil HCl)",
    synName: "Viagra",
  },
  {
    genericName: "verapamil SR",
    synName: "Calan SR;Verelan PM",
  },
  {
    genericName: "venlafaxine XR",
    synName: "Effexor XR",
  },
  {
    genericName: "valsartan",
    synName: "Diovan",
  },
  {
    genericName: "valaciclovir",
    synName: "Valtrex",
  },
  {
    genericName: "triamterene and hydrochlorothiazide",
    synName: "Dyazide;Maxzide",
  },
  {
    genericName: "triamcinolone Ace topical",
    synName: "Aristocort;Cinalog;Kenalog;Triderm",
  },
  {
    genericName: "trazodone HCl",
    synName: "Desyrel",
  },
  {
    genericName: "tramadol",
    synName: "Ultram",
  },
  {
    genericName: "topiramate",
    synName: "Topamax",
  },
  {
    genericName: "temezepam",
    synName: "Restoril",
  },
  {
    genericName: "tamsulosin",
    synName: "Flomax",
  },
  {
    genericName: "synthroid (levothyroxine sodium)",
    synName: "Synthroid",
  },
  {
    genericName: "sulfamethoxazole and trimethoprim DS",
    synName: "Bactrim DS;Septra DS",
  },
  {
    genericName: "spironolactone",
    synName: "Aldactone",
  },
  {
    genericName: "simvastatin",
    synName: "Zocor",
  },
  {
    genericName: "sertraline HCl",
    synName: "Zoloft",
  },
  {
    genericName: "rosuvastatin",
    synName: "Crestor",
  },
  {
    genericName: "ranitidine",
    synName: "Zantac",
  },
  {
    genericName: "quetiapine",
    synName: "Seroquel",
  },
  {
    genericName: "promethazine",
    synName: "Phenergan",
  },
  {
    genericName: "Premarin (conjugated estrogens)",
    synName: "Premarin",
  },
  {
    genericName: "pregabalin",
    synName: "Lyrica",
  },
  {
    genericName: "prednisone",
    synName: "Deltasone",
  },
  {
    genericName: "pravastatin",
    synName: "Pravachol",
  },
  {
    genericName: "potassium Chloride",
    synName: "Klor-Con",
  },
  {
    genericName: "pioglitazone",
    synName: "Actos",
  },
  {
    genericName: "paroxetine",
    synName: "Paxil",
  },
  {
    genericName: "pantoprazole",
    synName: "Protonix",
  },
  {
    genericName: "oxycodone and acetaminophen",
    synName: "Percocet;Tylox;Roxicet;Endocet",
  },
  {
    genericName: "omeprazole",
    synName: "Prilosec",
  },
  {
    genericName: "naproxen",
    synName: "Naprosyn",
  },
  {
    genericName: "montelukast",
    synName: "Singulair",
  },
  {
    genericName: "mometasone",
    synName: "Nasonex",
  },
  {
    genericName: "metoprolol tartrate",
    synName: "Lopressor",
  },
  {
    genericName: "metoprolol succinate XL",
    synName: "Toprol",
  },
  {
    genericName: "methylprednisone",
    synName: "Medrol",
  },
  {
    genericName: "metformin HCl",
    synName: "Glucophage",
  },
  {
    genericName: "meloxicam",
    synName: "Mobic",
  },
  {
    genericName: "lovastatin",
    synName: "Mevacor",
  },
  {
    genericName: "losartan",
    synName: "Cozaar",
  },
  {
    genericName: "lorazepam",
    synName: "Ativan",
  },
  {
    genericName: "lisinopril and hydrochlorothiazide",
    synName: "Prinizide;Zestoretic",
  },
  {
    genericName: "lisinopril",
    synName: "Prinivil;Zestril",
  },
  {
    genericName: "levothyroxine sodium",
    synName: "Synthroid;Levoxl",
  },
  {
    genericName: "levofloxacin",
    synName: "Levaquin",
  },
  {
    genericName: "lantus (insulin glargine)",
    synName: "Lantus",
  },
  {
    genericName: "lansoprazole",
    synName: "Prevacid",
  },
  {
    genericName: "isosorbide mononitrate",
    synName: "Imdur",
  },
  {
    genericName: "ibuprophen",
    synName: "Motrin",
  },
  {
    genericName: "hydrocodone and acetaminophen",
    synName: "Lortab;Lorcet;Norco;Vicodin",
  },
  {
    genericName: "hydrochlorothiazide",
    synName: "Microzide",
  },
  {
    genericName: "glyburide",
    synName: "Diabeta",
  },
  {
    genericName: "glipizide",
    synName: "Glucotrol",
  },
  {
    genericName: "glimepiride",
    synName: "Amaryl",
  },
  {
    genericName: "gabapentin",
    synName: "Neurontin",
  },
  {
    genericName: "furosemide",
    synName: "Lasix",
  },
  {
    genericName: "folic acid",
    synName: "Folic Acid",
  },
  {
    genericName: "fluticasone nasal spray",
    synName: "Flonase",
  },
  {
    genericName: "fluticasone and salmeterol inhaler",
    synName: "Advair",
  },
  {
    genericName: "fluoxetine HCl",
    synName: "Prozac",
  },
  {
    genericName: "fluconozole",
    synName: "Diflucan",
  },
  {
    genericName: "fexofenadine",
    synName: "Allegra",
  },
  {
    genericName: "fenofibrate",
    synName: "Tricor",
  },
  {
    genericName: "ezetimibe",
    synName: "Zetia",
  },
  {
    genericName: "esomeprazole",
    synName: "Nexium",
  },
  {
    genericName: "escitalopram",
    synName: "Lexapro",
  },
  {
    genericName: "enalapril",
    synName: "Vasotec",
  },
  {
    genericName: "Duloxetine",
    synName: "Cymbalta",
  },
  {
    genericName: "doxycycline hyclate",
    synName: "Vibramycin",
  },
  {
    genericName: "diclofenac sodium",
    synName: "Voltaren",
  },
  {
    genericName: "diazepam",
    synName: "Valium",
  },
  {
    genericName: "cyclobenzaprine",
    synName: "Flexeril",
  },
];
