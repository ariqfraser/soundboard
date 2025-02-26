import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplorerItemComponent } from './explorer-item.component';

describe('ExplorerItemComponent', () => {
  let component: ExplorerItemComponent;
  let fixture: ComponentFixture<ExplorerItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExplorerItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExplorerItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
