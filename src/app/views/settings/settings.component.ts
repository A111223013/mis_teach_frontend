import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
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
import { cilUser, cilCalendar, cilSchool, cilCommentBubble, cilTag, cilImage } from '@coreui/icons';

interface UserProfile {
  name: string;
  email: string;
  birthday: string;
  school: string;
  lineId: string;
  avatar: string;
  learningGoals: string[];
}

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
  isSaving = false;
  saveMessage = '';

  constructor(
    private iconSetService: IconSetService,
    private http: HttpClient
  ) {
    iconSetService.icons = { 
      cilUser, cilCalendar, cilSchool, cilCommentBubble, cilTag, cilImage 
    };
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    // 從 API 載入用戶資料
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('未找到 token');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.post<any>('http://localhost:5000/dashboard/get-user-info', {}, { headers })
      .subscribe({
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
    if (this.newGoal.trim()) {
      this.userProfile.learningGoals.push(this.newGoal.trim());
      this.newGoal = '';
    }
  }

  removeLearningGoal(index: number): void {
    this.userProfile.learningGoals.splice(index, 1);
  }

  onAvatarChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.userProfile.avatar = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  saveProfile(): void {
    this.isSaving = true;
    this.saveMessage = '';

    const token = localStorage.getItem('token');
    if (!token) {
      this.saveMessage = '未找到登入憑證';
      this.isSaving = false;
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    // 準備要更新的資料（排除 email）
    const updateData = {
      name: this.userProfile.name,
      birthday: this.userProfile.birthday,
      school: this.userProfile.school,
      lineId: this.userProfile.lineId,
      avatar: this.userProfile.avatar,
      learningGoals: this.userProfile.learningGoals
    };

    this.http.post<any>('http://localhost:5000/dashboard/update-user-info', updateData, { headers })
      .subscribe({
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
