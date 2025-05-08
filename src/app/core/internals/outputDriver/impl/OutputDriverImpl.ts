import { Injectable } from "@angular/core";
import { IOutputDriver } from "../../../../0shared/internals/drivers/IOutputDriver";
import { IResultsDto, MapSamples } from "../../../../0shared";


/**
 * Note: To process the csv you can use:
 *
 * awk -F "\"*,\"*" '{print $2}' generated.csv | xargs | sed -r 's/[ ]+/\n/g'
 *
 * -- Where $2 is the number of the column we want to select.
 *
*/

@Injectable({ providedIn: 'root' })
export class OutputDriverImpl implements IOutputDriver {

  private static readonly csvConf = {
    useKeysAsHeaders: true,
    quoteCharacter: "",
    fieldSeparator: ","
  }

  async resultsToCsv(r: IResultsDto, s: MapSamples): Promise<void> {
    const resultParsed: ResultItem = this._parceResults(r, s);

    import("export-to-csv").then(eCsv => {
      const csvConfig = eCsv.mkConfig(OutputDriverImpl.csvConf);
      const csv = eCsv.generateCsv(csvConfig)(resultParsed);
      eCsv.download(csvConfig)(csv);
    });
  }




  private _parceResults(r: IResultsDto, s: MapSamples): ResultItem {
    if(r.MWDs.length !== r.soilPortions.length || r.soilPortions.length !== r.tamizDiameterProm.length) {
      throw new Error("Resultados con mal formato: intente mas tarde");
    }
    const parsed: ResultItem = [];

    for (let i = 0; i < Array.from(s.keys()).length; i++) {
      const newItem = {
        soilWeight: s.get(i)!.soilWeight.toFixed(6),
        tamizDiameter: s.get(i)!.tamizDiameter.toFixed(6),
        tamizDiam: r.tamizDiameterProm[i]?.toFixed(6) ?? undefined,
        soilPortions: r.soilPortions[i]?.toFixed(6) ?? undefined,
        MWDs: r.MWDs[i]?.toFixed(6) ?? undefined,
      };
      parsed.push(newItem);
    }

    parsed[0].totalSoil = r.totalSoilWeight.toFixed(6);
    parsed[0].MWDTotal = r.MWDTotal;

    return parsed;
  }

}



type ResultItem = {
  soilWeight: string,
  tamizDiameter: string,
  tamizDiam?: string;
  soilPortions?: string;
  MWDs?: string;
  totalSoil?: string
  MWDTotal?: number
}[]
