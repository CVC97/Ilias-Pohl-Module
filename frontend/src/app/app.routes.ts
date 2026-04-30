import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Glossary } from './features/glossary/glossary';

// glossary features
import { Amplitude } from './features/glossary_features/amplitude/amplitude';
import { CriticalDamping } from './features/glossary_features/critical-damping/critical-damping';
import { DampingCoefficient } from './features/glossary_features/damping-coefficient/damping-coefficient';
import { AngularMomentum } from './features/glossary_features/angular-momentum/angular-momentum';
import { NaturalFrequency } from './features/glossary_features/natural-frequency/natural-frequency';
import { ExponentialAnsatz } from './features/glossary_features/exponential-ansatz/exponential-ansatz';
import { SpringConstant } from './features/glossary_features/spring-constant/spring-constant';
import { HomDgl } from './features/glossary_features/hom-dgl/hom-dgl';
import { InhomDgl } from './features/glossary_features/inhom-dgl/inhom-dgl';
import { AngularFrequency } from './features/glossary_features/angular-frequency/angular-frequency';
import { MomentOfInertia } from './features/glossary_features/moment-of-inertia/moment-of-inertia';

// learning features
import { IntroExperiment } from './features/learning_features/intro-experiment/intro-experiment';

// test features
import { TestDampedOscillations } from './features/test_features/damped-oscillations/damped-oscillations';

// simulation features
import { SimDampedOscillationsExperiment } from './features/simulation_features/damped-oscillations-experiment/damped-oscillations-experiment';



export const routes: Routes = [
    { path: '', component: Home , title: 'Pohlsches Rad'},
    { path: 'glossary', component: Glossary , title: 'Pohlsches Rad - Begriffe'},

    { path: 'glossary/amplitude', component: Amplitude, title: 'Amplitude'},
	{ path: 'glossary/critical-damping', component: CriticalDamping, title: 'Aperiodischer Grenzfall'},
	{ path: 'glossary/damping-coefficient', component: DampingCoefficient, title: 'Dämpungskoeffizient'},
	{ path: 'glossary/angular-momentum', component: AngularMomentum, title: 'Drehmoment'},
	{ path: 'glossary/natural-frequency', component: NaturalFrequency, title: 'Eigenschwingfrequenz'},
	{ path: 'glossary/exponential-ansatz', component: ExponentialAnsatz, title: 'Exponentialansatz'},
	{ path: 'glossary/spring-constant', component: SpringConstant, title: 'Federkonstante'},
	{ path: 'glossary/hom-dgl', component: HomDgl, title: 'Homogene DGL'},
	{ path: 'glossary/inhom-dgl', component: InhomDgl, title: 'Inhomogene DGL'},
	{ path: 'glossary/angular-frequency', component: AngularFrequency, title: 'Kreisfrequenz'},
	{ path: 'glossary/moment-of-inertia', component: MomentOfInertia, title: 'Trägheitsmoment'},

	{ path: 'learning/intro-experiment', component: IntroExperiment, title: 'Einstieg Versuchsaufbau'},

	{ path: 'test/damped-oscillations', component: TestDampedOscillations, title: 'Test: Gedämpfte Schwingungen'},

	{ path: 'simulation/damped-oscillations-experiment', component: SimDampedOscillationsExperiment, title: 'Simulation: Gedämpfte Schwingungen'},
]