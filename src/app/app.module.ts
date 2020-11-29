import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CodeEditorModule } from './code-editor';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, CodeEditorModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
