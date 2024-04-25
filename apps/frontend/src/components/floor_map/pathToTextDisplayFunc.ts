export function TotalDirectionDist(path: Directions[]) {
  let totalDist: number = 0;

  path.forEach((direction: Directions) => {
    totalDist += direction.distance;
  });

  return totalDist;
}
export enum directionType {
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
class GraphNode {
  id: string;
  neighbors: GraphNode[];
  xcoord: number;
  ycoord: number;
  nodeType: string;
  floor: string;
  longName: string;
  constructor(
    id: string,
    xcoord: number,
    ycoord: number,
    nodeType: string,
    floor: string,
    longName: string,
  ) {
    this.id = id;
    this.neighbors = [];
    this.xcoord = xcoord;
    this.ycoord = ycoord;
    this.nodeType = nodeType;
    this.floor = floor;
    this.longName = longName;
  }
  //add neighbor
  addNB(node: GraphNode) {
    this.neighbors.push(node);
  }
}

export class Directions {
  private _textDirection: string;
  private _directionType: directionType;
  private _startNode: GraphNode;
  private _endNode: GraphNode;
  private _floorStart: string;
  private _floorEnd: string;
  private _distance: number;

  get distance(): number {
    return this._distance;
  }

  set distance(value: number) {
    this._distance = Math.round(value);
  }

  get floorStart(): string {
    return this._floorStart;
  }

  set floorStart(value: string) {
    this._floorStart = value;
  }

  get floorEnd(): string {
    return this._floorEnd;
  }

  set floorEnd(value: string) {
    this._floorEnd = value;
  }
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
    floorStart: string,
    floorEnd: string,
    distance: number,
  ) {
    this._textDirection = textDirection;
    this._directionType = directionType;
    this._startNode = startNode;
    this._endNode = endNode;
    this._floorStart = floorStart;
    this._floorEnd = floorEnd;
    this._distance = Math.round(distance);
  }

  toJson() {
    return {
      textDirection: this._textDirection,
      directionType: this._directionType,
      startNode: this._startNode.id,
      endNode: this._endNode.id,
      floorStart: this._floorStart,
      floorEnd: this._floorEnd,
      distance: this._distance,
    };
  }
}

export function GetEstimatedTime(path: Directions[]) {
  return Math.round(TotalDirectionDist(path) / 273);
}
