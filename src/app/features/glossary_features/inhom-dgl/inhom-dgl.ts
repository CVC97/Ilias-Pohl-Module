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
    selector: 'app-inhom-dgl',
    standalone: true,
    imports: [RouterLink],
	templateUrl: './inhom-dgl.html',
	styleUrl: './inhom-dgl.css',
})



export class InhomDgl implements OnInit {
    inhom_dglFormulaText!: SafeHtml;

    constructor(
        private sanitizer: DomSanitizer,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}

	// bypassing math rendering errors
    ngOnInit() {        
        this.inhom_dglFormulaText = this.sanitizer.bypassSecurityTrustHtml(`
			Allgemein gilt:
			$$m\\ddot{x} + b\\dot{x} + kx = F(t)$$
			Beim Pohlschen Rad ergibt sich dies zu:
			$$\\Theta\\ddot{\\varphi} + \\rho\\dot{\\varphi} + D^*\\varphi = M_0\\cos(\\omega t)$$
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