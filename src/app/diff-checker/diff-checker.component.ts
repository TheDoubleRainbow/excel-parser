import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ParsedDiff, Line } from '../types';

import hash from 'object-hash';

@Component({
  selector: 'app-diff-checker',
  templateUrl: './diff-checker.component.html',
  styleUrls: ['./diff-checker.component.scss']
})
export class DiffCheckerComponent implements OnInit {

  @Output() fileLoad: EventEmitter<any> = new EventEmitter();
  @Output() sheetSelect: EventEmitter<any> = new EventEmitter();

  @Input() diffData: ParsedDiff;

  sameSheetNames: Array<string>;
  differences: Array<any> = [];
  checkedFlag = false;

  constructor() { }

  loadFile(e:any, diffType: 'firstDiff' | 'secondDiff'): void {
    this.checkedFlag = false;

    this.fileLoad.emit({
      target: e.target,
      diffType,
    });
  }

  getSheetNamesList(): void {
    this.sameSheetNames = this.diffData.firstDiff.sheetNames.map(el => {
      if(el && this.diffData.secondDiff.sheetNames.includes(el)) {
        return el
      }
    }).filter(el => el != undefined);
  }

  sheetSelected(event: any):void {
    const sheetName = event.target.value;
    if(sheetName != 'Select sheet name') {
      this.sheetSelect.emit(event.target.value);
    }
  }

  checkDifference() {
    this.checkedFlag = true;
    this.differences = [];
    const first = this.diffData.firstDiff.lines;
    const second = this.diffData.secondDiff.lines;
    const main = first.length > second.length ? first : second;
    const alt = first.length > second.length ? second : first;

    let cursorDiff = [];
    let findResults = [];
    let altI = 0;

    for(let i = 0; i < main.length; i++) {
      if(main[i]) {
        const altChecked = alt[altI] || {row: [altI], columns: {}};
        const mainHash = hash(main[i]);
        const altHash = hash(altChecked);

        if(mainHash != altHash) {
          cursorDiff = [{i: i, value: main[i]}, {i: altI, value: altChecked}];

          // const findResult = this.findLine(main[i], alt);

          // if(findResult) {
          //   altI += 1;
          //   findResults.push({value: findResult, i});
          // }
          // else {
          //   altI -= 1;
          // }

          this.differences.push([main[i], altChecked]);
        }
      }
      altI++;
    }
  }

  findLine(line: Line, array: Array<Line>) {
    let result: false | Line = false;
    array.map(
      (value) => {
        if(Object.values(value.columns).toString() === Object.values(line.columns).toString()) {
          result = result ? result : value;
        }
      }
    )

    return result;
  }

  ngOnChanges(changes: any): void {
    console.log(changes);
    if(this.diffData.firstDiff.sheetNames && this.diffData.secondDiff.sheetNames) {
      this.getSheetNamesList();
      if(this.diffData.firstDiff.lines && this.diffData.secondDiff.lines) {
        this.checkDifference();
      }
    }
  }

  ngOnInit(): void {
  }

}
