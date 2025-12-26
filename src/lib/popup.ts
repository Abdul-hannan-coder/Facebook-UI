/**
 * Popup Window Utility
 * Handles OAuth popup windows for Facebook connection
 */

export interface PopupOptions {
  width?: number;
  height?: number;
  name?: string;
}

export const openPopup = (url: string, options: PopupOptions = {}): Window | null => {
  const { width = 600, height = 700, name = 'facebook-oauth' } = options;

  const left = (window.screen.width - width) / 2;
  const top = (window.screen.height - height) / 2;

  const popup = window.open(
    url,
    name,
    `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,directories=no,status=no`
  );

  return popup;
};

export const waitForPopupClose = (popup: Window | null): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!popup) {
      reject(new Error('Popup window not opened'));
      return;
    }

    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        resolve();
      }
    }, 500);

    // Timeout after 5 minutes
    setTimeout(() => {
      clearInterval(checkClosed);
      if (!popup.closed) {
        popup.close();
      }
      reject(new Error('Popup timeout'));
    }, 5 * 60 * 1000);
  });
};

export const listenForPopupMessage = (
  expectedOrigin: string,
  timeout: number = 5 * 60 * 1000
): Promise<{ success: boolean; data?: unknown; error?: string }> => {
  return new Promise((resolve, reject) => {
    const messageHandler = (event: MessageEvent) => {
      // Verify origin for security
      if (event.origin !== expectedOrigin) {
        return;
      }

      if (event.data.type === 'FACEBOOK_OAUTH_SUCCESS' || event.data.type === 'FACEBOOK_OAUTH_ERROR') {
        window.removeEventListener('message', messageHandler);
        clearTimeout(timeoutId);

        if (event.data.type === 'FACEBOOK_OAUTH_SUCCESS') {
          resolve({ success: true, data: event.data.payload });
        } else {
          resolve({ success: false, error: event.data.error || 'OAuth failed' });
        }
      }
    };

    window.addEventListener('message', messageHandler);

    const timeoutId = setTimeout(() => {
      window.removeEventListener('message', messageHandler);
      reject(new Error('Popup message timeout'));
    }, timeout);
  });
};

