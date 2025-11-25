import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostForum } from './post-forum';

describe('PostForum', () => {
  let component: PostForum;
  let fixture: ComponentFixture<PostForum>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostForum]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostForum);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
