import { encodeHex } from "jsr:@std/encoding/hex";
import { Point, Cluster, RawData } from "../types/cluster_types.ts";
import { getRandomColor } from "./colors.ts";
import { createClusterSVG } from "./svg.ts";

const HD_X = 1920;
const HD_Y = 1080;

export const re_center = (cluster: Cluster): Point => {
  if (cluster.centroid === undefined) {
    throw new Error("Cluster centroid is undefined");
  }
  return average(cluster.points, cluster.centroid.color);
};

export function average(points: Point[], color: string = "red"): Point {
  const sum = points.reduce(
    (acc, point) => ({ x: acc.x + point.x, y: acc.y + point.y }),
    { x: 0, y: 0 },
  );
  return { x: sum.x / points.length, y: sum.y / points.length, color };
}

export function randomPoint(color: string = "red"): Point {
  // Generate points in [0, 1] x [0, 1]
  return { x: Math.random(), y: Math.random(), color };
}

export function randomPoints(count: number): Point[] {
  return Array.from({ length: count }, randomPoint);
}

export function randomCluster(
  center_point: Point,
  radius: number,
  count: number,
): Cluster {
  const cluster: Cluster = {
    points: [],
    centroid: center_point,
  };
  const { color } = center_point;
  for (let i = 0; i < count; i++) {
    // Generate points scattered around the center_point within the radius
    const rawX = center_point.x + (Math.random() * radius * 2 - radius);
    const rawY = center_point.y + (Math.random() * radius * 2 - radius);

    // Clamp the coordinates to the [0, 1] range
    // const clampedX = Math.max(0, Math.min(1, rawX));
    // const clampedY = Math.max(0, Math.min(1, rawY));
    const clampedX = Math.abs(Math.min(1, rawX));
    const clampedY = Math.abs(Math.min(1, rawY));

    const point = {
      x: clampedX,
      y: clampedY,
      color,
    };

    cluster.points.push(point);
  }

  cluster.centroid = average(cluster.points, color);
  return cluster;
}

export function createClusters(
  radius: number,
  cluster_count: number,
  elements_per_cluster: number = 10,
): Cluster[] {
  const clusters: Cluster[] = [];
  for (let i = 0; i < cluster_count; i++) {
    const color = getRandomColor();
    // Generate centroid randomly within the [0, 1] x [0, 1] space
    const centroid = randomPoint(color);
    clusters.push(randomCluster(centroid, radius, elements_per_cluster));
  }
  return clusters;
}

export function euclideanDistance(
  p1: Point | undefined,
  p2: Point | undefined,
): number {
  if (p1 === undefined || p2 === undefined) {
    throw new Error("Point is undefined");
  }
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;

  return Math.sqrt(dx * dx + dy * dy);
}

export function reassignment_logic(clusters: Cluster[]): Cluster[] {
  const all_points = clusters
    .map((cluster) => cluster.points)
    .flatMap((cluster) => cluster);

  const all_centroids = clusters.map((centroid) => centroid.centroid);

  const newClusterPoints: Point[][] = Array.from(
    { length: clusters.length },
    () => [],
  );

  for (const point of all_points) {
    let min_distance = Number.MAX_SAFE_INTEGER;
    let closestClusterIndex = -1;
    let color: string | undefined = "teal";

    for (let j = 0; j < all_centroids.length; j++) {
      const centroid = all_centroids[j];
      if (centroid === undefined) {
        throw new Error("Cluster centroid is undefined");
      }
      const d = euclideanDistance(centroid, point);
      // Check if this distance is smaller than the minimum found so far for this point
      if (d < min_distance) {
        color = centroid.color;
        min_distance = d; // Update the minimum distance
        closestClusterIndex = j; // Store the index of the closest cluster
      }
    }

    if (closestClusterIndex !== -1) {
      point.color = color;
      newClusterPoints[closestClusterIndex].push(point);
    } else {
      console.warn("Point could not be assigned to any cluster.");
    }
  }

  for (let i = 0; i < clusters.length; i++) {
    clusters[i].points = newClusterPoints[i];
  }

  return clusters;
}

