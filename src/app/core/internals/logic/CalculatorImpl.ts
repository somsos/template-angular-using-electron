import { IResultsDto, MapSamples, ResultsDtoUtils } from "../../../0shared";
import { ICalculator } from "./ICalculator";

export class CalculatorImpl implements ICalculator {

  private _samplesRows!: MapSamples;

  private readonly _results: IResultsDto = ResultsDtoUtils.getEmptyResults();

  private static readonly precision = 9;

  setData(samplesRows: MapSamples): void {
    this._samplesRows = samplesRows;
    this._adustPrecisionSample();
    if(ResultsDtoUtils.itHasProcessedData(this._results)) {
      ResultsDtoUtils.cleanResults(this._results);
    }
  }

  // first calc
  calcTotalSoilWeight(): number {
    // check it was already calculated, and if so, return it
    if(this._results.totalSoilWeight != -1) {
      return this._results.totalSoilWeight;
    }

    let resp = 0;
    const soilWeights = this._getSoilWeights();
    soilWeights.forEach((weight) => {
      resp = resp + weight;
    });
    this._results.totalSoilWeight = resp;
    return this._results.totalSoilWeight;
  }

  calcTamizDiameterProm(): Array<number> {
    // check it was already calculated, and if so, return it
    if(this._results.tamizDiameterProm.length !== 0) {
      return this._results.tamizDiameterProm;
    }

    const resp: Array<number> = [];
    const tDiameters = this._getTamizDiameters();
    for (let i = 0; i < tDiameters.length-1; i++) {
      const currentDiam= tDiameters[i];
      const nextDiameter = tDiameters[i+1];
      const sum = currentDiam + nextDiameter;
      const prom = sum / 2;
      resp.push(prom);
    }
    this._results.tamizDiameterProm = resp;
    return this._results.tamizDiameterProm;
  }

  calcSoilPortions(): Array<number> {
    // check it was already calculated, and if so, return it
    if(this._results.soilPortions.length !== 0) {
      return this._results.soilPortions;
    }

    const soilWeights = this._getSoilWeights();
    soilWeights.shift();
    const totalSoilWeight: number = this.calcTotalSoilWeight();
    const soilPortions = soilWeights.map(sp => {
      const divRaw = sp / totalSoilWeight;
      const divFixed =  this._adustPrecision(Number(divRaw.toFixed(9)));
      return divFixed;
    });

    this._results.soilPortions = soilPortions;
    return this._results.soilPortions;
  }

  calcMWDs(): Array<number> {
    // check it was already calculated, and if so, return it
    if(this._results.MWDs.length !== 0) {
      return this._results.MWDs;
    }

    const soilWeights: Array<number> = this.calcTamizDiameterProm();
    const soilPortions: Array<number> = this.calcSoilPortions();

    if(soilWeights.length != soilPortions.length) {
      throw new Error("unexpected: soilWeights.length != soilPortions.length");
    }

    const resp: number[] = [];
    for (let i = 0; i < soilWeights.length; i++) {
      const soilWeight = soilWeights[i];
      const soilPortion = soilPortions[i];
      const multiRaw = soilWeight * soilPortion;
      const multiFixed = this._adustPrecision(multiRaw);
      resp.push(multiFixed);
    }

    this._results.MWDs = resp;
    return this._results.MWDs;
  }

  calcMWDTotal(): number {
    if(this._results.MWDTotal != -1) {
      return this._results.MWDTotal;
    }

    const MWDs = this.calcMWDs();
    let resp = 0;
    for (let i = 0; i < MWDs.length; i++) {
      resp = resp + MWDs[i];
    }

    this._results.MWDTotal = resp;
    return this._results.MWDTotal;
  }

  private _getTamizDiameters(): number[] {
    const all = Array.from(this._samplesRows.values()).map(v => v.tamizDiameter);
    return all;
  }

  private _getSoilWeights(): Array<number> {
    const all = Array.from(this._samplesRows.values()).map(v => v.soilWeight);
    return  all;
  }

  private _adustPrecision(original: number): number {
    const fixed = Number(original.toFixed(CalculatorImpl.precision));
    return fixed;
  }

  private _adustPrecisionSample(): void {
    this._samplesRows.values()
  }

  public getResults(): IResultsDto {
    let clone = ResultsDtoUtils.getEmptyResults();
    Object.assign(clone, this._results);
    return clone;
  }

}


