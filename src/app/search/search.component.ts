import { Component, OnInit, Input } from '@angular/core';
import { Line } from './../types';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  constructor() { }

  @Input() lines : Array<Line>;
  @Input() columnIDs : Array<string>;

  result: Array<Line>;

  onSearchType(event: any): void {
    let query = event.target.value;
    if(query.length > 3) {
      this.result = this.search(query);
    }
  }

  search(query): Array<Line> {
    let result: Array<Line> = [];
    for(let i = 1; i < this.lines.length; i++) {
      const line = this.lines[i];
      for(let [key, value] of Object.entries(line.columns)) {
        let cellContent:string = value+'';
        if(cellContent.toUpperCase().includes(query.toUpperCase())){
          result.push(line);
          break;
        }
      }
    }

    return result;
  }

  objectKeys(obj): Array<any> {
    let keys = Object.keys(obj).sort();

    return keys
  }

  ngOnInit(): void {
  }

}
