import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';



interface PageVisit {
    page: string;
    startTime: number;
    endTime?: number;
    duration?: number;
	duration_s?: number;
    sessionId: string;
    timestamp: string;
}



@Injectable({
    providedIn: 'root'
})



export class Analytics {
    private currentVisit: PageVisit | null = null;
    private visits: PageVisit[] = [];
    private sessionId: string;


    constructor(
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.sessionId = this.generateSessionId();
        this.initTracking();
    }


    private initTracking() {
        if (!isPlatformBrowser(this.platformId)) return;

        // Track route changes
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: any) => {
            this.endCurrentVisit();
            this.startNewVisit(event.urlAfterRedirects);
        });

        // Track when user leaves the page
        if (typeof window !== 'undefined') {
            window.addEventListener('beforeunload', () => {
                this.endCurrentVisit();
                this.saveData();
            });
        }
    }


    private startNewVisit(page: string) {
        this.currentVisit = {
            page: page,
            startTime: Date.now(),
            sessionId: this.sessionId,
            timestamp: new Date().toISOString()
        };
    }


	private endCurrentVisit() {
		if (this.currentVisit) {
			this.currentVisit.endTime = Date.now();
			this.currentVisit.duration = this.currentVisit.endTime - this.currentVisit.startTime;
			this.currentVisit.duration_s = this.currentVisit.duration / 1000;
			this.visits.push({ ...this.currentVisit });
			
			// LOG HERE - This runs every time user leaves a page
			console.log('Page visit ended:', this.currentVisit);
			console.log('All visits so far:', this.visits);
			
			this.currentVisit = null;
		}
	}


    private generateSessionId(): string {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }


    private saveData() {
        // For now, save to localStorage (temporary solution)
        if (isPlatformBrowser(this.platformId)) {
            const existingData = localStorage.getItem('analyticsData');
            const allVisits = existingData ? JSON.parse(existingData) : [];
            allVisits.push(...this.visits);
            localStorage.setItem('analyticsData', JSON.stringify(allVisits));
        }
    }


    // Method to send data to backend (you'll implement this later)
    async sendToBackend() {
        this.endCurrentVisit();
        
        // TODO: Send to your backend API
        // Example:
        // await fetch('https://your-backend.com/api/analytics', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(this.visits)
        // });
        
        console.log('Analytics data:', this.visits);
        this.visits = [];
    }


    // Get current session data (for debugging)
    getSessionData() {
        return {
            sessionId: this.sessionId,
            visits: this.visits,
            currentVisit: this.currentVisit
        };
    }
}