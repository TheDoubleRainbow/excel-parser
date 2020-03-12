import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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



  displayableIDs = {};
  defaultFilters = DefaultFilters;
  headers = HeadersConfig;
  filter: any = this.defaultFilters.phone;

  result: Array<Line>;
  lastQuery: string;

  onSearchType(event: any): void {
    let query = event.target.value;
    if(query.length > 3) {
      this.result = this.search(query);
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

  defaultFilter(type: string) {
    if(type === 'audio') {
      this.filter = this.defaultFilters.audio;
    }
    else if(type === 'phone'){
      this.filter = this.defaultFilters.phone;
    }
    console.log(this.filter);
  }

  changeFilter(id) {
    this.filter[id] = !this.filter[id];
  }

  followUp(line, key) {
    
  }

  onCommandClick(event) {
    this.commandClick.emit(event.target.innerText);
  }

  ngOnInit(): void {
  }

  ngOnChanges() {
    console.log('change')
  }

}
