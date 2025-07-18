import React, { useEffect, useState } from 'react';
import { useTheme } from '../providers/ThemeProvider';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import {
  Globe,
  Key,
  TestTube2,
  Save,
  Shield,
  Monitor,
  Sun,
  Moon,
} from 'lucide-react';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { useTradingData } from '../providers/TradingDataProvider';

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { isConnected, refreshData, refreshInterval, updateRefreshInterval } =
    useTradingData();
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [environment, setEnvironment] = useState('demo');
  const [compactMode, setCompactMode] = useState(false);
  const [showBalanceInHeader, setShowBalanceInHeader] = useState(true);
  const [soundNotifications, setSoundNotifications] = useState(false);
  const [selectedRefreshInterval, setSelectedRefreshInterval] =
    useState(refreshInterval);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedApiKey = await window.api.getStore('apiKey');
        const storedApiSecret = await window.api.getStore('apiSecret');
        const storedEnvironment = await window.api.getStore('isDemo');
        const storedCompactMode = await window.api.getStore('compactMode');
        const storedShowBalanceInHeader = await window.api.getStore(
          'showBalanceInHeader',
        );
        const storedSoundNotifications = await window.api.getStore(
          'soundNotifications',
        );

        if (storedApiKey) setApiKey(storedApiKey);
        if (storedApiSecret) setApiSecret(storedApiSecret);
        if (storedEnvironment !== null && storedEnvironment !== undefined)
          setEnvironment(String(storedEnvironment));
        if (storedCompactMode !== null && storedCompactMode !== undefined)
          setCompactMode(
            storedCompactMode === 'true' || storedCompactMode === true,
          );

        if (
          storedShowBalanceInHeader !== null &&
          storedShowBalanceInHeader !== undefined
        )
          setShowBalanceInHeader(
            storedShowBalanceInHeader === 'true' ||
              storedShowBalanceInHeader === true,
          );

        if (
          storedSoundNotifications !== null &&
          storedSoundNotifications !== undefined
        )
          setSoundNotifications(
            storedSoundNotifications === 'true' ||
              storedSoundNotifications === true,
          );
      } catch (error) {
        console.warn('Failed to load settings from eStorage', error);
      }
    };
    loadSettings();
  }, []);

  const handleSaveApiKeys = async () => {
    try {
      await window.api.setStore('apiKey', apiKey);
      await window.api.setStore('apiSecret', apiSecret);
      await window.api.setStore('isDemo', environment);
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings', error);
      toast.error('Failed to save settings');
    }
  };

  const handleTestConnection = async () => {
    try {
      await refreshData();
      if (isConnected) {
        toast.success('Connection successful');
      } else {
        toast.error('Connection failed');
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      toast.error('Connection test failed');
    }
  };

  const handleEnvironmentChange = async (value) => {
    setEnvironment(String(value));
    try {
      await window.api.setStore('isDemo', value);
      const env = value === 'true' ? 'demo' : 'mainnet';
      toast.info(`Switched to ${env} environment`);
      // Környezet váltás után frissítjük a kapcsolatot
      setTimeout(() => refreshData(), 500);
    } catch (error) {
      console.warn('Failed to change environment', error);
    }
  };

  const handleAppearanceSettings = async () => {
    try {
      await window.api.setStore('compactMode', compactMode);
      await window.api.setStore('showBalanceInHeader', showBalanceInHeader);
      await window.api.setStore('soundNotifications', soundNotifications);
      toast.success('Settings saved');
    } catch (error) {
      console.error('Failed to save settings', error);
      toast.error('Failed to save settings');
    }
  };

  const hanldeToggleSetting = async (settingName, currentValue, setter) => {
    const newValue = !currentValue;
    setter(newValue);
    try {
      await window.api.setStore(settingName, newValue);
    } catch (error) {
      console.error(`Failed to save ${settingName} setting:`, error);
    }
  };

  const handleRefreshIntervalChange = async (value) => {
    const interval = parseInt(value);
    try {
      setSelectedRefreshInterval(interval);
      await updateRefreshInterval(interval);
      toast.success('Refresh interval updated');
    } catch (error) {
      console.warn('Failed to change refresh interval', error);
      toast.error('Failed to change refresh interval');
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6 w-full">
      <div className="flex items-center justify-between w-full">
        <h2 className="text-3xl font-bold tracking-tight">Trading Dashboard</h2>
        <Badge
          className="gap-2"
          variant={isConnected ? 'default' : 'secondary'}
        >
          <div
            className={cn(
              'w-2 h-2 rounded-full animate-pulse',
              isConnected ? 'bg-green-500' : 'bg-red-500',
            )}
          ></div>
          {isConnected ? 'Connected' : 'Disconnected'}
        </Badge>
      </div>

      <Tabs defaultValue="api" className={'space-y-4 w-full'}>
        <TabsList className={'grid w-full grid-cols-2'}>
          <TabsTrigger value="api">API Configuration</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="api" className="space-y-4 w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Bybit API Configuration
              </CardTitle>
              <CardDescription>
                Configure your Bybit API credentials for trading
              </CardDescription>
            </CardHeader>

            {/* DATA REFRESH INTERVAL */}
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="refreshInterval">Data Refresh Interval</Label>
                <Select
                  value={selectedRefreshInterval.toString()}
                  onValueChange={handleRefreshIntervalChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5000">5 seconds</SelectItem>
                    <SelectItem value="10000">10 seconds</SelectItem>
                    <SelectItem value="30000">30 seconds</SelectItem>
                  </SelectContent>
                  <p className="text-xs text-muted-foreground">
                    How often to refresh account and trading data
                  </p>
                </Select>
              </div>

              {/* CHANGE ENVIRONMENT */}
              <div className="space-y-2">
                <Label htmlFor="environment">Environment</Label>
                <Select
                  value={environment}
                  onValueChange={handleEnvironmentChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">
                      <div className="flex items-center gap-2">
                        <TestTube2 className="h-4 w-4" />
                        Demo (Testnet)
                      </div>
                    </SelectItem>
                    <SelectItem value="false">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Mainnet (Live)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* API KEYS */}
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Enter your Bybit API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiSecret">API Secret</Label>
                <Input
                  id="apiSecret"
                  type="password"
                  placeholder="Enter your Bybit API secret"
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSaveApiKeys} className="flex-1">
                  <Save className="mr-2 h-4 w-4" />
                  Save API Keys
                </Button>
                <Button variant="outline" onClick={handleTestConnection}>
                  <Shield className="mr-2 h-4 w-4" />
                  Test Connection
                </Button>
              </div>
              <p className="text-muted-foreground font-medium">
                Restart the application after saving API keys or changing
                environment!
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance settings */}
        <TabsContent value="appearance" className={'space-y-4 w-full'}>
          <Card className={'w-full'}>
            <CardHeader>
              <CardTitle className={'flex items-center gap-2'}>
                <Monitor className="h-5 w-5" />
                Appearance settings
              </CardTitle>
              <CardDescription>
                Customize the look and feel of your trading interface
              </CardDescription>
            </CardHeader>
            <CardContent className={'space-y-4'}>
              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="flex gap-2">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    onClick={() => setTheme('light')}
                    className={'flex-1'}
                  >
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    className={'flex-1'}
                    onClick={() => setTheme('dark')}
                  >
                    <Moon />
                    Dark
                  </Button>
                </div>
              </div>
              <p className="text-sm text-red-900">
                These are not yet implemented!
              </p>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Compact mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Reduce spacing for more data on screen
                  </p>
                </div>
                <Switch
                  disabled="true"
                  checked={compactMode}
                  onCheckedChange={() =>
                    hanldeToggleSetting(
                      'compactMode',
                      compactMode,
                      setCompactMode,
                    )
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show balance in header</Label>
                  <p className="text-sm text-muted-foreground">
                    Display account balance in the top header
                  </p>
                </div>
                <Switch
                  disabled="true"
                  checked={showBalanceInHeader}
                  onCheckedChange={() =>
                    hanldeToggleSetting(
                      'showBalanceInHeader',
                      showBalanceInHeader,
                      setShowBalanceInHeader,
                    )
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sound notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Play sounds for order fills and alerts
                  </p>
                </div>
                <Switch
                  disabled="true"
                  checked={soundNotifications}
                  onCheckedChange={() =>
                    hanldeToggleSetting(
                      'soundNotifications',
                      soundNotifications,
                      setSoundNotifications,
                    )
                  }
                />
              </div>
              <Button className={'w-full'} onClick={handleAppearanceSettings}>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
