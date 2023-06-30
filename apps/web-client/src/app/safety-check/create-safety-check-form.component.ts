import { NgIf } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface CreateSafetyCheckModel {
  id: string;
  durationInDays: number | null;
}

export interface CreateSafetyCheckPayload {
  id: string;
  durationInDays: number;
}

@Component({
  selector: 'safety-check-app-create-safety-check-form',
  template: `
    <form
      (ngSubmit)="onCreateSafetyCheck(createSafetyCheckForm)"
      #createSafetyCheckForm="ngForm"
      name="create-safety-check-form"
    >
      <mat-form-field class="w-full">
        <mat-label> Site ID </mat-label>
        <input
          matInput
          placeholder="Site ID"
          name="create-safety-check-form-site-id"
          #siteIdControl="ngModel"
          [ngModel]="siteId"
          required
          readonly
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
          name="create-safety-check-form-device-id"
          #deviceIdControl="ngModel"
          [ngModel]="deviceId"
          required
          readonly
          [disabled]="disabled"
        />
        <mat-error *ngIf="deviceIdControl.invalid && submitted">
          Device ID is required.
        </mat-error>
      </mat-form-field>

      <mat-form-field class="w-full">
        <mat-label> Safety Check ID </mat-label>
        <input
          matInput
          placeholder="Safety Check ID"
          name="create-safety-check-form-safety-check-id"
          #safetyCheckIdControl="ngModel"
          [(ngModel)]="model.id"
          required
          [disabled]="disabled"
        />
        <mat-error *ngIf="safetyCheckIdControl.invalid && submitted">
          Safety Check ID is required.
        </mat-error>
      </mat-form-field>

      <mat-form-field class="w-full">
        <mat-label> Duration in days </mat-label>
        <input
          matInput
          placeholder="Duration in days"
          name="create-safety-check-form-safety-duration-in-days"
          #durationInDaysControl="ngModel"
          [(ngModel)]="model.durationInDays"
          required
          [disabled]="disabled"
        />
        <mat-error *ngIf="durationInDaysControl.invalid && submitted">
          Duration is required.
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
          Create
        </button>
      </div>
    </form>
  `,
  imports: [NgIf, FormsModule, MatInputModule, MatButtonModule],
  standalone: true,
})
export class CreateSafetyCheckFormComponent {
  private readonly _snackBar = inject(MatSnackBar);

  @Input() siteId = '';
  @Input() deviceId = '';
  @Input() disabled = false;
  @Output() createSafetyCheck = new EventEmitter<CreateSafetyCheckPayload>();
  @Output() cancel = new EventEmitter<void>();

  submitted = false;
  model: CreateSafetyCheckModel = { id: '', durationInDays: null };

  onCreateSafetyCheck(form: NgForm) {
    this.submitted = true;

    if (form.invalid || this.model.durationInDays === null) {
      this._snackBar.open('⚠️ Invalid form!', undefined, {
        duration: 3000,
      });
    } else {
      this.createSafetyCheck.emit({
        id: this.model.id,
        durationInDays: this.model.durationInDays,
      });
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
