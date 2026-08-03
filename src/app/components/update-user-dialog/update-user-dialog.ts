import { Component, Inject, inject, linkedSignal, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { SkillsService } from '../../services/skills-service';
import { Mastery, SkillMastery, UpdateProfileInput, UpdateUserInput, User } from 'cv-graphql';
import { Skill } from 'cv-graphql';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth-service';
import { DepService } from '../../services/dep-service';
import { PosService } from '../../services/pos-service';
import { Department } from 'cv-graphql';
import { Position } from 'cv-graphql';

@Component({
    selector: 'app-update-user-dialog',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatSelectModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        MatIconModule,
    ],
    templateUrl: './update-user-dialog.html',
    styleUrl: './update-user-dialog.css',
})
export class UpdateUserDialog implements OnInit{
    private readonly depService = inject(DepService);
    private readonly posService = inject(PosService);
    private readonly fb = inject(FormBuilder);
    private readonly authService = inject(AuthService);

    public dialogRef = inject(MatDialogRef<UpdateUserDialog>);
    public data = inject<{ user: User }>(MAT_DIALOG_DATA);

    departments = signal<Department[]>([]);
    positions = signal<Position[]>([]);

    form = this.fb.group({
        email: [{ value: this.data.user.email, disabled: true }, Validators.required],
        first_name: [this.data.user.profile.first_name , Validators.required],
        last_name: [this.data.user.profile.last_name, Validators.required],
        dep: [this.data.user.department?.id, Validators.required],
        role: [{ value: this.data.user.role, disabled: true }, Validators.required],
        password: [{ value: this.authService.currentUserPassword(), disabled: true }, Validators.required],
        position: [this.data.user.position?.id, Validators.required],
    });

    initalFormValue = this.form.value;

    isFormChanged = linkedSignal(() => {
        return JSON.stringify(this.initalFormValue) == JSON.stringify(this.form.value);
    })

    onCancel(){
        this.dialogRef.close();
    }

    onAdd(){
        const res1: UpdateUserInput = {
            userId: this.data.user.id,
            departmentId: this.form.value.dep,
            positionId: this.form.value.position,
        }

        const res2: UpdateProfileInput = {
            userId: this.data.user.id,
            first_name: this.form.value.first_name,
            last_name: this.form.value.last_name,
        }

        this.dialogRef.close({res1 , res2});
    }

    ngOnInit() {
        this.form.valueChanges
        .subscribe((res) => {
            console.log(res);
            this.isFormChanged.set(JSON.stringify(this.initalFormValue) == JSON.stringify(this.form.value));
        })

        
        this.depService.getDepartments().subscribe((res) => {
            if (res.data?.departments) {
                this.departments.set(res.data?.departments);
                console.log(this.departments());
            }
        });

        this.posService.getPositions().subscribe((res) => {
            if (res.data?.positions) {
                this.positions.set(res.data.positions);
                console.log(this.positions());
            }
        });

        //this.initalFormValue = this.form.value;
        console.log(this.initalFormValue);
        console.log(this.form.value);
    }
}
