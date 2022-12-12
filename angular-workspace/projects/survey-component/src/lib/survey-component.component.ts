import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-survey-component',
  template: `
    <p>Survey</p>
  `,
  styles: [
  ]
})
export class SurveyComponentComponent implements OnInit {

  constructor() { 
    console.log('abc')
  }

  ngOnInit(): void {
  }

}
