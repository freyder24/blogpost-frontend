import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
})
// Pipe  para Recortar Texto de la descripcion
export class TruncatePipe implements PipeTransform {
  transform(value: string | undefined | null, limit: number = 50): string {
    if (!value) return '';

    return value.length > limit ? value.substring(0, limit) + '....' : value;
  }
}
