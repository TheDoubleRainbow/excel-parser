import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ParsedDiff, Line } from '../types';

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

  constructor() { }

  loadFile(e:any, diffType: 'firstDiff' | 'secondDiff'): void {
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
    console.log('Check Difference');
    const first = this.diffData.firstDiff.lines;
    const second = this.diffData.secondDiff.lines;
    const main = first.length > second.length ? first : second;
    const alt = first.length > second.length ? second : first;

    for(let i = 0; i < main.length; i++) {
      if(main[i]) {
        const altChecked = alt[i] || {row: [i], columns: {}};
        const mainValues = Object.values(main[i].columns);
        const altValues = Object.values(alt[i].columns);

        if(mainValues.toString() != altValues.toString()) {
          this.differences.push([main[i], alt[i]]);
        }
        console.log(this.differences);
      }
    }

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
