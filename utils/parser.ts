import { parse } from "jsr:@std/csv";

const DATA_PATH = "./csv/data.csv";
const DATA_PATH_1 = "./csv/data_1.csv";

const text = Deno.readFileSync(DATA_PATH);
const text_1 = Deno.readFileSync(DATA_PATH_1);
const decoder = new TextDecoder("utf-8");

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

export const data_1 = d_1.map(({ d1, d2, index }) => {
  return { index, d1, d2 };
});
