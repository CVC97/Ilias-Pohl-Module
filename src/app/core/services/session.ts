import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';



@Injectable({
    providedIn: 'root'
})


export class Session {
    private sessionId: string | null = null;
    private isBrowser: boolean;
    private readonly SESSION_STORAGE_KEY = 'framework_session_id';

    constructor(
        @Inject(PLATFORM_ID) platformId: Object,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.isBrowser = isPlatformBrowser(platformId);
        this.initSession();
    }


    private initSession() {
        if (!this.isBrowser) return;

        // try to get session_id from URL first
        const urlSessionId = this.getSessionIdFromUrl();
        
        if (urlSessionId) {
            // got it from URL - store it
            this.sessionId = urlSessionId;
            this.saveToStorage(urlSessionId);
            console.log('Session ID from URL:', this.sessionId);
        } else {
            // not in URL - try to load from storage
            this.sessionId = this.loadFromStorage();
            if (this.sessionId) {
                console.log('Session ID from storage:', this.sessionId);
			// neither in URL nor in storage - generate own session id and store it
            } else {
                console.warn('No session ID found in URL or storage.');
				this.sessionId = this.generateSessionId();
				this.saveToStorage(this.sessionId);
				console.log('Session ID generated and stored:', this.sessionId);
            }
        }

        // Listen for route changes to catch session_id in future navigations
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe(() => {
            const newSessionId = this.getSessionIdFromUrl();
            if (newSessionId && newSessionId !== this.sessionId) {
                this.sessionId = newSessionId;
                this.saveToStorage(newSessionId);
                console.log('Session ID updated:', this.sessionId);
            }
        });
    }


    private getSessionIdFromUrl(): string | null {
        // check route params
        const sessionFromRoute = this.route.snapshot.queryParamMap.get('session_id');
        if (sessionFromRoute) return sessionFromRoute;

        // also check if it's in the URL directly (fallback)
        if (this.isBrowser) {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get('session_id');
        }

        return null;
    }


	// save session ID in storage
    private saveToStorage(sessionId: string) {
        if (this.isBrowser) {
            localStorage.setItem(this.SESSION_STORAGE_KEY, sessionId);
            // also save in sessionStorage as backup
            sessionStorage.setItem(this.SESSION_STORAGE_KEY, sessionId);
        }
    }


    private loadFromStorage(): string | null {
        if (this.isBrowser) {
            // Try localStorage first
            let stored = localStorage.getItem(this.SESSION_STORAGE_KEY);
            if (stored) return stored;

            // Fallback to sessionStorage
            stored = sessionStorage.getItem(this.SESSION_STORAGE_KEY);
            if (stored) return stored;
        }
        return null;
    }
	
	
	// generate a session if no session detected
	private generateSessionId(): string {
		return 'rogue_user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
	}


    // public API
    getSessionId(): string | null {
        return this.sessionId;
    }


    hasValidSession(): boolean {
        return this.sessionId !== null && this.sessionId.length > 0;
    }


    clearSession() {
        this.sessionId = null;
        if (this.isBrowser) {
            localStorage.removeItem(this.SESSION_STORAGE_KEY);
            sessionStorage.removeItem(this.SESSION_STORAGE_KEY);
        }
        console.log('Session cleared');
    }
}