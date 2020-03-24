import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nlu-diff-checker',
  templateUrl: './nlu-diff-checker.component.html',
  styleUrls: ['./nlu-diff-checker.component.scss']
})
export class NluDiffCheckerComponent implements OnInit {

  linesFist: Array<string>;

  linesSecond: Array<string>;

  constructor() { }

  loadFile(event, type) {
    const file = event.target.files[0];

    const reader = new FileReader();
    reader.onload = (e) => {
      console.log(type, e.target.result);
      const lines = (e.target.result+'').split('\n');
      if(type === 'first') {
        this.linesFist = lines;
      }
      else {
        this.linesSecond = lines;
      }
    };
    reader.readAsText(file);
  }

  check() {

  }

  ngOnInit(): void {
  }

}
