import React from "react";
import ll2 from '../assets/HmapNoBackground/00_thelowerlevel2_bg-rm.png';
import ll1 from '../assets/HmapNoBackground/00_thelowerlevel1_rm-bg.png';
import f1 from '../assets/HmapNoBackground/01_thefirstfloor_rm-bg.png';
import f2 from '../assets/HmapNoBackground/02_thesecondfloor_rm-bg.png';
import f3 from '../assets/HmapNoBackground/03_thethirdfloor_rm-bg.png';


import styles from "./MiniMap.module.css";

function MiniMap() {

    return (
        <div>
            <img src={ll1} alt="map" className={styles.ll1}/>
            <img src={ll2} alt="map" className={styles.ll2}/>
            <img src={f1} alt="map" className={styles.f1}/>
            <img src={f2} alt="map" className={styles.f2}/>
            <img src={f3} alt="map" className={styles.f3}/>
        </div>
    );
}


export default MiniMap;
