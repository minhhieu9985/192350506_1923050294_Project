import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const notificationService = {
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') return false;
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      return finalStatus === 'granted';
    } catch {
      return false;
    }
  },

  async triggerPriceDropNotification(
    itemTitle: string,
    oldPrice: number,
    newPrice: number
  ): Promise<void> {
    const formattedOld = oldPrice.toLocaleString('vi-VN');
    const formattedNew = newPrice.toLocaleString('vi-VN');

    if (Platform.OS === 'web') {
      return;
    }

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🔥 Giảm giá sách/đồ dùng trong Favourites!',
          body: `"${itemTitle}" vừa giảm từ ${formattedOld}đ xuống ${formattedNew}đ! Vào xem ngay.`,
          data: { type: 'price_drop' },
        },
        trigger: null, // Send immediately
      });
    } catch {
      // Ignore notification schedule errors
    }
  },
};
