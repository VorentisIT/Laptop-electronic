import { Injectable } from '@angular/core';

export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, unknown>;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private events: AnalyticsEvent[] = [];

  track(event: string, properties?: Record<string, unknown>): void {
    const record: AnalyticsEvent = {
      event,
      properties,
      timestamp: new Date()
    };
    this.events.push(record);
    console.log(`[Vorentis Analytics] 📡 ${event}`, properties ?? '');
  }

  getRecentEvents(): AnalyticsEvent[] {
    return [...this.events];
  }
}
