import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User } from '../../../../shared/models/user';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.css',
})
export class MemberCardComponent {
  user = input.required<User>();
}
