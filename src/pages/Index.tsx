import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { QuickActions } from "@/components/dashboard/QuickActions";

const stats = [
  {
    title: "在售商品",
    value: "128",
    change: "+12 本周新增",
    changeType: "positive" as const,
    icon: Package,
  },
  {
    title: "待处理订单",
    value: "23",
    change: "8 个需今日发货",
    changeType: "neutral" as const,
    icon: ShoppingCart,
  },
  {
    title: "本月销售额",
    value: "¥45,890",
    change: "+18.2% 较上月",
    changeType: "positive" as const,
    icon: DollarSign,
  },
  {
    title: "商品曝光量",
    value: "12.5K",
    change: "+5.3% 较昨日",
    changeType: "positive" as const,
    icon: TrendingUp,
  },
];

const Index = () => {
  return (
    <MainLayout>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div
            key={stat.title}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Recent Orders - Takes 3 columns */}
        <div className="lg:col-span-3">
          <RecentOrders />
        </div>

        {/* Quick Actions - Takes 1 column */}
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
