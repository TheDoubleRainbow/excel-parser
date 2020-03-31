import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ParsedDiff, Line, ChangeListArray } from '../types';


import { diffArrays } from 'diff';

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
  checkedFlag = false;
  changeList: ChangeListArray = [];
  hashMap: any = {};

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
    const first = this.diffData.firstDiff.lines;
    const second = this.diffData.secondDiff.lines;
    const main = first.length > second.length ? first : second;
    const alt = first.length > second.length ? second : first;

    this.hashMap = {};
    let mainHashArr = [];
    let altHashArr = [];
    this.changeList = [];

    for(let i = 0; i < main.length; i++) {
      if(main[i]) {
        //const altChecked = alt[i] || {row: [i], columns: {}};
        const mainHash = hash(main[i].columns);
        const altHash = alt[i] ? hash(alt[i].columns) : '';

        this.hashMap[mainHash] = main[i];
        if(altHash && mainHash != altHash) {
          this.hashMap[altHash] = alt[i];
        }

        mainHashArr.push(mainHash);
        if(altHash) {
          altHashArr.push(altHash);
        }
      }
    }
    let diffList;
    if(main === first) {
      diffList = diffArrays(mainHashArr, altHashArr);
    }
    else if(main === second) {
      diffList = diffArrays(altHashArr, mainHashArr);
    }

     diffList.map(el => {
       if(el.added) {
        this.changeList.push({type: 'added', value: el.value});
       }
       else if(el.removed) {
        this.changeList.push({type: 'removed', value: el.value});
       }
     })

    console.log(this.changeList);
  }

  getDataFromHash(hash) {
    const line = this.hashMap[hash];
    return {
      row: line.row,
      values: Object.values(this.hashMap[hash].columns),
    };
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