export function iterate(clusters: Cluster[]): Cluster[] {
  const new_clusters: Cluster[] = [];

  for (const cluster of clusters) {
    const this_centroid = cluster.centroid;
    if (this_centroid === undefined) {
      throw new Error("Cluster centroid is undefined");
    }
    const centroid = average(cluster.points, this_centroid.color);

    new_clusters.push({
      centroid,
      points: cluster.points,
    });
  }

  return new_clusters;
}

export async function hashCentroids(clusters: Cluster[]): Promise<string> {
  const str_centroids = clusters.map((cluster) => cluster.centroid);

  const messageBuffer = new TextEncoder().encode(JSON.stringify(str_centroids));
  const hashBuffer = await crypto.subtle.digest("SHA-256", messageBuffer);

  return encodeHex(hashBuffer);
}

/**
 * Iterate clusters until they converge.
 * @todo Implement a more efficient convergence check. Use a hash map to store previous centroids and compare them with the current ones.
 */
export async function iterate_clusters(clusters: Cluster[]) {
  let hash = await hashCentroids(clusters);
  let is_different: boolean = true;
  let i = 0;
  while (is_different) {
    Deno.writeTextFileSync(
      `./svg/points_0${i}.svg`,
      createClusterSVG(reassignment_logic(clusters), HD_X, HD_Y),
    );
    clusters = iterate(clusters);
    const tmp_hash = await hashCentroids(clusters);
    is_different = hash !== tmp_hash;
    hash = tmp_hash;
    i++;
  }
}

export function get_min_max_point_values(cluster: Cluster): {
  min_x: number;
  min_y: number;
  max_x: number;
  max_y: number;
} {
  let min_x = Number.MAX_SAFE_INTEGER;
  let min_y = Number.MAX_SAFE_INTEGER;

  let max_x = 0;
  let max_y = 0;

  for (const point of cluster.points) {
    min_x = Math.min(min_x, point.x);
    min_y = Math.min(min_y, point.y);
    max_x = Math.max(max_x, point.x);
    max_y = Math.max(max_y, point.y);
  }
  return { min_x, min_y, max_x, max_y };
}

export function get_min_max_raw_data(data: RawData[]): {
  min_x: number;
  min_y: number;
  max_x: number;
  max_y: number;
} {
  let min_x = Number.MAX_SAFE_INTEGER;
  let min_y = Number.MAX_SAFE_INTEGER;

  let max_x = 0;
  let max_y = 0;

  for (const point of data) {
    point.d1 = typeof point.d1 !== "number" ? parseFloat(point.d1) : point.d1;
    point.d2 = typeof point.d2 !== "number" ? parseFloat(point.d2) : point.d2;
    min_x = Math.min(min_x, point.d1);
    min_y = Math.min(min_y, point.d2);
    max_x = Math.max(max_x, point.d1);
    max_y = Math.max(max_y, point.d2);
  }
  return { min_x, min_y, max_x, max_y };
}

export function normalize_cluster(cluster: Cluster): Cluster {
  const { min_x, min_y, max_x, max_y } = get_min_max_point_values(cluster);
  const points = [];
  for (const point of cluster.points) {
    point.x = (point.x - min_x) / (max_x - min_x);
    point.y = (point.y - min_y) / (max_y - min_y);
    points.push({ x: point.x, y: point.y, color: point.color });
  }
  const centroid = average(points);
  return { centroid, points };
}

export function normalize_raw_data(data: RawData[]): Point[] {
  const { min_x, min_y, max_x, max_y } = get_min_max_raw_data(data);
  const points = [];
  const color = getRandomColor();
  for (const point of data) {
    point.d1 = typeof point.d1 !== "number" ? parseFloat(point.d1) : point.d1;
    point.d2 = typeof point.d2 !== "number" ? parseFloat(point.d2) : point.d2;

    point.d1 = (point.d1 - min_x) / (max_x - min_x);
    point.d2 = (point.d2 - min_y) / (max_y - min_y);
    points.push({ x: point.d1, y: point.d2, color });
  }
  return points;
}
