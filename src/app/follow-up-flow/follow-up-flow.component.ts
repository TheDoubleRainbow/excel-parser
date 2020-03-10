import {
  Component,
  Input,
  OnInit,
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
export class FollowUpFlowComponent implements OnInit {
  constructor() {}
  ngOnInit(): void {}

  @Input() lines: Array<Line>;
  @Input() selectedFilterValue: Array<Line>;
  selectedValue: string;
  selectedNextFollowUp: string;
  conditionListFollowUp: Array<Line> = [];
  @ViewChild('viewContainer', { read: ViewContainerRef })
  viewContainer: ViewContainerRef;
  @ViewChild('template') template: TemplateRef<any>;

  mainFlow: Array<{ table: Array<LineRenderType>; nextFollowUp: string }> = [];

  // ngOnChanges(selectedFilterValue) {
  //   if (selectedFilterValue) {
  //     this.mainFlow = [];
  //   }
  // }

  ngOnChanges() {}

  selectFilter(event: any) {
    this.selectedValue = event.target.value;
  }

  selectCondition() {
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

    this.conditionListFollowUp = this.conditionListFollowUp.concat(table);

    this.mainFlow = this.mainFlow.concat({ table });
    const template = this.template.createEmbeddedView(null);
    this.viewContainer.insert(template);
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

    this.mainFlow = this.mainFlow.concat({ table });
  }
}
