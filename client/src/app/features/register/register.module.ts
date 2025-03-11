import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RegisterComponent,
  ],
  exports: [
    RegisterComponent
  ]
})
export class RegisterModule { }
