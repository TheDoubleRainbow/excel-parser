import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
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
  mainFlow: Array<{ table: Array<LineRenderType>; nextFollowUp: string }> = [];

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

  insertView(name: string, index: number, nextCondition: string) {
    this.selectedNextFollowUp = nextCondition;

    if (index !== this.mainFlow.length - 1) {
      this.mainFlow = this.mainFlow.slice(0, index + 1);
    }
    if (name === 'Follow-Up') {
      this.mainFlow[index].nextFollowUp = nextCondition;
    }
  }

  selectConditionForFollowUp() {
    console.log('mainflow', this.mainFlow);
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

    this.mainFlow = this.mainFlow.concat({ table, nextFollowUp: '' });
    console.log('mainflow', this.mainFlow);
  }
}
