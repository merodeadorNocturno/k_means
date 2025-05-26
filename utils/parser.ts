/**
 * This module provides utility functions for parsing data from CSV files.
 * It includes constants for predefined data sets parsed from specific file paths.
 * @module
 */
import { parse } from "jsr:@std/csv@1.0.6";

const DATA_PATH = "./csv/data.csv";
const DATA_PATH_1 = "./csv/data_1.csv";

const text = Deno.readFileSync(DATA_PATH);
const text_1 = Deno.readFileSync(DATA_PATH_1);
const decoder = new TextDecoder("utf-8");

/**
 * Parsed data from `./csv/data.csv`.
 * The data is expected to have columns "index", "d1", and "d2".
 * @property index Identifier for the data entry.
 * @property d1 First data dimension (as string).
 * @property d2 Second data dimension (as string).
 */
export const data: Record<"index" | "d1" | "d2", string>[] = parse(
  decoder.decode(text),
  {
    skipFirstRow: true,
    columns: ["index", "d1", "d2"],
  },
);

const d_1: Record<"d1" | "d2" | "index", string>[] = parse(
  decoder.decode(text_1),
  {
    skipFirstRow: true,
    columns: ["d1", "d2", "index"],
  },
);

/**
 * Parsed and re-mapped data from `./csv/data_1.csv`.
 * The original data is expected to have columns "d1", "d2", and "index",
 * which are remapped to match the standard "index", "d1", "d2" structure.
 * @property index Identifier for the data entry.
 * @property d1 First data dimension (as string).
 * @property d2 Second data dimension (as string).
 */
export const data_1: Record<"index" | "d1" | "d2", string>[] = d_1.map(
  ({ d1, d2, index }) => {
    return { index, d1, d2 };
  },
);
