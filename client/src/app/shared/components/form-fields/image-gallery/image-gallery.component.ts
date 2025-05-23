import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  EventEmitter,
  Input,
  input,
  Output,
  signal,
  WritableSignal,
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
  selectedImagesToUpload = signal<File[]>([]);
  selectedImagesLocalUrls: string[] = [];
  hasReachedMax: boolean = false;

  @Input() images!: WritableSignal<string[]>;
  @Input() label: string | null = null;
  @Input() multiple: boolean = true;
  @Input() maxCount: number = 2;
  @Input() allowWarning: boolean = false;
  @Output() deleteImageEvent$ = new EventEmitter<number>();
  @Output() selectedImagesToUploadChange = new EventEmitter<File[]>();
  imageCount = computed(
    () => this.images().length + this.selectedImagesToUpload().length
  );

  constructor() {
    effect(
      () => {
        const totalImageCount = this.imageCount();
        this.hasReachedMax = totalImageCount >= this.maxCount;
      },
      { allowSignalWrites: true }
    );
  }

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (!inputElement.files) return;

    const availableSlots = this.maxCount - this.imageCount();
    if (availableSlots <= 0) return;

    const newFiles = Array.from(inputElement.files).slice(0, availableSlots);

    // Update signal
    this.selectedImagesToUpload.update((existingImages) => [
      ...existingImages,
      ...newFiles,
    ]);
    this.selectedImagesToUploadChange.emit(this.selectedImagesToUpload());

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
    const imagesData = [...this.images()];
    imagesData.splice(index, 1);
    this.images.set(imagesData);
    this.deleteImageEvent$.emit(index);
  }

  deleteLocalImage(index: number): void {
    const selectedImages = [...this.selectedImagesToUpload()];
    selectedImages.splice(index, 1);
    this.selectedImagesToUpload.set(selectedImages);
    this.selectedImagesToUploadChange.emit(this.selectedImagesToUpload());

    this.selectedImagesLocalUrls.splice(index, 1);
  }

  getMessage(): string {
    return `${this.label ?? 'Field'} is required`;
  }

  get showError() {
    return this.isRequired() && this.imageCount() === 0;
  }
}
