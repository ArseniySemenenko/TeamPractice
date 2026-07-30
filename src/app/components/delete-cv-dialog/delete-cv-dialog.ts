import { Component , inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Cv } from 'cv-graphql';


@Component({
    selector: 'app-delete-cv-dialog',
    imports: [
        MatIconModule,
        MatDialogModule,
        MatButtonModule,
    ],
    templateUrl: './delete-cv-dialog.html',
    styleUrl: './delete-cv-dialog.css',
})
export class DeleteCvDialog {

    dialogRef = inject(MatDialogRef<DeleteCvDialog>);
    public data = inject<{cv: Cv}>(MAT_DIALOG_DATA);

    onAdd(){
        this.dialogRef.close({
            cv: this.data.cv,
        });
    }

    onCancel(){
        this.dialogRef.close();
    }

}
