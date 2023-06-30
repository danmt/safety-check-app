import { NgIf } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface CreateDeviceModel {
  id: string;
}

export interface CreateDevicePayload {
  id: string;
}

@Component({
  selector: 'safety-check-app-create-device-form',
  template: `
    <form
      (ngSubmit)="onCreateDevice(createDeviceForm)"
      #createDeviceForm="ngForm"
      name="create-device-form"
    >
      <mat-form-field class="w-full">
        <mat-label> Site ID </mat-label>
        <input
          matInput
          placeholder="Site ID"
          name="create-device-form-site-id"
          #siteIdControl="ngModel"
          [ngModel]="siteId"
          required
          readonly
          [disabled]="disabled"
        />
        <mat-error
          *ngIf="
            siteIdControl.invalid &&
            (siteIdControl.dirty || siteIdControl.touched)
          "
        >
          Site ID is required.
        </mat-error>
      </mat-form-field>

      <mat-form-field class="w-full">
        <mat-label> Device ID </mat-label>
        <input
          matInput
          placeholder="Device ID"
          name="create-device-form-device-id"
          #deviceIdControl="ngModel"
          [(ngModel)]="model.id"
          required
          [disabled]="disabled"
        />
        <mat-error
          *ngIf="
            deviceIdControl.invalid &&
            (deviceIdControl.dirty || deviceIdControl.touched)
          "
        >
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
          [disabled]="createDeviceForm.invalid || disabled"
        >
          Create
        </button>
      </div>
    </form>
  `,
  imports: [NgIf, FormsModule, MatInputModule, MatButtonModule],
  standalone: true,
})
export class CreateDeviceFormComponent {
  private readonly _snackBar = inject(MatSnackBar);

  @Input() siteId = '';
  @Input() disabled = false;
  @Output() createDevice = new EventEmitter<CreateDevicePayload>();
  @Output() cancel = new EventEmitter<void>();

  model: CreateDeviceModel = { id: '' };

  onCreateDevice(form: NgForm) {
    if (form.invalid) {
      this._snackBar.open('⚠️ Invalid form!', undefined, {
        duration: 3000,
      });
    } else {
      this.createDevice.emit(this.model);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
