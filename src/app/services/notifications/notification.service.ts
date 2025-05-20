import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private baseUrl = 'http://localhost:35393/notifications';

    constructor(private http: HttpClient) {}

    // Method to send a GET request
    getNotifications(token: string): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });
        return this.http.get(this.baseUrl, { headers });
    }

    // Method to send a POST request
    sendNotification(token: string, payload: any): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        });
        return this.http.post(this.baseUrl, payload, { headers });
    }
}