import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import {
  TrendingUp,
  BarChart3,
  ChevronLeft,
  Bitcoin,
  Settings,
  Wifi,
  WifiOff,
  ChartArea,
  Loader,
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { useTradingData } from '../providers/TradingDataProvider';

const navigation = [
  { name: 'Dashboard', href: '/', icon: TrendingUp },
  { name: 'Tradingview', href: '/tradingview', icon: ChartArea },
  { name: 'Trades', href: '/trades', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const Sidebar = ({ open, onToggle }) => {
  const location = useLocation();
  const { walletBalance, isLoading, isConnected } = useTradingData();

  const fetchInfo = async () => {
    try {
      const response = await window.api.getAllOrders('linear', 'USDT');
      console.log(response);
    } catch (error) {
      throw new Error(error);
    }
  };
  return (
    <div
      className={cn(
        'flex flex-col bg-card border-r border-border transition-all duration-300',
        open ? 'w-64' : 'w-20',
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div
          className={cn('flex items-center gap-2', !open && 'justify-center')}
        >
          <Bitcoin className="h-6 w-6 text-primary" />
          {open && <span className="font-semibold text-lg">ZenTrader</span>}
        </div>
        <Button
          variant={'ghost'}
          size={'icon'}
          onClick={onToggle}
          className={cn(!open && 'rotate-180')}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>

      {/* Connection status info */}
      <div
        className={cn(
          'flex flex-col py-4 border-b border-border',
          open ? 'px-2' : 'px-6',
        )}
      >
        <div className="space-y-2">
          <div className="flex-1 flex flex-col items-center">
            <Badge
              className={'gap-1 text-xs p-2'}
              variant={isConnected ? 'outline' : 'destructive'}
            >
              {isConnected ? (
                <>
                  <Wifi className="w-4 h-4 animate-pulse text-green-500" />
                  {open ? 'Connected' : ''}
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4" />
                  {open ? 'Disconnected' : ''}
                </>
              )}
            </Badge>

            {/* Account Info */}
            {open && (
              <div className="space-y-2 text-xs mt-2 w-full">
                <div className="flex justify-between items-center gap-4">
                  <span className="text-muted-foreground">Balance: </span>
                  <span className="text-green-500 font-medium">
                    {isLoading ? (
                      <Loader className="animate-spin w-4 h-4" />
                    ) : (
                      `$ ${walletBalance.totalAvailableBalance.toLocaleString()}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">P&L: </span>
                  <span
                    className={`font-medium ${
                      parseFloat(walletBalance.totalPerpUPL) >= 0
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {isLoading ? (
                      <Loader className="animate-spin w-4 h-4" />
                    ) : (
                      `${
                        parseFloat(walletBalance.totalPerpUPL) >= 0 ? '+' : ''
                      }$ ${parseFloat(
                        walletBalance.totalPerpUPL,
                      ).toLocaleString()}`
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
        <Button onClick={() => fetchInfo()}>fetch</Button>
      </div>

      {/* navigation menu */}

      <nav className="flex-1 p-2">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                    !open && 'justify-center',
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {open && <span>{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};
export default Sidebar;
