import { Component } from '@angular/core';
//import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})


export class AppComponent {

  sendMessage() {
    window.electronAPI.sendMessage("Hello from Angular!");
    console.log("Hello node: " + window.electronAPI.versions());
  }

}
