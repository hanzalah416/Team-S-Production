import ll2 from "../assets/HmapNoBackground/00_thelowerlevel2_bg-rm.png";
import ll1 from "../assets/HmapNoBackground/00_thelowerlevel1_rm-bg.png";
import f1 from "../assets/HmapNoBackground/01_thefirstfloor_rm-bg.png";
import f2 from "../assets/HmapNoBackground/02_thesecondfloor_rm-bg.png";
import f3 from "../assets/HmapNoBackground/03_thethirdfloor_rm-bg.png";
import styles from "./3DPathfinding.module.css";

interface MiniMapProps {
  onChangeFloor: (floor: string) => void;
}

const ThreeDPathfind: React.FC<MiniMapProps> = ({ onChangeFloor }) => {
  return (
    <div className={styles.outerOuterDiv}>
      <div className={styles.outerDiv}>
        <div className={styles.ll2} onClick={() => onChangeFloor("L2")}>
          <header className={styles.mhead}>L2</header>
          <img src={ll2} alt="map" className={styles.mmimg} />
        </div>
        <div className={styles.ll1} onClick={() => onChangeFloor("L1")}>
          <header className={styles.mhead}>L1</header>
          <img src={ll1} alt="map" className={styles.mmimg} />
        </div>
        <div className={styles.f1} onClick={() => onChangeFloor("01")}>
          <header className={styles.mhead}>1</header>
          <img src={f1} alt="map" className={styles.mmimg} />
        </div>
        <div className={styles.f2} onClick={() => onChangeFloor("02")}>
          <header className={styles.mhead}>2</header>
          <img src={f2} alt="map" className={styles.mmimg} />
        </div>
        <div className={styles.f3} onClick={() => onChangeFloor("03")}>
          <header className={styles.mhead}>3</header>
          <img src={f3} alt="map" className={styles.mmimg} />
        </div>
      </div>
    </div>
  );
};

export default ThreeDPathfind;
