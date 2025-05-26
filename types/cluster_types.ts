export type Point = { x: number; y: number; color?: string | undefined };
export type Cluster = {
  points: Point[];
  centroid: Point | undefined;
};

export type RawData = {
  index: string | number;
  d1: string | number;
  d2: string | number;
};
