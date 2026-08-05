import {
    Component,
    inject,
    signal,
    input,
    linkedSignal,
    model,
    computed,
    effect,
} from '@angular/core';
import { UsersService } from '../../services/users-service';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth-service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Department, Position, User } from 'cv-graphql';
import { tap } from 'rxjs';
import { DepService } from '../../services/dep-service';
import { MatSelectModule } from '@angular/material/select';
import { PosService } from '../../services/pos-service';
import { CvsService } from '../../services/cvs-service';
import { UploadService } from '../../services/upload-service';

@Component({
    selector: 'app-profile-details',
    imports: [
        DatePipe,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatSelectModule,
    ],
    templateUrl: './profile-details.html',
    styleUrl: './profile-details.css',
})
export class ProfileDetails {
    private readonly usersService = inject(UsersService);
    private readonly depService = inject(DepService);
    private readonly posService = inject(PosService);
    private readonly uploadService = inject(UploadService);

    readonly authService = inject(AuthService);

    currentProfile = signal<User>({} as User);

    f_name = signal<string>('');
    l_name = signal<string>('');

    departments = signal<Department[]>([]);
    selectedDep = signal<string | null>(null);

    positions = signal<Position[]>([]);
    selectedPos = signal<string | null>(null);

    isNameInvalid = computed(() => {
        return (
            (this.f_name() === '' || this.f_name() === this.currentProfile().profile.first_name) &&
            (this.l_name() === '' || this.l_name() === this.currentProfile().profile.last_name)
        );
    });

    isDepartmentInvalid = computed(() => {
        return !this.selectedDep() || this.selectedDep() == this.currentProfile().department?.id;
    });

    isPositionInvalid = computed(() => {
        return !this.selectedPos() || this.selectedPos() == this.currentProfile().position?.id;
    });

    isUpdateDisabled = linkedSignal(() => {
        return this.isNameInvalid() && this.isDepartmentInvalid() && this.isPositionInvalid();
    });

    base64Avatar: string | null = null;

    uploadChange(event: Event) {
        const input = event.target as HTMLInputElement;

        if (input.files && input.files[0]) {
            const file = input.files[0];
            
            // Проверка размера (0.5 MB = 524288 байт)
            if (file.size > 524288) {
                alert('File is bigger then 0.5 MB');
                return;
            }

            const fr = new FileReader();

            fr.onload = () => {
                const result = fr.result as string;
                // Извлекаем только Base64 части после запятой
                this.base64Avatar = result.includes(',') ? result.split(',')[1] : result;

                this.uploadService
                    .uploadAvatar({
                        // Если аргумент GraphQL мутации ожидает объект $args: UploadAvatarInput
                            userId: this.authService.currentUser().id,
                            base64: this.base64Avatar,
                            type: file.type,
                            size: file.size,
                    })
                    .subscribe({
                        next: (res) => console.log('Avatar uploaded:', res),
                        error: (err) => console.error('Upload error:', err),
                    });
            };

            fr.readAsDataURL(file);
        }
    }

    ngOnInit() {
        this.usersService
            .getUser(this.userId())
            .pipe(
                tap((res) => {
                    if (
                        res.data &&
                        res.data.user.profile.first_name &&
                        res.data.user.profile.last_name
                    ) {
                        this.f_name.set(res.data.user.profile.first_name);
                        this.l_name.set(res.data.user.profile.last_name);
                    }
                    !!res.data?.user.department &&
                        this.selectedDep.set(res.data?.user.department.id);

                    !!res.data?.user.position && this.selectedPos.set(res.data?.user.position.id);
                }),
            )
            .subscribe((res) => {
                console.log('res', res);
                console.log();
                if (res.data) {
                    this.currentProfile.set(res.data.user);
                }
            });

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
    }

    updateSubmit() {
        console.log('submit click');
        if (!this.isDepartmentInvalid() || !this.isPositionInvalid()) {
            console.log('1 1');
            this.updateUser();
            console.log('this.updateUser()');
        }
        if (!this.isNameInvalid()) {
            console.log('2 2');
            this.updateProfile();
            console.log('this.updateProfile()');
        }
    }

    updateUser() {
        console.log(1);
        this.usersService
            .updateUser(
                this.currentProfile().id,
                this.selectedDep() ?? '',
                this.selectedPos() ?? '',
            )
            .subscribe((res) => {
                console.log(res);
                if (res.data?.updateUser) {
                    this.currentProfile.set(res.data.updateUser);
                    if (!this.isNameInvalid()) {
                        this.updateProfile();
                    }
                }
            });
    }

    updateProfile() {
        console.log(this.selectedDep());
        if (this.f_name() && this.l_name()) {
            this.usersService
                .updateProfile(this.currentProfile().id, this.f_name(), this.l_name())
                .subscribe((res) => {
                    if (res.data?.updateProfile) {
                        this.authService.currentUser.update((current) => ({
                            ...current,
                            profile: {
                                ...current.profile,
                                first_name: this.f_name(),
                                last_name: this.l_name(),
                                full_name: this.f_name() + ' ' + this.l_name(),
                            },
                        }));
                    }
                    this.isUpdateDisabled.set(true);
                });
        }
    }

    userId = input.required<string>();
}
