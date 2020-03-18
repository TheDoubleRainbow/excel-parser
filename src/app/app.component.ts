import { Component } from '@angular/core';

import * as xlsx from 'xlsx';
import { Line, ParsedDiff } from './types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  sheetNames: Array<string>;
  sheets: any;
  columnIDs: Array<string>;
  selectedName: string;
  selectedFilterValue: Line[];
  lines: Array<Line>;
  commandSheets: any;
  commandColumnIDs: Array<string>;
  commandLines: Array<Line>;
  fileType: string;
  findColumn: Array<Line>;
  modalActive: boolean;
  modalHasContent: boolean = false;
  isSpoiled = {
    file: false,
    search: false,
    followUp: false,
    diffChecker: true,
  }
  fileName: string;
  commandFileName: string;
  loadedFromLocalStorage: boolean = false;
  followUpFromSearch: any;

  diffData: ParsedDiff;

  onFileUpload(event: any, type: string, diffNum?: number) {
    if (event.target.files.length !== 1) {
      return;
    }

    this.loadedFromLocalStorage = false;

    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.parseFile(e, file, type, diffNum);
    };
    reader.readAsBinaryString(file);
  }

  selectSheet(event: any) {
    this.selectedName = event.target.value;
    this.parseSheetLines(this.sheets, this.selectedName, this.lines, this.columnIDs, 'vui')
  }

  parseFile(e: any, file: File, type:string, diffNum?: number) {
    const binary = e.target.result;
    const wb: xlsx.WorkBook = xlsx.read(binary, { type: 'binary' });
    console.log(wb);
    if (type === 'vui') {
      this.fileName = file.name;
      this.lines = undefined;
      this.sheetNames = wb.SheetNames;
      this.sheets = wb.Sheets;
      this.fileType = file.name.includes('Audio')
        ? 'audio'
        : file.name.includes('Phone')
        ? 'phone'
        : 'Unknown';
    } else if (type === 'commands') {
      this.commandFileName = file.name;
      this.commandSheets = wb.Sheets;
      this.parseSheetLines(
        this.commandSheets,
        'Mapping',
        this.commandLines,
        this.commandColumnIDs,
        'commands',
      );
    }

    else if(type === 'diff') {
      let diff = diffNum === 0 ? this.diffData.firstDiff : this.diffData.secondDiff;
    }
  }

  isIndex(index: string) {
    return RegExp(/[A-Z]/).test(index[0]);
  }

  parseSheetLines(sheets, selectedName, lines, columnIDs, type) {
    let keys = Object.keys(sheets[selectedName]);
    lines = [];
    let columnIDsMap = {};
    for (let i = 0; i < keys.length; i++) {
      if (!this.isIndex(keys[i])) {
        continue;
      }
      const splitedKey: any = keys[i].split('');
      const column = splitedKey.splice(0, 1).join('');
      if (!columnIDsMap[column]) {
        columnIDsMap[column] = true;
      }
    }

    columnIDs = Object.keys(columnIDsMap).sort();

    for (let i = 0; i < keys.length; i++) {
      if (!this.isIndex(keys[i])) {
        continue;
      }
      const splitedKey: any = keys[i].split('');
      const column = splitedKey.splice(0, 1).join('');
      const row = splitedKey.join('') * 1;
      const cellContent = sheets[selectedName][column + row].v;
      if (lines[row]) {
        lines[row].columns[column] = cellContent;
      } else {
        lines[row] = {
          row,
          columns: {
            [column]: cellContent,
          },
        };
      }
    }

    for (let i = 1; i < lines.length; i++) {
      let line = lines[i];

      for (let j = 0; j < columnIDs.length; j++) {
        let id = columnIDs[j];
        if (!line.columns[id]) {
          if (
            lines[i - 1] &&
            lines[i - 1].columns[id] &&
            (id === 'G' || id === 'H') &&
            type === 'vui'
          ) {
            line.columns[id] = lines[i - 1].columns[id];
          } else {
            line.columns[id] = '';
          }
        }
      }
    }

    if (type === 'vui') {
      this.sheets = sheets;
      this.selectedName = selectedName;
      this.lines = lines;
      this.columnIDs = columnIDs;
      const vuiSaved = {
        selectedName: this.selectedName,
        lines: this.lines,
        columnIDs: this.columnIDs,
      };
      localStorage.setItem('vuiLines', JSON.stringify(vuiSaved));
    } else {
      this.commandSheets = sheets;
      this.commandLines = lines;
      this.commandColumnIDs = columnIDs;
      const commandSaved = {
        lines: this.commandLines,
        columnIDs: this.commandColumnIDs,
      };
      localStorage.setItem('commandLines', JSON.stringify(commandSaved));
    }

    const savedCommon = {
      fileType: this.fileType,
      fileName: this.fileName,
      commandFileName: this.commandFileName,
    }
    localStorage.setItem('common', JSON.stringify(savedCommon));

    if(type === 'vui') {
      this.isSpoiled.file = true;

      this.selectedFilterValue = this.lines.reduce((acc, item) => {
        if (item.columns.B && !acc.includes(item.columns.B)) {
          acc.push(item.columns.B);
        }
        return acc;
      }, []);
    }

    localStorage.setItem('selectedFilterValue', JSON.stringify(this.selectedFilterValue));
  }

  onCommandClick(event) {
    if (this.commandLines) {
      this.modalHasContent = true;

      this.findColumn = this.commandLines.filter(data => {
        if (data.columns.B === event) {

          data.columns = Object.keys(data.columns).reduce((object, key) => {

            if (key == 'B' || key == 'D' || key == 'E') {
              object[key] = data.columns[key];
            }

            if (key == 'E' && typeof object['E'] !== 'object') {
              object[key] = object[key].split(',').map((item, key) => {
                if (item.includes('=')) {
                  return {
                    name: item.split('=')[0],
                    sep: '=',
                    value: item.split('=')[1]
                  }
                } else {
                  return {
                    name: item,
                    sep: '',
                    value: ''
                  }
                }
              }, {});
            }

            return object
          }, {});

          this.commandColumnIDs = Object.keys(data.columns);

          return data;
        }
      });
    }

    this.modalActive = true;
    localStorage.setItem('selectedFilterValue', JSON.stringify(this.selectedFilterValue));
  }

  spoil(name: string){
    this.isSpoiled[name] = !this.isSpoiled[name];
  }

  onPopupClose() {
    this.modalActive = false;
  }

  checkSavedData() {
    const savedVui = localStorage.getItem('vuiLines');
    const savedCommand = localStorage.getItem('commandLines');
    const savedCommon = localStorage.getItem('common');
    const selectedFilterValue = localStorage.getItem('selectedFilterValue');
    if(!savedCommon || !selectedFilterValue) {
      return
    }

    this.loadedFromLocalStorage = true;

    const commonParsed = JSON.parse(savedCommon);
    this.selectedFilterValue = JSON.parse(selectedFilterValue);

    if(savedVui) {
      const vuiParsed = JSON.parse(savedVui);
      vuiParsed.lines.splice(0,1);
      this.lines = vuiParsed.lines;
      this.selectedName = vuiParsed.selectedName;
      this.columnIDs = vuiParsed.columnIDs;
      this.fileType = commonParsed.fileType;
      this.fileName = commonParsed.fileName;
    }
    if(savedCommand) {
      const commandParsed = JSON.parse(savedCommand);
      commandParsed.lines.splice(0, 1);
      this.commandLines = commandParsed.lines;
      this.commandColumnIDs = commandParsed.columnIDs;
      this.commandFileName = commonParsed.commandFileName;
    }
  }

  onFollowUp({line}) {
    const followUpData:any = {};
    if(this.fileType === 'audio') {
      followUpData.followContext = line.columns['P'];
    }
    else {
      followUpData.followContext = line.columns['O'];
    }
    this.followUpFromSearch = followUpData;
    this.isSpoiled['search'] = true;
  }

  ngOnInit() {
    this.checkSavedData();
  }
}
