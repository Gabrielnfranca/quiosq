import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeElapsed',
  standalone: true
})
export class TimeElapsedPipe implements PipeTransform {

  transform(startTime: string, now: Date, status?: string, initTime?: string, endTime?: string): string {

    if (status === 'awaiting_preparation' || status === 'preparing' || status === 'ready' || status === 'delivering') {
      if (!startTime) return '00:00:00';

      const start = new Date(startTime).getTime();
      let end = new Date().getTime();

      if (endTime) {
        end = new Date(endTime).getTime();
      } else {
        end = now.getTime();
      }

      const diff = end - start;
      if (diff < 0) return '00:00:00';

      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      const paddedHours = hours.toString().padStart(2, '0');
      const paddedMinutes = minutes.toString().padStart(2, '0');
      const paddedSeconds = seconds.toString().padStart(2, '0');

      return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
    }
    if (status === 'completed') {
      
      if (!endTime) return '00:00:00';
      if (!initTime) return '00:00:00';

      const end = new Date(endTime).getTime();
      const start = new Date(initTime).getTime();

      const diff = end - start;
      if (diff < 0) return '00:00:00';

      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      const paddedHours = hours.toString().padStart(2, '0');
      const paddedMinutes = minutes.toString().padStart(2, '0');
      const paddedSeconds = seconds.toString().padStart(2, '0');

      return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
    }
    return '';

  }

}
