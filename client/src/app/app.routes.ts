import { Routes } from '@angular/router';
import { HomeComponent } from './shared/components/home/home.component';
import { MemberListComponent } from './features/members/member-list/member-list.component';
import { MemberDetailComponent } from './features/members/member-detail/member-detail.component';
import { ListsComponent } from './shared/components/lists/lists.component';
import { MessagesComponent } from './shared/components/messages/messages.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'members', component: MemberListComponent},
    {path: 'members/:id', component: MemberDetailComponent},
    {path: 'lists', component: ListsComponent},
    {path: 'messages', component: MessagesComponent},
    {path: '**', component: HomeComponent, pathMatch: 'full'},
];
