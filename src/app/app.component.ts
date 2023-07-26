import { Component } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'real-time-emp';
  inputValue!: string;

  constructor(private apiService: ApiService) {}

  add() {
    this.apiService.add({name: this.inputValue}).subscribe(res => {
      if(res) {
        console.log("inserted!!", res)
      }
    })
  }
  get() {
    this.apiService.getAll().subscribe(res => {
      if(res) {
        console.log("get!!", res)
      }
    })
  }
  del() {}
}
