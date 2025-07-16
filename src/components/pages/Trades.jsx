import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Edit, X, Target, MoreHorizontal } from 'lucide-react';
const Trades = () => {
  const [trades] = useState([
    {
      id: '1',
      symbol: 'BTCUSDT',
      side: 'long',
      size: 0.5,
      entryPrice: 43500,
      currentPrice: 44200,
      pnl: 350,
      pnlPercentage: 1.61,
      takeProfit: 45000,
      stopLoss: 42000,
      timestamp: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      symbol: 'ETHUSDT',
      side: 'short',
      size: 2.5,
      entryPrice: 2650,
      currentPrice: 2580,
      pnl: 175,
      pnlPercentage: 2.64,
      takeProfit: 2500,
      stopLoss: 2750,
      timestamp: '2024-01-15T09:15:00Z',
    },
    {
      id: '3',
      symbol: 'ADAUSDT',
      side: 'long',
      size: 1000,
      entryPrice: 0.45,
      currentPrice: 0.42,
      pnl: -30,
      pnlPercentage: -6.67,
      takeProfit: 0.5,
      stopLoss: 0.4,
      timestamp: '2024-01-15T08:45:00Z',
    },
  ]);
  const [editingTrade, setEditingTrade] = useState(null);
  const [takeProfit, setTakeProfit] = useState('');
  const [stopLoss, setStopLoss] = useState('');

  const handleEditTrade = (trade) => {
    setEditingTrade(trade);
    setTakeProfit(trade.takeProfit?.toString() || '');
    setStopLoss(trade.stopLoss?.toString() || '');
  };

  const handleClosePosition = (tradeId) => {
    console.log('Closing Position', tradeId);
    //implement logic
  };

  const handleUpdateTrade = () => {
    console.log('Updating trade', editingTrade?.id, { takeProfit, stopLoss });
    //implement logic
    setEditingTrade(null);
  };

  return (
    <div className="flex-1 space-y-6 p-6 w-full">
      {/* header thing */}
      <div className="flex items-center justify-between w-full">
        <h2 className="text-3xl font-bold tracking-tight">Open Position</h2>
        <Badge variant={'outline'}>
          {trades?.length} Active Position{trades.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Card + Table of the trades */}
      <Card className={'w-full'}>
        <CardHeader>
          <CardTitle>Current Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Side</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Entry Price</TableHead>
                  <TableHead>Current Price</TableHead>
                  <TableHead>P&L</TableHead>
                  <TableHead>Take Profit</TableHead>
                  <TableHead>Stop Loss</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className={'w-[70px]'}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trades?.map((trade) => (
                  <TableRow key={trade.id}>
                    <TableCell className={'font-medium'}>
                      {trade.symbol}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          trade.side === 'long' ? 'default' : 'destructive'
                        }
                      >
                        {trade.side.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>{trade.size}</TableCell>
                    <TableCell>$ {trade.entryPrice.toLocaleString()}</TableCell>
                    <TableCell>
                      $ {trade.currentPrice.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div
                        className={`font-medium ${
                          trade.pnl >= 0 ? 'text-green-500' : 'text-red-500'
                        }`}
                      >
                        $ {trade.pnl.toFixed(2)}
                      </div>
                      <div
                        className={`text-xs ${
                          trade.pnl >= 0 ? 'text-green-500' : 'text-red-500'
                        }`}
                      >
                        {trade.pnlPercentage >= 0 ? '+' : ''}
                        {trade.pnlPercentage.toFixed(2)} %
                      </div>
                    </TableCell>
                    <TableCell>
                      {trade.takeProfit
                        ? `$${trade.takeProfit.toLocaleString()}`
                        : ''}
                    </TableCell>
                    <TableCell>
                      {trade.stopLoss
                        ? `$${trade.stopLoss.toLocaleString()}`
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {new Date(trade.timestamp).toLocaleTimeString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant={'ghost'}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEditTrade(trade)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit TP/SL
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleClosePosition(trade.id)}
                          >
                            <X className="mr-2 h-4 w-4" />
                            Close Position
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* DIALOG  */}

      <Dialog open={!!editingTrade} onOpenChange={() => setEditingTrade(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Position - {editingTrade?.symbol}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label htmlFor="takeProfit">Take Profit</Label>
            <Input
              id="takeProfit"
              type={'number'}
              placeholder="Enter take profit price"
              value={takeProfit}
              onChange={(e) => setTakeProfit(e.target.value)}
            />
          </div>
          <div className="space-y-4">
            <Label htmlFor="stopLoss">Stop Loss</Label>
            <Input
              id="stopLoss"
              type={'number'}
              placeholder="Enter stop loss price"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant={'outline'}
              onClick={() => handleClosePosition(null)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateTrade}>
              <Target className="mr-2 h-4 w-4" />
              Update position
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Trades;
