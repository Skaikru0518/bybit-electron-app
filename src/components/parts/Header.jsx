import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Menu, User, LogOut, Wifi, WifiOff } from 'lucide-react';

const Header = ({ onSidebarToggle }) => {
  const isConnected = true;

  return (
    <header className="flex items-center">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onSidebarToggle}
          className={'lg:hidden'}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div
          className="flex timesce
         gap-2"
        >
          <Badge
            variant={isConnected ? 'default' : 'destructive'}
            className="gap-2"
          >
            {isConnected ? (
              <>
                <Wifi /> Connected
              </>
            ) : (
              <>
                <WifiOff /> Disconnected
              </>
            )}
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-4 text-sm">
          <div className="text-muted-foreground">
            Balance:
            <span className="text-green-500 font-medium">$12,444.65</span>
          </div>
          <div>
            P&L:
            <span className="text-green-500 font-medium">+$230.44</span>
          </div>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuContent></DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};
export default Header;
