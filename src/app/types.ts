export type Line = {
  row: number;
  columns?: any;
};

export class ParsedFile  {
  lines: Array<Line>;
  columnIDs: Array<string>;
  sheetNames: Array<string>;
  sheets: any;
  fileType: string;
}

export class ParsedDiff {
  firstDiff = new ParsedFile();
  secondDiff = new ParsedFile();
  selectedSheet: string;
}

