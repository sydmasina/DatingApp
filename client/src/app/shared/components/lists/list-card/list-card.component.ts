import { Component, input } from '@angular/core';
import { User } from '../../../models/user';

@Component({
  selector: 'app-list-card',
  standalone: true,
  imports: [],
  templateUrl: './list-card.component.html',
  styleUrl: './list-card.component.css',
})
export class ListCardComponent {
  user = input.required<User>();
}
