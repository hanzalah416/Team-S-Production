import { Node } from "../common/NodeInterface.ts";
import { Position } from "../common/PositionInterface.ts";
import { useEffect, useState } from "react";
import FindClosestMatch from "../HelperFunctions/FindClosestMatch.ts";
import SpeechKey from "./SpeechKey.ts";
import isFirstWord from "../HelperFunctions/IsFirstWord.ts";
import { GetSecondWord } from "../HelperFunctions/GetSecondWord.ts";
import MicIcon from "@mui/icons-material/Mic";
import styles from "./FloorMap.module.css";
import { useNavigate } from "react-router-dom";
import jingle from "../assets/320181__dland__hint.mp3";
import PlayJingle from "../HelperFunctions/PlayJingle.ts";

//Function to turn speech into text
export default function SpeechToText(props: {
  handleSelection: (value: Position | null, type: "start" | "end") => void;
  getPositionById: (id: string) => Position;
  startPosition: Position | null;
}) {
  const [locations, setLocations] = useState<Position[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const sortedLocations = [...locations]
    .filter((location) => !location.label.includes("Hall")) // Change startsWith to includes
    .sort((a, b) => a.label.localeCompare(b.label))
    .map((location) => location.label);

  useEffect(() => {
    fetch("/api/nodes")
      .then((response) => response.json())
      .then((nodes: Node[]) => {
        const formattedLocations: Position[] = nodes.map((node) => ({
          label: node.longName || "Unknown",
          id: node.id,
          top: `${node.ycoord}px`,
          left: `${node.xcoord}px`,
          floor: node.floor,
        }));
        setLocations(formattedLocations);
      })
      .catch((error) => console.error("Failed to fetch node data:", error));
  }, []);

  const grammar =
    "#JSGF V1.0; grammar locations; public <location> = " +
    sortedLocations.join(" | ") +
    " ;";
  const SpeechRecognition =
    window.webkitSpeechRecognition || window.SpeechRecognition;
  const SpeechGrammarList =
    window.webkitSpeechGrammarList || window.SpeechGrammarList;
  const recognition = new SpeechRecognition();
  const speechRecognitionList = new SpeechGrammarList();
  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
  recognition.continuous = false;
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  const navigate = useNavigate();

  function handleClick() {
    if (!isRecording) {
      setIsRecording(true);
      recognition.start();
      PlayJingle("jingle");
      console.log("Ready to receive location command.");
    }
  }

  recognition.onend = () => {
    setIsRecording(false);
  };

  recognition.onerror = (event) => {
    console.error("Recognition error:", event.error);
    setIsRecording(false); // Handle errors like no speech detected
  };

  recognition.onresult = (event) => {
    const spokenLocationRaw = event.results[0][0].transcript;
    console.log(spokenLocationRaw);
    //console.log(sortedLocations);
    PlayJingle("outJingle");

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
        "manage database",
        "home page",
        "all service requests",
        "credit page",
        "about page",
        "gift request",
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
        case "home page":
          navigate("/");
          break;

        default:
          navigate("/");
          break;
      }
    } else if (isFirstWord(spokenLocationRaw, ["closest", "nearest"])) {
      const keyTypes = [
        "atm",
        "busstop",
        "cafe",
        "elevator",
        "emergency",
        "entrance",
        "escalator",
        "handicapped",
        "parking",
        "restroom",
        "valet",
        "vending",
        "waitingroom",
      ];

      const locationType = FindClosestMatch(
        GetSecondWord(spokenLocationRaw),
        keyTypes,
      );

      if (props.startPosition) {
        SpeechKey(
          props.startPosition?.id,
          props.handleSelection,
          props.getPositionById,
          locationType,
        );
      }
    } else if (!props.startPosition) {
      const spokenLocation = FindClosestMatch(
        spokenLocationRaw,
        sortedLocations,
      );

      props.handleSelection(FindLocationByLongName(spokenLocation), "start");
    } else {
      const spokenLocation = FindClosestMatch(
        spokenLocationRaw,
        sortedLocations,
      );

      props.handleSelection(FindLocationByLongName(spokenLocation), "end");
    }
    setIsRecording(false);
    console.log("done");
  };

  //Find the location based on long name given
  const FindLocationByLongName = (longNameToFind: string): Position | null => {
    const foundLocation = locations.find(
      (location) =>
        location.label.toLowerCase() === longNameToFind.toLowerCase(),
    );
    return foundLocation !== undefined ? foundLocation : null;
  };

  const buttonStyle = isRecording ? { backgroundColor: "red" } : {};

  return (
    <div>
      <audio id="jingle" src={jingle}></audio>
      <button
        onClick={handleClick}
        className={styles.micButton}
        style={buttonStyle}
      >
        <MicIcon />
      </button>
    </div>
  );
}
