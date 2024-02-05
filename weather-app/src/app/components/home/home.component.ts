import {Component, OnInit} from '@angular/core';
import {DataService} from "../../services/data.service";
import {City} from "../../interfaces/City";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  cities: City[] = [];
  temperatures: number[] = [];
  measurement = 'C';

  constructor(private dataService: DataService, private router: Router) {
  }

  ngOnInit(): void {
    this.temperatures = new Array(this.cities.length).fill(0);
    this.getCitiesAndCountries();
  }

  getCitiesAndCountries() {
    return this.dataService.getCitiesAndCountries().subscribe((cities) => {
      this.cities = cities;
      this.temperatures = new Array(cities.length).fill(0); // Initialize with default values

      cities.forEach((city, i) => {
        if (localStorage.getItem(city.name) === null) {
          this.dataService.getLatAndLng(city.name).subscribe((response) => {
            //@ts-ignore
            localStorage.setItem(city.name, JSON.stringify(response.results[0].geometry));
            //@ts-ignore
            const lat = response.results[0].geometry.lat;
            //@ts-ignore
            const lng = response.results[0].geometry.lng;

            this.dataService.getCurrentTemperature(lat, lng).subscribe((temp) => {
              //@ts-ignore
              this.temperatures[i] = temp.current.temperature_2m;
            });
          });
        } else {
          const storedGeometry = JSON.parse(localStorage.getItem(city.name)!!);
          const lat = storedGeometry.lat;
          const lng = storedGeometry.lng;

          this.dataService.getCurrentTemperature(lat, lng).subscribe((temp) => {
            //@ts-ignore
            this.temperatures[i] = temp.current.temperature_2m;
          });
        }
      });
    });
  }

  cityDetails(cityId: number) {
    const navigationExtras = {
      queryParams: {
        cityId: JSON.stringify(cityId),
      },
    };

    this.router.navigate(['/details'], navigationExtras);
  }

  changeMeasurement() {
    if (this.measurement == 'C') {
      this.measurement = 'F';
      this.temperatures = this.temperatures.map(t => this.celsiusToFahrenheit(t));
      return;
    }
    this.measurement = 'C';
    this.temperatures = this.temperatures.map(t => this.fahrenheitToCelsius(t));
    return;
  }

  celsiusToFahrenheit(celsius: number): number {
    const fahrenheit = (celsius * 9 / 5) + 32;
    return parseFloat(fahrenheit.toFixed(2));
  }

  fahrenheitToCelsius(fahrenheit: number): number {
    const celsius = (fahrenheit - 32) * 5 / 9;
    return parseFloat(celsius.toFixed(2));
  }

  addCity() {
    this.router.navigate(['/add-city']);
  }

  deleteCity(id: number) {
    const confirmation = confirm("Are you sure you want to delete this city?");

    if (confirmation) {
      this.dataService.deleteCity(id).subscribe({
        next: response => {
          alert("Deleted city successfully!");
          this.ngOnInit();
        },
        error: err => console.log(err)
      })
    }
  }
}
