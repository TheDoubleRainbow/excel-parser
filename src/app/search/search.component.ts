import { Component, OnInit, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import { Line } from './../types';
import { HeadersConfig, DefaultFilters } from './../settings';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {


  constructor() { }

  @Input() lines : Array<Line>;
  @Input() columnIDs : Array<string>;
  @Input() fileType : string;

  @Output() commandClick: EventEmitter<any> = new EventEmitter();
  @Output() followUpClick: EventEmitter<any> = new EventEmitter();

  headers = HeadersConfig;
  filter: any = DefaultFilters.phone;

  result: Array<Line>;
  lastQuery: string;
  allContext = 'All contexts';
  selectedContext: string = this.allContext;
  contextList: Array<string> = [this.allContext];

  onSearchType(event: any): void {
    let query = event.target.value;
    if(query.length > 3) {
      this.selectedContext = this.allContext;
      this.result = this.search(query);
      this.buildContextsList();
    }
  }

  search(query): Array<Line> {
    this.lastQuery = query;
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

  onFilterChange(e: any) {
    this.filter = e;
    console.log(e);
  }

  followUp(line) {
    this.followUpClick.emit({line});
  }

  onCommandClick(value: string) {
    this.commandClick.emit(value );
  }

  filterByContext(event: any) {
    this.selectedContext = event.target.value;
  }

  buildContextsList() {
    let contextMap = {};
    this.result.map(el => {
      if(!contextMap[el.columns.B]) {
        contextMap[el.columns.B] = true;
      }
    });
    this.contextList = [this.allContext ,...Object.keys(contextMap)];
  }

  ngOnInit(): void {
  }

}
