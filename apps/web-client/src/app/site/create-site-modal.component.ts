import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {
  CreateSiteFormComponent,
  CreateSitePayload,
} from './create-site-form.component';
import { SiteApiService } from './site-api.service';

@Component({
  selector: 'safety-check-app-create-site-modal',
  template: `
    <div class="p-4 w-[320px]">
      <header class="mt-4 mb-2">
        <h2 class="text-xl text-center">Create Site</h2>
      </header>

      <safety-check-app-create-site-form
        (createSite)="onCreateSite($event)"
        [disabled]="isCreatingSite"
        (cancel)="closeDialog()"
      ></safety-check-app-create-site-form>
    </div>
  `,
  standalone: true,
  imports: [CreateSiteFormComponent],
})
export class CreateSiteModalComponent {
  private readonly _dialogRef = inject(MatDialogRef<CreateSiteModalComponent>);
  private readonly _siteApiService = inject(SiteApiService);

  isCreatingSite = false;

  async onCreateSite(payload: CreateSitePayload) {
    this.isCreatingSite = true;

    try {
      await this._siteApiService.createSite(payload);
      this._dialogRef.close();
    } catch (error) {
      console.error(error);
    } finally {
      this.isCreatingSite = false;
    }
  }

  closeDialog(): void {
    this._dialogRef.close();
  }
}
