import { IResultsDto, MapSamples } from "../..";

export interface IOutputDriver {

  resultsToCsv(r: IResultsDto, s: MapSamples): Promise<void>;

}
