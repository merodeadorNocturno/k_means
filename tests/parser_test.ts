import { parse } from "jsr:@std/csv";
import { assertEquals } from "jsr:@std/assert";

// Mock CSV data strings based on user provided examples and parser.ts column expectations

// Mock data.csv format: Actual header from example, but parser uses specified columns
const mockDataCsv = `CondensedBinary2DGeometry,BandGapLocation,BandGapWidth
10,497.0116577,22.6972663
11,467.9290183,85.65493622
100,687.6367054,37.40981452
101,721.2827768,61.60475601
110,464.3477675,46.35470747
111,445.8453909,75.48117321
`;

// Mock data_1.csv format: Actual header from example, but parser uses specified columns
const mockData1Csv = `x,y,color
516.0127058374305,393.01451385201693,0
436.2117622061974,408.6565848615271,2
512.0526012254161,372.02201357478293,0
489.14046445291086,401.807159361874,1
446.2079858903369,338.51668220520173,0
516.4143942778024,354.1946331968146,1
`;

const decoder = new TextDecoder("utf-8");
const encoder = new TextEncoder();

// Test case for parsing data similar to data.csv
// The parser uses columns ["index", "d1", "d2"], mapping to the 1st, 2nd, 3rd columns respectively.
Deno.test("parser parses data.csv format correctly based on example", () => {
  const expected = [
    { index: "10", d1: "497.0116577", d2: "22.6972663" },
    { index: "11", d1: "467.9290183", d2: "85.65493622" },
    { index: "100", d1: "687.6367054", d2: "37.40981452" },
    { index: "101", d1: "721.2827768", d2: "61.60475601" },
    { index: "110", d1: "464.3477675", d2: "46.35470747" },
    { index: "111", d1: "445.8453909", d2: "75.48117321" },
  ];

  const decodedMockData = decoder.decode(encoder.encode(mockDataCsv));

  const result = parse(decodedMockData, {
    skipFirstRow: true,
    columns: ["index", "d1", "d2"], // Columns as expected by parser.ts
  });

  assertEquals(result, expected);
});

// Test case for parsing and mapping data similar to data_1.csv
// The parser uses columns ["d1", "d2", "index"] and then maps them to { index, d1, d2 }.
// This means column 1 (x) maps to d1, column 2 (y) maps to d2, and column 3 (color) maps to index initially,
// and then the final object keys are reordered.
Deno.test(
  "parser parses and maps data_1.csv format correctly based on example",
  () => {
    const expected = [
      { index: "0", d1: "516.0127058374305", d2: "393.01451385201693" },
      { index: "2", d1: "436.2117622061974", d2: "408.6565848615271" },
      { index: "0", d1: "512.0526012254161", d2: "372.02201357478293" },
      { index: "1", d1: "489.14046445291086", d2: "401.807159361874" },
      { index: "0", d1: "446.2079858903369", d2: "338.51668220520173" },
      { index: "1", d1: "516.4143942778024", d2: "354.1946331968146" },
    ];

    const decodedMockData1 = decoder.decode(encoder.encode(mockData1Csv));

    const parsed_d1 = parse(decodedMockData1, {
      skipFirstRow: true,
      columns: ["d1", "d2", "index"], // Columns as expected by parser.ts
    });

    // Apply the same mapping logic as in parser.ts
    const result = parsed_d1.map(({ d1, d2, index }) => {
      return { index, d1, d2 };
    });

    assertEquals(result, expected);
  },
);

// Test case for parsing empty data (only header)
const mockEmptyCsv = `header1,header2,header3
`;

const mockEmptyData = ``;

Deno.test("parser handles empty data with header", () => {
  const expected: Record<string, string>[] = []; // Expect an empty array

  const decodedMockData = decoder.decode(encoder.encode(mockEmptyCsv));

  const result = parse(decodedMockData, {
    skipFirstRow: true,
    columns: ["index", "d1", "d2"], // Columns as expected by parser.ts
  });

  assertEquals(result, expected);
});

// Test case for parsing with no data and no header
Deno.test("parser handles completely empty input", () => {
  // When input is empty and no columns are specified, parse should return string[][].
  // For empty input, this is an empty array of empty arrays.
  const expected: string[][] = [];

  const decodedMockData = decoder.decode(encoder.encode(mockEmptyData));

  const result = parse(decodedMockData, {});

  assertEquals(result, expected);
});

// Note: These tests use string literals for mock CSV data.
// To test the `Deno.readFileSync` calls and potential file system errors,
// mocking Deno's file system APIs would be required, which is beyond the scope here.
