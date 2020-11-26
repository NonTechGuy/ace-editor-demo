import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AceModule } from 'ngx-ace-wrapper';
import { ACE_CONFIG } from 'ngx-ace-wrapper';
import { AceConfigInterface } from 'ngx-ace-wrapper';
import 'brace';
import 'brace/mode/text';
import 'brace/theme/github';

const routes: Routes = [];
const DEFAULT_ACE_CONFIG: AceConfigInterface = {
};

@NgModule({
  imports: [RouterModule.forRoot(routes),
    AceModule],
  providers: [
    {
      provide: ACE_CONFIG,
      useValue: DEFAULT_ACE_CONFIG
    }
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
