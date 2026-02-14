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
    selector: 'app-hom-dgl',
    standalone: true,
    imports: [RouterLink],
	templateUrl: './hom-dgl.html',
	styleUrl: './hom-dgl.css',
})



export class HomDgl implements OnInit {
    hom_dglFormulaText!: SafeHtml;

    constructor(
        private sanitizer: DomSanitizer,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}

	// bypassing math rendering errors
    ngOnInit() {        
        this.hom_dglFormulaText = this.sanitizer.bypassSecurityTrustHtml(`
			Die Differentialgleichung 
			$$m\\ddot{x} + b\\dot{x} + Dx = 0$$
			beschreibt die freie, gedämpfte Schwingung eines Federpendels mit der Masse $m$, 
			der Federkonstante $D$ und einem Dämpfungskoeffizienten $b$, der die Reibungskraft bestimmt.
			<br><br>
			Beim <strong>Pohlschen Resonator</strong> gilt die gleiche Form, nur in Drehbewegung:
			$$\\Theta\\ddot{\\varphi} + \\rho\\dot{\\varphi} + D^*\\varphi = 0$$
			Dabei entsprechen $\\Theta$ der Masse $m$, $\\rho$ der Dämpfungskonstante $b$ und 
			$D^*$ der Federkonstante $D$.
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