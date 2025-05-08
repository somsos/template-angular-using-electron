import { Component, EventEmitter, Input, Output, WritableSignal } from '@angular/core';
import { IResultsDto } from '../../0shared';
import { MaterialModule } from '../material.module';

@Component({
  selector: 'mwd-results',
  standalone: true,
  imports: [
    MaterialModule,
  ],
  templateUrl: './mwd-results.component.html',
  styleUrls: ['./mwd-results.component.scss']
})
export class MwdResultsComponent {

  @Input()
  public results!: WritableSignal<IResultsDto | null>;

  @Output()
  public readonly downloadClick = new EventEmitter<void>();


  onClickDownloadEvent() {
    this.downloadClick.emit();
  }


}
