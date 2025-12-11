import { Component, computed, inject, input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { User } from '../../../../shared/models/user';
import { LikesService } from '../../../../shared/services/likes.service';
import { PresenceService } from '../../../../shared/services/presence.service';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [RouterLink, MatTooltipModule],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.css',
})
export class MemberCardComponent {
  private _presenceService = inject(PresenceService);
  private _likeService = inject(LikesService);
  user = input.required<User>();
  hasLiked = computed(() =>
    this._likeService.likeIds().includes(this.user().id)
  );
  isOnline = computed(() =>
    this._presenceService.onlineUsers().includes(this.user().userName)
  );

  handleLikeToggle() {
    this._likeService.toggleLike(this.user().id).subscribe({
      next: () => {
        if (this.hasLiked()) {
          this._likeService.likeIds.update((ids) =>
            ids.filter((x) => x !== this.user().id)
          );
        } else {
          this._likeService.likeIds.update((ids) => [...ids, this.user().id]);
        }
      },
    });
  }
}
