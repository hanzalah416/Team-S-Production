import React, { useState } from 'react';
import styles from './FloorMap.module.css';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Box } from "@mui/material";

interface Position {
    top: string;
    left: string;
}

function FloorMap() {
    const csvData = `nodeID,xcoord,ycoord,floor,building,nodeType,longName,shortName
    CCONF001L1,2255,849,L1,45 Francis,CONF,Anesthesia Conf Floor L1,Conf C001L1
    CCONF002L1,2665,1043,L1,45 Francis,CONF,Medical Records Conference Room Floor L1,Conf C002L1
    CCONF003L1,2445,1245,L1,45 Francis,CONF,Abrams Conference Room,Conf C003L1
    CDEPT002L1,1980,844,L1,Tower,DEPT,Day Surgery Family Waiting Floor L1,Department C002L1
    CDEPT003L1,1845,844,L1,Tower,DEPT,Day Surgery Family Waiting Exit Floor L1,Department C003L1`;

    const locations = csvData.split('\n').slice(1).map(row => {
        const [nodeID, xcoord, ycoord, , , , longName, ] = row.split(',');
        return {
            label: longName.trim(),
            id: nodeID.trim(),
            top: `${(parseInt(ycoord, 10) / 3400) * 100}%`,
            left: `${(parseInt(xcoord, 10) / 5000) * 100}%`,
        };
    });

    const [startPosition, setStartPosition] = useState<Position | null>(null);
    const [endPosition, setEndPosition] = useState<Position | null>(null);

    return (
        <div className={styles.wholePage}>
            <div className={styles.container}>
                <div className={styles.signInForm}>
                    <div className={styles.boldtag}>Enter Starting Point</div>
                    <Autocomplete
                        disablePortal
                        options={locations}
                        getOptionLabel={(option) => option.label}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Enter Starting Point"
                                InputLabelProps={{
                                    style: {
                                        fontFamily: 'Poppins',
                                        fontSize: 14,
                                    },
                                }}
                            />
                        )}
                        onChange={(event, value) => setStartPosition(value)}
                    />

                    <div className={styles.boldtag}>Enter Destination</div>
                    <Autocomplete
                        disablePortal
                        options={locations}
                        getOptionLabel={(option) => option.label}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Enter Destination"
                                InputLabelProps={{
                                    style: {
                                        fontFamily: 'Poppins',
                                        fontSize: 14,
                                    },
                                }}
                            />
                        )}
                        onChange={(event, value) => setEndPosition(value)}
                    />

                    <Box className={styles.directionsBox}>
                        Directions
                    </Box>

                </div>
                <div className={styles.mapArea}>
                    <TransformWrapper initialScale={1.633} initialPositionX={-288.4} initialPositionY={-145.83}>
                        <TransformComponent>
                            <img
                                src="/src/components/assets/HospitalMap/00_thelowerlevel1.png"
                                alt="map"
                                className={styles.hmapImage}
                            />
                            <div className={styles.dotsContainer}>
                                {startPosition && (
                                    <div
                                        className={styles.mapDot}
                                        style={{
                                            top: startPosition.top,
                                            left: startPosition.left,
                                            backgroundColor: 'green',
                                        }}
                                    ></div>
                                )}
                                {endPosition && (
                                    <div
                                        className={styles.mapDot}
                                        style={{
                                            top: endPosition.top,
                                            left: endPosition.left,
                                            backgroundColor: 'red',
                                        }}
                                    ></div>
                                )}
                            </div>
                        </TransformComponent>
                    </TransformWrapper>
                </div>
            </div>
        </div>
    );
}

export default FloorMap;
