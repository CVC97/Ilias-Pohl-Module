import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Session } from './session';
import { Analytics, AnalyticsData } from './analytics';
import { ResultsTracking, ModuleProgress } from './results-tracking';
import { TestTracking, TestProgress } from './test-tracking';



export interface CombinedData {
    username: string;
    sessionId: string;
    analytics: AnalyticsData;
    moduleResults: ModuleProgress[];
    testResults: TestProgress[];
    exportTime: string;
}



@Injectable({
    providedIn: 'root'
})
export class DataExport {
    private readonly API_BASE = '/api';

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private sessionService: Session,
        private analyticsService: Analytics,
        private resultsService: ResultsTracking,
        private testService: TestTracking
    ) {
        if (isPlatformBrowser(this.platformId)) {
            window.addEventListener('beforeunload', () => this.saveProgress());
        }
    }


    getCombinedData(): CombinedData {
        const username = this.sessionService.getSessionId() || 'unknown';
        return {
            username,
            sessionId: username,
            analytics: this.analyticsService.getSessionData(),
            moduleResults: this.resultsService.getAllResults(),
            testResults: this.testService.getAllTests(),
            exportTime: new Date().toISOString()
        };
    }


    exportToJSON(): string {
        return JSON.stringify(this.getCombinedData(), null, 2);
    }


    // Saves all progress to the backend. Silently skips rogue users.
    async saveProgress(): Promise<void> {
        if (!isPlatformBrowser(this.platformId)) return;
        if (this.sessionService.isRogueUser()) {
            console.log('Rogue user — progress not saved to database.');
            return;
        }

        try {
            const response = await fetch(`${this.API_BASE}/progress/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.getCombinedData()),
                keepalive: true   // survives page unload
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            console.log('Progress saved to backend.');
        } catch (err) {
            console.error('Failed to save progress:', err);
        }
    }


    downloadAsFile(filename: string = 'session-data.json') {
        const dataStr = this.exportToJSON();
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();

        URL.revokeObjectURL(url);
    }
}
