import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TrainingsModule } from './trainings/trainings.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, TrainingsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
