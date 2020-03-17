import { Component, Input } from '@angular/core';
import { Line, LineRenderType } from '../types';
import { HeadersConfig, DefaultFilters } from './../settings';

@Component({
  selector: 'app-follow-up-flow',
  templateUrl: './follow-up-flow.component.html',
  styleUrls: ['./follow-up-flow.component.scss'],
})
export class FollowUpFlowComponent {
  @Input() lines: Array<Line>;
  @Input() selectedFilterValue: Array<Line>;
  @Input() followUpFromSearch:any;

  @Input() columnIDs : Array<string>;
  @Input() fileType : string;


  constructor() {}

  defaultFilters = DefaultFilters;
  headers = HeadersConfig;
  filter: any = this.defaultFilters.phone;
  

  selectedValue: string = 'Context Name';
  selectedNextFollowUp: string;
  mainFlow: Array<Array< Array<LineRenderType>>
   
  > = [];




  selectFilter(event: any) {
    this.selectedValue = event.target.value;
  }

  selectiterKey(){
    if (this.filter.N) {
      return 'N'
    }
    return 'O'
  }




  selectCondition(nextFollowUp?: string) {
    console.log('filter', this.filter);
    console.log('this.selectiterKey()',this.selectiterKey());
    console.log('this.selectedValue', this.selectedValue);
    console.log(this.lines);
    
    
    
    this.mainFlow = [];
    const table = this.lines.reduce((acc, line) => {
      console.log(line.columns[this.selectiterKey()]);
      
      if (line.columns.B.toLowerCase() === this.selectedValue.toLowerCase()) {
        acc = acc.concat({
          ...line
        });
      }
      return acc;
    }, []);


    console.log('table', table);
    

  

    this.mainFlow = this.mainFlow.concat([table]);

    console.log("this.mainFlow", this.mainFlow);
  }


  selectConditionForFollowUp() {

    console.log('this.selectiterKey()',this.selectiterKey());
    
    const table = this.lines.reduce((acc, line) => {
      if (
        line.columns.B.toLowerCase() === this.selectedNextFollowUp.toLowerCase()
      ) {
        acc = acc.concat({
          ...line
        });
      }
      return acc;
    }, []);



   
    this.mainFlow = this.mainFlow.concat([table]);
    
    console.log("this.mainFlow", this.mainFlow);
    
    }

    followUp(line, index){
      console.log('line', line, index);
      console.log('index', index);

      this.selectedNextFollowUp = line.columns[this.selectiterKey()];
      this.selectConditionForFollowUp()
    }


    objectKeys(obj): Array<any> {
      let keys = Object.keys(obj).sort();
  
      return keys
    }

  

  ngOnChanges(change: any) {
    console.error('this.fileType', this.fileType)
    console.error('this.defaultFilters',this.defaultFilters)
    this.filter = this.fileType === 'audio' ? this.defaultFilters.audio : this.defaultFilters.phone;

    if(change.followUpFromSearch.currentValue) {
      this.selectFilter({target: {value: this.followUpFromSearch.followContext}});
      this.selectCondition();
    }


  }

  onClickBreadcrumbs(index: number){
    this.mainFlow = this.mainFlow.slice(0, index + 1);
    console.log(' this.mainFlow', this.mainFlow)
  }



  defaultFilter(type: string) {
    if(type === 'audio') {
      this.filter = this.defaultFilters.audio;
    }
    else if(type === 'phone'){
      this.filter = this.defaultFilters.phone;
    }
  }

  changeFilter(id) {
    this.filter[id] = !this.filter[id];
  }


}
