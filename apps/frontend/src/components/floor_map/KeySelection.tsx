//Imports
import ATMIcon from "../assets/MapKeyIcons/ATMIcon.png";
import BusStopIcon from "../assets/MapKeyIcons/BusStopIcon.png";
import CafeIcon from "../assets/MapKeyIcons/CafeIcon.png";
import DiningIcon from "../assets/MapKeyIcons/DiningIcon.png";
import ElevatorIcon from "../assets/MapKeyIcons/ElevatorIcon.png";
import EmergencyIcon from "../assets/MapKeyIcons/EmergencyIcon.png";
import EntranceIcon from "../assets/MapKeyIcons/EntranceIcon.png";
import EscalatorIcon from "../assets/MapKeyIcons/EscalatorIcon.png";
import HandicapIcon from "../assets/MapKeyIcons/HandicapIcon.png";
import ParkingIcon from "../assets/MapKeyIcons/ParkingIcon.png";
import RestroomIcon from "../assets/MapKeyIcons/RestroomIcon.png";
import ValetIcon from "../assets/MapKeyIcons/ValetIcon.png";
import VendingIcon from "../assets/MapKeyIcons/VendingIcon.png";
import WaitingIcon from "../assets/MapKeyIcons/WaitingIcon.png";
import styles from "./FloorMap.module.css";

export default function KeySelection() {
  return (
    <div className={`${styles.MapKey}`}>
      <button type="button" className={"keyButton"}>
        <img src={ATMIcon} alt="ATM icon" className={styles.MapKeyIcon} />
      </button>

      <div className={styles.MapKeyItem}>ATM</div>

      <img
        src={BusStopIcon}
        alt="Bus Stop icon"
        className={styles.MapKeyIcon}
      />
      <div className={styles.MapKeyItem}>Bus Stop</div>

      <img src={CafeIcon} alt="Cafe icon" className={styles.MapKeyIcon} />
      <div className={styles.MapKeyItem}>Cafe</div>
      <img src={DiningIcon} alt="Dining icon" className={styles.MapKeyIcon} />
      <div className={styles.MapKeyItem}>Food Service</div>
      <img
        src={ElevatorIcon}
        alt="Elevator icon"
        className={styles.MapKeyIcon}
      />
      <div className={styles.MapKeyItem}>Elevator</div>
      <img
        src={EmergencyIcon}
        alt="Emergency icon"
        className={styles.MapKeyIcon}
      />
      <div className={styles.MapKeyItem}>Emergency</div>
      <img
        src={EntranceIcon}
        alt="Entrance icon"
        className={styles.MapKeyIcon}
      />
      <div className={styles.MapKeyItem}>Entrance</div>
      <img
        src={EscalatorIcon}
        alt="Escalator icon"
        className={styles.MapKeyIcon}
      />
      <div className={styles.MapKeyItem}>Escalator</div>
      <img
        src={HandicapIcon}
        alt="Handicapped entrance icon"
        className={styles.MapKeyIcon}
      />
      <div className={styles.MapKeyItem}>Handicapped Entrance</div>
      <img src={ParkingIcon} alt="Parking icon" className={styles.MapKeyIcon} />
      <div className={styles.MapKeyItem}>Parking</div>
      <img
        src={RestroomIcon}
        alt="Restroom icon"
        className={styles.MapKeyIcon}
      />
      <div className={styles.MapKeyItem}>Restroom</div>
      <img src={ValetIcon} alt="Valet icon" className={styles.MapKeyIcon} />
      <div className={styles.MapKeyItem}>Valet</div>
      <img src={VendingIcon} alt="Vending icon" className={styles.MapKeyIcon} />
      <div className={styles.MapKeyItem}>Vending</div>
      <img
        src={WaitingIcon}
        alt="Waiting room icon"
        className={styles.MapKeyIcon}
      />
      <div className={styles.MapKeyItem}>Waiting Room</div>
    </div>
  );
}
