import { Routes } from '@angular/router';
import { MatchesComponent } from './features/matches/matches.component';
import { MemberDetailComponent } from './features/members/member-detail/member-detail.component';
import { MemberEditComponent } from './features/members/member-edit/member-edit.component';
import { MemberListComponent } from './features/members/member-list/member-list.component';
import { MessagesComponent } from './features/messages/messages.component';
import { PrivacyPolicyComponent } from './features/privacy-policy/privacy-policy.component';
import { authGuard } from './shared/_guards/auth.guard';
import { redirectIfAuthenticatedGuard } from './shared/_guards/redirect-if-authenticated.guard';
import { UnsavedChangesGuard } from './shared/_guards/unsaved-changes.guard';
import { NotFoundComponent } from './shared/components/errors/not-found/not-found.component';
import { ServerErrorComponent } from './shared/components/errors/server-error/server-error.component';
import { TestErrorsComponent } from './shared/components/errors/test-errors/test-errors.component';
import { HomeComponent } from './shared/components/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [redirectIfAuthenticatedGuard],
  },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: [
      { path: 'members', component: MemberListComponent },
      { path: 'members/:username', component: MemberDetailComponent },
      {
        path: 'edit-profile',
        component: MemberEditComponent,
        canDeactivate: [UnsavedChangesGuard],
      },
      { path: 'messages', component: MessagesComponent },
      { path: 'matches', component: MatchesComponent },
      { path: 'errors', component: TestErrorsComponent },
      { path: 'not-found', component: NotFoundComponent },
      { path: 'server-error', component: ServerErrorComponent },
    ],
  },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  {
    path: '**',
    component: HomeComponent,
    pathMatch: 'full',
    canActivate: [redirectIfAuthenticatedGuard],
  },
];
