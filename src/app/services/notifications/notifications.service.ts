import { Injectable } from '@angular/core';
import { HeadlessService } from '@novu/headless';
import { FetchResult } from '@novu/headless/dist/lib/types';
import { ISession } from '@novu/headless/dist/utils/types';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  headlessService = new HeadlessService({
    applicationIdentifier: environment.novuAppId,
    subscriberId: this.userService.get().id,
    backendUrl: environment.novuBackendUrl,
    // socketUrl: environment.novuSocketUrl,
  });
  public shouldInviteCalendar = new Subject<boolean>();

  constructor(private userService: UserService) {
    this.initNotificationCenter();
  }

  initNotificationCenter = () => {
    this.headlessService.initializeSession({
      listener: (res: FetchResult<ISession>) => {
        console.log(res);
      },
      onSuccess: () => {
        this.headlessService.fetchNotifications({
          listener: () => {},
          onSuccess: this.handleCalendarNotification,
          page: 0,
          query: {
            read: false,
          }
        });
      },
      onError: (error) => {
        console.error(error);
      },
    });
  }

  handleCalendarNotification = (response: any) => {
    const calendarNotifications = response.data.filter((item: any) => item.templateIdentifier === 'calendar-event-notification');
    if (calendarNotifications.length > 0) {
      this.shouldInviteCalendar.next(true);
      this.headlessService.markNotificationsAsRead({
        listener: () => {},
        onSuccess: () => {},
        messageId: calendarNotifications.map((notif: any) => notif.id),
      });
    }
  }
}
