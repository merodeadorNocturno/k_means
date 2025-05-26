import { Point, Cluster } from "../types/cluster_types.ts";
import { getRandomColor } from "./colors.ts";
import { average } from "./cluster.ts";

const ELEMENTS_PER_CLUSTER = 10;

export function divide_data_set_clusters(
  my_data: Record<"index" | "d1" | "d2", string>[],
  cluster_size: number = ELEMENTS_PER_CLUSTER,
): Cluster[] {
  const clusters: Cluster[] = [];
  let color = "";
  let i = 0;

  for (const row of my_data) {
    if (i % cluster_size === 0) {
      color = getRandomColor();
      clusters.push({ points: [], centroid: undefined });
    }

    const lastCluster = clusters[clusters.length - 1];

    // The previous check for undefined lastCluster is still valid
    if (lastCluster === undefined) {
      continue;
    }

    lastCluster.points.push({
      x: parseFloat(row.d1),
      y: parseFloat(row.d2),
      color: color,
    });
    i++;
  }

  for (const cluster of clusters) {
    // Only calculate centroid if there are points
    if (cluster.points.length > 0) {
      cluster.centroid = average(cluster.points, cluster.points[0].color);
    }
  }

  return clusters;
}

export function divide_and_set_clusters(
  points: Point[],
  cluster_size: number,
): Cluster[] {
  const newClusters: Cluster[] = [];
  let i = 0;
  let color = "";
  for (const point of points) {
    if (i % cluster_size === 0) {
      color = getRandomColor();
      newClusters.push({ points: [], centroid: undefined });
    }
    const last_cluster = newClusters[newClusters.length - 1];

    if (last_cluster === undefined) {
      continue;
    }

    point.color = color;

    last_cluster.points.push(point);
    i++;
  }

  for (const cluster of newClusters) {
    // Only calculate centroid if there are points
    if (cluster.points.length > 0) {
      cluster.centroid = average(cluster.points, cluster.points[0].color);
    }
  }
  return newClusters;
}
