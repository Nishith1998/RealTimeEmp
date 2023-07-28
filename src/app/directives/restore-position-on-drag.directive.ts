import { Directive, HostListener } from '@angular/core';
import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';

@Directive({
  selector: '[appRestorePositionOnDrag]'
})
export class RestorePositionOnDragDirective {

  constructor(private cdkDrag: CdkDrag) { }

  @HostListener('cdkDragEnded', ['$event'])
  onDragEnded(event: CdkDragEnd): void {
    this.cdkDrag.reset();
  }
}
