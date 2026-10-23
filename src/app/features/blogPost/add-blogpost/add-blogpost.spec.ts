import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideMarkdown } from 'ngx-markdown';

import { AddBlogpost } from './add-blogpost';

describe('AddBlogpost', () => {
  let component: AddBlogpost;
  let fixture: ComponentFixture<AddBlogpost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBlogpost],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideRouter([]),
        provideMarkdown(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddBlogpost);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
