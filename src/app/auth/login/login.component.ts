import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {noop, ReplaySubject} from "rxjs";
import {takeUntil, tap} from "rxjs/operators";
import {Store} from "@ngrx/store";
import {AppState} from "../../reducers";
import {login} from "../auth.actions";
import {AuthActions} from "../action-types";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit, OnDestroy {

  public form: FormGroup;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject<boolean>();

  constructor(private fb:FormBuilder,
              private auth: AuthService,
              private store: Store<AppState>,
              private router:Router) {

      this.form = fb.group({
          email: ['test@angular-university.io', [Validators.required]],
          password: ['test', [Validators.required]]
      });
  }

  ngOnInit(): void {}

  public login(): void {
    const formValue = this.form.value;
    this.auth.login(formValue.email, formValue.password)
      .pipe(
        tap(user => {
          this.store.dispatch(login({user}));
          this.router.navigateByUrl('/courses');
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe(
        noop,
        () => alert('Login Failed')
      );
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}

