import { MainLayout } from "@/components/layout/MainLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface Order {
  id: string;
  product: string;
  productImage: string;
  customer: string;
  amount: string;
  status: "pending" | "shipped" | "completed" | "cancelled" | "refunding";
  time: string;
  address: string;
}

const orders: Order[] = [
  {
    id: "XY20250129001",
    product: "iPhone 14 Pro Max 256G",
    productImage: "📱",
    customer: "张*明",
    amount: "¥5,899",
    status: "pending",
    time: "2025-01-29 10:30",
    address: "广东省深圳市南山区***",
  },
  {
    id: "XY20250129002",
    product: "索尼 WH-1000XM5 降噪耳机",
    productImage: "🎧",
    customer: "李*华",
    amount: "¥1,899",
    status: "shipped",
    time: "2025-01-29 09:15",
    address: "上海市浦东新区***",
  },
  {
    id: "XY20250128003",
    product: "MacBook Air M2 8+256",
    productImage: "💻",
    customer: "王*",
    amount: "¥6,499",
    status: "completed",
    time: "2025-01-28 16:20",
    address: "北京市朝阳区***",
  },
  {
    id: "XY20250128004",
    product: "Nintendo Switch OLED",
    productImage: "🎮",
    customer: "赵*龙",
    amount: "¥1,799",
    status: "completed",
    time: "2025-01-28 14:45",
    address: "浙江省杭州市西湖区***",
  },
  {
    id: "XY20250127005",
    product: "戴森 V15 Detect 吸尘器",
    productImage: "🧹",
    customer: "陈*",
    amount: "¥3,299",
    status: "refunding",
    time: "2025-01-27 11:00",
    address: "江苏省南京市鼓楼区***",
  },
];

const statusConfig = {
  pending: { label: "待发货", className: "bg-warning/15 text-warning border-warning/30" },
  shipped: { label: "已发货", className: "bg-primary/15 text-primary border-primary/30" },
  completed: { label: "已完成", className: "bg-success/15 text-success border-success/30" },
  cancelled: { label: "已取消", className: "bg-muted text-muted-foreground border-muted" },
  refunding: { label: "退款中", className: "bg-destructive/15 text-destructive border-destructive/30" },
};

const Orders = () => {
  return (
    <MainLayout title="订单管理">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="搜索订单号、商品、客户..."
            className="pl-9 bg-card"
          />
        </div>
        <Button variant="secondary">
          <Filter className="w-4 h-4 mr-2" />
          筛选
        </Button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order, index) => (
          <div
            key={order.id}
            className="stat-card animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Order Info */}
              <div className="flex gap-4 flex-1 min-w-0">
                <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center text-2xl flex-shrink-0">
                  {order.productImage}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-muted-foreground">
                      {order.id}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn("font-normal text-xs", statusConfig[order.status].className)}
                    >
                      {statusConfig[order.status].label}
                    </Badge>
                  </div>
                  <h3 className="font-medium text-foreground truncate mb-1">
                    {order.product}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {order.customer} · {order.address}
                  </p>
                </div>
              </div>

              {/* Order Details */}
              <div className="flex items-center justify-between lg:justify-end gap-6">
                <div className="text-right">
                  <p className="text-lg font-semibold text-foreground">
                    {order.amount}
                  </p>
                  <p className="text-xs text-muted-foreground">{order.time}</p>
                </div>
                {order.status === "pending" && (
                  <Button size="sm">
                    <Package className="w-4 h-4 mr-1" />
                    发货
                  </Button>
                )}
                {order.status === "shipped" && (
                  <Button size="sm" variant="secondary">
                    查看物流
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
};

export default Orders;
