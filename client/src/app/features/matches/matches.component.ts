import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { LikedByListComponent } from './liked-by-list/liked-by-list.component';
import { LikedByMeListComponent } from './liked-by-me-list/liked-by-me-list.component';
import { MatchListComponent } from './match-list/match-list.component';

@Component({
  selector: 'app-matches',
  standalone: true,
  imports: [
    MatTabsModule,
    MatchListComponent,
    LikedByListComponent,
    LikedByMeListComponent,
  ],
  templateUrl: './matches.component.html',
  styleUrl: './matches.component.scss',
})
export class MatchesComponent {
  constructor() {}
}
