import { Directive, HostBinding, HostListener } from '@angular/core';
import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';

@Directive({
  selector: '[appRestorePositionOnDrag]'
})
export class RestorePositionOnDragDirective {
//   private originalTransform: string = '';

  constructor(private cdkDrag: CdkDrag) { }

//   @HostBinding('style.transform')
//   get transform(): string {
//     return this.originalTransform;
//   }

//   @HostListener('cdkDragStarted')
//   onDragStarted(): void {
//     this.originalTransform = this.cdkDrag.element.nativeElement.style.transform;
//   }

  @HostListener('cdkDragEnded', ['$event'])
  onDragEnded(event: CdkDragEnd): void {
    // if (!event.isPointerOverContainer) {
      this.cdkDrag.reset();
    // }
    // this.originalTransform = '';
  }
}
