import { Component } from '@angular/core';

@Component({
  selector: 'app-double-check',
  standalone: true,
  imports: [],
  template: `<svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M7 13l3 3 7-7" />
    <path d="M12 13l3 3 7-7" />
  </svg>`,
})
export class DoubleCheckComponent {}
