//Imports
import { GraphNode } from "./makegraph.ts";

//Turn type enum
enum directionType {
  Right,
  Left,
  SRight,
  SLeft,
  Forward,
  FloorSwitch,
  UNDEFINED,
}

enum cardinalDirection {
  North,
  East,
  South,
  West,
}

let facing: cardinalDirection; //Initally facing north

//Path to turn an array of graph nodes into text directions
export function PathToText(path: GraphNode[]): string[] {
  const textDirections: string[] = []; //Array of strings holding the directions
  let turnType: directionType;

  //Calibrate so that the navigator is facing the next node from the start node
  DetermineInitialFacing(path[0], path[1]);
  textDirections[0] = "Face " + path[1].longName + " from " + path[0].longName;

  for (let i = 0; i < path.length - 1; i++) {
    // Handle switching floors
    if (
      (path[i].nodeType === "ELEV" || path[i].nodeType === "STAI") &&
      path[i].floor !== path[i + 1].floor
    ) {
      textDirections[i + 1] = MakePathText(
        path[i],
        path[i + 1],
        directionType.FloorSwitch,
      );
      continue; // Continue the loop
    }

    //Determine turnType
    turnType = DetermineTurnType(path[i], path[i + 1]);

    //Add direction
    textDirections[i + 1] = MakePathText(path[i], path[i + 1], turnType);
  }

  //Add arrive at destination at the end of every direction
  textDirections[textDirections.length] = "Arrive at destination";
  return textDirections;
}

function DetermineTurnType(
  startNode: GraphNode,
  endNode: GraphNode,
): directionType {
  //Get the change of x and y
  const dx = endNode.xcoord - startNode.xcoord;
  const dy = endNode.ycoord - startNode.ycoord;

  //Determine turn type based on direction and signs of dx and dy
  //Change current facing direction based on turn
  switch (facing) {
    case cardinalDirection.North:
      if (dx < 0) {
        facing = cardinalDirection.West;
        return directionType.Left;
      } else if (dx > 0) {
        facing = cardinalDirection.East;
        return directionType.Right;
      } else if (dy < 0) {
        return directionType.Forward;
      }

      break;
    case cardinalDirection.East:
      if (dy < 0) {
        facing = cardinalDirection.North;
        return directionType.Left;
      } else if (dy > 0) {
        facing = cardinalDirection.South;
        return directionType.Right;
      } else if (dx > 0) {
        return directionType.Forward;
      }

      break;
    case cardinalDirection.South:
      if (dx < 0) {
        facing = cardinalDirection.East;
        return directionType.Left;
      } else if (dx > 0) {
        facing = cardinalDirection.West;
        return directionType.Right;
      } else if (dy > 0) {
        return directionType.Forward;
      }

      break;
    case cardinalDirection.West:
      if (dy > 0) {
        facing = cardinalDirection.South;
        return directionType.Left;
      } else if (dy < 0) {
        facing = cardinalDirection.North;
        return directionType.Right;
      } else if (dx < 0) {
        return directionType.Forward;
      }

      break;
    default:
      return directionType.UNDEFINED;
  }
  //If it made it to this point it's undefined
  return directionType.UNDEFINED;
}

function DetermineInitialFacing(startNode: GraphNode, endNode: GraphNode) {
  const dx = endNode.xcoord - startNode.xcoord;
  const dy = endNode.ycoord - endNode.ycoord;

  if (dy > 0) {
    facing = cardinalDirection.North;
  } else if (dy < 0) {
    facing = cardinalDirection.South;
  } else if (dx < 0) {
    facing = cardinalDirection.West;
  } else if (dx > 0) {
    facing = cardinalDirection.East;
  }
}
//Makes a string for the direction
function MakePathText(
  startNode: GraphNode,
  endNode: GraphNode,
  type: directionType,
): string {
  let pathText: string = "";

  switch (type) {
    case directionType.Right:
      pathText = "Turn right and continue to " + endNode.longName;

      break;
    case directionType.Left:
      pathText = "Turn left and continue to " + endNode.longName;

      break;
    case directionType.Forward:
      pathText = "Continue forward toward " + endNode.longName;

      break;
    case directionType.FloorSwitch:
      pathText = "Take " + startNode.longName + " to floor " + endNode.floor;
      break;
    default:
      break;
  }

  return pathText;
}
