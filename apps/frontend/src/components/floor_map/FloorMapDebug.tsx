import React, { useState, useEffect } from 'react';
import styles from './FloorMapDebug.module.css';
import { Button } from '@mui/material';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import l1Map from '../assets/HospitalMap/00_thelowerlevel1.png';
import l2Map from '../assets/HospitalMap/00_thelowerlevel2.png';
import f1Map from '../assets/HospitalMap/01_thefirstfloor.png';
import f2Map from '../assets/HospitalMap/02_thesecondfloor.png';
import f3Map from '../assets/HospitalMap/03_thethirdfloor.png';

interface Node {
    xcoord: string;
    ycoord: string;
    id: string;
    longName: string;
    floor: string;
}

const StaticFloorMapDebug = () => {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [currentFloor, setCurrentFloor] = useState('01');

    useEffect(() => {
        fetch('/api/nodes')
            .then((response) => response.json())
            .then(setNodes)
            .catch((error) => console.error('Failed to fetch nodes:', error));

    }, []);

    const floorMaps = {
        L1: l1Map,
        L2: l2Map,
        '01': f1Map,
        '02': f2Map,
        '03': f3Map,
    };

    const FloorSwitcher = () => (
        <div className={styles.floorSwitcher}>
            {Object.keys(floorMaps).map((floor) => (
                <Button
                    key={floor}
                    variant={currentFloor === floor ? 'contained' : 'outlined'}
                    onClick={() => setCurrentFloor(floor)}
                    style={{
                        marginRight: "2px",
                        marginBottom: "5px",
                        color: currentFloor === floor ? "white" : "black",
                        backgroundColor: currentFloor === floor ? "#003b9c" :  "#f1f1f1",
                        borderColor: "black",
                        fontFamily: "Poppins",
                    }}
                >
                    {floor}
                </Button>
            ))}
        </div>
    );

    const getPositionById = (id: string): { top: string; left: string } => {
        const position = nodes.find((node) => node.id === id);
        if (position) {
            return {
                top: `${(parseInt(position.ycoord, 10) / 3400) * 100}%`,
                left: `${(parseInt(position.xcoord, 10) / 5000) * 100}%`,
            };
        }
        return { top: "0%", left: "0%" };
    };

    return (
        <div className={styles.container}>
            <div className={styles.mapContainer}>
                <FloorSwitcher />
                <TransformWrapper>
                    <TransformComponent>
                        <img src={floorMaps[currentFloor]} alt={`Floor ${currentFloor}`} className={styles.mapImage} />
                        <svg className={styles.overlay} viewBox="0 0 100 100">
                            {nodes
                                .filter((node) => node.floor === currentFloor)
                                .map((node) => {
                                    const position = getPositionById(node.id);
                                    return (
                                        <circle
                                            key={node.id}
                                            cx={position.left}
                                            cy={position.top}
                                            r="0.5"
                                            fill="red"
                                        />
                                    );
                                })}
                        </svg>
                    </TransformComponent>
                </TransformWrapper>
            </div>
        </div>
    );
};

export default StaticFloorMapDebug;
