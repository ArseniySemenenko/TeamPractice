import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstLetterUpper',
})
export class FirstLetterUpperPipe implements PipeTransform {
  transform(value: string | null | undefined) {
    if(!value) return '';
    return value[0].toUpperCase() + value.slice(1);
  }
}
