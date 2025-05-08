import { ApplicationConfig, provideExperimentalZonelessChangeDetection, importProvidersFrom } from '@angular/core';
import { CalcMwdModule } from '../core/CalcMwdModule';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    importProvidersFrom(CalcMwdModule),
  ]
};
