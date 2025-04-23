import { Component,OnInit } from '@angular/core';
import { NgStyle } from '@angular/common';
import { Router } from '@angular/router';
import { IconDirective } from '@coreui/icons-angular';
import { FormBuilder, FormGroup, ReactiveFormsModule,Validators } from '@angular/forms';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../service/login.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle,
      RouterModule, ReactiveFormsModule, CommonModule
    ]
})
export class LoginComponent implements OnInit {
  loginForm!:  FormGroup;
  registerForm!: FormGroup;
  errorMessage: string = '';
  regErrorMessage: string = '';

  constructor(private fb: FormBuilder, private router: Router, private loginService: LoginService) { }
  
  ngOnInit(): void {
    this.initForms();
    this.initTaichiSlider();
  }
  initForms(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }
  
  initTaichiSlider(): void {
    setTimeout(() => {
      const slider = document.getElementById('taichiSlider');
      const showRegisterBtn = document.getElementById('showRegisterBtn');
      const showLoginBtn = document.getElementById('showLoginBtn');
      
      if (slider && showRegisterBtn && showLoginBtn) {
        showRegisterBtn.addEventListener('click', () => {
          slider.style.transform = 'translateX(-50%)';
        });
        showLoginBtn.addEventListener('click', () => {
          slider.style.transform = 'translateX(0)';
        });
      }
    }, 100);
  }
  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('登入表單提交', this.loginForm.value);
      this.loginService.loginUser(this.loginForm.value).subscribe(
        response => {
          this.errorMessage = '';
          console.log('登入成功', response);
          //this.router.navigate(['/dashboard']);
        },
        error => {
          console.error('登入失敗', error);
          this.errorMessage = '登入失敗，請檢查您的帳號和密碼';
        }
      );
    } else {
      this.errorMessage = '請填寫所有必填欄位';
    }
  }
  
  onRegister(): void {
    if (this.registerForm.valid) {
      const password = this.registerForm.get('password')?.value;
      const confirmPassword = this.registerForm.get('confirmPassword')?.value;
      if (password !== confirmPassword) {
        this.regErrorMessage = '兩次輸入的密碼不一致';
        return;
      }
      this.loginService.registerUser(this.registerForm.value).subscribe(
        response => {
          this.regErrorMessage = '';
          console.log('註冊表單提交', this.registerForm.value);
        },
        error => {
          console.error('註冊失敗', error);
          this.regErrorMessage = '註冊失敗，請稍後再試';
        }
      );
    } else {
      this.regErrorMessage = '請填寫所有必填欄位';
    }
  }
}

