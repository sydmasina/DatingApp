import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, signal } from '@angular/core';
import {
  GetCitiesEndpoint,
  GetCountriesEndpoint,
} from '../constants/api-enpoints/static-data';
import { City, Country } from '../models/static-data';

@Injectable({
  providedIn: 'root',
})
export class StaticDataService {
  private readonly _countries = signal<Country[]>([]);
  public readonly countries: Signal<Country[]> = this._countries.asReadonly();
  private readonly _isFetchingCountryData = signal<boolean>(false);
  public readonly isFetchingCountryData: Signal<boolean> =
    this._isFetchingCountryData.asReadonly();

  private readonly _cities = signal<City[]>([]);
  public readonly cities: Signal<City[]> = this._cities.asReadonly();
  private readonly _isFetchingCityData = signal<boolean>(false);
  public readonly isFetchingCityData: Signal<boolean> =
    this._isFetchingCityData.asReadonly();

  constructor(private _httpClient: HttpClient) {}

  async GetCountries() {
    if (this.isFetchingCountryData()) {
      return;
    }

    this._isFetchingCountryData.set(true);

    return this._httpClient.get<Country[]>(GetCountriesEndpoint).subscribe({
      next: (response) => {
        this._countries.set(response);
      },
      error: () => {},
      complete: () => {
        this._isFetchingCountryData.set(false);
      },
    });
  }

  async GetCitiesByCountyId(countryId: number) {
    this._isFetchingCityData.set(true);

    return this._httpClient
      .get<City[]>(GetCitiesEndpoint + '/' + countryId)
      .subscribe({
        next: (response) => {
          this._cities.set(response);
        },
        error: () => {},
        complete: () => {
          this._isFetchingCityData.set(false);
        },
      });
  }
}
