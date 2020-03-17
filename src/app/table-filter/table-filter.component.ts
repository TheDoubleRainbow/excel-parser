import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import { HeadersConfig, DefaultFilters } from './../settings';
import { Line } from './../types';

@Component({
  selector: 'app-table-filter',
  templateUrl: './table-filter.component.html',
  styleUrls: ['./table-filter.component.scss']
})
export class TableFilterComponent implements OnInit {

  @Input() lines : Array<Line>;
  @Input() columnIDs : Array<string>;
  @Input() fileType : string;

  @Output() filterChange : EventEmitter<any> = new EventEmitter();

  constructor() { }

  displayableIDs = {};
  defaultFilters = DefaultFilters;
  headers = HeadersConfig;
  filter: any = this.defaultFilters.phone;

  defaultFilter(type: string) {
    if(type === 'audio') {
      this.filter = this.defaultFilters.audio;
    }
    else if(type === 'phone'){
      this.filter = this.defaultFilters.phone;
    }
    this.filterChange.emit(this.filter);
  }

  changeFilter(id) {
    this.filter[id] = !this.filter[id];
    this.filterChange.emit(this.filter);
  }


  ngOnChanges() {
    this.filter = this.fileType === 'audio' ? this.defaultFilters.audio : this.defaultFilters.phone;
    this.filterChange.emit(this.filter);
  }

  ngOnInit(): void {
  }

}
