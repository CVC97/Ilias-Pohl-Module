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
	selector: 'app-moment-of-inertia',
	standalone: true,
	imports: [RouterLink],
	templateUrl: './moment-of-inertia.html',
	styleUrl: './moment-of-inertia.css',
})



export class MomentOfInertia implements OnInit {
    moiText!: SafeHtml;
    moiFormulaText!: SafeHtml;
	moiPlotText!: SafeHtml;

    constructor(
        private sanitizer: DomSanitizer,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}

	// bypassing math rendering errors
    ngOnInit() {        
        this.moiText = this.sanitizer.bypassSecurityTrustHtml(`
            Das Trägheitsmoment $\\theta$ ist ein Maß für den Widerstand, den ein Körper der Änderung seiner Winkelgeschwindigkeit entgegensetzt. 
			Es spielt damit bei einer Drehbewegung die gleiche Rolle wie die (träge) Masse im Verhältnis von Kraft und Beschleunigung (Translationsbewegeung).
        `);

        this.moiFormulaText = this.sanitizer.bypassSecurityTrustHtml(`
            Das Trägheitsmoment $\\theta$ ist definiert als 
			
			$$\\theta=\\int_V\\vec{r}_\\perp^2\\rho(\\vec{r})\\mathrm{d}V.$$

			Dabei ist $\\rho(\\vec{r})$ die Funktion der Dichte des Körpers und $\\vec{r}_\\perp$ der senkrechte Vektor von der Rotationsachse 
			(vorgegeben von der vektoriellen Winkelgeschwindigkeit $\\omega$) zum Volumenelement $\\mathrm{d}V$.
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
