import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Glossary } from './features/glossary/glossary';

export const routes: Routes = [
	{ path: '', component: Home },
	{ path: 'glossary', component: Glossary }
];