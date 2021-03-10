import { MediaMatcher } from '@angular/cdk/layout';
import {ChangeDetectorRef,Component,OnInit, OnDestroy} from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {


  menuClick: number = 0;
  mobileQuery: MediaQueryList;
  isShowing: boolean = false;

  fillerNav = ['Home','Profilo','Contatti']/* Array.from({length: 50}, (_, i) => `Nav Item ${i + 1}`); */

  fillerContent = Array.from({length: 5}, () =>
      `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
       labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
       `);

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
  }


  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  toggleNavbar() {
    this.isShowing = !this.isShowing
    if(this.isShowing)
      this.menuClick++;
  }
}
