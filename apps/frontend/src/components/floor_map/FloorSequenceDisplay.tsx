import React from 'react';
import styles from './FloorSequenceDisplay.module.css';
import arrow from "../../components/assets/arrow.svg";  // Import the SVG arrow image

interface FloorSequenceDisplayProps {
    path: string[];
}

const FloorSequenceDisplay: React.FC<FloorSequenceDisplayProps> = ({ path }) => {
    const extractFloorsFromPath = (path: string[]) => {
        const floorChanges: string[] = [];
        let lastFloor: string | null = null;

        path.forEach((nodeId, index) => {
            const floor = nodeId.slice(-2);
            if (floor !== lastFloor) {
                floorChanges.push(floor);
                lastFloor = floor;
            } else if (index > 0 && index < path.length - 1) {
                const prevFloor = path[index - 1].slice(-2);
                const nextFloor = path[index + 1].slice(-2);
                if (floor !== prevFloor && floor !== nextFloor) {
                    floorChanges.push(floor);
                }
            }
        });

        return floorChanges;
    };

    const floors = extractFloorsFromPath(path);

    // Function to remove leading zeros
    const formatFloor = (floor: string) => floor.replace(/^0+/, '');

    // Conditional rendering to return null if there are no floors to display
    if (floors.length === 0) {
        return null;
    }

    return (
        <div className={styles.container}>
            {floors.map((floor, index) => (
                <React.Fragment key={index}>
                    <span className={styles.floor}>{formatFloor(floor)}</span>
                    {index < floors.length - 1 && (
                        <img src={arrow} className={styles.arrow} alt="arrow" />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default FloorSequenceDisplay;
