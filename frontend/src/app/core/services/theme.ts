import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';



@Injectable({
    providedIn: 'root'
})


export class ThemeService {
    private darkMode = false;
    private isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) platformId: Object) {
        this.isBrowser = isPlatformBrowser(platformId);
        
        if (this.isBrowser) {
            // Load saved preference only in browser
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark') {
                this.enableDarkMode();
            }
        }
    }

    toggleTheme() {
        this.darkMode = !this.darkMode;
        if (this.darkMode) {
            this.enableDarkMode();
        } else {
            this.disableDarkMode();
        }
    }

    private enableDarkMode() {
        if (this.isBrowser) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
        this.darkMode = true;
    }

    private disableDarkMode() {
        if (this.isBrowser) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        }
        this.darkMode = false;
    }

    isDarkMode(): boolean {
        return this.darkMode;
    }
}