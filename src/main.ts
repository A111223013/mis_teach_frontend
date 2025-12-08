import { bootstrapApplication } from '@angular/platform-browser';
import 'zone.js';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { ngrokInterceptor } from './app/interceptor/ngrok.interceptor';
import { IconSetService, IconModule } from '@coreui/icons-angular';
import { MarkdownModule } from 'ngx-markdown';
import {
  cilBook,
  cilClipboard,
  cilThumbUp,
  cilMinus,
  cilThumbDown,
  cilLightbulb,
  cilList,
  cilChart,
  cilCheck,
  cilCheckCircle,
  cilPuzzle,
  cilSpeech,
  cilInfo,
  cilSend,
  cilNotes,
  cilPencil,
  cilLibrary,
  cilPlus,
  cilMenu,
  cilTrash,
  cilCloud,
  cilCog,
  cilSpeedometer,
  cilPeople,
  cilChartPie,
  cilBrush,
  cilAccountLogout,
  cilBookmark,
  cilStar,
  cilMap,
  cilCalendar,
  cilEducation,
  cilArrowRight,
  cilReload,
  cilNewspaper,
  cilQrCode,
  cilTag,
  cilImage,
  cilSchool,
  cilSettings,
  cilMediaPlay,
  cilUser,
  cilClock,
  cilBell,
  cilX,
  cilTask,
  cilWarning,
  cilCommentBubble,
  cilChevronLeft,
  cilChevronRight
} from '@coreui/icons';
import { register as registerSwiperElements } from 'swiper/element/bundle';

registerSwiperElements();

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([ngrokInterceptor])),
    importProvidersFrom(BrowserAnimationsModule, MarkdownModule.forRoot()),
    {
      provide: IconSetService,
      useFactory: () => {
        const iconSetService = new IconSetService();
        iconSetService.icons = {
          cilBook,
          cilClipboard,
          cilThumbUp,
          cilMinus,
          cilThumbDown,
          cilLightbulb,
          cilList,
          cilChart,
          cilCheck,
          cilCheckCircle,
          cilPuzzle,
          cilSpeech,
          cilInfo,
          cilSend,
          cilNotes,
          cilPencil,
          cilLibrary,
          cilPlus,
          cilMenu,
          cilTrash,
          cilCloud,
          cilCog,
          cilSpeedometer,
          cilPeople,
          cilChartPie,
          cilBrush,
          cilAccountLogout,
          cilBookmark,
          cilStar,
          cilMap,
          cilCalendar,
          cilEducation,
          cilArrowRight,
          cilReload,
          cilNewspaper,
          cilQrCode,
          cilTag,
          cilImage,
          cilSchool,
          cilSettings,
          cilMediaPlay,
          cilUser,
          cilClock,
          cilBell,
          cilX,
          cilTask,
          cilWarning,
          cilCommentBubble,
          cilChevronLeft,
          cilChevronRight
        };
        return iconSetService;
      }
    }
  ]
});