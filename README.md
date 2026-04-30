# Lernmodul zum Pohlschen Resonator

Lernmodul zum Experiment "Der Pohlsche Resonator" des Grundpraktikums zur Experimentalphysik I der Georg-August Universität Göttingen.

The project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.4. with strong help of Claude (Sonnet 4.5 / 4.6).


## Project Structure Tree

```
ilias_bridge.html                               // entry point served from ILIAS; username form + redirect
docker-compose.yml                              // local MySQL container (dev only)
.gitignore
README.md
│
├── frontend/                                   // Angular application
│   │   angular.json                            // defines location of stylesheets, icons, etc.
│   │   proxy.conf.json                         // dev proxy: /api → localhost:3000
│   │
│   └── src/
│       │   index.html                          // main .html
│       │   styles.css                          // main stylesheet
│       │   styles_glossary.css                 // stylesheet for the glossary
│       │   styles_evaluation.css               // stylesheet for the evaluation types
│       │   styles_test.css                     // stylesheet for the test evaluations
│       │
│       └── assets/                             // images, icons, etc.
│       │
│       └── app/
│           │   app.html                        // general page structure
│           │   app.routes.ts                   // contains all the routing
│           │
│           └── core/
│           │   └── services/                   // project-wide services
│           │           theme.ts                // light / dark mode toggling
│           │           session.ts              // session ID management + rogue user detection
│           │           analytics.ts            // page visit tracking
│           │           results-tracking.ts     // learning module answer logging
│           │           test-tracking.ts        // test answer logging (single-submission)
│           │           data-export.ts          // aggregates all tracking; saves to backend
│           │
│           └── shared/
│           │   └── footer/                     // footer component
│           │   └── header/                     // header component
│           │   │
│           │   └── evaluation/                 // Q+A types for learning pages (retryable)
│           │   │   └── single-choice/
│           │   │   └── multiple-choice/
│           │   │   └── multiple-choice-image/
│           │   │   └── image-choice/
│           │   │   └── drag-and-drop/
│           │   │
│           │   └── test/                       // Q+A types for test pages (single-submission)
│           │       └── order-images/
│           │       └── single-choice/
│           │       └── multiple-choice/
│           │       └── drag-and-drop/
│           │       └── end-page/               // results display; triggers progress save
│           │
│           └── features/                       // individual pages
│               └── home/
│               └── glossary/
│               └── glossary_features/          // individual glossary entries
│               │   │   glossary-base.ts
│               │   └── amplitude/
│               │   └── ...
│               │
│               └── learning_features/
│               └── test_features/
│               └── sidepath_features/
│               └── target_features/
│               └── simulation_features/
│
└── backend/                                    // Express API + MySQL integration
        server.js                               // Express entry point (port 3000)
        db.js                                   // MySQL connection pool
        schema.sql                              // database schema (run once to initialise)
        package.json
        .env                                    // DB credentials (gitignored)
        .env.example                            // template for .env
        │
        └── routes/
                users.js                        // POST /api/users/check, POST /api/users/create
                progress.js                     // POST /api/progress/save, GET /api/progress/:username
```


## Running Locally

Three processes must be running simultaneously:

**1. Database (Docker):**
```bash
sudo docker compose up
```

**2. Backend:**
```bash
cd backend && node server.js
```

**3. Frontend:**
```bash
cd frontend && npx ng serve
```

Then open **`http://localhost:3000/bridge`** to enter the module via the bridge page.
The Angular app is accessible directly at **`http://localhost:4200`** (rogue user session, no DB writes).


## Backend API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/check` | Check if a username exists; returns user data if found |
| POST | `/api/users/create` | Register a new user |
| POST | `/api/progress/save` | Save analytics, module results, and test results for a user |
| GET | `/api/progress/:username` | Load all saved progress for a user |


## Database Schema

| Table | Purpose |
|-------|---------|
| `users` | One row per registered username |
| `page_visits` | Page visit durations per session |
| `module_results` | Learning module question answers (retryable) |
| `test_results` | Test question answers (single-submission) |

Initialise with:
```bash
docker exec -i ilias_pohl_db mysql -u pohl_user -ppohl_password ilias_pohl < backend/schema.sql
```


## Project Services

### Frontend Services

- **theme.ts:** toggles light / dark mode
- **session.ts:** reads `session_id` from URL (set by bridge page), falls back to generating a `rogue_user_` identifier for direct access; exposes `isRogueUser()`
- **analytics.ts:** tracks page visit durations on route changes
- **results-tracking.ts:** logs learning question answers; allows retries, increments `attemptCount`
- **test-tracking.ts:** logs test question answers; blocks re-submission of the same question
- **data-export.ts:** aggregates all three tracking services; calls `saveProgress()` on test completion and on `beforeunload`; silently skips rogue users


### Evaluation Formats (Learning Pages)

- **single-choice:** single correct answer
- **multiple-choice:** multiple correct answers
- **multiple-choice-image:** multiple choice with a reference image
- **image-choice:** choose between images arranged in a grid
- **drag-and-drop:** match items by dragging

### Test Formats

- **order-images:** sort images by dragging them up / down
- **single-choice:** single correct answer
- **multiple-choice:** multiple correct answers
- **drag-and-drop:** assign answers to images


## Features

### Glossary Features

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
- **spring-constant** ("Federkonstante")


### Learning Features

- **intro-experiment:**
    - *intro-exp-1-schwungrad*
    - *intro-exp-2-feder*
    - *intro-exp-3-wirbelstrombremse*
    - *intro-exp-4-direktionsmoment*
    - *intro-exp-5-winkel-drehmoment*
    - *intro-exp-6-winkel-zeit*


### Test Features

- **damped-oscillations:**
    - *damped-osc-1-daempfungsstaerke*
    - *damped-osc-2-federkonstante*
    - *damped-osc-3-frequency-damping*
    - *damped-osc-4-log-decrement*
    - *damped-osc-5-phase-space*


### Sidepath Features

### Target Features

- **simulation:**
- **chaos:**
- **common-free:**
- **common-technical:**
- **setup-free:**
- **setup-concrete:**
- **evaluation-comparison:**


### Simulation Features

- **undamped-oscillations-theory:**
- **damped-oscillations-theory:**
- **driven-oscillations-theory:**
- **expanded-driven-oscillations-theory:**
- **undamped-oscillations-experiment:**
- **damped-oscillations-experiment:**
- **driven-oscillations-experiment:**
- **expanded-driven-oscillations-experiment:**
