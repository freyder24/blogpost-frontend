import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideMarkdown } from 'ngx-markdown';

import { EditBlogpost } from './edit-blogpost';

describe('EditBlogpost', () => {
  let component: EditBlogpost;
  let fixture: ComponentFixture<EditBlogpost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditBlogpost],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideRouter([]),
        provideMarkdown(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditBlogpost);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
