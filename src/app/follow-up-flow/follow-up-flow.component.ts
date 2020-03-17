import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Line } from '../types';
import { HeadersConfig, DefaultFilters } from './../settings';

@Component({
  selector: 'app-follow-up-flow',
  templateUrl: './follow-up-flow.component.html',
  styleUrls: ['./follow-up-flow.component.scss'],
})
export class FollowUpFlowComponent implements OnInit {
  @Input() lines: Array<Line>;
  @Input() selectedFilterValue: Array<Line>;
  @Input() followUpFromSearch: any;

  @Input() columnIDs: Array<string>;
  @Input() fileType: string;

  @Output() commandClick: EventEmitter<any> = new EventEmitter();

  constructor() {}

  defaultFilters = DefaultFilters;
  headers = HeadersConfig;
  filter: any = this.defaultFilters.phone;
  selectedValue: string = 'Context Name';
  selectedNextFollowUp: string;
  mainFlow: Array<Array<Array<Line>>> = [];

  allContext = 'All contexts';
  selectedContext: string = this.allContext;

  selectFilter(event: any) {
    this.selectedValue = event.target.value;
  }

  selectiterKey() {
    if (this.filter.N) {
      return 'O';
    }
    return 'P';
  }

  onFilterChange(e: any) {
    this.filter = e;
  }

  addTable(compareValue: string) {
    return this.lines.reduce((acc, line) => {
      if (line.columns.B.toLowerCase() === compareValue.toLowerCase()) {
        acc = acc.concat({
          ...line,
        });
      }
      return acc;
    }, []);
  }

  selectCondition() {
    this.mainFlow = [];
    const table = this.addTable(this.selectedValue);

    if (table.length) {
      this.mainFlow = this.mainFlow.concat([table]);
    }
  }

  followUp(line: Line) {
    this.selectedNextFollowUp = line.columns[this.selectiterKey()];
    const table = this.addTable(this.selectedNextFollowUp);
    if (table.length) {
      this.mainFlow = this.mainFlow.concat([table]);
    }
  }

  objectKeys(obj): Array<any> {
    let keys = Object.keys(obj).sort();
    return keys;
  }

  ngOnChanges(change: any) {
    if (change.followUpFromSearch.currentValue) {
      this.selectFilter({
        target: { value: this.followUpFromSearch.followContext },
      });
      this.selectCondition();
    }
  }

  onClickBreadcrumbs(index: number) {
    this.mainFlow = this.mainFlow.slice(0, index + 1);
  }

  onCommandClick(value: string) {
    this.commandClick.emit(value);
  }

  ngOnInit(): void {}
}
