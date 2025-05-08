import { AfterContentChecked, AfterViewInit, Component, computed, EventEmitter, inject, Output, signal, } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { IRowSample, MapSamples } from "../../0shared";
import { MaterialModule } from '../material.module';
import { MwdHistoryComponent } from '../mwd-history/mwd-history.component';
import { InputDriverImpl } from '../../core/internals/inputDriver/impl/InputDriverImpl';
import { NumberUtils } from '../../0shared/internals/utils/NumberUtils';
import { delay, filter, interval, Observable, of, repeat, startWith, take, takeUntil, takeWhile, tap } from 'rxjs';

@Component({
    selector: 'app-mwd-samples',
    standalone: true,
    imports: [
      MaterialModule,
      MwdHistoryComponent,
    ],
    templateUrl: './mwd-samples.component.html',
    styleUrls: ['./mwd-samples.component.scss']
})
export class MwdSamplesComponent implements AfterViewInit {
  private readonly formBuilder = inject(FormBuilder);

  @Output()
  public readonly sampleSubmitted = new EventEmitter<MapSamples>();

  @Output()
  public readonly resetClick = new EventEmitter<void>();

  private readonly _inDrv = inject(InputDriverImpl);

  // Define the form group that holds the form array
  form = this.formBuilder.group({
    rows: this.formBuilder.array<FormGroup>([]),
  });

  public rows = computed(() => this.form.get('rows') as FormArray);

  readonly displayedColumns = ['tamizDiameter', 'soilWeight'];

  public readonly showHistory$ = signal(false);

  ngAfterViewInit(): void {
    this.addRow();
    this.addRow();
    this._setFocusOnFirstInput();
  }

  // Update row based on index and key
  updateRow(index: number, key: keyof IRowSample, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const row = this.rows().at(index);
    let valueStr: string = inputElement.value;

    if(NumberUtils.userIsStillIntroducing(valueStr)) {
      return ;
    }
    valueStr = NumberUtils.cleanNumberString(valueStr);

    if(inputElement.value !== valueStr) {
      row.patchValue({ [key]: valueStr });
      return ;
    }

    const valueNum: number = NumberUtils.toNumber(valueStr);
    if(valueNum === 0) {
      //When we have values as 0.0 or 0.00, we will get 0 but that will
      //set the input as 0 making it annoying for the user.
      return ;
    }

    // We can finally say that valueNum is a number
    row.patchValue({ [key]: valueNum });
  }

  checksOnUnfocus(index: number, key: keyof IRowSample, $event: Event): void {
    $event.stopPropagation();
    this._completeInputIfIsIncomplete(index, key, $event);
    this._addCoRowIfPenultimateValueIsCorrect(index)
  }

  private _addCoRowIfPenultimateValueIsCorrect(index: number): void {
    const penultimateRowValid = this.rows().length > 1 && this.rows().at(this.rows().length - 2).valid;
    const userIsEditingLastRow = index === this.rows().length - 1;
    if (penultimateRowValid && userIsEditingLastRow) {
      this.addRow();
    }
  }

  private _completeInputIfIsIncomplete(index: number, key: keyof IRowSample, $event: Event): void {
    const inputElement = $event.target as HTMLInputElement;
    const row = this.rows().at(index);
    let valueStr: string = inputElement.value;
    if(NumberUtils.userIsStillIntroducing(valueStr)) {
      valueStr = NumberUtils.completeInputIfIsIncomplete(valueStr);
      row.patchValue({ [key]: valueStr });
    }
  }


  // Add a new row if the penultimate row is valid
  addRow(): void {
    this.rows().push(this._createRowFormGroup());
  }

  removeLastRow() {
    this.rows().removeAt(this.rows().length-1);
  }

  private _removeRows() {
    this.rows().clear();
  }

  onClickSubmit(): void {
    const sampleOnForm = this._castUIToSample();
    this.sampleSubmitted.emit(sampleOnForm);
  }

  // Convert UI data into a MapSamples object
  private _castUIToSample(): MapSamples {
    const introducedSamples: MapSamples = new Map();
    for (let i = 0; i < this.rows().controls.length; i++) {
      const row = this.rows().controls[i];
      const rowSample = row.value as IRowSample;
      rowSample.soilWeight = Number(NumberUtils.cleanNumberString(rowSample.soilWeight) );
      rowSample.tamizDiameter = Number(NumberUtils.cleanNumberString(rowSample.tamizDiameter))

      if(rowSample.soilWeight == 0 && rowSample.tamizDiameter == 0) {
        this.removeLastRow();
        continue;
      }

      if(typeof rowSample.soilWeight !== 'number' || isNaN(rowSample.soilWeight)) {
        throw new Error("The soilWeight sample '" + rowSample.soilWeight + "' is not a number");
      }

      if(typeof rowSample.tamizDiameter !== 'number' || isNaN(rowSample.tamizDiameter)) {
        throw new Error("The tamizDiameter sample '" + rowSample.tamizDiameter + "' is not a number");
      }

      introducedSamples.set(i, rowSample);
    }

    console.log("introducedSamples", introducedSamples);

    return introducedSamples;
  }

  private static readonly numberValidators = [
    Validators.required,
    Validators.min(0),
    Validators.max(100),
  ];

  private _createRowFormGroup(): FormGroup {
    return this.formBuilder.group({
      tamizDiameter: new FormControl<number | null>(null, [ ...MwdSamplesComponent.numberValidators ] ),
      soilWeight:    new FormControl<number | null>(null, [ ...MwdSamplesComponent.numberValidators ] ),
    });
  }

  public insertSample(sample: MapSamples): void {
    this.onClickReset(false);
    sample.forEach(rd => {
      const newRow = this.formBuilder.group({
        tamizDiameter: [rd.tamizDiameter, [...MwdSamplesComponent.numberValidators]],
        soilWeight: [rd.soilWeight, MwdSamplesComponent.numberValidators],
      });
      this.rows().push(newRow);
    })
    this.onClickSubmit();
  }

  onClickReset(addRows = true): void {
    this._removeRows();
    if(addRows) {
      this.addRow();
      this.addRow();

      // the timer because is too fast
      let timer = setTimeout(() => {
        this._setFocusOnFirstInput();
        clearTimeout(timer);
      }, 100);

    }
    this.resetClick.emit();
  }

  async onSelectFile(ev: any) {
    const csvFile = ev.target.files[0];
    const sampleInCsv = await this._inDrv.parseFileToSamples(csvFile);
    this.insertSample(sampleInCsv);
  }

  private _setFocusOnFirstInput(): void {
    of(null)
      .pipe(
        repeat({delay: 500}),
        filter(() => document.querySelector('#first-input') != undefined ),
        take(1),
      )
      .subscribe({
        complete: () => {
          const input = <HTMLInputElement>document.querySelector('#first-input');
          input.focus();
          console.debug("set focus on first input");
        }
      });
  }

}
