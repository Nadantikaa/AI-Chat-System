import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MistralService {
  private apiKey = ''; // TODO: Load from environment or config
  private apiUrl = 'https://api.mistral.ai/v1/chat/completions';//endpoint URL for the Mistral AI chat

  constructor(private http: HttpClient) {}

  getChatCompletion(message: string, history: any[]): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`//sends the apiKey as a Bearer token
    });

    const body = {
      model: 'mistral-tiny',
      messages: [
        ...history.map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.content
        })),
        { role: 'user', content: message }
      ]
    };

    return this.http.post(this.apiUrl, body, { headers });
  }
}
