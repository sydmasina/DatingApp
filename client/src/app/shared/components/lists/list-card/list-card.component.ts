import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User } from '../../../models/user';

@Component({
  selector: 'app-list-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './list-card.component.html',
  styleUrl: './list-card.component.css',
})
export class ListCardComponent {
  user = input.required<User>();
}
