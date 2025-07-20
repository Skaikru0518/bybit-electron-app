import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

function UpdateButton() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [version, setVersion] = useState(null);
  const [status, setStatus] = useState('idle'); // 'idle', 'checking', 'available', 'not-available', 'error'

  useEffect(() => {
    if (!window.api) {
      console.error('window api is undefined!');
      return;
    }

    // Listen for update status from Electron
    window.api.onUpdateStatus((data) => {
      console.log('Update status received:', data);
      const { status, info, error } = data;

      setStatus(status);

      switch (status) {
        case 'available':
          setUpdateAvailable(true);
          if (info?.version) setVersion(info.version);
          if (data?.version) setVersion(data.version);
          break;
        case 'not-available':
          setUpdateAvailable(false);
          break;
        case 'error':
          console.error('Update error:', error);
          setUpdateAvailable(false);
          break;
        case 'downloaded':
          // Update downloaded, app will restart
          break;
        default:
          break;
      }
    });

    // Check for updates on mount
    const checkUpdate = async () => {
      try {
        await window.api.checkForUpdates();
      } catch (error) {
        console.error('Failed to check for updates:', error);
      }
    };

    checkUpdate();
  }, []);

  const getButtonText = () => {
    switch (status) {
      case 'checking':
        return 'Checking...';
      case 'available':
        return version ? `Update to ${version}` : 'Update available';
      case 'downloaded':
        return 'Restarting...';
      case 'error':
        return 'Update error';
      default:
        return updateAvailable ? 'Update available' : 'Up to date';
    }
  };

  return (
    <Button
      variant={updateAvailable ? 'default' : 'disabled'}
      className={cn(
        updateAvailable
          ? 'bg-emerald-500 hover:cursor-pointer'
          : 'bg-transparent cursor-not-allowed',
      )}
      disabled={status === 'checking' || status === 'downloaded'}
    >
      {getButtonText()}
    </Button>
  );
}

export default UpdateButton;
