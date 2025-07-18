import React, { useEffect, useState } from 'react';
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
import {
  Edit,
  X,
  Target,
  MoreHorizontal,
  Plus,
  Loader,
  TrendingUp,
} from 'lucide-react';
import { useTradingData } from '../providers/TradingDataProvider';
import { toast } from 'sonner';
import { Slider } from '../ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
const Trades = () => {
  const { tradesData, refreshInterval } = useTradingData();
  const [editingTrade, setEditingTrade] = useState(null);
  const [takeProfit, setTakeProfit] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [newOrder, setNewOrder] = useState({
    symbol: '',
    side: '',
    orderType: 'market',
    qty: '',
    takeProfit: '',
    stopLoss: '',
    leverage: '',
  });
  const [currentPrice, setCurrentPrice] = useState(0);
  const [instrumentInfo, setInstrumentInfo] = useState(null);
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);
  const [showNewOrderDialog, setShowNewOrderDialog] = useState(false);
  const [symbolInput, setSymbolInput] = useState();

  const fetchInstumentData = async (symbol) => {
    try {
      setIsLoadingPrice(true);
      const info = await window.api?.getInstrumentInfo('linear', symbol);
      const instrumentPrice = await window.api?.getPrice('linear', symbol);
      if (info) {
        setCurrentPrice(instrumentPrice[0].markPrice);
        setInstrumentInfo(info.list[0]);
      }
    } catch (error) {
      console.error('Failed to fetch instrument data', error);
      toast.error('Failed to fetch current price');
    } finally {
      setIsLoadingPrice(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (symbolInput && symbolInput !== newOrder.symbol) {
        setNewOrder((prev) => ({ ...prev, symbol: symbolInput }));
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [symbolInput, newOrder.symbol]);

  useEffect(() => {
    if (showNewOrderDialog && newOrder.symbol) {
      fetchInstumentData(newOrder.symbol);
      const interval = setInterval(() => {
        fetchInstumentData(newOrder.symbol);
      }, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [showNewOrderDialog, newOrder.symbol, refreshInterval]);

  const handleEditTrade = (trade) => {
    setEditingTrade(trade);
    setTakeProfit(trade.takeProfit?.toString() || '');
    setStopLoss(trade.stopLoss?.toString() || '');
  };

  const handleNewOrderSubmit = async () => {
    try {
      const price = newOrder.orderType === 'market' ? 'null' : currentPrice;
      await window.api?.placeOrder?.(
        'linear',
        newOrder.symbol,
        newOrder.side,
        newOrder.orderType,
        parseFloat(newOrder.qty),
        price,
        newOrder.takeProfit ? parseFloat(newOrder.takeProfit) : null,
        newOrder.stopLoss ? parseFloat(newOrder.stopLoss) : null,
      );

      toast.success('Order placed');
      setShowNewOrderDialog(false);

      //reset newOrder state
      setNewOrder({
        symbol: '',
        side: '',
        orderType: '',
        qty: '',
        takeProfit: '',
        stopLoss: '',
        leverage: '',
      });
    } catch (error) {
      console.error('Failed to place order', error);
      toast.error('Failed to place order');
    }
  };

  const handleClosePosition = async (trade) => {
    try {
      await window.api?.cancelOrder?.('linear', trade.symbol, trade.orderId);
      toast.success(`Position ${trade.symbol} closed succesfully`);
    } catch (error) {
      console.error('Failed to close position', error);
      toast.error('Failed to close position');
    }
  };

  const handleUpdateTrade = () => {
    console.log('Updating trade', editingTrade?.id, { takeProfit, stopLoss });
    //implement logic
    setEditingTrade(null);
  };

  const handleSymbolChange = (symbol) => {
    setSymbolInput(symbol.toUpperCase());
  };

  return (
    <div className="flex-1 space-y-6 p-6 w-full">
      {/* header thing */}
      <div className="flex flex-col items-center justify-between gap-5 w-full">
        <div className="flex w-full justify-between items-center ">
          <h2 className="text-3xl font-bold tracking-tight">Open Position</h2>
          <Badge variant={'outline'}>
            {tradesData?.length} Active Position
            {tradesData.length !== 1 ? 's' : ''}
          </Badge>
        </div>
        <div className="flex justify-start w-full">
          <Button
            onClick={() => setShowNewOrderDialog(true)}
            className={
              'hover:bg-emerald-500 hover:cursor-pointer hover:transition-colors duration-300'
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            New Order
          </Button>
        </div>
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
                  <TableHead>Leverage</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Entry Price</TableHead>
                  <TableHead>Current Price</TableHead>
                  <TableHead>P&L</TableHead>
                  <TableHead>Realized P&L</TableHead>
                  <TableHead>Take Profit</TableHead>
                  <TableHead>Stop Loss</TableHead>
                  <TableHead className={'w-[70px]'}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tradesData?.map((trade, idx) => (
                  <TableRow key={trade.symbol + idx}>
                    <TableCell className={'font-medium'}>
                      {trade.symbol}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          trade.side === 'Buy'
                            ? 'bg-green-500 text-black'
                            : 'bg-red-500 text-white'
                        }
                      >
                        {trade.side.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>{trade.leverage}x</TableCell>
                    <TableCell>{parseFloat(trade.size)}</TableCell>
                    <TableCell>
                      $ {parseFloat(trade.avgPrice).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      $ {parseFloat(trade.markPrice).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div
                        className={`font-medium ${
                          parseFloat(trade.unrealisedPnl) >= 0
                            ? 'text-green-500'
                            : 'text-red-500'
                        }`}
                      >
                        $ {parseFloat(trade.unrealisedPnl).toFixed(2)}
                      </div>

                      {/* pnlPercentage */}
                      <div
                        className={`text-xs ${
                          parseFloat(trade.unrealisedPnl) >= 0
                            ? 'text-green-500'
                            : 'text-red-500'
                        }`}
                      >
                        {trade.positionIM && parseFloat(trade.positionIM) !== 0
                          ? (
                              (parseFloat(trade.unrealisedPnl) /
                                parseFloat(trade.positionIM)) *
                              100
                            ).toFixed(2) + ' %'
                          : '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className={`${
                          trade.curRealisedPnl >= 0
                            ? 'text-green-500'
                            : 'text-red-500'
                        }`}
                      >
                        $ {parseFloat(trade.curRealisedPnl).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {trade.takeProfit
                        ? `$ ${Number(trade.takeProfit).toLocaleString()}`
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {trade.stopLoss
                        ? `$ ${Number(trade.stopLoss).toLocaleString()}`
                        : '-'}
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

      {/* NEW ORDER DIALOG */}
      <Dialog open={showNewOrderDialog} onOpenChange={setShowNewOrderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Place new order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="symbol">Symbol</Label>
              <Input
                id="symbol"
                type={'text'}
                placeholder="Enter symbol (e.g. BTCUSDT)"
                value={symbolInput}
                onChange={(e) => handleSymbolChange(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Current price</Label>
              <div className="flex flex-row items-center gap-2 text-sm">
                <span>
                  {isLoadingPrice
                    ? 'Loading...'
                    : `$${currentPrice.toLocaleString()}`}
                </span>
                {isLoadingPrice && (
                  <Loader className="text-green-500 h-4 w-4 animate-spin" />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Leverage: {newOrder.leverage[0]}x</Label>
              {/* <Slider
                value={newOrder.leverage}
                onValueChange={(value) =>
                  setNewOrder((prev) => ({ ...prev, leverage: value }))
                }
                max={instrumentInfo?.leverageFilter?.maxLeverage || 100}
                min={instrumentInfo?.leverageFilter?.minLeverage || 1}
                step={1}
                className="mt-2"
              /> */}
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1x</span>
                <span>
                  {instrumentInfo?.leverageFilter?.maxLeverage || 100} x
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Side</Label>
              <div className="flex gap-2 mt-1">
                <Button
                  onClick={() =>
                    setNewOrder((prev) => ({ ...prev, side: 'Buy' }))
                  }
                  className={'flex-1 bg-emerald-600'}
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Buy
                </Button>
                <Button
                  onClick={() =>
                    setNewOrder((prev) => ({ ...prev, side: 'Sell' }))
                  }
                  className={'flex-1 bg-red-700'}
                >
                  Sell
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Order type</Label>
              <Select
                value={newOrder.orderType}
                onValueChange={(value) =>
                  setNewOrder((prev) => ({ ...prev, orderType: value }))
                }
                default="market"
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="market">Market</SelectItem>
                  <SelectItem value="limit">Limit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="qty">Quantity</Label>
              <Input
                id="qty"
                type={'number'}
                placeholder="Enter quantity"
                value={newOrder.qty}
                onChange={(e) =>
                  setNewOrder((prev) => ({ ...prev, qty: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newTakeProfit">Take Profit (optional)</Label>
              <Input
                id="newTakeProfit"
                type={'number'}
                placeholder="Enter take profit price"
                value={newOrder.takeProfit}
                onChange={(e) =>
                  setNewOrder((prev) => ({
                    ...prev,
                    takeProfit: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newStopLoss"> Stop Loss (optional)</Label>
              <Input
                id="newStopLoss"
                type={'number'}
                placeOrder="Enter stop loss price"
                value={newOrder.stopLoss}
                onChange={(e) =>
                  setNewOrder((prev) => ({ ...prev, stopLoss: e.target.value }))
                }
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                className={
                  'bg-red-700 hover:bg-red-500 hover:cursor-pointer hover:transition-colors duration-300'
                }
                onClick={() => setShowNewOrderDialog(false)}
              >
                Cancel
              </Button>
              <Button
                className={
                  'bg-emerald-700 hover:bg-emerald-500 hover:cursor-pointer hover:transition-colors duration-300'
                }
                onClick={handleNewOrderSubmit}
                disabled={!newOrder.qty}
              >
                Place order
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* EDIT DIALOG  */}

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
