export default function toAdjacencyList(graph) {
    const adjacencyList = {};

    graph.getElements().forEach((element) => {
        const ids = [];

        graph.getNeighbors(element, {
            deep: false,
            outbound: true,
            indirect: true,
        }).forEach((neighbor) => {
            ids.push(neighbor.id);
        });

        adjacencyList[element.id] = ids;
    });

    return adjacencyList;
}
