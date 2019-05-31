import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EntryFeed } from '@app/interfaces/entry-feed';
import { ApiService } from '@app/services/api/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EntryService {

  constructor(private http: HttpClient, private apiService: ApiService) {
  }

  /**
   * Get entry
   *
   * @param id Entry ID
   */
  getEntry(id: string): Observable<EntryFeed> {
    return this.http.get<EntryFeed>(`${this.apiService.base.zero}website/entry/${id}/`);
  }
}
