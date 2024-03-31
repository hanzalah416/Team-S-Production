import React from 'react';
import './FloorMap.css';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

function FloorMap() {
    return (
        <div className="mapDiv">
            <div className="ImageDiv">
                <h1>Lower Level</h1>
                <div>
                    <TransformWrapper>
                        <TransformComponent>
                            <img src="/src/components/assets/HospitalMap/00_thelowerlevel1.png" className={"hmap"} alt={"map"}/>
                        </TransformComponent>
                    </TransformWrapper>
                </div>
            </div>
            {/*<div className="mapDirectory">*/}
            {/*    <h2 className="DirectoryHeader">Directory</h2>*/}
            {/*    <ul className="DirectoryList">*/}
            {/*        <li>Amenities</li>*/}
            {/*        <li>Clinics / Departments</li>*/}
            {/*        <li>Meeting / Conference Rooms</li>*/}
            {/*        <li>Patient Rooms</li>*/}
            {/*        <li>Radiology</li>*/}
            {/*        <li>Services</li>*/}
            {/*    </ul>*/}
            {/*</div>*/}
            <div className="Vkey">
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"/>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"/>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"/>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"/>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"/>
                {/*<h2 id="VisitorHeader">Visitor Key</h2>*/}
                {/*<ul id="VisitorList">*/}
                {/*    <li>*/}
                {/*        <span className="material-symbols-outlined">wc</span>*/}
                {/*        Restroom*/}
                {/*    </li>*/}
                {/*    <li>*/}
                {/*        <span className="material-symbols-outlined">local_atm</span>*/}
                {/*        ATM*/}
                {/*    </li>*/}
                {/*    <li>*/}
                {/*        <span className="material-symbols-outlined">stairs</span>*/}
                {/*        Stairs*/}
                {/*    </li>*/}
                {/*    <li>*/}
                {/*        <span className="material-symbols-outlined">elevator</span>*/}
                {/*        Elevator*/}
                {/*    </li>*/}
                {/*</ul>*/}
            </div>
        </div>
    );
}

export default FloorMap;
