import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/main/app.config';
import { MainLayoutComponent } from './app/ui/main-layout/main-layout.component';

bootstrapApplication(MainLayoutComponent, appConfig)
  .catch((err) => console.error(err));
