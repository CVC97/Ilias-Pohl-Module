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
    selector: 'app-critical-damping',
    standalone: true,
    imports: [RouterLink],
	templateUrl: './critical-damping.html',
	styleUrl: './critical-damping.css',
})

export class CriticalDamping implements OnInit {
    critical_dampingText!: SafeHtml;
    critical_dampingFormulaText!: SafeHtml;
	critical_dampingPlotText!: SafeHtml;

    constructor(
        private sanitizer: DomSanitizer,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}

	// bypassing math rendering errors
    ngOnInit() {        
        this.critical_dampingFormulaText = this.sanitizer.bypassSecurityTrustHtml(`
            <strong>Kennzeichen:</strong>
            <ul>
                <li>Annäherung an die Gleichgewichtslage in kürzester Zeit</li>
                <li><strong>Keine Überschwingen</strong> der Ruhelage</li>
                <li>Monotones, exponentielles Abklingen der Auslenkung</li>
                <li>Tritt auf, wenn $\\beta = \\omega_0$ (kritische Dämpfung)</li>
                <li>Bei stärkerer Dämpfung ($\\beta > \\omega_0$) geht das System in den überaperiodischen Fall (Kriechfall) über</li>
            </ul>
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