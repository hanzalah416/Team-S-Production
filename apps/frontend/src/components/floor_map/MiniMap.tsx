import React from "react";
import ll2 from "../assets/HospitalMap/00_thelowerlevel2.png";
import ll1 from "../assets/HospitalMap/00_thelowerlevel1.png";
import f1 from "../assets/HospitalMap/01_thefirstfloor.png";
import f2 from "../assets/HospitalMap/02_thesecondfloor.png";
import f3 from "../assets/HospitalMap/03_thethirdfloor.png";

import styles from "./MiniMap.module.css";

function MiniMap() {
  return (
    // <div className={styles.outerDiv}>
    //   <img src={ll1} alt="map" className={styles.ll1} />
    //   <img src={ll2} alt="map" className={styles.ll2} />
    //   <img src={f1} alt="map" className={styles.f1} />
    //   <img src={f2} alt="map" className={styles.f2} />
    //   <img src={f3} alt="map" className={styles.f3} />
    // </div>
    <div className={styles.outerOuterDiv}>
      <div className={styles.outerDiv}>
        <div className={styles.ll1}>
          <header>LL1</header>
          <img src={ll1} alt="map" className={styles.mmimg} />
        </div>
        <div className={styles.ll2}>
          <header>LL2</header>
          <img src={ll2} alt="map" className={styles.mmimg} />
        </div>
        <div className={styles.f1}>
          <header>1</header>
          <img src={f1} alt="map" className={styles.mmimg} />
        </div>
        <div className={styles.f2}>
          <header>2</header>
          <img src={f2} alt="map" className={styles.mmimg} />
        </div>
        <div className={styles.f3}>
          <header>3</header>
          <img src={f3} alt="map" className={styles.mmimg} />
        </div>
      </div>
    </div>
  );
}

export default MiniMap;
