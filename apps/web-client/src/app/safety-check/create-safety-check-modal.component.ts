import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  CreateSafetyCheckFormComponent,
  CreateSafetyCheckPayload,
} from './create-safety-check-form.component';
import { SafetyCheckApiService } from './safety-check-api.service';

@Component({
  selector: 'safety-check-app-create-safety-check-modal',
  template: `
    <div class="p-4 w-[320px]">
      <header class="mt-4 mb-2">
        <h2 class="text-xl text-center">Create Safety Check</h2>
      </header>

      <safety-check-app-create-safety-check-form
        [siteId]="siteId"
        [deviceId]="deviceId"
        [disabled]="isCreatingSafetyCheck"
        (createSafetyCheck)="onCreateSafetyCheck($event)"
        (cancel)="closeDialog()"
      ></safety-check-app-create-safety-check-form>
    </div>
  `,
  standalone: true,
  imports: [CreateSafetyCheckFormComponent],
})
export class CreateSafetyCheckModalComponent {
  private readonly _dialogRef = inject(
    MatDialogRef<CreateSafetyCheckModalComponent>
  );
  private readonly _dialogData = inject(MAT_DIALOG_DATA);
  private readonly _safetyCheckApiService = inject(SafetyCheckApiService);
  private readonly _snackBar = inject(MatSnackBar);

  readonly siteId = this._dialogData.siteId;
  readonly deviceId = this._dialogData.deviceId;

  isCreatingSafetyCheck = false;

  async onCreateSafetyCheck(payload: CreateSafetyCheckPayload) {
    this.isCreatingSafetyCheck = true;

    try {
      await this._safetyCheckApiService.createSafetyCheck({
        siteId: this.siteId,
        deviceId: this.deviceId,
        durationInDays: payload.durationInDays,
        safetyCheckId: payload.id,
      });
      this._snackBar.open('🎉 Safety check successfully created!', undefined, {
        duration: 3000,
      });
      this._dialogRef.close();
    } catch (error) {
      this._snackBar.open('🚨 Failed to create safety check!', undefined, {
        duration: 3000,
      });
      console.error({ error });
    } finally {
      this.isCreatingSafetyCheck = false;
    }
  }

  closeDialog(): void {
    this._dialogRef.close();
  }
}
