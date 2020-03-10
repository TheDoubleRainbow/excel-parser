import {
  Component,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

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
  selectedName: string;
  selectedValue: string;
  selectedFilterValue: Line[];
  lines: Array<Line>;

  onFileUpload(event: any) {
    if (event.target.files.length !== 1) {
      return;
    }

    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const binary = e.target.result;
      const wb: xlsx.WorkBook = xlsx.read(binary, { type: 'binary' });
      // console.log(wb);
      this.sheetNames = wb.SheetNames;
      this.sheets = wb.Sheets;
    };
    reader.readAsBinaryString(file);
  }

  selectSheet(event: any) {
    this.selectedName = event.target.value;
  }

  selectFilter(event: any) {
    this.selectedValue = event.target.value;
  }

  listOfTopCondition() {
    this.selectedFilterValue = this.lines.reduce((acc, item) => {
      if (item.columns.B && !acc.includes(item.columns.B)) {
        acc.push(item.columns.B);
      }
      return acc;
    }, []);
  }

  isIndex(index: string) {
    return RegExp(/[A-Z]/).test(index[0]);
  }

  parseSheetLines() {
    let keys = Object.keys(this.sheets[this.selectedName]);
    this.lines = [];
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

    const columnIDs = Object.keys(columnIDsMap).sort();

    for (let i = 0; i < keys.length; i++) {
      if (!this.isIndex(keys[i])) {
        continue;
      }
      const splitedKey: any = keys[i].split('');
      const column = splitedKey.splice(0, 1).join('');
      const row = splitedKey.join('') * 1;
      const cellContent = this.sheets[this.selectedName][column + row].h;
      if (this.lines[row]) {
        this.lines[row].columns[column] = cellContent;
      } else {
        this.lines[row] = {
          row,
          columns: {
            [column]: cellContent,
          },
        };
      }
    }

    // console.log(columnIDs, this.lines);

    for (let i = 1; i < this.lines.length; i++) {
      let line = this.lines[i];

      for (let j = 0; j < columnIDs.length; j++) {
        let id = columnIDs[j];
        if (!line.columns[id]) {
          if (this.lines[i - 1] && this.lines[i - 1].columns[id]) {
            line.columns[id] = this.lines[i - 1].columns[id];
          } else {
            line.columns[id] = '';
          }
        }
      }
    }

    // console.log(this.lines);

    this.listOfTopCondition();
  }
}
