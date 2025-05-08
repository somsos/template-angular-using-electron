import { Injectable } from "@angular/core";
import { MapSamples } from "../../0shared";
import { BehaviorSubject, Observable } from "rxjs";

export interface IMapSamplesHistoryService {

  addSamplesRecord(newRecord: ISampleRecord): void

  getSamplesByItem(index: number): MapSamples;

}

export interface ISampleRecord {
  sample: MapSamples;
  result: number;
  createdAt?: Date;
}

@Injectable({ providedIn: "root" })
export class MapSamplesHistoryServiceImpl implements IMapSamplesHistoryService {

  private readonly _allSamples$ = new BehaviorSubject<ISampleRecord[]>([this.getExample()]);


  addSamplesRecord(newRecord: ISampleRecord): void {
    if(newRecord.createdAt === undefined) {
      newRecord.createdAt = new Date();
    }

    if(this._doesSampleExist(newRecord)) {
      return ;
    }

    this._allSamples$.next([...this._allSamples$.value, newRecord]);
  }

  _doesSampleExist(newRecord: ISampleRecord): boolean {
    const newResult = newRecord.result;
    if(newResult === 0 || newResult === undefined) {
      return true;
    }

    const existRepeated = this._allSamples$.value.some((record) => {
      const resultInHistory = record.result;

      return resultInHistory === newResult;
    });
    return existRepeated;
  }


  getSamplesByItem(index: number): MapSamples {
    return this._allSamples$.value[index].sample;
  }

  observeAllSamplesRecords():  Observable<ISampleRecord[]> {
    return this._allSamples$.asObservable();
  }


  cleanAll(): void {
    this._allSamples$.next([this.getExample()]);
  }

  cleanOne(index: number): void {
    const currentSamples = this._allSamples$.value;
    if(index < 0 || index >= currentSamples.length) {
      throw new Error("Index out of bounds");
    }
    currentSamples.splice(index, 1);
    this._allSamples$.next(currentSamples);
  }

  getExample(): ISampleRecord {
    return {
      sample: new Map([
        [ 0, { tamizDiameter: 8.0,   soilWeight:   0.0    }  ],
        [ 1, { tamizDiameter: 4.0,   soilWeight:   3.4    }  ],
        [ 2, { tamizDiameter: 2.0, soilWeight:   21.26  }  ],
        [ 3, { tamizDiameter: 1.0, soilWeight:   34.73  }  ],
        [ 4, { tamizDiameter: 0.5, soilWeight:   35.69  }  ],
        [ 5, { tamizDiameter: 0.25, soilWeight:  31.31  }  ],
        [ 6, { tamizDiameter: 0.053, soilWeight: 38.26  }  ],
        [ 7, { tamizDiameter: 0.0, soilWeight:   25.37  }  ],
      ]),
      result: 0.953859829,
      createdAt: new Date("2025-04-07T18:50:00-06:00"),
    }
  }

}
