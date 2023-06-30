import { NgIf } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface CheckDeviceModel {
  siteId: string;
  deviceId: string;
}

export interface CheckDevicePayload {
  siteId: string;
  deviceId: string;
}

@Component({
  selector: 'safety-check-app-check-device-form',
  template: `
    <form
      (ngSubmit)="onCheckDevice(checkDeviceForm)"
      #checkDeviceForm="ngForm"
      name="check-device-form"
    >
      <mat-form-field class="w-full">
        <mat-label> Site ID </mat-label>
        <input
          matInput
          placeholder="Site ID"
          name="check-device-form-site-id"
          #siteIdControl="ngModel"
          [(ngModel)]="model.siteId"
          required
          [disabled]="disabled"
        />
        <mat-error *ngIf="siteIdControl.invalid && submitted">
          Site ID is required.
        </mat-error>
      </mat-form-field>

      <mat-form-field class="w-full">
        <mat-label> Device ID </mat-label>
        <input
          matInput
          placeholder="Device ID"
          name="check-device-form-device-id"
          #deviceIdControl="ngModel"
          [(ngModel)]="model.deviceId"
          required
          [disabled]="disabled"
        />
        <mat-error *ngIf="deviceIdControl.invalid && submitted">
          Device ID is required.
        </mat-error>
      </mat-form-field>

      <div class="flex justify-end">
        <button
          mat-button
          type="button"
          (click)="onCancel()"
          [disabled]="disabled"
        >
          Cancel
        </button>
        <button
          mat-raised-button
          color="primary"
          type="submit"
          [disabled]="disabled"
        >
          Check
        </button>
      </div>
    </form>
  `,
  imports: [NgIf, FormsModule, MatInputModule, MatButtonModule],
  standalone: true,
})
export class CheckDeviceFormComponent {
  private readonly _snackBar = inject(MatSnackBar);

  @Input() disabled = false;
  @Output() checkDevice = new EventEmitter<CheckDevicePayload>();
  @Output() cancel = new EventEmitter<void>();

  submitted = false;
  model: CheckDeviceModel = { siteId: '', deviceId: '' };

  onCheckDevice(form: NgForm) {
    this.submitted = true;

    if (form.invalid) {
      this._snackBar.open('⚠️ Invalid form!', undefined, {
        duration: 3000,
      });
    } else {
      this.checkDevice.emit(this.model);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
