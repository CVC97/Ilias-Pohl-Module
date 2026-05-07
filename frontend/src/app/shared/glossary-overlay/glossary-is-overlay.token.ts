import { InjectionToken } from '@angular/core';

// Provided as `true` inside a CDK Dialog so GlossaryBase hides the back button.
export const GLOSSARY_IS_OVERLAY = new InjectionToken<boolean>('GLOSSARY_IS_OVERLAY');
