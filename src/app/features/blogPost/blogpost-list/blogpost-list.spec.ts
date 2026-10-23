import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BlogpostList } from './blogpost-list';

describe('BlogpostList', () => {
  let component: BlogpostList;
  let fixture: ComponentFixture<BlogpostList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogpostList],
      providers: [provideZonelessChangeDetection(), provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogpostList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
