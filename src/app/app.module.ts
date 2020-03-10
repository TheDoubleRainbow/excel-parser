import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';
import { SheetComponent } from './sheet/sheet.component';
import { FollowUpComponent } from './follow-up/follow-up.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    SheetComponent,
    FollowUpComponent
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
