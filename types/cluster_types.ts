/**
 * Represents a single data point in a 2D space.
 * @property x The x-coordinate of the point.
 * @property y The y-coordinate of the point.
 * @property color An optional color associated with the point, typically representing its cluster.
 */
export type Point = { x: number; y: number; color?: string | undefined };
/**
 * Represents a cluster of points.
 * @property points An array of data points belonging to this cluster.
 * @property centroid The calculated center point of the cluster.
 */
export type Cluster = {
  points: Point[];
  centroid: Point | undefined;
};

/**
 * Represents raw data parsed from a source like a CSV file.
 * @property index An identifier for the data entry.
 * @property d1 The first dimension of the data, which needs to be parsed into a number.
 * @property d2 The second dimension of the data, which needs to be parsed into a number.
 */
export type RawData = {
  index: string | number;
  d1: string | number;
  d2: string | number;
};
