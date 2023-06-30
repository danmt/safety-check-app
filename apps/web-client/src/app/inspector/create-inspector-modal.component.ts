import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  CreateInspectorFormComponent,
  CreateInspectorPayload,
} from './create-inspector-form.component';
import { InspectorApiService } from './inspector-api.service';

@Component({
  selector: 'safety-check-app-create-inspector-modal',
  template: `
    <div class="p-4 w-[320px]">
      <header class="mt-4 mb-2">
        <h2 class="text-xl text-center">Create Inspector</h2>
      </header>

      <safety-check-app-create-inspector-form
        [siteId]="siteId"
        [disabled]="isCreatingInspector"
        (createInspector)="onCreateInspector($event)"
        (cancel)="closeDialog()"
      ></safety-check-app-create-inspector-form>
    </div>
  `,
  standalone: true,
  imports: [CreateInspectorFormComponent],
})
export class CreateInspectorModalComponent {
  private readonly _dialogRef = inject(
    MatDialogRef<CreateInspectorModalComponent>
  );
  private readonly _dialogData = inject(MAT_DIALOG_DATA);
  private readonly _inspectorApiService = inject(InspectorApiService);
  private readonly _snackBar = inject(MatSnackBar);

  readonly siteId = this._dialogData.siteId;

  isCreatingInspector = false;

  async onCreateInspector(payload: CreateInspectorPayload) {
    this.isCreatingInspector = true;

    try {
      await this._inspectorApiService.createInspector({
        siteId: this.siteId,
        owner: payload.owner,
      });
      this._snackBar.open('🎉 Inspector successfully created!', undefined, {
        duration: 3000,
      });
      this._dialogRef.close();
    } catch (error) {
      this._snackBar.open('🚨 Failed to create inspector!', undefined, {
        duration: 3000,
      });
      console.error({ error });
    } finally {
      this.isCreatingInspector = false;
    }
  }

  closeDialog(): void {
    this._dialogRef.close();
  }
}
