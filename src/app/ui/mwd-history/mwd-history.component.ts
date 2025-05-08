import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { MaterialModule } from '../material.module';
import { MapSamplesHistoryServiceImpl } from '../0commons/MapSamplesHistoryServiceImpl';
import { map } from 'rxjs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MapSamples } from "../../0shared";
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'mwd-history',
  imports: [ MaterialModule, MatExpansionModule, MatButtonModule, MatIconModule ],
  templateUrl: './mwd-history.component.html',
  styleUrl: './mwd-history.component.scss'
})
export class MwdHistoryComponent {

  @Output()
  public readonly recordClick = new EventEmitter<MapSamples>();

  @Output()
  public readonly backFromHistory = new EventEmitter<void>();

  private readonly _srv = inject(MapSamplesHistoryServiceImpl);
  readonly panelOpenState = signal(false);

  public history$ = this._srv.observeAllSamplesRecords().pipe(
    map(samples => samples.map((record) => ( record )))
  );

  onClickClean() {
    this._srv.cleanAll();
  }

  onClickCleanOne(index: number) {
    this._srv.cleanOne(index);
  }

  onRecordClick(index: number) {
    const record = this._srv.getSamplesByItem(index);
    this.recordClick.emit(record);
    this.backFromHistory.emit();
  }

  onClickBackFromHistory() {
    this.backFromHistory.emit();
  }

}
