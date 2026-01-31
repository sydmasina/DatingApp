import { inject, Injectable } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { map } from 'rxjs';
import { PromptComponent } from '../components/prompt/prompt.component';

@Injectable({
  providedIn: 'root',
})
export class PromptService {
  bsModalRef?: BsModalRef;
  private modalService = inject(BsModalService);

  confirm(
    title = 'Unsaved Changes',
    message = 'Continuing now will discard any unsaved changes. Are you sure?',
    btnText1 = 'Return to editing',
    btnText2 = 'Continue'
  ) {
    const config: ModalOptions = {
      initialState: {
        title,
        message,
        btnText1,
        btnText2,
      },
    };
    this.bsModalRef = this.modalService.show(PromptComponent, config);
    return this.bsModalRef.onHidden?.pipe(
      map(() => {
        if (this.bsModalRef?.content) {
          return this.bsModalRef.content.result as boolean;
        } else {
          return false;
        }
      })
    );
  }
}
