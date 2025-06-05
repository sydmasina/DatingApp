import { Component, computed, input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { User } from '../../../../shared/models/user';
import { LikesService } from '../../../../shared/services/likes.service';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [RouterLink, MatTooltipModule],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.css',
})
export class MemberCardComponent {
  user = input.required<User>();
  hasLiked = computed(() =>
    this._likeService.likeIds().includes(this.user().id)
  );
  constructor(private _likeService: LikesService) {}

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
