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

  const handleClose = () => {
    setDialogValue({
      GenericName: "",
      BrandName: "",
    });
    toggleOpen(false);
  };

  const [dialogValue, setDialogValue] = React.useState({
    GenericName: "",
    BrandName: "",
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValue({
      GenericName: dialogValue.GenericName,
      BrandName: dialogValue.BrandName,
    });
    prop.setNameMedicine(dialogValue.BrandName + dialogValue.GenericName);
    console.log(dialogValue.BrandName + dialogValue.GenericName);
    handleClose();
  };

  useEffect(() => {
    if (value != null) {
      prop.setNameMedicine(value.GenericName);
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
                GenericName: newValue,
                BrandName: "",
              });
            });
          } else if (newValue && newValue.inputValue) {
            toggleOpen(true);
            setDialogValue({
              GenericName: newValue.inputValue,
              BrandName: "",
            });
          } else {
            setValue(newValue);
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          if (params.inputValue !== "") {
            filtered.push({
              BrandName: "",
              inputValue: params.inputValue,
              GenericName: `Add "${params.inputValue}"`,
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
          return option.GenericName;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        renderOption={(props, option) => (
          <li {...props}>{option.GenericName}</li>
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
              value={dialogValue.GenericName}
              onChange={(event) =>
                setDialogValue({
                  ...dialogValue,
                  GenericName: event.target.value,
                })
              }
              label="Generic Brand"
              type="text"
              variant="standard"
            />
            <TextField
              margin="dense"
              id="name"
              value={dialogValue.BrandName}
              onChange={(event) =>
                setDialogValue({
                  ...dialogValue,
                  BrandName: event.target.value,
                })
              }
              label="Brand Name"
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
  GenericName: string;
  BrandName: string;
}

// export const GenericName = "Generic Name";

// https://rxtechexam.com/top-100-drugs/
// This is a list of the top 100 used drugs in the world
// In later iterations want to add a connection to backend so there can be more
const medicineData: readonly MedicineOptionType[] = [
  {
    GenericName: "zolpidem",
    BrandName: "Ambien",
  },
  {
    GenericName: "Yaz (drospirenone and ethinyl estradiol)",
    BrandName: "Yaz",
  },
  {
    GenericName: "viagra (sildenafil HCl)",
    BrandName: "Viagra",
  },
  {
    GenericName: "verapamil SR",
    BrandName: "Calan SR;Verelan PM",
  },
  {
    GenericName: "venlafaxine XR",
    BrandName: "Effexor XR",
  },
  {
    GenericName: "valsartan",
    BrandName: "Diovan",
  },
  {
    GenericName: "valaciclovir",
    BrandName: "Valtrex",
  },
  {
    GenericName: "triamterene and hydrochlorothiazide",
    BrandName: "Dyazide;Maxzide",
  },
  {
    GenericName: "triamcinolone Ace topical",
    BrandName: "Aristocort;Cinalog;Kenalog;Triderm",
  },
  {
    GenericName: "trazodone HCl",
    BrandName: "Desyrel",
  },
  {
    GenericName: "tramadol",
    BrandName: "Ultram",
  },
  {
    GenericName: "topiramate",
    BrandName: "Topamax",
  },
  {
    GenericName: "temezepam",
    BrandName: "Restoril",
  },
  {
    GenericName: "tamsulosin",
    BrandName: "Flomax",
  },
  {
    GenericName: "synthroid (levothyroxine sodium)",
    BrandName: "Synthroid",
  },
  {
    GenericName: "sulfamethoxazole and trimethoprim DS",
    BrandName: "Bactrim DS;Septra DS",
  },
  {
    GenericName: "spironolactone",
    BrandName: "Aldactone",
  },
  {
    GenericName: "simvastatin",
    BrandName: "Zocor",
  },
  {
    GenericName: "sertraline HCl",
    BrandName: "Zoloft",
  },
  {
    GenericName: "rosuvastatin",
    BrandName: "Crestor",
  },
  {
    GenericName: "ranitidine",
    BrandName: "Zantac",
  },
  {
    GenericName: "quetiapine",
    BrandName: "Seroquel",
  },
  {
    GenericName: "promethazine",
    BrandName: "Phenergan",
  },
  {
    GenericName: "Premarin (conjugated estrogens)",
    BrandName: "Premarin",
  },
  {
    GenericName: "pregabalin",
    BrandName: "Lyrica",
  },
  {
    GenericName: "prednisone",
    BrandName: "Deltasone",
  },
  {
    GenericName: "pravastatin",
    BrandName: "Pravachol",
  },
  {
    GenericName: "potassium Chloride",
    BrandName: "Klor-Con",
  },
  {
    GenericName: "pioglitazone",
    BrandName: "Actos",
  },
  {
    GenericName: "paroxetine",
    BrandName: "Paxil",
  },
  {
    GenericName: "pantoprazole",
    BrandName: "Protonix",
  },
  {
    GenericName: "oxycodone and acetaminophen",
    BrandName: "Percocet;Tylox;Roxicet;Endocet",
  },
  {
    GenericName: "omeprazole",
    BrandName: "Prilosec",
  },
  {
    GenericName: "naproxen",
    BrandName: "Naprosyn",
  },
  {
    GenericName: "montelukast",
    BrandName: "Singulair",
  },
  {
    GenericName: "mometasone",
    BrandName: "Nasonex",
  },
  {
    GenericName: "metoprolol tartrate",
    BrandName: "Lopressor",
  },
  {
    GenericName: "metoprolol succinate XL",
    BrandName: "Toprol",
  },
  {
    GenericName: "methylprednisone",
    BrandName: "Medrol",
  },
  {
    GenericName: "metformin HCl",
    BrandName: "Glucophage",
  },
  {
    GenericName: "meloxicam",
    BrandName: "Mobic",
  },
  {
    GenericName: "lovastatin",
    BrandName: "Mevacor",
  },
  {
    GenericName: "losartan",
    BrandName: "Cozaar",
  },
  {
    GenericName: "lorazepam",
    BrandName: "Ativan",
  },
  {
    GenericName: "lisinopril and hydrochlorothiazide",
    BrandName: "Prinizide;Zestoretic",
  },
  {
    GenericName: "lisinopril",
    BrandName: "Prinivil;Zestril",
  },
  {
    GenericName: "levothyroxine sodium",
    BrandName: "Synthroid;Levoxl",
  },
  {
    GenericName: "levofloxacin",
    BrandName: "Levaquin",
  },
  {
    GenericName: "lantus (insulin glargine)",
    BrandName: "Lantus",
  },
  {
    GenericName: "lansoprazole",
    BrandName: "Prevacid",
  },
  {
    GenericName: "isosorbide mononitrate",
    BrandName: "Imdur",
  },
  {
    GenericName: "ibuprophen",
    BrandName: "Motrin",
  },
  {
    GenericName: "hydrocodone and acetaminophen",
    BrandName: "Lortab;Lorcet;Norco;Vicodin",
  },
  {
    GenericName: "hydrochlorothiazide",
    BrandName: "Microzide",
  },
  {
    GenericName: "glyburide",
    BrandName: "Diabeta",
  },
  {
    GenericName: "glipizide",
    BrandName: "Glucotrol",
  },
  {
    GenericName: "glimepiride",
    BrandName: "Amaryl",
  },
  {
    GenericName: "gabapentin",
    BrandName: "Neurontin",
  },
  {
    GenericName: "furosemide",
    BrandName: "Lasix",
  },
  {
    GenericName: "folic acid",
    BrandName: "Folic Acid",
  },
  {
    GenericName: "fluticasone nasal spray",
    BrandName: "Flonase",
  },
  {
    GenericName: "fluticasone and salmeterol inhaler",
    BrandName: "Advair",
  },
  {
    GenericName: "fluoxetine HCl",
    BrandName: "Prozac",
  },
  {
    GenericName: "fluconozole",
    BrandName: "Diflucan",
  },
  {
    GenericName: "fexofenadine",
    BrandName: "Allegra",
  },
  {
    GenericName: "fenofibrate",
    BrandName: "Tricor",
  },
  {
    GenericName: "ezetimibe",
    BrandName: "Zetia",
  },
  {
    GenericName: "esomeprazole",
    BrandName: "Nexium",
  },
  {
    GenericName: "escitalopram",
    BrandName: "Lexapro",
  },
  {
    GenericName: "enalapril",
    BrandName: "Vasotec",
  },
  {
    GenericName: "Duloxetine",
    BrandName: "Cymbalta",
  },
  {
    GenericName: "doxycycline hyclate",
    BrandName: "Vibramycin",
  },
  {
    GenericName: "diclofenac sodium",
    BrandName: "Voltaren",
  },
  {
    GenericName: "diazepam",
    BrandName: "Valium",
  },
  {
    GenericName: "cyclobenzaprine",
    BrandName: "Flexeril",
  },
];
