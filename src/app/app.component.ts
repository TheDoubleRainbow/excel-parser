import { Component } from '@angular/core';

import * as xlsx from 'xlsx';
import { Line } from './types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  sheetNames: Array<string>;
  sheets: any;
  columnIDs: Array<string>;
  selectedName: string;
  selectedFilterValue: Line[];
  lines: Array<Line>;
  commandSheets: any;
  commandColumnIDs: Array<string>;
  commandLines: Array<Line>;
  fileType: string;
  isSpoiled = {
    file: false,
    search: false,
  }

  onFileUpload(event: any, type: string) {
    if (event.target.files.length !== 1) {
      return;
    }

    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const binary = e.target.result;
      const wb: xlsx.WorkBook = xlsx.read(binary, { type: 'binary' });
      console.log(wb);
      if (type === 'vui') {
        this.sheetNames = wb.SheetNames;
        this.sheets = wb.Sheets;
        this.fileType = file.name.includes('Audio')
          ? 'audio'
          : file.name.includes('Phone')
          ? 'phone'
          : 'Unknown';
      } else if (type === 'commands') {
        this.commandSheets = wb.Sheets;
        this.parseSheetLines(
          this.commandSheets,
          'Mapping',
          this.commandLines,
          this.commandColumnIDs,
          'commands',
        );
      }
    };
    reader.readAsBinaryString(file);
  }

  selectSheet(event: any) {
    this.selectedName = event.target.value;
    this.parseSheetLines(this.sheets, this.selectedName, this.lines, this.columnIDs, 'vui')
  }

  isIndex(index: string) {
    return RegExp(/[A-Z]/).test(index[0]);
  }

  parseSheetLines(sheets, selectedName, lines, columnIDs, type) {
    let keys = Object.keys(sheets[selectedName]);
    lines = [];
    let columnIDsMap = {};
    for (let i = 0; i < keys.length; i++) {
      if (!this.isIndex(keys[i])) {
        continue;
      }
      const splitedKey: any = keys[i].split('');
      const column = splitedKey.splice(0, 1).join('');
      if (!columnIDsMap[column]) {
        columnIDsMap[column] = true;
      }
    }

    columnIDs = Object.keys(columnIDsMap).sort();

    for (let i = 0; i < keys.length; i++) {
      if (!this.isIndex(keys[i])) {
        continue;
      }
      const splitedKey: any = keys[i].split('');
      const column = splitedKey.splice(0, 1).join('');
      const row = splitedKey.join('') * 1;
      const cellContent = sheets[selectedName][column + row].v;
      if (lines[row]) {
        lines[row].columns[column] = cellContent;
      } else {
        lines[row] = {
          row,
          columns: {
            [column]: cellContent,
          },
        };
      }
    }

    for (let i = 1; i < lines.length; i++) {
      let line = lines[i];

      for (let j = 0; j < columnIDs.length; j++) {
        let id = columnIDs[j];
        if (!line.columns[id]) {
          if (
            lines[i - 1] &&
            lines[i - 1].columns[id] &&
            (id === 'G' || id === 'H') &&
            type === 'vui'
          ) {
            line.columns[id] = lines[i - 1].columns[id];
          } else {
            line.columns[id] = '';
          }
        }
      }
    }

    if (type === 'vui') {
      this.sheets = sheets;
      this.selectedName = selectedName;
      this.lines = lines;
      this.columnIDs = columnIDs;
    } else {
      this.commandSheets = sheets;
      this.commandLines = lines;
      this.commandColumnIDs = columnIDs;
    }

    if(type === 'vui') {
      this.isSpoiled.file = true;
    }

    console.log('lines===>', this.lines);
    this.selectedFilterValue = this.lines.reduce((acc, item) => {
      if (item.columns.B && !acc.includes(item.columns.B)) {
        acc.push(item.columns.B);
      }
      return acc;
    }, []);

    console.log('lines===>', this.lines);
    console.log('selectedFilterValue===>', this.selectedFilterValue);
  }
  onCommandClick(event) {
    console.log(event);
    // console.log(this.lines);
  }
  spoil(name: string){
    this.isSpoiled[name] = !this.isSpoiled[name];
  }
}
