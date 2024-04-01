import React, { useState, useEffect } from 'react';
import styles from './FloorMap.module.css';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/material';
import { parse } from 'csv-parse/browser/esm/sync';
import { sendLocationData } from './api';

interface Position {
    label: string;
    id: string;
    top: string;
    left: string;
}

interface LocationData {
    nodeID: string;
    xcoord: string;
    ycoord: string;
    floor: string;
    building: string;
    nodeType: string;
    longName: string;
    shortName: string;
}

function FloorMap() {
    const [locations, setLocations] = useState<Position[]>([]);
    const [startPosition, setStartPosition] = useState<Position | null>(null);
    const [endPosition, setEndPosition] = useState<Position | null>(null);

    useEffect(() => {
        fetch('src/components/FloorMap/L1Nodes.csv')
            .then(response => response.text())
            .then(csvData => {
                const parsedData: LocationData[] = parse(csvData, {
                    columns: true,
                    skip_empty_lines: true
                });

                const formattedLocations: Position[] = parsedData.map((location: LocationData) => ({
                    label: location.longName,
                    id: location.nodeID,
                    top: `${(parseInt(location.ycoord, 10) / 3400) * 100}%`,
                    left: `${(parseInt(location.xcoord, 10) / 5000) * 100}%`,
                }));

                setLocations(formattedLocations);
            });
    }, []);

    const toggleScrolling = (disableScroll: boolean) => {
        if (disableScroll) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    };

    const handleSelection = (value: Position | null, type: 'start' | 'end') => {
        const newStartId = type === 'start' ? value?.id : startPosition?.id;
        const newEndId = type === 'end' ? value?.id : endPosition?.id;

        if (type === 'start') {
            setStartPosition(value);
        } else {
            setEndPosition(value);
        }

        if (newStartId && newEndId) {
            sendLocationData(newStartId, newEndId)
                .then(data => {
                    console.log('Success:', data);
                });
        }
    };

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
                        onOpen={() => toggleScrolling(true)}
                        onClose={() => toggleScrolling(false)}
                        onChange={(event, value) => handleSelection(value, 'start')}
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
                        onOpen={() => toggleScrolling(true)}
                        onClose={() => toggleScrolling(false)}
                        onChange={(event, value) => handleSelection(value, 'end')}
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
