import { Component } from '@angular/core';
import { ChatbotComponent } from './chatbot/chatbot.component'; // ✅ Import standalone component

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ChatbotComponent],   // ✅ Add here
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ai-chatbot-app';
}
