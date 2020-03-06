import { Component } from '@angular/core';

import * as xlsx from 'xlsx';
import { Line } from './types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  sheetNames: Array<string>;
  sheets: any;
  selectedName: string;
  selectedFilterValue: Array<string>;
  lines: Array<Line>;

  onFileUpload(event: any) {
    if(event.target.files.length !== 1) {
      return;
    }

    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const binary = e.target.result;
      const wb: xlsx.WorkBook = xlsx.read(binary, {type: 'binary'});
      console.log(wb);
      this.sheetNames = wb.SheetNames;
      this.sheets = wb.Sheets;
    }
    reader.readAsBinaryString(file);
  }

  selectSheet(event: any) {
    this.selectedName = event.target.value;
  }

  selectFilter(event: any) {
    this.selectedFilterValue = event.target.value;
  }

  listOfTopCondition() {
    return this.lines.filter(item => item.columns)
  }

  isIndex(index: string) {
    return RegExp(/[A-Z]/).test(index[0]);
  }

  parseSheetLines() {
    let keys = Object.keys(this.sheets[this.selectedName]);
    this.lines = [];
    for(let i = 0; i < keys.length; i++) {
      // console.log(keys[i]);
      if(!this.isIndex(keys[i])) { continue; }
      const splitedKey:any = keys[i].split('');
      const column = splitedKey.splice(0, 1).join('');
      const row = splitedKey.join('')*1;
      const cellContent = this.sheets[this.selectedName][column+row].h;
      if(this.lines[row]) {
        this.lines[row].strings.push(cellContent)
        this.lines[row].columns.push(column);
      }
      else {
        this.lines[row] = {
          row,
          columns: [column],
          strings: [cellContent]
        }
      }
    }
    console.log(this.lines);
  }
}
