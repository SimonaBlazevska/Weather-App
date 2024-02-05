import {Component, OnInit} from '@angular/core';
import {DataService} from "../../services/data.service";
import {ActivatedRoute, Router} from "@angular/router";
import {City} from "../../interfaces/City";
import {Country} from "../../interfaces/Country";
import {switchMap} from "rxjs";

@Component({
  selector: 'app-city-details',
  templateUrl: './city-details.component.html',
  styleUrls: ['./city-details.component.css']
})
export class CityDetailsComponent implements OnInit {
  city!: City;
  country!: Country;
  temperature = 0;
  measurement = 'C';
  lat = 0;
  lng = 0;

  constructor(private dataService: DataService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['cityId']) {
        const id = JSON.parse(params['cityId']);
        this.getCityAndCountry(id);
      }
    })
  }

  getCityAndCountry(id: number) {
    this.dataService.getCityById(id).pipe(
      switchMap((city) => {
        // @ts-ignore
        this.city = city[0];
        this.getTemperature(this.city.name);
        return this.dataService.getCountryById(this.city.country);
      })
    ).subscribe({
      // @ts-ignore
      next: (country) => this.country = country[0],
      error: (error) => console.log(error)
    });
  }

  getTemperature(city: string) {
    if (localStorage.getItem(city) != null) {
      const storedGeometry = JSON.parse(localStorage.getItem(city)!!);
      this.lat = storedGeometry.lat;
      this.lng = storedGeometry.lng;

      this.dataService.getCurrentTemperature(this.lat, this.lng).subscribe((temp) => {
        //@ts-ignore
        this.temperature = temp.current.temperature_2m;
      });
    }
  }

  backToHome() {
    this.router.navigate(['/']);
  }

  changeMeasurement() {
    if (this.measurement == 'C') {
      this.measurement = 'F';
      this.temperature = this.celsiusToFahrenheit(this.temperature);
      return;
    }
    this.measurement = 'C';
    this.temperature = this.fahrenheitToCelsius(this.temperature);
  }

  celsiusToFahrenheit(celsius: number): number {
    const fahrenheit = (celsius * 9 / 5) + 32;
    return parseFloat(fahrenheit.toFixed(2));
  }

  fahrenheitToCelsius(fahrenheit: number): number {
    const celsius = (fahrenheit - 32) * 5 / 9;
    return parseFloat(celsius.toFixed(2));
  }
}
