import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPostForum } from './form-post-forum';

describe('FormPostForum', () => {
  let component: FormPostForum;
  let fixture: ComponentFixture<FormPostForum>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormPostForum]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormPostForum);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
