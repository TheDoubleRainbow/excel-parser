import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { diffArrays, diffChars } from 'diff';
import { ChangeListArray, Diff } from '../types';

@Component({
  selector: 'app-nlu-diff-checker',
  templateUrl: './nlu-diff-checker.component.html',
  styleUrls: ['./nlu-diff-checker.component.scss']
})
export class NluDiffCheckerComponent implements OnInit {

  linesFist: Array<string>;
  linesSecond: Array<string>;
  changeList: ChangeListArray = [];
  checked = false;

  linesList: Array<Array<[Diff]>>  = [];

  @Output() topicClicked: EventEmitter<any> = new EventEmitter();

  constructor() { }

  loadFile(event, type) {
    const file = event.target.files[0];

    const reader = new FileReader();
    reader.onload = (e) => {
      console.log(type, e.target.result);
      const lines = (e.target.result + '').split('\n');
      if (type === 'first') {
        this.linesFist = lines;
      } else {
        this.linesSecond = lines;
      }
    };

    reader.readAsText(file);
  }

  check() {
    this.changeList = [];

    if (this.linesFist && this.linesSecond) {

     const diffList = diffArrays(this.linesFist, this.linesSecond);


     diffList.map(el => {

       if (el.added) {
        console.log('el.added', el.value);
        this.changeList.push({type: 'added', value: el.value});
       } else if (el.removed) {
        console.log('el.removed', el.value);
        this.changeList.push({type: 'removed', value: el.value});
       }
     });

     let lastIndex = 0;


     for (let i = 0; i < this.changeList.length / 2; i++) {
        const firstStr = this.changeList[lastIndex].value[0];
        const secondStr = this.changeList[lastIndex + 1].value[0];
        this.linesList.push([diffChars(firstStr, secondStr)]) ;
        lastIndex = lastIndex + 2;
     }
    }
    this.checked = true;
    console.log(this.changeList);
  }


  topicClick(event) {
    this.topicClicked.emit(event.target.innerHTML);
  }

  ngOnInit(): void {
  }

}
