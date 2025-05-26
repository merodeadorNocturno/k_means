import { Cluster } from "./types/cluster_types.ts";
import { normalize_raw_data, iterate_clusters } from "./utils/cluster.ts";
import { divide_and_set_clusters } from "./utils/parse_csv.ts";
import { data_1 } from "./utils/parser.ts";

const normalized_data = normalize_raw_data(data_1);

const clusters: Cluster[] = divide_and_set_clusters(normalized_data, 30);

console.log("Clusters created:", clusters.length);
console.log("First cluster points:", clusters[0].points.length);
console.log("First cluster centroid:", clusters[0].centroid);

await iterate_clusters(clusters);
