import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SurveyComponentComponent } from './survey-component.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

@NgModule({
  declarations: [
    SurveyComponentComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    SurveyComponentComponent,
  ],
  bootstrap: [SurveyComponentComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA ]
})
export class SurveyComponentModule {
  
 }
