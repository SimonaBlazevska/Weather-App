import {Component, OnInit} from '@angular/core';
import {DataService} from "../../services/data.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Country} from "../../interfaces/Country";
import {City} from "../../interfaces/City";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-city',
  templateUrl: './add-city.component.html',
  styleUrls: ['./add-city.component.css']
})
export class AddCityComponent implements OnInit {
  form: FormGroup;
  countries: Country[] = [];

  constructor(private dataService: DataService, private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      country: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.dataService.getAllCountries().subscribe({
      next: response => this.countries = response,
      error: err => console.log(err)
    })
  }

  capitalizeFirstLetter(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  onSubmit() {
    const newCity: City = {
      id: this.form.get("id")?.value,
      name: this.capitalizeFirstLetter(this.form.get("name")?.value),
      country: this.form.get("country")?.value,
    };

    this.dataService.addCity(newCity).subscribe({
      next: res => {
        alert("City added successfully");
        this.router.navigate(['/']);
      },
      error: err => console.log(err)
    })
  }
}
