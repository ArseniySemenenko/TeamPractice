import { Component, inject, input, linkedSignal, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CvsService } from '../../services/cvs-service';
import { CvsHeaderService } from '../../services/cvs-header-service';

@Component({
    selector: 'app-cv-profile',
    imports: [MatFormFieldModule, MatButtonModule, MatInputModule, ReactiveFormsModule],
    templateUrl: './cv-profile.html',
    styleUrl: './cv-profile.css',
})
export class CvProfile implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly cvsService = inject(CvsService);
    cvsHeader = inject(CvsHeaderService);

    cvId = input.required<string>();

    form = this.fb.group({
        name: ['', Validators.required],
        education: ['', Validators.required],
        description: ['', Validators.required],
    });

    initalValues = signal(this.form.value);

    isUpdateActive = linkedSignal<boolean>(() => {
        return JSON.stringify(this.form.value) !== JSON.stringify(this.initalValues());
    })

    submitForm() {
        if (this.form.value) {
            this.cvsHeader.cvsHeader.set(this.form.value.name ?? '');
            console.log('set header: ', this.cvsHeader.cvsHeader());
            this.cvsService.updateCvProfileById({
                cvId: this.cvId(),
                name: this.form.value.name ?? '',
                education: this.form.value.education,
                description: this.form.value.description ?? '',
            })
            .subscribe(() => {
                this.isUpdateActive.set(false);
            })
        }
    }

    ngOnInit() {
        this.cvsService.getCvProfileById(this.cvId()).subscribe((res) => {
            if (res.data?.cv) {
                console.log(res.data.cv); 
                this.cvsHeader.cvsHeader.set(res.data.cv.name);
                console.log("set header: " , this.cvsHeader.cvsHeader());
                this.form.patchValue({
                    name: res.data.cv.name,
                    education: res.data.cv.education,
                    description: res.data.cv.description,
                });

                this.initalValues.set(this.form.value);
                console.log('set inital: ', this.initalValues());
            }
        });

        this.form.valueChanges
        .subscribe(() => {
            console.log('form value changed');
            console.log('form value: ' , this.form.value);
            console.log('inital value: ' , this.initalValues());
            this.isUpdateActive.set(JSON.stringify(this.form.value) !== JSON.stringify(this.initalValues()));

        })
    }
}
