import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Line, LineRenderType } from '../types';
import { log } from 'util';

@Component({
  selector: 'app-follow-up-flow',
  templateUrl: './follow-up-flow.component.html',
  styleUrls: ['./follow-up-flow.component.scss'],
})
export class FollowUpFlowComponent {
  @Input() lines: Array<Line>;
  @Input() selectedFilterValue: Array<Line>;
  @Input() followUpFromSearch:any;

  constructor() {}

  selectedValue: string = 'Context Name';
  selectedNextFollowUp: string;
  mainFlow: Array<{
    table: Array<LineRenderType>;
    nextFollowUp: string;
    followBoxPosition: {
      top: string;
      position?: string;
    };
    tablePosition: {
      top: string;
      left: string;
      position?: string;
    };
  }> = [];

  followUpBoxStyle: {
    top: string;

    position?: string;
  } = {
    top: '0px',

    position: 'relative',
  };

  selectFilter(event: any) {
    this.selectedValue = event.target.value;
  }


  selectCondition(nextFollowUp?: string) {
    this.mainFlow = [];
    const table = this.lines.reduce((acc, line) => {
      if (line.columns.B.toLowerCase() === this.selectedValue.toLowerCase()) {
        acc = acc.concat({
          B: line.columns.B,
          G: line.columns.G,
          L: line.columns.L,
          O: line.columns.O,
          P: line.columns.P,
        });
      }
      return acc;
    }, []);

    this.mainFlow = this.mainFlow.concat({
      table,
      nextFollowUp: nextFollowUp || '',
      display: 'inline-table',
    });
  }


  onClickFollowUp(
    event: any,
    name: string,
    index: number,
    nextCondition: string,
  ) {
    const div = document.getElementById('myDiv');
    const rect = div.getBoundingClientRect();

    console.log(rect)

    const centerCell = event.srcElement.offsetHeight / 2;

    const h = event.srcElement.offsetHeight - event.offsetY;

    const pl =
      event.offsetY > centerCell
        ? event.srcElement.offsetHeight - h
        : event.srcElement.offsetHeight + h;

       
    const scrollHeigth = event.pageY - event.clientY
    
    const positionTop =`${event.pageY -
      rect.top -
      (event.offsetY > centerCell
        ? event.srcElement.offsetHeight + h-centerCell
        : event.srcElement.offsetHeight - h)-scrollHeigth}px`

    const positionStyle = {
      ...this.followUpBoxStyle,
      firstBlockTop: parseInt(positionTop) + rect.top,
      top: positionTop,
      display: 'inline-table'
          
    };
    const lastFlowBoxPosition = this.mainFlow[this.mainFlow.length - 1]
      .followBoxPosition;
    const lastTablePosition = this.mainFlow[this.mainFlow.length - 1]
      .tablePosition;

    // const firstTableBoxValue = this.mainFlow[0].followBoxPosition.top

    this.selectedNextFollowUp = nextCondition;

    if (index !== this.mainFlow.length - 1) {
      this.mainFlow = this.mainFlow.slice(0, index + 1);
    }
    if (name === 'Follow-Up' && index === 0) {
      this.mainFlow[index].nextFollowUp = nextCondition;
      this.mainFlow[index].followBoxPosition = positionStyle;
    } else {
      console.log('index', index);
      console.log('!!!!!!!!!!!!!!!!!');
      console.log('event.scrollTop ', event.scrollTop);
      console.log('lastTablePosition', lastTablePosition);
      console.log(
        ' parseInt(lastTablePosition.top, 10)',
        parseInt(lastTablePosition.top, 10),
      );

      console.log(
        '`${event.pageY - parseInt(lastTablePosition.top, 10)}`',
        `${event.pageY - parseInt(lastTablePosition.top, 10)}`,
      );

      // const differ = event.screenY - parseInt(lastTablePosition.top, 10);
      const firstBlockTop = this.mainFlow[0].followBoxPosition.firstBlockTop;
      const differ = event.pageY - event.clientY;

  


      console.log('event.screenY', event);
      console.log('event.pageY', event.pageY);
      console.log('event.clientY', event.clientY);
      console.log('differ', differ)
      console.log('window',window.pageYOffset || document.documentElement.scrollTop)
      this.mainFlow[index].nextFollowUp = nextCondition;
      this.mainFlow[index].followBoxPosition = {
        position: 'relative',
        display: 'inline-table',
        //   top: `${parseInt(lastTablePosition.top, 10) -
        //     (event.pageY - parseInt(lastTablePosition.top, 10))}px`,
        // };
        // top: differ > 0 ? `${differ + parseInt(lastTablePosition.top, 10)}px` : `${Math.abs(differ)}px`,
        // top: `${differ + parseInt(lastTablePosition.top, 10)-firstBlockTop}px`,
        top: `${event.pageY - firstBlockTop + differ}px`,
        
      };
    }
    console.log('this.mainFlow', this.mainFlow);
  }

  selectConditionForFollowUp() {
    console.log('add Table');
    const table = this.lines.reduce((acc, line) => {
      if (
        line.columns.B.toLowerCase() === this.selectedNextFollowUp.toLowerCase()
      ) {
        acc = acc.concat({
          B: line.columns.B,
          G: line.columns.G,
          L: line.columns.L,
          O: line.columns.O,
          P: line.columns.P,
        });
      }
      return acc;
    }, []);

    const lastFlowBoxPosition = this.mainFlow[this.mainFlow.length - 1]
      .followBoxPosition;

    const lastTablePosition = this.mainFlow[this.mainFlow.length - 1]
      .tablePosition;
    console.log('lastFlowBoxPosition', lastFlowBoxPosition);
    console.log(`lastTablePosition`, lastTablePosition);

    const diff = lastTablePosition
      ? parseInt(lastTablePosition.top, 10) -
        parseInt(lastFlowBoxPosition.top, 10)
      : 0;

      window.scrollBy(700,0)

    this.mainFlow = this.mainFlow.concat({
      table,
      nextFollowUp: '',
      tablePosition: {
        // top: lastTablePosition ? `${parseInt(lastFlowBoxPosition.top, 10) - diff}px`: `${parseInt(lastFlowBoxPosition.top, 10)}px`,
        top: lastTablePosition
          ? `${parseInt(lastFlowBoxPosition.top, 10) +
              parseInt(lastTablePosition.top, 10)}px`
          : `${parseInt(lastFlowBoxPosition.top, 10)}px`,
        position: 'relative',
        display: 'inline-table',
      },
    });

  
    console.log('mainflow', this.mainFlow);
  }

  ngOnChanges(change: any) {
    if(change.followUpFromSearch.currentValue) {
      this.selectFilter({target: {value: this.followUpFromSearch.followContext}});
      this.selectCondition();
    }
  }
}
