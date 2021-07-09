import { Component } from '@angular/core';
import { Training } from './trainings/training.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'training-manager-app';
  trainings : Training[]= [new Training("Angular Grundkurs")];;
  constructor(){
    
  }
}
