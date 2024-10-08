import { Component } from '@angular/core';
import { catchError, of, switchMap } from 'rxjs';
import { PolicestationService } from '../../services/policestation.service';

@Component({
  selector: 'app-policestations-near-me',
  templateUrl: './policestations-near-me.component.html',
  styleUrl: './policestations-near-me.component.css'
})
export class PolicestationsNearMeComponent {
  address: string = '';
  policeStations: any[] = [];
  errorMessage: string = '';
  isLoading: boolean = false; 

  constructor(private policeService: PolicestationService) {}

  searchLocation() {
    this.errorMessage = '';
    this.policeStations = [];
    if (!this.address.trim()) return;
    this.isLoading = true; 

    this.policeService.getCoordinates(this.address).pipe(
      switchMap(response => {
        if (response.length > 0) {
          const { lat, lon } = response[0];
          return this.policeService.getPoliceStations(lat, lon);
        } else {
          throw new Error('No coordinates found.');
        }
      }),
      catchError(error => {
        this.errorMessage = 'Error fetching police stations.';
        this.isLoading = false; // Stop loading on error
        return of([]);
      })
    ).subscribe(
      (stations: any[]) => {
        this.policeStations = stations;
        this.isLoading = false; // Stop loading after receiving data
        if (this.policeStations.length === 0) {
          this.errorMessage = 'No police stations found.';
        }
      },
      error => {
        this.errorMessage = 'Error occurred.';
        this.isLoading = false; // Stop loading on error
      }
    );
  }
}
