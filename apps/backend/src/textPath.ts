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
  Face,
  Ending,
  UNDEFINED,
}

enum cardinalDirection {
  North,
  East,
  South,
  West,
}

export class Directions {
  private _textDirection: string;
  private _directionType: directionType;
  private _startNode: GraphNode;
  private _endNode: GraphNode;
  get startNode(): GraphNode {
    return this._startNode;
  }

  set startNode(value: GraphNode) {
    this._startNode = value;
  }

  get endNode(): GraphNode {
    return this._endNode;
  }

  set endNode(value: GraphNode) {
    this._endNode = value;
  }

  get textDirection(): string {
    return this._textDirection;
  }

  set textDirection(value: string) {
    this._textDirection = value;
  }

  get directionType(): directionType {
    return this._directionType;
  }

  set directionType(value: directionType) {
    this._directionType = value;
  }

  constructor(
    textDirection: string,
    directionType: directionType,
    startNode: GraphNode,
    endNode: GraphNode,
  ) {
    this._textDirection = textDirection;
    this._directionType = directionType;
    this._startNode = startNode;
    this._endNode = endNode;
  }

  toJson() {
    return {
      textDirection: this._textDirection,
      directionType: this._directionType,
      startNode: this._startNode.id,
      endNode: this._endNode.id,
    };
  }
}

let facing: cardinalDirection = cardinalDirection.South; //Initally facing north

//Path to turn an array of graph nodes into text directions
export function PathToText(path: GraphNode[]): Directions[] {
  const textDirections: Directions[] = []; //Array of strings holding the directions
  let turnType = directionType.UNDEFINED;
  let numDirections = 0;

  //Calibrate so that the navigator is facing the next node from the start node
  DetermineInitialFacing(path[0], path[1]);
  textDirections[numDirections] = new Directions(
    "Face " + path[1].longName + " from " + path[0].longName,
    directionType.Face,
    path[0],
    path[1],
  );

  numDirections++;

  for (let i = 0; i < path.length - 1; i++) {
    // Handle switching floors
    if (
      (path[i].nodeType === "ELEV" || path[i].nodeType === "STAI") &&
      path[i].floor !== path[i + 1].floor
    ) {
      textDirections[numDirections] = new Directions(
        MakePathText(path[i], path[i + 1], directionType.FloorSwitch),
        directionType.FloorSwitch,
        path[i],
        path[i + 1],
      );
      numDirections++;
      //Adjust where the navigator is after it switches floor facing
      //Ensure it doesn't check past the array
      if (i + 1 != path.length - 1) {
        DetermineInitialFacing(path[i + 1], path[i + 2]);

        textDirections[numDirections] = new Directions(
          "Face " + path[i].longName + " from " + path[i + 1].longName,
          directionType.Face,
          path[i],
          path[i + 1],
        );
        numDirections++;
      }
      continue; // Continue the loop
    }

    turnType = DetermineTurnType(path[i], path[i + 1]);

    //Ensure that continue forward only ever occurs once in a row
    if (
      textDirections[numDirections - 1].directionType ===
        directionType.Forward &&
      turnType === directionType.Forward
    ) {
      textDirections[numDirections - 1].endNode = path[i + 1];
      textDirections[numDirections - 1].textDirection = MakePathText(
        textDirections[numDirections - 1].startNode,
        path[i + 1],
        directionType.Forward,
      );
    } else {
      //Add direction
      textDirections[numDirections] = new Directions(
        MakePathText(path[i], path[i + 1], turnType),
        turnType,
        path[i],
        path[i + 1],
      );
      numDirections++;
    }
  }

  //Add arrive at destination at the end of every direction
  textDirections[numDirections] = new Directions(
    "Arrive at destination",
    directionType.Ending,
    path[path.length - 1],
    path[path.length - 1],
  );
  return textDirections;
}

function DetermineTurnType(
  startNode: GraphNode,
  endNode: GraphNode,
): directionType {
  //Get the change of x and y
  const dx = endNode.xcoord - startNode.xcoord;
  const dy = endNode.ycoord - startNode.ycoord;
  let angle = Math.atan2(dy, dx);
  if (angle < 0) {
    angle += 2 * Math.PI;
  }
  const degree = angle * (180 / Math.PI);

  console.log(angle);
  console.log(degree);

  //Determine turn type based on direction and signs of dx and dy
  //Change current facing direction based on turn
  switch (facing) {
    case cardinalDirection.North:
      if (angle <= Math.PI / 4 || angle >= (3 * Math.PI) / 2) {
        facing = cardinalDirection.East;
        return directionType.Left;
      } else if (angle >= (3 * Math.PI) / 4 && angle < (3 * Math.PI) / 2) {
        facing = cardinalDirection.West;
        return directionType.Right;
      } else if (angle < (3 * Math.PI) / 4 && angle > Math.PI / 4) {
        return directionType.Forward;
      }

      break;
    case cardinalDirection.East:
      if (angle <= (7 * Math.PI) / 4 && angle > Math.PI) {
        facing = cardinalDirection.South;
        return directionType.Left;
      } else if (angle >= Math.PI / 4 && angle <= Math.PI) {
        facing = cardinalDirection.North;
        return directionType.Right;
      } else if (angle < Math.PI / 4 || angle > (7 * Math.PI) / 4) {
        return directionType.Forward;
      }

      break;
    case cardinalDirection.South:
      if (angle > Math.PI / 2 && angle <= (5 * Math.PI) / 4) {
        facing = cardinalDirection.West;
        return directionType.Left;
      } else if (angle <= Math.PI / 2 || angle >= (7 * Math.PI) / 4) {
        facing = cardinalDirection.East;
        return directionType.Right;
      } else if (angle > (5 * Math.PI) / 4 && angle < (7 * Math.PI) / 4) {
        return directionType.Forward;
      }
      break;
    case cardinalDirection.West:
      if (angle <= (3 * Math.PI) / 4 && angle >= 0) {
        facing = cardinalDirection.North;
        return directionType.Left;
      } else if (angle >= (5 * Math.PI) / 4) {
        facing = cardinalDirection.South;
        return directionType.Right;
      } else if (angle > (3 * Math.PI) / 4 && angle < (5 * Math.PI) / 4) {
        return directionType.Forward;
      }

      break;
    default:
      return directionType.UNDEFINED;
  }
  //If it made it to this point it's undefined
  return directionType.UNDEFINED;
}

//Function to determine where the navigator is initially facing
function DetermineInitialFacing(startNode: GraphNode, endNode: GraphNode) {
  const dx = endNode.xcoord - startNode.xcoord;
  const dy = endNode.ycoord - startNode.ycoord;
  let angle = Math.atan2(dy, dx);

  if (angle < 0) {
    angle += 2 * Math.PI;
  }
  const degree = angle * (180 / Math.PI);

  console.log(angle);
  console.log(degree);

  if (angle <= (3 * Math.PI) / 4 && angle > Math.PI / 4) {
    facing = cardinalDirection.North;
  } else if (angle >= (7 * Math.PI) / 4 || angle < Math.PI / 4) {
    facing = cardinalDirection.East;
  } else if (angle > (5 * Math.PI) / 4 && angle < (7 * Math.PI) / 4) {
    facing = cardinalDirection.South;
  } else if (angle < (5 * Math.PI) / 4 && angle > (3 * Math.PI) / 4) {
    facing = cardinalDirection.West;
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
