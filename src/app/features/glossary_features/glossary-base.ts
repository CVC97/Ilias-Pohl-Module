import { Directive, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';



declare global {
    interface Window {
        MathJax: any;
    }
}



@Directive()
export abstract class GlossaryBase implements OnInit, AfterViewInit {
    showBackButton = true;
    protected isBrowser: boolean;
    private mathRendered = false;


    constructor(
        @Inject(PLATFORM_ID) protected platformId: Object,
        protected route: ActivatedRoute
    ) {
        this.isBrowser = isPlatformBrowser(platformId);
    }


    ngOnInit() {
        // Check if accessed from learning module
        const fromParam = this.route.snapshot.queryParamMap.get('from');
        this.showBackButton = fromParam !== 'module';
        
        // Call child's content initialization
        this.initContent();
    }


    ngAfterViewInit() {
        // Render math after view is initialized
        if (!this.mathRendered) {
            this.renderMath();
            this.mathRendered = true;
        }
    }


    // child classes must implement this
    abstract initContent(): void;


    // math rendering (shared across all glossary pages)
    protected renderMath() {
        if (this.isBrowser) {
            setTimeout(() => {
                if (window.MathJax) {
                    // Clear previous MathJax containers
                    const mjxContainers = document.querySelectorAll('mjx-container');
                    mjxContainers.forEach(container => {
                        if (container.children.length > 0) {
                            container.remove();
                        }
                    });
                    
                    window.MathJax.typesetPromise();
                }
            }, 100);
        }
    }
}