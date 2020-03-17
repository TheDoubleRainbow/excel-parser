import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FollowUpFlowComponent } from './follow-up-flow/follow-up-flow.component';
import { SearchComponent } from './search/search.component';
import { SheetComponent } from './sheet/sheet.component';
import { PopupComponent } from './popup/popup.component';
import { DiffCheckerComponent } from './diff-checker/diff-checker.component';
import { TableFilterComponent } from './table-filter/table-filter.component';

@NgModule({
  declarations: [
    AppComponent,
    FollowUpFlowComponent,
    SearchComponent,
    SheetComponent,
    PopupComponent,
    DiffCheckerComponent,
    TableFilterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
