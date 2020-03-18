export type Line = {
  row: number;
  columns?: any;
};

export type ParsedFile = {
  lines: Array<Line>,
  columnIDs: Array<string>,
  sheets: any,
  fileType?: string,
}

export type ParsedDiff = {
  firstDiff: ParsedFile,
  secondDiff: ParsedFile,
}

