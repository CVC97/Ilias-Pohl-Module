import { Injectable } from '@angular/core';
import { Session } from './session';
import { Analytics, AnalyticsData } from './analytics';
import { ResultsTracking, ModuleProgress } from './results-tracking';



export interface CombinedData {
    sessionId: string;
    analytics: AnalyticsData;
    results: ModuleProgress[];
    exportTime: string;
}



@Injectable({
    providedIn: 'root'
})



export class DataExport {
    constructor(
        private sessionService: Session,
        private analyticsService: Analytics,
        private resultsService: ResultsTracking
    ) {}


    getCombinedData(): CombinedData {
        return {
            sessionId: this.sessionService.getSessionId() || 'unknown',
            analytics: this.analyticsService.getSessionData(),
            results: this.resultsService.getAllResults(),
            exportTime: new Date().toISOString()
        };
    }


    exportToJSON(): string {
        return JSON.stringify(this.getCombinedData(), null, 2);
    }


    async sendToBackend(endpoint: string = 'http://localhost:3000/api/combined') {
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: this.exportToJSON()
            });

            const result = await response.json();
            console.log('Combined data sent successfully:', result);
            return result;
        } catch (error) {
            console.error('Failed to send combined data:', error);
            throw error;
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