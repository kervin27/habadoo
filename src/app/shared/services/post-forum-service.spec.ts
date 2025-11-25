import { TestBed } from '@angular/core/testing';

import { PostForumService } from './post-forum-service';

describe('PostForumService', () => {
  let service: PostForumService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostForumService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
