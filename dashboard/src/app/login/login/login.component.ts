import { Component, Inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthenticationService } from "../services/authentication.service";
import { TokenStorageService } from "../../config/token-storage.service";
import { AuthenticationUser } from "../model/AuthenticationUser";
import { SESSION_STORAGE, StorageService } from "ngx-webstorage-service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  username: string | undefined;
  password: string | undefined;
  errorMessage = "Invalid Credentials";
  successMessage: string | undefined;
  invalidLogin = false;
  loginSuccess = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private tokenService: TokenStorageService,
    private formBuilder: FormBuilder,
    @Inject(SESSION_STORAGE) private sessionStorage: StorageService,
  ) {

    this.loginForm = this.formBuilder.group({
      username: new FormControl("", [Validators.required, Validators.min(5)]),
      password: new FormControl("", Validators.required)
    });
  }

  ngOnInit() {
  }

  handleLogin() {

    this.authenticationService.login(new AuthenticationUser(this.loginForm.get("username")?.value, this.loginForm.get("password")?.value))
      .subscribe({
        next: () => {
          if (this.tokenService.isLoggedIn()) {
            this.invalidLogin = false;
            this.loginSuccess = true;
            this.successMessage = "Login Successful.";
            this.sessionStorage.set("userLogin", true);
            this.router.navigateByUrl("/dashboard");
          }
        },
        error: () => {
          this.invalidLogin = true;
          this.loginSuccess = false;
          this.sessionStorage.set("userLogin", false);
        }
      });
  }
}
