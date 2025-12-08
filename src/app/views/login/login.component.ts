import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContainerComponent, RowComponent, ColComponent, CardComponent, CardBodyComponent, InputGroupComponent, InputGroupTextDirective, ButtonDirective } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoginService } from '../../service/login.service';
import { DetailedGuideService } from '../../service/detailed-guide.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [ContainerComponent, RowComponent, ColComponent, CardComponent, CardBodyComponent, InputGroupComponent, InputGroupTextDirective, IconDirective, ButtonDirective,
      RouterModule, ReactiveFormsModule, CommonModule
  ]
})
export class LoginComponent implements OnInit {
  loginForm!:  FormGroup;
  registerForm!: FormGroup;
  errorMessage: string = '';
  regErrorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private detailedGuideService: DetailedGuideService,
    private authService: AuthService
  ) { }
  
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
    if (this.loginForm.value) {
      this.loginService.loginUser(this.loginForm.value).subscribe(
        response => {
          this.errorMessage = '';
          
          // 使用AuthService設置token
          if (response.token) {
            this.authService.setToken(response.token);
          }

          // 檢查 MongoDB 中的 new_user 狀態
          if (response.new_user === true) {
            // 更新本地導覽狀態
            const guideStatus = {
              user_id: 'current_user',
              new_user: response.new_user,
              guide_completed: response.guide_completed,
              last_login: new Date().toISOString()
            };
            this.detailedGuideService.updateLocalStatus(guideStatus);

            // 先導航到 dashboard
            this.router.navigate(['/dashboard']).then(() => {
              // [已註解] 網站導覽功能暫時停用
              // 延遲觸發導覽，確保頁面完全載入
              setTimeout(() => {
                this.showWelcomeMessage();
                // setTimeout(() => {
                //   this.detailedGuideService.startDetailedGuide();
                // }, 3500);
              }, 1000);
            });
          } else {
            // 普通用戶直接導航
            this.router.navigate(['/dashboard']);
          }
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
    if (this.registerForm.value ) {
      const password = this.registerForm.get('password')?.value;
      const confirmPassword = this.registerForm.get('confirmPassword')?.value;
      if (password !== confirmPassword) {
        this.regErrorMessage = '兩次輸入的密碼不一致';
        return;
      }
      this.loginService.registerUser(this.registerForm.value).subscribe(
        response => {
          this.regErrorMessage = '';
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

  /**
   * 顯示歡迎訊息
   */
  private showWelcomeMessage(): void {
    const welcomeElement = document.createElement('div');
    welcomeElement.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #28a745, #20c997);
      color: white;
      padding: 30px 40px;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      z-index: 10004;
      text-align: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      animation: welcomeFadeIn 0.5s ease-out;
      max-width: 400px;
    `;

    welcomeElement.innerHTML = `
      <div style="font-size: 24px; font-weight: 600; margin-bottom: 12px;">
        🎉 歡迎來到 MIS 教學系統！
      </div>
      <div style="font-size: 16px; opacity: 0.9; margin-bottom: 20px;">
        我是您的專屬導覽助手，將為您介紹系統的各項功能
      </div>
      <div style="font-size: 14px; opacity: 0.8;">
        導覽將在 3 秒後自動開始...
      </div>
    `;

    // 添加動畫樣式
    const style = document.createElement('style');
    style.textContent = `
      @keyframes welcomeFadeIn {
        from {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.8);
        }
        to {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(welcomeElement);

    // 3 秒後移除歡迎訊息
    setTimeout(() => {
      welcomeElement.remove();
      style.remove();
    }, 3000);
  }
}

