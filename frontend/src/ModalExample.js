import React, { useEffect } from 'react';
import { AppExtensionsSDK, Command } from '@pipedrive/app-extensions-sdk';

function ModalExample() {
  useEffect(() => {
    async function showModal() {
      try {
        // Инициализация SDK
        const sdk = await new AppExtensionsSDK().initialize();

        // Отображение модального окна
        const { confirmed } = await sdk.execute(Command.SHOW_CONFIRMATION, {
          title: 'Confirm Action',
          message: 'Are you sure you want to do this?',
          confirmText: 'Yes',
          cancelText: 'No'
        });

        if (confirmed) {
          console.log('User confirmed action');
          alert('Action confirmed!');
        } else {
          console.log('User cancelled action');
          alert('Action cancelled!');
        }
      } catch (error) {
        console.error('Error showing modal:', error);
        alert('Error showing modal');
      }
    }

    showModal();
  }, []);

  return (
    <div>
      <h1>App Extensions SDK Example</h1>
    </div>
  );
}

export default ModalExample;
