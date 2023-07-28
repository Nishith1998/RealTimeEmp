import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  @Input() toolbarTitle!: string;
  @Input() iconEnabled: boolean = false;
  @Input() iconName!: string;
  @Output() onAction: EventEmitter<null> = new EventEmitter();

  onActionBtnClicked() {
    this.onAction.emit();
  }

}
