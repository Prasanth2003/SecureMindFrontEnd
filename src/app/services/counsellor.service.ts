import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CounsellorService {
  private apiUrl = ' http://localhost:5240/api/Counsellors/Specialization';
  constructor(private http: HttpClient) { }
 
  getCounselorsBySpecialization(specialization: string): Observable<any[]> {
    const headers = new HttpHeaders().set('Accept', 'application/json');
    return this.http.get<{ $values: any[] }>(`${this.apiUrl}?specialization=${encodeURIComponent(specialization)}`, { headers })
      .pipe(
        map(response => response.$values.map(counselor => ({
          name: counselor.name,
          specialization: counselor.specialization,
          contactInfo: counselor.contactInfo,
          latitude: counselor.location?.latitude,  // Ensure this matches the API response structure
          longitude: counselor.location?.longitude,
          location:counselor.location?.locationName
        })))
      );
  }
  
}
