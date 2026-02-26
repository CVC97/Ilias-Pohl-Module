# Lernmodul zum Pohlschen Resonator

Lernmodul zum Experiment "Der Pohlsche Resonator" des Grundpraktikums zur Experimentalphysik I der Georg-August Universität Göttingen.

The project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.4. with strong help of Claude AI.


## Project Structure Tree

The directory tree is as follows:

```

dist/                                           // compressed angular build for deployment to server

angular.json                                    // defines location of stylesheets, icons, etc.
src/
|   index.html                                  // main .html
|   styles.css                                  // main stylesheet
|   styles_glossary.css                         // stylesheet for the glossary 
|
└───app/
|   |   app.routes.ts                           // contains all the routing
|   |
|   └───core/
|   |   └───services/                           // services to provide fuctionality
|   |           theme.ts                        // light / dark mode toggling
|   |           session.ts                      // session ID management
|   |           analytics.ts                    // page tracking
|   |           results-tracking.ts             // results tracking
|   |           data-export.ts                  // data export
|   |
|   └───shared/
|   |   └───footer/                             // all footer code
|   |   └───header/                             // all header code
|   |   └───evaluation/                         // all Q+A types globally defined as features
|   |   |   |   styles_evaluation.css           // stylesheet for the evaluation types
|   |   |   |
|   |   |   └───single-choice/ 
|   |   |   └───multiple-choice /
|   |   |   └───multiple-choice-image/
|   |   |   └───image-choice/
|   |   |   └───drag-drop/
|   |   |
|   |   └───test/                               // test formats (TBD)
|   |   
|   └───features/                               // code for the individual subpages
|           └───home/                           // home page
|           └───glossary/                       // glossary overview page
|           └───glossary_features/              // contains the individual glossary entries
|           └───learning_features/              // " the " learning subpages
|           └───test_features/                  // " the " tests / decision questions
|           └───sidepath_features/              // " the " sidepath pages
|           └───target_features/                // " the " target pages
|           └───simulation_features/            // " the " simulation pages
|
└───assets/                                     // contains image, icons, etc.

```

## Project Services and Components

### Services

Project-wide services providing functionality.

- **theme.ts:** toggles light / dark mode
- **session.ts:** manages session ID pulled from ILIAS / randomly generated
- **analytics.ts:** tracks page visiting times
- **results-tracking.ts:** logs answers on each submission
- **data-export.ts:** exports page and question tracking (TBD)


### Evaluation Features

Each Q+A box type has its own modularised code provided globally, these formats do exist.

- **single-choice:** TBD
- **multiple-choice:** ordinary multiple choice box
- **multiple-choice-image:** multiple choice box regarding an image on the left
- **image-choice:** multiple choice of images (aligned in rows of three)
- **drag-drop:** TBD


### Glossary Features

The individual entries of the glossary. Either accessible via reference on the individual pages of the learning module (main purpose) or directly from the home page (possibly removed later).

- **amplitude** ("Amplitude")
- **angular-frequency** ("Kreisfrequenz")
- **angular-momentum** ("Drehmoment")
- **critical-damping** ("Aperiodischer Grenzfall")
- **damping-coefficient** ("Dämpfungskoeffizient")
- **exponential-ansatz** ("Exponentialansatz")
- **hom-dgl** ("Homogene Differentialgleichung")
- **inhom-dgl** ("Inhomogene Differentialgleichung")
- **moment-of-inertia** ("Trägheitsmoment")
- **natural-frequency** ("Eigenschwingfrequenz")
- **pring-constant** ("Federkonstante")


### Learning Features

The subpages of the learning module and the questionID of each Q+A box found in them. These subpages do contain intra-page compartimentalisation at times. 


- **intro-experiment:**


### Test Features


### Sidepath Features

### Target Features

### Simulation Features


### Tests