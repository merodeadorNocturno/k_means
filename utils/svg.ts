import type { Point, Cluster } from "../types/cluster_types.ts";

export function createClusterSVG(
  clusters: Cluster[],
  width: number = 640,
  height: number = 480,
): string {
  let svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"> <rect width="100%" height="100%" fill="lightgray" />`;

  // Define size for rhombus and crosshair
  const pointSize = 5; // Rhombus "radius"
  const centroidSize = 10; // Crosshair arm length

  clusters.forEach((cluster) => {
    // Draw points as rhombuses
    cluster.points.forEach((point: Point) => {
      const scaledX = point.x * width;
      const scaledY = point.y * height;

      // Define rhombus points relative to the center (scaledX, scaledY)
      const rhombusPoints = [
        [scaledX, scaledY - pointSize],
        [scaledX + pointSize, scaledY],
        [scaledX, scaledY + pointSize],
        [scaledX - pointSize, scaledY],
      ]
        .map((p) => p.join(","))
        .join(" "); // Format for polygon points attribute

      svgString += `
        <polygon points="${rhombusPoints}" fill="${point.color}" stroke="black" stroke-width="0.5"/>`;
    });

    if (cluster.centroid === undefined) {
      throw new Error("Cluster centroid is undefined");
    }

    // Draw centroid as crosshair
    const scaledCentroidX = cluster.centroid.x * width;
    const scaledCentroidY = cluster.centroid.y * height;

    // Horizontal line of crosshair
    svgString += `
      <line x1="${scaledCentroidX - centroidSize / 2}" y1="${scaledCentroidY}" x2="${scaledCentroidX + centroidSize / 2}" y2="${scaledCentroidY}" stroke="${cluster.centroid.color}" stroke-width="2"/>`;

    // Vertical line of crosshair
    svgString += `
      <line x1="${scaledCentroidX}" y1="${scaledCentroidY - centroidSize / 2}" x2="${scaledCentroidX}" y2="${scaledCentroidY + centroidSize / 2}" stroke="${cluster.centroid.color}" stroke-width="2"/>`;
  });

  svgString += `\n</svg>`;

  return svgString;
}
