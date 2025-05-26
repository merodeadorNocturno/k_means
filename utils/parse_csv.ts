/**
 * This module provides utility functions for parsing raw data and dividing it into clusters.
 * It includes functions to create initial clusters from raw data or pre-processed points.
 * @module
 */
import type { Point, Cluster } from "../types/cluster_types.ts";
import { getRandomColor } from "./colors.ts";
import { average } from "./cluster.ts";

const ELEMENTS_PER_CLUSTER = 10;

/**
 * Divides raw data entries into clusters based on a specified cluster size.
 * It assigns a random color to each cluster and calculates the initial centroid
 * for each cluster based on the average of its assigned points.
 * Note: The input data is expected to have 'd1' and 'd2' properties as strings
 * that can be parsed into numbers.
 * @param my_data An array of raw data objects, typically from a parsed CSV.
 * @param cluster_size The desired number of points per cluster. Defaults to ELEMENTS_PER_CLUSTER (10).
 * @returns An array of Cluster objects with points and initial centroids.
 */
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

/**
 * Divides an array of Point objects into clusters based on a specified cluster size.
 * It assigns a random color to each cluster and calculates the initial centroid
 * for each cluster based on the average of its assigned points.
 * @param points An array of Point objects, which are already in a numerical format.
 * @param cluster_size The desired number of points per cluster.
 * @returns An array of Cluster objects with points and initial centroids.
 */
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
