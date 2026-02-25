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

        // priority 1: check if session already exists in storage (from another tab)
        const storedSessionId = this.loadFromStorage();
        
        // priority 2: check URL for session_id parameter
        const urlSessionId = this.getSessionIdFromUrl();
        
        if (urlSessionId) {
			// URL has session_id - this takes priority (new framework access)
			if (urlSessionId !== storedSessionId) {
				// different session from URL - update storage
                this.sessionId = urlSessionId;
                this.saveToStorage(urlSessionId);
                console.log('New session from framework:', urlSessionId);
            } else {
                // same session - just use it
                this.sessionId = urlSessionId;
                console.log('Session ID from URL (matches storage):', this.sessionId);
            }
        } else if (storedSessionId) {
            // no URL param, but we have stored session - use it (new tab scenario)
            this.sessionId = storedSessionId;
            console.log('Session ID from storage (new tab):', this.sessionId);
        } else {
            // no URL param AND no storage - generate new (standalone access)
            console.warn('No session ID found in URL or storage.');
            this.sessionId = this.generateSessionId();
            this.saveToStorage(this.sessionId);
            console.log('Session ID generated and stored:', this.sessionId);
        }


		// listen for route changes to catch session_id in future navigations
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe(() => {
            const newSessionId = this.getSessionIdFromUrl();
            if (newSessionId && newSessionId !== this.sessionId) {
                // new session from URL
                this.sessionId = newSessionId;
                this.saveToStorage(newSessionId);
                console.log('Session ID updated from navigation:', this.sessionId);
            }
        });

        // listen for storage changes from other tabs
        if (typeof window !== 'undefined') {
            window.addEventListener('storage', (event) => {
                if (event.key === this.SESSION_STORAGE_KEY && event.newValue) {
                    // another tab updated the session
                    const newSessionId = event.newValue;
                    if (newSessionId !== this.sessionId) {
                        console.log('Session ID updated from another tab:', newSessionId);
                        this.sessionId = newSessionId;
                    }
                }
            });
        }
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
        }
    }


    private loadFromStorage(): string | null {
        if (this.isBrowser) {
            return localStorage.getItem(this.SESSION_STORAGE_KEY);
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