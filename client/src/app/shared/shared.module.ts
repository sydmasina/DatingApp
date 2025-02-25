import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './components/nav/nav.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, NavComponent],
  exports: [NavComponent],
})
export class SharedModule {}
