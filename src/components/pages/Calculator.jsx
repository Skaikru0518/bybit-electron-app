import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Calculator as CalcIcon } from 'lucide-react';
import { toast } from 'sonner';

// Entry Calculator Component
const EntryCalculator = () => {
  const [currentPositionSize, setCurrentPositionSize] = useState('');
  const [firstEntryPrice, setFirstEntryPrice] = useState('');
  const [newPositionSize, setNewPositionSize] = useState('');
  const [newEntryPrice, setNewEntryPrice] = useState('');
  const [averageEntryPrice, setAverageEntryPrice] = useState(null);

  // Load from store
  useEffect(() => {
    const loadData = async () => {
      const data = await window.api?.getStore('entryCalculator');
      if (data) {
        const parsed = JSON.parse(data);
        setCurrentPositionSize(parsed.currentPositionSize || '');
        setFirstEntryPrice(parsed.firstEntryPrice || '');
        setNewPositionSize(parsed.newPositionSize || '');
        setNewEntryPrice(parsed.newEntryPrice || '');
        setAverageEntryPrice(parsed.averageEntryPrice || null);
      }
    };
    loadData();
  }, []);

  // Save to store
  const saveData = async (field, value) => {
    const current = await window.api?.getStore('entryCalculator');
    const data = current ? JSON.parse(current) : {};
    data[field] = value;
    await window.api?.setStore('entryCalculator', JSON.stringify(data));
  };

  const calculateAverageEntry = () => {
    if (
      !currentPositionSize ||
      !firstEntryPrice ||
      !newPositionSize ||
      !newEntryPrice
    ) {
      toast.error('Please fill in all fields with valid numbers.');
      return;
    }

    const totalInvestment =
      parseFloat(currentPositionSize) * parseFloat(firstEntryPrice) +
      parseFloat(newPositionSize) * parseFloat(newEntryPrice);
    const totalSize =
      parseFloat(currentPositionSize) + parseFloat(newPositionSize);

    if (totalSize === 0) {
      toast.error('Total position size cannot be zero.');
      return;
    }

    const averagePrice = totalInvestment / totalSize;
    const result = averagePrice.toFixed(2);
    setAverageEntryPrice(result);
    saveData('averageEntryPrice', result);
    toast.success(`Average entry price calculated: ${result} USDT`);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalcIcon className="w-5 h-5" />
          Entry Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="currentPositionSize">Current Position Size</Label>
          <Input
            id="currentPositionSize"
            type="number"
            placeholder="0.00"
            value={currentPositionSize}
            onChange={(e) => {
              setCurrentPositionSize(e.target.value);
              saveData('currentPositionSize', e.target.value);
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="firstEntryPrice">First Entry Price</Label>
          <Input
            id="firstEntryPrice"
            type="number"
            placeholder="0.00"
            value={firstEntryPrice}
            onChange={(e) => {
              setFirstEntryPrice(e.target.value);
              saveData('firstEntryPrice', e.target.value);
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="newPositionSize">New Position Size</Label>
          <Input
            id="newPositionSize"
            type="number"
            placeholder="0.00"
            value={newPositionSize}
            onChange={(e) => {
              setNewPositionSize(e.target.value);
              saveData('newPositionSize', e.target.value);
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="newEntryPrice">New Entry Price</Label>
          <Input
            id="newEntryPrice"
            type="number"
            placeholder="0.00"
            value={newEntryPrice}
            onChange={(e) => {
              setNewEntryPrice(e.target.value);
              saveData('newEntryPrice', e.target.value);
            }}
          />
        </div>
        <Button onClick={calculateAverageEntry} className="w-full">
          Calculate
        </Button>
        {averageEntryPrice && (
          <div className="p-4 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground">New Average Entry Price</p>
            <p className="text-2xl font-bold">{averageEntryPrice} USDT</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// TP/SL Calculator Component
const TPSLCalculator = () => {
  const [positionType, setPositionType] = useState('long');
  const [entryPrice, setEntryPrice] = useState('');
  const [investedAmount, setInvestedAmount] = useState('');
  const [leverage, setLeverage] = useState('');
  const [riskRewardRatio, setRiskRewardRatio] = useState('');
  const [takeProfitPercent, setTakeProfitPercent] = useState('');
  const [stopLossPercent, setStopLossPercent] = useState('');
  const [results, setResults] = useState(null);

  // Load from store
  useEffect(() => {
    const loadData = async () => {
      const data = await window.api?.getStore('tpslCalculator');
      if (data) {
        const parsed = JSON.parse(data);
        setPositionType(parsed.positionType || 'long');
        setEntryPrice(parsed.entryPrice || '');
        setInvestedAmount(parsed.investedAmount || '');
        setLeverage(parsed.leverage || '');
        setRiskRewardRatio(parsed.riskRewardRatio || '');
        setTakeProfitPercent(parsed.takeProfitPercent || '');
        setStopLossPercent(parsed.stopLossPercent || '');
        setResults(parsed.results || null);
      }
    };
    loadData();
  }, []);

  // Save to store
  const saveData = async (field, value) => {
    const current = await window.api?.getStore('tpslCalculator');
    const data = current ? JSON.parse(current) : {};
    data[field] = value;
    await window.api?.setStore('tpslCalculator', JSON.stringify(data));
  };

  const calculateTPSL = () => {
    if (!entryPrice || !investedAmount || !leverage || !riskRewardRatio) {
      toast.error('Please fill in Entry Price, Invested Amount, Leverage, and Risk/Reward Ratio.');
      return;
    }

    if (!takeProfitPercent && !stopLossPercent) {
      toast.error('Please fill in either Take Profit % OR Stop Loss %.');
      return;
    }

    const positionSize = parseFloat(investedAmount) * parseFloat(leverage);
    const coinsPurchased = positionSize / parseFloat(entryPrice);
    const entry = parseFloat(entryPrice);
    const rr = parseFloat(riskRewardRatio);

    let tpPrice, slPrice, tpPercent, slPercent;

    if (positionType === 'long') {
      // LONG: TP > Entry, SL < Entry
      if (takeProfitPercent) {
        tpPercent = parseFloat(takeProfitPercent);
        slPercent = tpPercent / rr; // SL% = TP% / RR

        if (slPercent >= 100) {
          toast.error(`Long position: Calculated SL% (${slPercent.toFixed(2)}%) would go negative. Reduce TP% or increase Risk/Reward ratio.`);
          return;
        }

        tpPrice = entry * (1 + tpPercent / 100);
        slPrice = entry * (1 - slPercent / 100);
      } else if (stopLossPercent) {
        slPercent = parseFloat(stopLossPercent);

        if (slPercent >= 100) {
          toast.error('Long position: SL% cannot be 100% or higher.');
          return;
        }

        tpPercent = slPercent * rr; // TP% = SL% * RR
        slPrice = entry * (1 - slPercent / 100);
        tpPrice = entry * (1 + tpPercent / 100);
      }
    } else {
      // SHORT: TP < Entry, SL > Entry
      if (takeProfitPercent) {
        tpPercent = parseFloat(takeProfitPercent);

        if (tpPercent >= 100) {
          toast.error('Short position: TP% cannot be 100% or higher (price would go to zero or negative).');
          return;
        }

        slPercent = tpPercent / rr; // SL% = TP% / RR
        tpPrice = entry * (1 - tpPercent / 100);
        slPrice = entry * (1 + slPercent / 100);
      } else if (stopLossPercent) {
        slPercent = parseFloat(stopLossPercent);
        tpPercent = slPercent * rr; // TP% = SL% * RR

        if (tpPercent >= 100) {
          toast.error(`Short position: Calculated TP% (${tpPercent.toFixed(2)}%) would go negative. Reduce SL% or decrease Risk/Reward ratio.`);
          return;
        }

        slPrice = entry * (1 + slPercent / 100);
        tpPrice = entry * (1 - tpPercent / 100);
      }
    }

    if (tpPrice <= 0 || slPrice <= 0) {
      toast.error('Invalid TP/SL calculation. Check your inputs.');
      return;
    }

    const maxProfit =
      positionType === 'long'
        ? (tpPrice - entry) * coinsPurchased
        : (entry - tpPrice) * coinsPurchased;
    const maxLoss =
      positionType === 'long'
        ? (entry - slPrice) * coinsPurchased
        : (slPrice - entry) * coinsPurchased;

    const calculatedResults = {
      tpPrice: tpPrice.toFixed(2),
      slPrice: slPrice.toFixed(2),
      coinsPurchased: coinsPurchased.toFixed(4),
      maxProfit: maxProfit.toFixed(2),
      maxLoss: maxLoss.toFixed(2),
    };
    setResults(calculatedResults);
    saveData('results', calculatedResults);
    toast.success('TP/SL calculated successfully');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalcIcon className="w-5 h-5" />
          TP/SL Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="positionType">Position Type</Label>
          <Select
            value={positionType}
            onValueChange={(value) => {
              setPositionType(value);
              saveData('positionType', value);
            }}
          >
            <SelectTrigger id="positionType" className="w-full">
              <SelectValue placeholder="Select position type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="long">Long</SelectItem>
              <SelectItem value="short">Short</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="entryPrice">Entry Price</Label>
          <Input
            id="entryPrice"
            type="number"
            placeholder="0.00"
            value={entryPrice}
            onChange={(e) => {
              setEntryPrice(e.target.value);
              saveData('entryPrice', e.target.value);
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="investedAmount">Invested Amount</Label>
          <Input
            id="investedAmount"
            type="number"
            placeholder="0.00"
            value={investedAmount}
            onChange={(e) => {
              setInvestedAmount(e.target.value);
              saveData('investedAmount', e.target.value);
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="leverage">Leverage</Label>
          <Input
            id="leverage"
            type="number"
            placeholder="1"
            value={leverage}
            onChange={(e) => {
              setLeverage(e.target.value);
              saveData('leverage', e.target.value);
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="riskRewardRatio">Risk/Reward Ratio</Label>
          <Input
            id="riskRewardRatio"
            type="number"
            placeholder="2"
            value={riskRewardRatio}
            onChange={(e) => {
              setRiskRewardRatio(e.target.value);
              saveData('riskRewardRatio', e.target.value);
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="takeProfitPercent">Take Profit % (optional)</Label>
          <Input
            id="takeProfitPercent"
            type="number"
            step="any"
            placeholder="0.00"
            value={takeProfitPercent}
            onChange={(e) => {
              setTakeProfitPercent(e.target.value);
              saveData('takeProfitPercent', e.target.value);
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stopLossPercent">Stop Loss % (optional)</Label>
          <Input
            id="stopLossPercent"
            type="number"
            step="any"
            placeholder="0.00"
            value={stopLossPercent}
            onChange={(e) => {
              setStopLossPercent(e.target.value);
              saveData('stopLossPercent', e.target.value);
            }}
          />
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Either TP or SL is required to be filled, the other can be calculated from RR.
        </p>
        <Button onClick={calculateTPSL} className="w-full">
          Calculate
        </Button>
        {results && (
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">TP Price:</span>
              <span className="font-semibold">{results.tpPrice} USDT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">SL Price:</span>
              <span className="font-semibold">{results.slPrice} USDT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Coins Purchased:</span>
              <span className="font-semibold">{results.coinsPurchased}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Max Profit:</span>
              <span className="font-semibold text-green-500">{results.maxProfit} USDT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Max Loss:</span>
              <span className="font-semibold text-red-500">{results.maxLoss} USDT</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Order By Value Calculator Component
const OrderByValueCalculator = () => {
  const [positionType, setPositionType] = useState('long');
  const [entryPrice, setEntryPrice] = useState('');
  const [maxLoss, setMaxLoss] = useState('');
  const [leverage, setLeverage] = useState('');
  const [slPrice, setSlPrice] = useState('');
  const [orderValue, setOrderValue] = useState(null);
  const [marginRequired, setMarginRequired] = useState(null);

  // Load from store
  useEffect(() => {
    const loadData = async () => {
      const data = await window.api?.getStore('orderByValueCalculator');
      if (data) {
        const parsed = JSON.parse(data);
        setPositionType(parsed.positionType || 'long');
        setEntryPrice(parsed.entryPrice || '');
        setMaxLoss(parsed.maxLoss || '');
        setLeverage(parsed.leverage || '');
        setSlPrice(parsed.slPrice || '');
        setOrderValue(parsed.orderValue ?? null);
        setMarginRequired(parsed.marginRequired ?? null);
      }
    };
    loadData();
  }, []);

  // Save to store
  const saveData = async (field, value) => {
    const current = await window.api?.getStore('orderByValueCalculator');
    const data = current ? JSON.parse(current) : {};
    data[field] = value;
    await window.api?.setStore('orderByValueCalculator', JSON.stringify(data));
  };

  const calculateOrderByValue = () => {
    const entry = parseFloat(entryPrice);
    const loss = parseFloat(maxLoss);
    const lev = parseFloat(leverage);
    const stopLoss = parseFloat(slPrice);

    if (isNaN(entry) || isNaN(loss) || isNaN(lev) || isNaN(stopLoss)) {
      toast.error('Please enter valid numeric values.');
      return;
    }

    // Calculate per unit loss based on position type
    const perUnitLoss = positionType === 'long'
      ? entry - stopLoss  // Long: Entry > SL
      : stopLoss - entry; // Short: SL > Entry

    if (perUnitLoss <= 0) {
      const errorMsg = positionType === 'long'
        ? 'For Long: Stop-loss must be below entry price.'
        : 'For Short: Stop-loss must be above entry price.';
      toast.error(errorMsg);
      return;
    }

    const positionSize = loss / perUnitLoss;
    const totalOrderValue = +(positionSize * entry).toFixed(3);
    const requiredMargin = +(totalOrderValue / lev).toFixed(3);

    setOrderValue(totalOrderValue);
    setMarginRequired(requiredMargin);
    saveData('orderValue', totalOrderValue);
    saveData('marginRequired', requiredMargin);
    toast.success('Order value calculated successfully');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalcIcon className="w-5 h-5" />
          Order by Value Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="positionTypeOBV">Position Type</Label>
          <Select
            value={positionType}
            onValueChange={(value) => {
              setPositionType(value);
              saveData('positionType', value);
            }}
          >
            <SelectTrigger id="positionTypeOBV" className="w-full">
              <SelectValue placeholder="Select position type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="long">Long</SelectItem>
              <SelectItem value="short">Short</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="entryPriceOBV">Entry Price</Label>
          <Input
            id="entryPriceOBV"
            type="number"
            placeholder="0.00"
            value={entryPrice}
            onChange={(e) => {
              setEntryPrice(e.target.value);
              saveData('entryPrice', e.target.value);
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="maxLoss">Max Loss</Label>
          <Input
            id="maxLoss"
            type="number"
            placeholder="0.00"
            value={maxLoss}
            onChange={(e) => {
              setMaxLoss(e.target.value);
              saveData('maxLoss', e.target.value);
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="leverageOBV">Leverage</Label>
          <Input
            id="leverageOBV"
            type="number"
            placeholder="1"
            value={leverage}
            onChange={(e) => {
              setLeverage(e.target.value);
              saveData('leverage', e.target.value);
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slPrice">Stop Loss Price</Label>
          <Input
            id="slPrice"
            type="number"
            placeholder="0.00"
            value={slPrice}
            onChange={(e) => {
              setSlPrice(e.target.value);
              saveData('slPrice', e.target.value);
            }}
          />
        </div>
        <Button onClick={calculateOrderByValue} className="w-full">
          Calculate
        </Button>
        {orderValue !== null && marginRequired !== null && (
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Order Value:</span>
              <span className="font-semibold">{orderValue} USDT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Required Margin:</span>
              <span className="font-semibold">{marginRequired} USDT</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Main Calculator Component
const Calculator = () => {
  return (
    <div className="flex-1 space-y-6 p-6 w-full">
      <div className="flex items-center justify-between w-full">
        <h2 className="text-3xl font-bold tracking-tight">Trading Calculators</h2>
      </div>

      <Tabs defaultValue="entry" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
          <TabsTrigger value="entry">Entry</TabsTrigger>
          <TabsTrigger value="tpsl">TP/SL</TabsTrigger>
          <TabsTrigger value="order">Order Value</TabsTrigger>
        </TabsList>
        <TabsContent value="entry" className="mt-6">
          <EntryCalculator />
        </TabsContent>
        <TabsContent value="tpsl" className="mt-6">
          <TPSLCalculator />
        </TabsContent>
        <TabsContent value="order" className="mt-6">
          <OrderByValueCalculator />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Calculator;
