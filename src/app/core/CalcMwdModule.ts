import { NgModule } from '@angular/core';
import { OutputDriverImpl } from './internals/outputDriver/impl/OutputDriverImpl';
import { InputDriverImpl } from './internals/inputDriver/impl/InputDriverImpl';
import { IOutputDriver } from '../0shared/internals/drivers/IOutputDriver';
import { IInputDriver } from '../0shared/internals/drivers/IInputDriver';

@NgModule({
  imports: [

  ],
  exports: [],
  providers: [
    OutputDriverImpl,
    InputDriverImpl,
  ],
})
export class CalcMwdModule {

  getOutputDriver(): IOutputDriver {
    return new OutputDriverImpl();
  }

  getInputDriver(): IInputDriver {
    return new InputDriverImpl();
  }


}
