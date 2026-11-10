import { TestBed, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';
import { MediaMatcher } from '@angular/cdk/layout';
import { HomeComponent } from './home.component';
import { configureTestBed } from 'src/testing/test-setup';

function mediaMatcher(matches: boolean) {
  return { matchMedia: () => ({ matches }) as MediaQueryList };
}

describe('HomeComponent', () => {
  function setup(mobile: boolean) {
    TestBed.overrideProvider(MediaMatcher, { useValue: mediaMatcher(mobile) });
    const fixture = TestBed.createComponent(HomeComponent);
    return { fixture, component: fixture.componentInstance };
  }

  beforeEach(() => configureTestBed({ declarations: [HomeComponent] }));

  it('should create', () => {
    const { fixture, component } = setup(false);
    fixture.detectChanges();
    expect(component).toBeTruthy();
    fixture.destroy();
  });

  it('starts exactly one clock timer on desktop and clears it on destroy', fakeAsync(() => {
    const setSpy = spyOn(window, 'setInterval').and.callThrough();
    const clearSpy = spyOn(window, 'clearInterval').and.callThrough();
    const { fixture, component } = setup(false);
    fixture.detectChanges();
    tick(5000);
    expect(setSpy).toHaveBeenCalledTimes(1);
    expect(component.clockText).toContain('2/02/2026 - ');
    fixture.destroy();
    expect(clearSpy).toHaveBeenCalled();
    discardPeriodicTasks();
  }));

  it('does not start a timer on mobile', fakeAsync(() => {
    const setSpy = spyOn(window, 'setInterval').and.callThrough();
    const { fixture } = setup(true);
    fixture.detectChanges();
    tick(3000);
    expect(setSpy).not.toHaveBeenCalled();
    fixture.destroy();
  }));
});
