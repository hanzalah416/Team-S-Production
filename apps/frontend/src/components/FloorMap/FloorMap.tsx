import React, { useState } from 'react';
import './FloorMap.css';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

function FloorMap() {
    const locations = [
        { label: 'Location 1', id: 1, top: '20%', left: '30%' },
        { label: 'Location 2', id: 2, top: '50%', left: '60%' },
        { label: 'Location 3', id: 3, top: '40%', left: '70%' },
    ];

    const [startPosition, setStartPosition] = useState({ top: '0%', left: '0%' });
    const [endPosition, setEndPosition] = useState({ top: '0%', left: '0%' });

    return (
        <div className="floorMapContainer">
            <div className="sidebar">
                <div>Enter Starting Point</div>
                <Autocomplete
                    disablePortal
                    options={locations}
                    getOptionLabel={(option) => option.label}
                    renderInput={(params) => <TextField {...params} label="Enter Starting Point" />}
                    onChange={(event, value) => setStartPosition({ top: value.top, left: value.left })}
                />
                <div>Enter Destination</div>
                <Autocomplete
                    disablePortal
                    options={locations}
                    getOptionLabel={(option) => option.label}
                    renderInput={(params) => <TextField {...params} label="Enter Destination" />}
                    onChange={(event, value) => setEndPosition({ top: value.top, left: value.left })}
                />
                <div>Directions</div>
            </div>
            <div className="mapArea">
                <TransformWrapper>
                    <TransformComponent>
                        <img
                            src="/src/components/assets/HospitalMap/00_thelowerlevel1.png"
                            alt="map"
                            className="hmap-image"
                        />
                        <div className="map-dot" style={{ ...startPosition, backgroundColor: 'red' }}></div> {/* Start position */}
                        <div className="map-dot" style={{ ...endPosition, backgroundColor: 'blue' }}></div> {/* End position */}
                    </TransformComponent>
                </TransformWrapper>
            </div>
        </div>
    );
}

export default FloorMap;
