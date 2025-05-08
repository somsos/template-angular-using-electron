import { IResultsDto, MapSamples } from "../..";

export interface IInputDriver {

  resolveSamples(samplesRows1: MapSamples): IResultsDto;

  parseFileToSamples(file: File): Promise<MapSamples>;

}
