import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-image-gallery',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './image-gallery.component.html',
  styleUrl: './image-gallery.component.css',
})
export class ImageGalleryComponent {
  isRequired = input<boolean>(false);
  images = input<string[]>([]);
  selectedImagesToUpload = input<File[]>([]);
  selectedImagesLocalUrls: string[] = [];

  @Input() label: string | null = null;
  @Output() deleteImageEvent$ = new EventEmitter<number>();

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    Array.from(input.files).forEach((element) => {
      this.selectedImagesToUpload().push(element);
    });
    const availableSlots =
      9 - this.images().length - this.selectedImagesToUpload().length;

    this.selectedImagesToUpload()
      .slice(0, availableSlots)
      .forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result && typeof reader.result === 'string') {
            this.selectedImagesLocalUrls.push(reader.result);
          }
        };
        reader.readAsDataURL(file);
      });

    input.value = '';
  }

  deleteExistingImage(index: number): void {
    this.images().splice(index, 1);
    this.deleteImageEvent$.emit(index);
  }

  deleteLocalImage(index: number): void {
    this.selectedImagesToUpload().splice(index, 1);
    this.selectedImagesLocalUrls.splice(index, 1);
  }
}
