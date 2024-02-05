import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {City} from "../interfaces/City";
import {Country} from "../interfaces/Country";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  readonly BASE_URL = 'http://localhost:3000';
  readonly LAT_LNG_URL = 'https://api.opencagedata.com/geocode/v1/json?q=';
  readonly WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';
  readonly API_KEY = '91a634b5d3c64451a9796ea79b9d2413';

  constructor(private http: HttpClient) {
  }

  getCitiesAndCountries() {
    return this.http.get<City[]>(`${this.BASE_URL}/cities`);
  }

  getAllCountries() {
    return this.http.get<Country[]>(`${this.BASE_URL}/countries`);
  }

  getCityById(cityId: number) {
    return this.http.get<City>(`${this.BASE_URL}/cities?id=${cityId}`);
  }

  addCity(city: City) {
    return this.http.post(`${this.BASE_URL}/cities`, city);
  }

  deleteCity(cityId: number) {
    return this.http.delete(`${this.BASE_URL}/cities/${cityId}`);
  }

  getCountryById(countryId: number) {
    return this.http.get<Country>(`${this.BASE_URL}/countries?id=${countryId}`);
  }

  getLatAndLng(city: string) {
    return this.http.get(`${this.LAT_LNG_URL}${city}&key=${this.API_KEY}`);
  }

  getCurrentTemperature(lat: number, lng: number) {
    return this.http.get(`${this.WEATHER_API_URL}?latitude=${lat}&longitude=${lng}&current=temperature_2m`);
  }
}
