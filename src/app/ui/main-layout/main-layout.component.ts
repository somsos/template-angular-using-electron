import { Component, inject, signal, WritableSignal } from '@angular/core';
import { MwdSamplesComponent } from '../mwd-samples/mwd-samples.component';
import { IInputDriver, IOutputDriver, IResultsDto, MapSamples } from '../../0shared';
import { MwdResultsComponent } from '../mwd-results/mwd-results.component';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '../material.module';
import { ComponentType } from '@angular/cdk/overlay';
import { IMapSamplesHistoryService, MapSamplesHistoryServiceImpl } from '../0commons/MapSamplesHistoryServiceImpl';
import { OutputDriverImpl } from '../../core/internals/outputDriver/impl/OutputDriverImpl';
import { InputDriverImpl } from '../../core/internals/inputDriver/impl/InputDriverImpl';

@Component({
    selector: 'main-layout-root',
    templateUrl: './main-layout.component.html',
    styleUrl: './main-layout.component.scss',
    standalone: true,
    imports: [
      MaterialModule,
      MwdSamplesComponent,
      MwdResultsComponent,
    ],
    providers: [
      MapSamplesHistoryServiceImpl
    ],
})
export class MainLayoutComponent {
  results: WritableSignal<IResultsDto | null> = signal(null);
  samples?: MapSamples;
  readonly dialog = inject(MatDialog);
  private _ourDrv: IOutputDriver = inject(OutputDriverImpl);
  private _inDrv: IInputDriver = inject(InputDriverImpl);
  private readonly _historySrv: IMapSamplesHistoryService = inject(MapSamplesHistoryServiceImpl);


  onSubmitSample(newSample: MapSamples) {
    this.samples = newSample;
    const results = this._inDrv.resolveSamples(newSample);
    this._addToHistory(newSample, results);
    this.results.set(results);
  }

  _addToHistory(newSample: MapSamples, results: IResultsDto) {
    const newRecord = { sample: newSample, result: results.MWDTotal };
    this._historySrv.addSamplesRecord(newRecord);
  }

  downloadCsv(): void {
    const results = this.results();
    if(!results || !this.samples) {
      throw new Error("Aun no se puede generar csv");
    }
    this._ourDrv.resultsToCsv(results, this.samples);
  }

  async openDialog() {
    const chunk = await import(`../csv-example-dialog/csv-example-dialog.component`);
    const DialogComponent = Object.values(chunk)[0] as ComponentType<unknown>;

    const dialogRef = this.dialog.open(DialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  onResetClick(): void {
    this.samples = undefined;
    this.results.set(null);
  }

}

