import { Component } from '@angular/core';
import { MaterialModule } from '../material.module';

@Component({
  selector: 'csv-example-dialog',
  imports: [ MaterialModule ],
  standalone: true,
  templateUrl: './csv-example-dialog.component.html',
  styleUrl: './csv-example-dialog.component.scss'
})
export class CsvExampleDialogComponent {

}
