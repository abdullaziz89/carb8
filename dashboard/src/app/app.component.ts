import { ChangeDetectorRef, Component, Inject, OnDestroy, ViewChild } from "@angular/core";
import { MediaMatcher } from "@angular/cdk/layout";
import { MatSidenav } from "@angular/material/sidenav";
import { LOCAL_STORAGE, SESSION_STORAGE, StorageService } from "ngx-webstorage-service";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { TokenStorageService } from "./config/token-storage.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnDestroy {

  @ViewChild("sidenav") sidenav!: MatSidenav;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  isUserLogin: boolean = false;
  private _isFinish: boolean = false;
  screenHeight: number = window.innerHeight - window.innerHeight * 0.2;
  currentYear = (new Date()).getFullYear();

  title = "Kuwait Food Truck - Dashboard";

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    @Inject(SESSION_STORAGE) private sessionStorage: StorageService,
    @Inject(LOCAL_STORAGE) private localStorage: StorageService,
    private tokenStorage: TokenStorageService,
    private router: Router,
  ) {

    this.mobileQuery = media.matchMedia("(max-width: 960px)");
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener("", this._mobileQueryListener);

    router.events.subscribe((val) => {
      // see also
      if (val instanceof NavigationEnd) {
        this.isUserLogin = !!this.sessionStorage.get("userLogin");
      }
    });
  }

  get isFinish(): boolean {
    return this._isFinish;
  }

  set isFinish(value: boolean) {
    this._isFinish = value;
  }

  openLogin() {
    this.router.navigate(["/login"]);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener("", this._mobileQueryListener);
  }

  closeMenu() {
    if (this.mobileQuery.matches) {
      this.sidenav.toggle();
    }
  }

  logout() {
    this.sessionStorage.set("userLogin", false);
    this.sessionStorage.set("auth-token", "");
    this.router.navigate(["/login"]);
  }

  goTo(path: string) {
    this.router.navigate([path]);
  }

  userIsSuper() {
    return this.tokenStorage.getUserRoles().includes("SUPER_ADMIN");
  }
}
