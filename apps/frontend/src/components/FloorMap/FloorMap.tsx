import React from 'react';
import './FloorMap.css';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

function FloorMap() {
    // Replace this with your actual data from the database
    const locations = [
        { label: 'Location 1', id: 1 },
        { label: 'Location 2', id: 2 },
        { label: 'Location 3', id: 3 },
        // ...more locations
    ];

    return (

        <div className="floorMapContainer">
            <div className="sidebar">
                <div>Enter Starting Point</div>
                <Autocomplete
                    disablePortal
                    options={locations}
                    getOptionLabel={(option) => option.label}
                    renderInput={(params) => <TextField {...params} label="Enter Starting Point"/>}

                />
                <div>Enter Destination</div>
                <Autocomplete
                    disablePortal
                    options={locations}
                    getOptionLabel={(option) => option.label}
                    renderInput={(params) => <TextField {...params} label="Enter Destination"/>}

                />
                <div>Directions</div>
            </div>
            <div className="mapArea">
                <TransformWrapper
                        // initialScale={1.5} // Adjust this value to set the initial zoom level
                        // initialPositionX={-100} // Adjust this value to set the initial X position
                        // initialPositionY={-50} // Adjust this value to set the initial Y position
                    //did this so we can focus on the parts of the map that are going to have pathfinding on them, still can zoom out
                >
                    <TransformComponent>
                        <img
                            src="/src/components/assets/HospitalMap/00_thelowerlevel1.png"
                            alt="map"
                            className="hmap-image"
                        />
                    </TransformComponent>
                </TransformWrapper>
            </div>
        </div>
    );
}

export default FloorMap;
