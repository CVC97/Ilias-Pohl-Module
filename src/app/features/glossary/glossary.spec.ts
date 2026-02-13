import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Glossary } from './glossary';

describe('Glossary', () => {
  let component: Glossary;
  let fixture: ComponentFixture<Glossary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Glossary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Glossary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
