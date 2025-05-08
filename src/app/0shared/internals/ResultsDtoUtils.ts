import { IResultsDto } from "..";

export abstract class ResultsDtoUtils {

  public static getEmptyResults(): IResultsDto {
    return {
      MWDTotal: -1,
      totalSoilWeight: -1,
      MWDs: [],
      soilPortions: [],
      tamizDiameterProm: [],
    };
  }

  public static cleanResults(r: IResultsDto) {
    r = ResultsDtoUtils.getEmptyResults();
  }


  public static itHasProcessedData(r: IResultsDto): boolean {

    if(r.MWDTotal !== -1 || r.totalSoilWeight !== -1) {
      return true;
    }

    if(r.MWDs.length <= 0 || r.soilPortions.length <= 0 || r.tamizDiameterProm.length <= 0) {
      return true;
    }

    return false;
  }


  public static areEquals(r1:IResultsDto, r2:IResultsDto): boolean {
    if(r1.totalSoilWeight !== r2.totalSoilWeight) {
      return false;
    }


    //
    for (let i = 0; i < r1.tamizDiameterProm.length; i++) {
      const got = Number(r1.tamizDiameterProm[i].toFixed(3));
      const expected = r2.tamizDiameterProm[i];
      if(got !== expected) {
        return false;
      }
    }

    //
    for (let i = 0; i < r1.soilPortions.length; i++) {
      const got = r1.soilPortions[i];
      const expected = r2.soilPortions[i];
      if(got !== expected) {
        return false;
      }
    }

    //
    for (let i = 0; i < r1.MWDs.length; i++) {
      const got = r1.MWDs[i].toFixed(7);
      const expected = r2.MWDs[i].toFixed(7); //OBSERVE: that we reduce the precision to avoid exaggerated comparison

      if(got !== expected) {
        throw new Error("Value expected and got different");
      }

    }

    //
    const FixedMWDTotal = Number(r1.MWDTotal.toFixed(2));
    if(FixedMWDTotal !== r2.MWDTotal) {
      throw new Error("Value expected and got different");
    }

    return false;
  }

}
