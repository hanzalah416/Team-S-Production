import FindClosestMatch from "../HelperFunctions/FindClosestMatch.ts";
import isFirstWord from "../HelperFunctions/IsFirstWord.ts";
import MicIcon from "@mui/icons-material/Mic";
import { useNavigate } from "react-router-dom";
import jingle from "../assets/320181__dland__hint.mp3";
import { useEffect, useState } from "react";
import PlayJingle from "../HelperFunctions/PlayJingle.ts";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import "./NavBar.css";

//Function to turn speech into text
export default function SpeechNavigate() {
  const [userInteracted, setUserInteracted] = useState(false);
  let voiceOn = GetVoiceBool();

  useEffect(() => {
    const handleInteraction = () => {
      setUserInteracted(true);
    };

    // Add event listeners when the component mounts
    document.addEventListener("mousedown", handleInteraction);
    document.addEventListener("keydown", handleInteraction);

    // Clean up event listeners when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
    };
  }, []);

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  const activationPhrase = "hey brigham";

  const grammar = `
  #JSGF V1.0;
  
  grammar activation;
  
  public <activation> = ${activationPhrase};
`;
  const SpeechGrammarList =
    window.SpeechGrammarList || window.webkitSpeechGrammarList;
  const speechRecognitionList = new SpeechGrammarList();
  speechRecognitionList.addFromString(grammar, 1);

  const activation = new SpeechRecognition();

  activation.grammars = speechRecognitionList;
  activation.continuous = true;
  activation.lang = "en-US";
  activation.interimResults = false;
  activation.maxAlternatives = 1;

  const navigate = useNavigate();

  function StartListening() {
    activation.start();
  }

  function ResetSpeechRecognition() {
    console.log("Resetting speech recognition...");

    activation.stop(); // Stop the ongoing speech recognition

    if (voiceOn) {
      // Start listening again
      setTimeout(() => {
        StartListening();
      }, 1000);
    }
  }

  function handleClick() {
    if (userInteracted) {
      PlayJingle("jingle");
    }
    recognition.start();
    activation.stop();

    console.log("Ready to receive Location");
  }

  activation.onresult = (event) => {
    const rawspeech = event.results[0][0].transcript;
    //console.log(rawspeech);

    if (rawspeech.toLowerCase().includes("hey brigham")) {
      handleClick();
    } else {
      ResetSpeechRecognition();
    }
  };

  recognition.onresult = (event) => {
    const spokenLocationRaw = event.results[0][0].transcript;
    //console.log(spokenLocationRaw);

    if (isFirstWord(spokenLocationRaw, ["go", "navigate"])) {
      const services = [
        "order flowers",
        "sanitation services",
        "language request",
        "room scheduling",
        "security request",
        "transport request",
        "medicine delivery request",
        "node data",
        "map editing",
        "floor map",
        "manage database",
        "home page",
        "all service requests",
        "credit page",
        "about page",
        "gift request",
        "map",
        "stats page",
        "statistics",
        "subscription page",
        "email send out",
      ];

      const navigatedService = FindClosestMatch(spokenLocationRaw, services);

      switch (navigatedService) {
        case "order flowers":
          navigate("/order-flowers");
          break;
        case "sanitation services":
          navigate("/sanitation-request");
          break;
        case "language request":
          navigate("/language-request");
          break;
        case "room scheduling":
          navigate("/room-scheduling");
          break;
        case "security request":
          navigate("/security-request");
          break;
        case "transport request":
          navigate("/transport-request");
          break;
        case "medicine delivery request":
          navigate("/medicine-delivery-request");
          break;
        case "node data":
          navigate("/node-data");
          break;
        case "map":
          navigate("/floor-map");
          break;
        case "floor map":
          navigate("/floor-map");
          break;
        case "map editing":
          navigate("/map-debug");
          break;
        case "manage database":
          navigate("/node-data");
          break;
        case "all service requests":
          navigate("/all-service-requests");
          break;
        case "credit page":
          navigate("/credit-page");
          break;
        case "about page":
          navigate("/about-page");
          break;
        case "gift request":
          navigate("/gift-request");
          break;
        case "stats page":
          navigate("/stats-page");
          break;
        case "statistics":
          navigate("/stats-page");
          break;
        case "subscription page":
          navigate("/sign-up-email");
          break;
        case "email send out":
          navigate("/message-publish");
          break;
        case "home page":
          navigate("/");
          break;

        default:
          navigate("/");
          break;
      }
    } else {
      recognition.stop();
      console.log("Nothing said");
    }
    if (voiceOn) {
      activation.start();
    }
  };

  //Handle turning on and off the voice activation
  function handleChange() {
    if (voiceOn) {
      activation.stop();
      voiceOn = false;
      localStorage.setItem("voice", "false");
      console.log("turning off voice");
    } else {
      voiceOn = true;
      activation.start();
      localStorage.setItem("voice", "true");
      console.log("turning on voice");
    }
  }

  function GetVoiceBool() {
    switch (localStorage.getItem("voice")) {
      case "true":
        return true;
      case "false":
        return false;
    }
  }

  return (
    <div className={"micSettings"} style={{ marginLeft: 1 }}>
      <audio id="jingle" src={jingle}></audio>
      <button onClick={handleClick} className={"navMic"}>
        <MicIcon style={{ color: "white" }} />
      </button>
      <FormControlLabel
        control={
          <Switch
            defaultChecked={GetVoiceBool()}
            onChange={() => handleChange()}
            color={"secondary"}
            sx={{
              fontSize: 9,
              "& .MuiSwitch-switchBase": {
                color: "#474747",
                // Thumb color when unchecked
                "&.Mui-checked": {
                  color: "#003b9c", // Thumb color when checked
                },
                "&.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "#0251d4", // Track color when checked
                },
              },
            }}
          />
        }
        sx={{ marginLeft: 1 }}
        label={""}
      />

      {/*<button onClick={() => localStorage.clear()}>Clear</button>*/}
    </div>
  );
}
