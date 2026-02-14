import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './shared/header/header';
import { Footer } from './shared/footer/footer';
import { Analytics } from './core/services/analytics';



@Component({
    selector: 'app-root',
    imports: [RouterOutlet, Header, Footer],
    templateUrl: './app.html',
    styleUrl: './app.css'
})



export class App {
    protected readonly title = signal('ilias-pohl-module');

    constructor(private analytics: Analytics) {
        // Service is initialized automatically
    }
}