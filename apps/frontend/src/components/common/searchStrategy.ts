class SearchStrategy {
    performSearch(startNode, goalNode) {
        throw new Error("This method should be overridden by subclasses.");
    }
}

class AStarSearch extends SearchStrategy {
    performSearch(startNode, endNode) {
        // 这个函数假设startNode和endNode是具有x,y属性的节点
        const openSet = new Set([startNode]);
        const cameFrom = new Map();
        const gScore = new Map(); // Cost from start to current node
        const fScore = new Map(); // Estimated cost from start to end through this node

        gScore.set(startNode, 0);
        fScore.set(startNode, this.heuristic(startNode, endNode));

        while (openSet.size > 0) {
            // current = the node in openSet having the lowest fScore value
            let current;
            let minFScore = Infinity;

            openSet.forEach(node => {
                if (fScore.get(node) < minFScore) {
                    current = node;
                    minFScore = fScore.get(node);
                }
            });

            if (current === endNode) {
                // Path has been found
                return this.reconstructPath(cameFrom, current);
            }

            openSet.delete(current);

            for (const neighbor of current.neighbors) {
                // Tentative_gScore is the distance from start to the neighbor through current
                const tentative_gScore = gScore.get(current) + this.distance(current, neighbor);
                if (tentative_gScore < (gScore.get(neighbor) || Infinity)) {
                    // This path to neighbor is better than any previous one. Record it!
                    cameFrom.set(neighbor, current);
                    gScore.set(neighbor, tentative_gScore);
                    fScore.set(neighbor, gScore.get(neighbor) + this.heuristic(neighbor, endNode));

                    if (!openSet.has(neighbor)) {
                        openSet.add(neighbor);
                    }
                }
            }
        }

        // No path was found
        throw new Error('No path found');
    }

    distance(nodeA, nodeB) {
        // Example distance function (Euclidean distance)
        return Math.sqrt((nodeA.x - nodeB.x) ** 2 + (nodeA.y - nodeB.y) ** 2);
    }

    heuristic(startNode, endNode) {
        // Heuristic function (Euclidean distance)
        return Math.sqrt((startNode.x - endNode.x) ** 2 + (startNode.y - endNode.y) ** 2);
    }

    reconstructPath(cameFrom, current) {
        const totalPath = [current];
        while (cameFrom.has(current)) {
            current = cameFrom.get(current);
            totalPath.unshift(current);
        }
        return totalPath;
    }
}

class DijkstraSearch extends SearchStrategy {
    performSearch(startNode, endNode) {
        const distances = new Map();
        const prev = new Map();
        const pq = new PriorityQueue(); // 假定存在一个优先队列数据结构

        distances.set(startNode, 0);
        pq.enqueue(startNode, 0);

        while (!pq.isEmpty()) {
            let currentNode = pq.dequeue();
            if (currentNode === endNode) {
                return this.reconstructPath(prev, currentNode);
            }

            for (const neighbor of currentNode.neighbors) {
                let alt = distances.get(currentNode) + this.distance(currentNode, neighbor);
                if (alt < (distances.get(neighbor) || Infinity)) {
                    distances.set(neighbor, alt);
                    prev.set(neighbor, currentNode);
                    pq.enqueue(neighbor, alt);
                }
            }
        }
        throw new Error('No path found');
    }

    distance(nodeA, nodeB) {
        // Same distance function as used in A*
        return Math.sqrt((nodeA.x - nodeB.x) ** 2 + (nodeA.y - nodeB.y) ** 2);
    }

    reconstructPath(prev, currentNode) {
        // Same reconstruction as used in A*
        const totalPath = [currentNode];
        while (prev.has(currentNode)) {
            currentNode = prev.get(currentNode);
            totalPath.unshift(currentNode);
        }
        return totalPath;
    }
}

class DepthFirstSearch extends SearchStrategy {
    performSearch(startNode, endNode) {
        const visited = new Set();
        const path = [];

        this.dfs(startNode, endNode, visited, path);
        return path;
    }

    dfs(node, endNode, visited, path) {
        if (node === endNode) {
            path.push(node);
            return true;
        }

        visited.add(node);

        for (const neighbor of node.neighbors) {
            if (!visited.has(neighbor) && this.dfs(neighbor, endNode, visited, path)) {
                path.push(node);
                return true;
            }
        }

        return false;
    }
}

class BreadthFirstSearch extends SearchStrategy {
    performSearch(startNode, endNode) {
        const visited = new Set();
        const queue = [];
        const prev = new Map();

        queue.push(startNode);
        visited.add(startNode);

        while (queue.length > 0) {
            const currentNode = queue.shift();
            if (currentNode === endNode) {
                return this.reconstructPath(prev, endNode);
            }

            for (const neighbor of currentNode.neighbors) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    prev.set(neighbor, currentNode);
                    queue.push(neighbor);
                }
            }
        }

        throw new Error('No path found');
    }

    reconstructPath(prev, currentNode) {
        // Same reconstruction as used in A*
        const totalPath = [currentNode];
        while (prev.has(currentNode)) {
            currentNode = prev.get(currentNode);
            totalPath.unshift(currentNode);
        }
        return totalPath;
    }
}
