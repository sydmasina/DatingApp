import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  EventEmitter,
  Input,
  input,
  Output,
} from '@angular/core';
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
  selectedImagesToUpload: File[] = [];
  imageCount = computed(
    () => this.images().length + this.selectedImagesToUpload.length
  );
  selectedImagesLocalUrls: string[] = [];
  hasReachedMax: boolean = false;

  @Input() label: string | null = null;
  @Input() multiple: boolean = true;
  @Input() maxCount: number = 2;
  @Input() allowWarning: boolean = false;
  @Output() deleteImageEvent$ = new EventEmitter<number>();
  @Output() selectedImagesToUploadChange = new EventEmitter<File[]>();

  constructor() {
    effect(() => {
      const imageCount = this.imageCount();
      if (imageCount >= this.maxCount) {
        this.hasReachedMax = true;
      } else {
        this.hasReachedMax = false;
      }
    });
  }

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (!inputElement.files) return;

    const currentImagesCount =
      this.images().length + this.selectedImagesToUpload.length;
    const availableSlots = this.maxCount - currentImagesCount;
    if (availableSlots <= 0) return;

    const newFiles = Array.from(inputElement.files).slice(0, availableSlots);

    // Update signal
    this.selectedImagesToUpload = this.selectedImagesToUpload.concat(newFiles);
    this.selectedImagesToUploadChange.emit(this.selectedImagesToUpload);

    // Load preview URLs
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          this.selectedImagesLocalUrls.push(reader.result);
        }
      };
      reader.readAsDataURL(file);
    });

    inputElement.value = '';
  }

  deleteExistingImage(index: number): void {
    this.images().splice(index, 1);
    this.deleteImageEvent$.emit(index);
  }

  deleteLocalImage(index: number): void {
    this.selectedImagesToUpload.splice(index, 1);
    this.selectedImagesLocalUrls.splice(index, 1);
  }
}
