import {Component, ChangeDetectionStrategy} from '@angular/core';
import {TextService} from '../text-service/text.service';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlPanelComponent {

  constructor(private textService: TextService) {}

  onClick(eventType: string, element?: HTMLButtonElement): void {
    this.textService.changeEvent(eventType, element);
  }

  insertColor(color: string, where: string): void {
    this.textService.insertColor(color, where);
  }

}
