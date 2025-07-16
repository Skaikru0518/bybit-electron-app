import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';
export const stats = [
  {
    title: 'Total Balance',
    value: '$12,345.67',
    change: '+2.5%',
    icon: DollarSign,
    positive: true,
  },
  {
    title: 'Unrealized P&L',
    value: '+$234.56',
    change: '+5.2%',
    icon: TrendingUp,
    positive: true,
  },
  {
    title: 'Open Positions',
    value: '3',
    change: 'Active',
    icon: Activity,
    positive: true,
  },
  {
    title: "Today's P&L",
    value: '-$45.23',
    change: '-1.2%',
    icon: TrendingDown,
    positive: false,
  },
];
