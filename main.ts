import { Cluster } from "./types/cluster_types.ts";
import { normalize_raw_data, iterate_clusters } from "./utils/cluster.ts";
import { divide_and_set_clusters } from "./utils/parse_csv.ts";
import { data_1, data } from "./utils/parser.ts";

const ELEMENTS_PER_CLUSTER = 10;

const normalized_data = normalize_raw_data(data);

const clusters: Cluster[] = divide_and_set_clusters(
  normalized_data,
  ELEMENTS_PER_CLUSTER,
);

console.log("Clusters created:", clusters.length);
console.log("First cluster points:", clusters[0].points.length);
console.log("First cluster centroid:", clusters[0].centroid);

await iterate_clusters(clusters);

// Remove comments from the following code to test the second dataset.
// If you don't remove it, the svg generated images will be overwritten.

// const normalized_data_1 = normalize_raw_data(data_1);

// const clusters_1: Cluster[] = divide_and_set_clusters(
//   normalized_data_1,
//   ELEMENTS_PER_CLUSTER,
// );

// console.log("Clusters created:", clusters_1.length);
// console.log("First cluster points:", clusters_1[0].points.length);
// console.log("First cluster centroid:", clusters_1[0].centroid);

// await iterate_clusters(clusters_1);
