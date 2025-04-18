import { Component,OnInit } from '@angular/core';
import { NgStyle } from '@angular/common';
import { Router } from '@angular/router';
import { IconDirective } from '@coreui/icons-angular';
import { FormBuilder, FormGroup, ReactiveFormsModule,Validators } from '@angular/forms';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

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

  constructor(private fb: FormBuilder, private router: Router) {
  }
  ngOnInit(): void {
    // 初始化表單
    this.initForms();
    
    // 初始化太極推拉效果
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
  
  // 初始化太極推拉效果
  initTaichiSlider(): void {
    // 等待DOM加載完成
    setTimeout(() => {
      const slider = document.getElementById('taichiSlider');
      const showRegisterBtn = document.getElementById('showRegisterBtn');
      const showLoginBtn = document.getElementById('showLoginBtn');
      
      if (slider && showRegisterBtn && showLoginBtn) {
        // 切換到註冊面板
        showRegisterBtn.addEventListener('click', () => {
          slider.style.transform = 'translateX(-50%)';
        });
        
        // 切換到登入面板
        showLoginBtn.addEventListener('click', () => {
          slider.style.transform = 'translateX(0)';
        });
      }
    }, 100);
  }
  // 登入提交
  onSubmit(): void {
    if (this.loginForm.valid) {
      // 處理登入邏輯
      console.log('登入表單提交', this.loginForm.value);
      // 這裡實現實際的登入API調用
    } else {
      this.errorMessage = '請填寫所有必填欄位';
    }
  }
  
  // 註冊提交
  onRegister(): void {
    if (this.registerForm.valid) {
      // 檢查密碼是否一致
      const password = this.registerForm.get('password')?.value;
      const confirmPassword = this.registerForm.get('confirmPassword')?.value;
      
      if (password !== confirmPassword) {
        this.regErrorMessage = '兩次輸入的密碼不一致';
        return;
      }
      
      // 處理註冊邏輯
      console.log('註冊表單提交', this.registerForm.value);
      // 這裡實現實際的註冊API調用
    } else {
      this.regErrorMessage = '請填寫所有必填欄位';
    }
  }
}
