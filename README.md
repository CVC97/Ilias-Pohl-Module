# Lernmodul zum Pohlschen Resonator

Lernmodul zum Experiment "Der Pohlsche Resonator" des Grundpraktikums zur Experimentalphysik I der Georg-August Universität Göttingen.

The project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.4. with strong help of Claude AI.


## Module Structure

The directory tree is as follows:

```
src/
|   index.html                          # main .html
|   styles.css                          # main stylesheet
|   styles_glossary.css                 # stylesheet for the glossary 
|
└───app/
|   |   app.routes.ts                   # contains all the routing
|   |
|   └───core/
|   |   └───services/                   # services to provide fuctionality
|   |           theme.ts                # light / dark mode toggling
|   |           session.ts              # session ID management
|   |           analytics.ts            # page tracking
|   |           results-tracking.ts     # results tracking
|   |           data-export.ts          # data export
|   |
|   └───shared/
|   |   └───footer/                     # all footer code
|   |   └───header/                     # all header code
|   |   └───evaluation/                 # all Q+A types globally defined
|   |   |   |   styles_evaluation.css   # stylesheet for the evaluation types
|   |   |   |
|   |   |   └───single-choice/ 
|   |   |   └───multiple-choice /
|   |   |   └───multiple-choice-image/
|   |   |   └───image-choice/
|   |   |   └───drag-drop/
|   |   |
|   |   └───test/                       # test formats 
|   |   
|   └───features/
|           └───home/
|           └───glossary/
|           └───glossary_features/
|               └───
|
└───assets/                             # contains image, icons, etc.

```

### Services


### Evaluation Types


### Glossary Features


### Learning Features


### Simulation Features