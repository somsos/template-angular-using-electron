import { Injectable } from "@angular/core";
import { MapSamples, IResultsDto, IRowSample } from "../../../../0shared";
import { CalculatorImpl } from "../../logic/CalculatorImpl";
import { IInputDriver } from "../../../../0shared/internals/drivers/IInputDriver";

@Injectable()
export class InputDriverImpl implements IInputDriver {

  resolveSamples(samplesRows1: MapSamples): IResultsDto {
    const calc = new CalculatorImpl();

    // it must be added or will throw error
    calc.setData(samplesRows1);

    // this is the order of calc
    // Note: With just call make the other calculations, but just to represent the process is called like this.
    calc.calcTotalSoilWeight();
    calc.calcTamizDiameterProm();
    calc.calcSoilPortions();
    calc.calcMWDs();
    calc.calcMWDTotal();

    return calc.getResults();

  }


  async parseFileToSamples(file: File): Promise<MapSamples> {
    const prop = new Promise<MapSamples>(( async (res, rej) => {
      const PapaLib = await import("ngx-papaparse")
      const Papa  = new PapaLib.Papa();
      Papa.parse(file, {
        complete: (results, file) => {
          const resp: MapSamples = this._parseDataFileToSample(results.data);
          res(resp);
        },
        error: (err: any) => {
          rej(err)
        }
        ,
      });
    }));

    return prop;
  }

  private _parseDataFileToSample(data: unknown[]): MapSamples {
    const wholeMatriz = data as string[][];
    const matriz = wholeMatriz.map(row => row.slice(0, 2));

    // it has header
    if(isNaN(Number(matriz[0][0]))) {
      console.log("has header");
      matriz.shift();
    }

    const resp = new  Map<number,  IRowSample>();
    for (let rowI = 0; rowI < matriz.length-1; rowI++) {
      const row = matriz[rowI];

      const soilWeight = Number(row[0]);
      if (isNaN(soilWeight)) {
        throw new Error("bad format in: '" + row[0] + "'");
      }

      const tamizDiameter = Number(row[1]);
      if (isNaN(tamizDiameter)) {
        throw new Error("bad format in: '" + row[1] + "'");
      }
      resp.set(rowI, {soilWeight, tamizDiameter})
    }

    return resp;
  }

}
