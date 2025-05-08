import { Routes } from '@angular/router';
import { MemberDetailComponent } from './features/members/member-detail/member-detail.component';
import { MemberListComponent } from './features/members/member-list/member-list.component';
import { authGuard } from './shared/_guards/auth.guard';
import { NotFoundComponent } from './shared/components/errors/not-found/not-found.component';
import { ServerErrorComponent } from './shared/components/errors/server-error/server-error.component';
import { TestErrorsComponent } from './shared/components/errors/test-errors/test-errors.component';
import { HomeComponent } from './shared/components/home/home.component';
import { ListsComponent } from './shared/components/lists/lists.component';
import { MessagesComponent } from './shared/components/messages/messages.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: [
      { path: 'members', component: MemberListComponent },
      { path: 'members/:username', component: MemberDetailComponent },
      { path: 'lists', component: ListsComponent },
      { path: 'messages', component: MessagesComponent },
      { path: 'errors', component: TestErrorsComponent },
      { path: 'not-found', component: NotFoundComponent },
      { path: 'server-error', component: ServerErrorComponent },
    ],
  },
  { path: '**', component: HomeComponent, pathMatch: 'full' },
];
