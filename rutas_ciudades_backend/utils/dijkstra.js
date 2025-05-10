function dijkstra(graph, start, end) {
    const distances = {};
    const prev = {};
    const visited = new Set();
    const queue = new Set(Object.keys(graph));
  
    for (let node of queue) {
      distances[node] = Infinity;
      prev[node] = null;
    }
  
    distances[start] = 0;
  
    while (queue.size) {
      let current = [...queue].reduce((a, b) =>
        distances[a] < distances[b] ? a : b
      );
      queue.delete(current);
  
      if (current === end) break;
      if (!graph[current]) continue;
  
      for (let neighbor of graph[current]) {
        if (!queue.has(neighbor.dest)) continue;
  
        let alt = distances[current] + neighbor.dist;
        if (alt < distances[neighbor.dest]) {
          distances[neighbor.dest] = alt;
          prev[neighbor.dest] = current;
        }
      }
    }
  
    // Reconstruir ruta
    let path = [];
    let curr = end;
    while (curr) {
      path.unshift(curr);
      curr = prev[curr];
    }
  
    return {
      path,
      distance: distances[end] === Infinity ? null : distances[end],
    };
  }
  
  module.exports = { dijkstra };
  