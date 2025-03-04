import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './components/nav/nav.component';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, NavComponent, HomeComponent],
  exports: [NavComponent, HomeComponent],
})
export class SharedModule {}
