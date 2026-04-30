import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './shared/header/header';
import { Footer } from './shared/footer/footer';
import { Analytics } from './core/services/analytics';
import { DataExport } from './core/services/data-export';



@Component({
    selector: 'app-root',
    imports: [RouterOutlet, Header, Footer],
    templateUrl: './app.html',
    styleUrl: './app.css'
})



export class App implements OnInit {
    protected readonly title = signal('ilias-pohl-module');

    constructor(
        private _analytics: Analytics,
        private dataExport: DataExport
    ) {}

    ngOnInit() {
        this.dataExport.loadProgress();
    }
}
