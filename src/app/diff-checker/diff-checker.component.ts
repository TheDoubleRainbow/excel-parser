import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ParsedDiff } from '../types';

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
