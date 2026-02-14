import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

declare global {
    interface Window {
        MathJax: any;
    }
}

@Component({
    selector: 'app-damping-coefficient',
    standalone: true,
    imports: [RouterLink],
	templateUrl: './damping-coefficient.html',
	styleUrl: './damping-coefficient.css',
})

export class DampingCoefficient implements OnInit {
    damping_coefficientText!: SafeHtml;

    constructor(
        private sanitizer: DomSanitizer,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}

	// bypassing math rendering errors
    ngOnInit() {        
        this.damping_coefficientText = this.sanitizer.bypassSecurityTrustHtml(`
			Der Dämpfungskoeffizient $\\beta$ beschreibt wie stark die <strong>Dämpfung</strong> einer Schwingung ist 
			und somit die <strong>Amplitude durch Energieverluste</strong> abnimmt. Beim Pohlschen Rad ist $\\beta$ über 
			die Dämpfungskonstante $\\rho$ und das Trägheitsmoment $\\Theta$ definiert:
			$$\\beta = \\frac{\\rho}{2\\Theta}$$
        `);
        
        this.renderMath();
    }

    renderMath() {
        if (isPlatformBrowser(this.platformId)) {
            setTimeout(() => {
                if (window.MathJax) {
                    window.MathJax.typesetPromise();
                }
            }, 100);
        }
    }
}
