import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { NavComponent } from './components/nav/nav.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, NavComponent, HomeComponent],
  exports: [NavComponent, HomeComponent],
})
export class SharedModule {}
