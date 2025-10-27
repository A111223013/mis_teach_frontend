import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {
  ModalModule,
  ButtonModule,
  CardModule,
  RowComponent,
  ColComponent,
  FormModule,
  AlertModule
} from '@coreui/angular';
import { IconDirective, IconModule, IconSetService } from '@coreui/icons-angular';
import { cilUser, cilCalendar, cilSchool, cilCommentBubble, cilTag, cilImage, cilCog, cilQrCode, cilCheckCircle, cilPlus, cilX, cilReload } from '@coreui/icons';
import { SettingsService, UserProfile } from '../../service/settings.service';

// UserProfile 介面已從 service 導入

@Component({
  selector: 'app-settings',
  standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        ModalModule,
        ButtonModule,
        CardModule,
        RowComponent,
        ColComponent,
        FormModule,
        AlertModule,
        IconModule,
        IconDirective
    ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  userProfile: UserProfile = {
    name: '',
    email: '',
    birthday: '',
    school: '',
    lineId: '',
    avatar: '',
    learningGoals: []
  };

  newGoal: string = '';
  availableSchools = [
    '國立台灣大學',
    '國立清華大學',
    '國立交通大學',
    '國立成功大學',
    '國立政治大學',
    '國立中央大學',
    '國立中山大學',
    '國立中興大學',
    '國立陽明交通大學',
    '其他'
  ];

  showModal = false;
  showQRCode = false;
  isSaving = false;
  saveMessage = '';
  avatarError = '';
  bindingStatus = '';
  qrCodeGenerated = false;
  currentBindingToken = '';

  constructor(
    private iconSetService: IconSetService,
    private settingsService: SettingsService
  ) {
    const existingIcons = iconSetService.icons || {};
    iconSetService.icons = {
      ...existingIcons,
      ...{ cilUser, cilCalendar, cilSchool, cilCommentBubble, cilTag, cilImage, cilCog, cilQrCode, cilCheckCircle, cilPlus, cilX, cilReload }
    };
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.settingsService.getUserProfile().subscribe({
      next: (response) => {
        if (response.user) {
          this.userProfile = response.user;
          // 更新 token
          if (response.token) {
            localStorage.setItem('token', response.token);
          }
        }
      },
      error: (error) => {
        console.error('載入用戶資料失敗:', error);
        // 如果 API 失敗，使用預設資料
        this.userProfile = {
          name: '使用者',
          email: '',
          birthday: '',
          school: '',
          lineId: '',
          avatar: '',
          learningGoals: []
        };
      }
    });
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.saveMessage = '';
  }

  addLearningGoal(): void {
    if (this.newGoal.trim() && this.userProfile.learningGoals.length < 10) {
      this.userProfile.learningGoals.push(this.newGoal.trim());
      this.newGoal = '';
    }
  }

  removeLearningGoal(index: number): void {
    this.userProfile.learningGoals.splice(index, 1);
  }

  onAvatarChange(event: any): void {
    this.avatarError = '';
    const file = event.target.files[0];
    
    if (!file) {
      return;
    }
    
    // 檢查檔案類型
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      this.avatarError = '請選擇 JPG、PNG 或 GIF 格式的圖片';
      return;
    }
    
    // 檢查檔案大小 (2MB = 2 * 1024 * 1024 bytes)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      this.avatarError = '檔案大小不能超過 2MB';
      return;
    }
    
    // 讀取檔案並轉換為 base64
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.userProfile.avatar = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  startLineBinding(): void {
    this.showQRCode = true;
    this.bindingStatus = '正在生成 QR Code...';
    this.generateQRCode();
  }

  generateQRCode(): void {
    // 生成唯一的綁定 token
    const bindingToken = this.generateBindingToken();
    this.currentBindingToken = bindingToken; // 保存綁定碼供顯示
    
    this.settingsService.generateLineQR(bindingToken).subscribe({
      next: (response) => {
        if (response.qrCodeUrl) {
          this.displayQRCode(response.qrCodeUrl);
          this.bindingStatus = '請使用 Line 掃描上方 QR Code 完成綁定';
          this.startBindingPolling(bindingToken);
        } else {
          this.bindingStatus = '生成 QR Code 失敗，請重試';
        }
      },
      error: (error) => {
        console.error('生成 QR Code 失敗:', error);
        this.bindingStatus = '生成 QR Code 失敗，請重試';
      }
    });
  }

  displayQRCode(qrCodeUrl: string): void {
    // 清空之前的 QR Code
    const qrContainer = document.getElementById('qrcode');
    if (qrContainer) {
      qrContainer.innerHTML = '';
      
      // 創建 QR Code 圖片
      const img = document.createElement('img');
      img.src = qrCodeUrl;
      img.alt = 'Line Bot 綁定 QR Code';
      img.style.maxWidth = '200px';
      img.style.height = 'auto';
      img.className = 'img-fluid';
      qrContainer.appendChild(img);
    }
    this.qrCodeGenerated = true;
  }

  generateBindingToken(): string {
    // 生成唯一的綁定 token
    return 'bind_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  copyBindingToken(): void {
    if (this.currentBindingToken) {
      navigator.clipboard.writeText(this.currentBindingToken).then(() => {
        // 可以添加一個短暫的提示
        const originalText = this.bindingStatus;
        this.bindingStatus = '綁定碼已複製到剪貼簿！';
        setTimeout(() => {
          this.bindingStatus = originalText;
        }, 2000);
      }).catch(err => {
        console.error('複製失敗:', err);
        // 降級方案：選擇文字
        const input = document.querySelector('input[readonly]') as HTMLInputElement;
        if (input) {
          input.select();
          document.execCommand('copy');
        }
      });
    }
  }

  startBindingPolling(bindingToken: string): void {
    // 每 3 秒檢查一次綁定狀態，最多檢查 60 次（3分鐘）
    let pollCount = 0;
    const maxPolls = 60; // 3分鐘 = 60次 * 3秒
    
    const pollInterval = setInterval(() => {
      pollCount++;
      
      if (pollCount > maxPolls) {
        console.log('綁定檢查超時，停止輪詢');
        clearInterval(pollInterval);
        this.bindingStatus = '綁定超時，請重新生成 QR Code';
        this.showQRCode = false;
        return;
      }
      
      this.checkBindingStatus(bindingToken, pollInterval);
    }, 3000);
  }

  checkBindingStatus(bindingToken: string, pollInterval: any): void {
    this.settingsService.checkLineBinding(bindingToken).subscribe({
      next: (response) => {
        if (response.bound === true) {
          clearInterval(pollInterval);
          this.userProfile.lineId = response.lineId || '已綁定';
          this.showQRCode = false;
          this.bindingStatus = '';
          this.saveMessage = 'Line Bot 綁定成功！';
          // 自動儲存設定
          this.saveProfile();
        } else {
          console.log('尚未綁定，繼續輪詢...');
        }
      },
      error: (error) => {
        console.error('檢查綁定狀態失敗:', error);
        // 發生錯誤時也停止輪詢，避免無限重試
        clearInterval(pollInterval);
        this.bindingStatus = '檢查綁定狀態時發生錯誤';
      }
    });
  }

  refreshQRCode(): void {
    this.bindingStatus = '正在重新生成 QR Code...';
    this.qrCodeGenerated = false;
    
    // 清空 QR Code 容器
    const qrContainer = document.getElementById('qrcode');
    if (qrContainer) {
      qrContainer.innerHTML = '';
    }
    
    this.generateQRCode();
  }

  cancelLineBinding(): void {
    this.showQRCode = false;
    this.bindingStatus = '';
    this.qrCodeGenerated = false;
    
    // 清空 QR Code 容器
    const qrContainer = document.getElementById('qrcode');
    if (qrContainer) {
      qrContainer.innerHTML = '';
    }
  }

  unbindLine(): void {
    if (confirm('確定要解除 Line 綁定嗎？')) {
      this.userProfile.lineId = '';
      this.saveMessage = 'Line 綁定已解除';
    }
  }

  saveProfile(): void {
    this.isSaving = true;
    this.saveMessage = '';
    this.avatarError = '';

    // 準備要更新的資料（排除 email）
    const updateData = {
      name: this.userProfile.name,
      birthday: this.userProfile.birthday,
      school: this.userProfile.school,
      lineId: this.userProfile.lineId,
      avatar: this.userProfile.avatar,
      learningGoals: this.userProfile.learningGoals
    };

    this.settingsService.updateUserProfile(updateData).subscribe({
      next: (response) => {
        this.saveMessage = '設定已成功儲存！';
        // 更新 token
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        setTimeout(() => {
          this.closeModal();
          this.isSaving = false;
        }, 1500);
      },
      error: (error) => {
        console.error('儲存用戶資料失敗:', error);
        this.saveMessage = '儲存失敗，請重試';
        this.isSaving = false;
      }
    });
  }
}
