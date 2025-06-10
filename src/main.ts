import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { IconSetService } from '@coreui/icons-angular';
import {
  cilBook,
  cilClipboard,
  cilThumbUp,
  cilMinus,
  cilThumbDown,
  cilLightbulb,
  cilList,
  cilChart,
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
  cilReload
} from '@coreui/icons';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule, BrowserAnimationsModule),
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
          cilReload
        };
        return iconSetService;
      }
    }
  ]
});