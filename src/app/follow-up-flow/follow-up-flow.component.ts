import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Line, LineRenderType } from '../types';

@Component({
  selector: 'app-follow-up-flow',
  templateUrl: './follow-up-flow.component.html',
  styleUrls: ['./follow-up-flow.component.scss'],
})
export class FollowUpFlowComponent {
  @Input() lines: Array<Line>;
  @Input() selectedFilterValue: Array<Line>;
  constructor() {}

  selectedValue: string;
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

    const centerCell = event.srcElement.offsetHeight / 2;

    const h = event.srcElement.offsetHeight - event.offsetY;

    const pl =
      event.offsetY > centerCell
        ? event.srcElement.offsetHeight - h
        : event.srcElement.offsetHeight + h;

    const positionStyle = {
      ...this.followUpBoxStyle,
      top: `${event.pageY -
        rect.top -
        (event.offsetY > centerCell
          ? event.srcElement.offsetHeight + h
          : event.srcElement.offsetHeight - h)}px`,
      parentPositionDiff: pl,
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
      console.log('event.screenY ', event.screenY);
      console.log('lastTablePosition', lastTablePosition);
      console.log(
        ' parseInt(lastTablePosition.top, 10)',
        parseInt(lastTablePosition.top, 10),
      );

      console.log(
        '`${event.pageY - parseInt(lastTablePosition.top, 10)}`',
        `${event.pageY - parseInt(lastTablePosition.top, 10)}`,
      );

      const differ = event.screenY - parseInt(lastTablePosition.top, 10);
      console.log('differ', differ);
      this.mainFlow[index].nextFollowUp = nextCondition;
      this.mainFlow[index].followBoxPosition = {
        position: 'relative',
        //   top: `${parseInt(lastTablePosition.top, 10) -
        //     (event.pageY - parseInt(lastTablePosition.top, 10))}px`,
        // };
        top: differ > 0 ? `${differ}px` : `${Math.abs(differ)}px`,
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
      },
    });

    window.scrollY = 700;
    console.log('mainflow', this.mainFlow);
  }
}
