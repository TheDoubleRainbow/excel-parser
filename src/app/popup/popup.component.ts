import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Line } from './../types';
import { HeadersMapping } from './../settings';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit { 
  @Input() commandColumnIDs: Array<string>;
  @Input() commandLines: Array<Line>;
  @Input() isModalActive: boolean;

  @Output() popupClose: EventEmitter<any> = new EventEmitter();

  headers = HeadersMapping;  

  objectKeys(obj): Array<any> {
    let keys = Object.keys(obj).sort();

    return keys;
  }

  toggleModal() {   
    this.popupClose.emit();
  }

  ngOnInit(): void { } 
}
