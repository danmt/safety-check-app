import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  CheckDeviceFormComponent,
  CheckDevicePayload,
} from './check-device-form.component';
import { DeviceApiService } from './device-api.service';

@Component({
  selector: 'safety-check-app-check-device-modal',
  template: `
    <div class="p-4 w-[320px]">
      <header class="mt-4 mb-2">
        <h2 class="text-xl text-center">Check Device</h2>
      </header>

      <safety-check-app-check-device-form
        [disabled]="isCheckingDevice"
        (checkDevice)="onCheckDevice($event)"
        (cancel)="closeDialog()"
      ></safety-check-app-check-device-form>
    </div>
  `,
  standalone: true,
  imports: [CheckDeviceFormComponent],
})
export class CheckDeviceModalComponent {
  private readonly _dialogRef = inject(MatDialogRef<CheckDeviceModalComponent>);
  private readonly _deviceApiService = inject(DeviceApiService);
  private readonly _snackBar = inject(MatSnackBar);

  isCheckingDevice = false;

  async onCheckDevice(payload: CheckDevicePayload) {
    this.isCheckingDevice = true;

    try {
      const isSafe = await this._deviceApiService.checkDevice({
        siteId: payload.siteId,
        deviceId: payload.deviceId,
      });

      if (isSafe) {
        this._snackBar.open('🎉 Device is safe!', undefined, {
          duration: 3000,
        });
      } else {
        this._snackBar.open('⚠️ Device is unsafe!', undefined, {
          duration: 3000,
        });
      }

      this._dialogRef.close();
    } catch (error) {
      this._snackBar.open('🚨 Failed to check device!', undefined, {
        duration: 3000,
      });
      console.error({ error });
    } finally {
      this.isCheckingDevice = false;
    }
  }

  closeDialog(): void {
    this._dialogRef.close();
  }
}
