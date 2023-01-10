
import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SurveyService } from '../survey.service';

@Component({
  selector: 'lib-item-page',
  templateUrl: './item-page.component.html',
  styleUrls: ['./item-page.component.scss']
})
export class ItemPageComponent implements OnInit {

  @Input() items: any;
  @Input() subcat_id: number | undefined;
  @Input() subcat_name: string | undefined;

  itemsBlock: any;
  constructor(
    public surveyor: SurveyService
  ) { }

  ngOnInit(): void { }

  checkOverflow(ele_name: any) {
    const element = document.getElementById(ele_name) as HTMLInputElement;
    if (element.offsetWidth < element.scrollWidth) {
      if (element.classList.contains('auto-scroll')) { element.classList.remove('auto-scroll'); }
      else { element.classList.add('auto-scroll'); }
    }
  }




}




