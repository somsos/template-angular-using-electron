import { IResultsDto, MapSamples } from "../../../0shared";

export interface ICalculator {

  setData(samplesRows: MapSamples): void;

  calcTotalSoilWeight(): number;

  calcTamizDiameterProm(): Array<number>;

  calcSoilPortions(): Array<number>;

  calcMWDs(): Array<number>;

  calcMWDTotal(): number;

  getResults(): IResultsDto;

}
