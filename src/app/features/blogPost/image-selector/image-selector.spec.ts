import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageSelector } from './image-selector';

describe('ImageSelector', () => {
  let component: ImageSelector;
  let fixture: ComponentFixture<ImageSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageSelector],
      providers: [provideZonelessChangeDetection(), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageSelector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
