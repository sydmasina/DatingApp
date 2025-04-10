import { Routes } from '@angular/router';
import { HomeComponent } from './shared/components/home/home.component';
import { MemberListComponent } from './features/members/member-list/member-list.component';
import { MemberDetailComponent } from './features/members/member-detail/member-detail.component';
import { ListsComponent } from './shared/components/lists/lists.component';
import { MessagesComponent } from './shared/components/messages/messages.component';
import { authGuard } from './shared/_guards/auth.guard';
import { TestErrorsComponent } from './shared/components/errors/test-errors/test-errors.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: [
      { path: 'members', component: MemberListComponent },
      { path: 'members/:id', component: MemberDetailComponent },
      { path: 'lists', component: ListsComponent },
      { path: 'messages', component: MessagesComponent },
      { path: 'errors', component: TestErrorsComponent },
    ],
  },
  { path: '**', component: HomeComponent, pathMatch: 'full' },
];
