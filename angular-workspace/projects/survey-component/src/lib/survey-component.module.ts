import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SurveyComponentComponent } from './survey-component.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubcatsComponent } from './subcats/subcats.component';
import { SurveyComponent } from './survey/survey.component';
import { ItemPageComponent } from './item-page/item-page.component';



@NgModule({
  declarations: [
    SurveyComponentComponent,
    SubcatsComponent,
    SurveyComponent,
    ItemPageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    SurveyComponentComponent
  ],
  bootstrap: [SurveyComponentComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA ]
})
export class SurveyComponentModule {
  
 }
