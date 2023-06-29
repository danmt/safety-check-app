import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  CreateDeviceFormComponent,
  CreateDevicePayload,
} from './create-device-form.component';
import { DeviceApiService } from './device-api.service';

@Component({
  selector: 'safety-check-app-create-device-modal',
  template: `
    <div class="p-4 w-[320px]">
      <header class="mt-4 mb-2">
        <h2 class="text-xl text-center">Create Device</h2>
      </header>

      <safety-check-app-create-device-form
        [siteId]="siteId"
        [disabled]="isCreatingDevice"
        (createDevice)="onCreateDevice($event)"
        (cancel)="closeDialog()"
      ></safety-check-app-create-device-form>
    </div>
  `,
  standalone: true,
  imports: [CreateDeviceFormComponent],
})
export class CreateDeviceModalComponent {
  private readonly _dialogRef = inject(
    MatDialogRef<CreateDeviceModalComponent>
  );
  private readonly _dialogData = inject(MAT_DIALOG_DATA);
  private readonly _deviceApiService = inject(DeviceApiService);

  readonly siteId = this._dialogData.siteId;

  isCreatingDevice = false;

  async onCreateDevice(payload: CreateDevicePayload) {
    this.isCreatingDevice = true;

    try {
      await this._deviceApiService.createDevice({
        siteId: this.siteId,
        deviceId: payload.id,
      });
      this._dialogRef.close();
    } catch (error) {
      console.error(error);
    } finally {
      this.isCreatingDevice = false;
    }
  }

  closeDialog(): void {
    this._dialogRef.close();
  }
}
