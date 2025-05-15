import { CommonModule } from '@angular/common';
import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-image-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-gallery.component.html',
  styleUrl: './image-gallery.component.css',
})
export class ImageGalleryComponent {
  isRequired = input<boolean>(false);
  images = input<string[]>([]);

  @Input() label: string | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const selectedFiles = Array.from(input.files);
    const availableSlots = 9 - this.images().length;

    selectedFiles.slice(0, availableSlots).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result && typeof reader.result === 'string') {
          this.images().push(reader.result);
        }
      };
      reader.readAsDataURL(file);
    });

    input.value = '';
  }

  deleteImage(index: number): void {
    this.images().splice(index, 1);
  }
}
