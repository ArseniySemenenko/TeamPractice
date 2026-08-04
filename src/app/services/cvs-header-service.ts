import { Service , signal } from '@angular/core';

@Service()
export class CvsHeaderService {
    cvsHeader = signal('');
}
