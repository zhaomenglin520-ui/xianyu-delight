import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Order {
  id: string;
  product: string;
  customer: string;
  amount: string;
  status: "pending" | "shipped" | "completed" | "cancelled";
  time: string;
}

const orders: Order[] = [
  {
    id: "XY20250129001",
    product: "iPhone 14 Pro Max 256G",
    customer: "张*明",
    amount: "¥5,899",
    status: "pending",
    time: "10分钟前",
  },
  {
    id: "XY20250129002",
    product: "索尼 WH-1000XM5 降噪耳机",
    customer: "李*华",
    amount: "¥1,899",
    status: "shipped",
    time: "30分钟前",
  },
  {
    id: "XY20250129003",
    product: "MacBook Air M2 8+256",
    customer: "王*",
    amount: "¥6,499",
    status: "completed",
    time: "1小时前",
  },
  {
    id: "XY20250129004",
    product: "Nintendo Switch OLED",
    customer: "赵*龙",
    amount: "¥1,799",
    status: "completed",
    time: "2小时前",
  },
  {
    id: "XY20250129005",
    product: "戴森 V15 Detect 吸尘器",
    customer: "陈*",
    amount: "¥3,299",
    status: "cancelled",
    time: "3小时前",
  },
];

const statusConfig = {
  pending: { label: "待发货", className: "bg-warning/15 text-warning border-warning/30" },
  shipped: { label: "已发货", className: "bg-primary/15 text-primary border-primary/30" },
  completed: { label: "已完成", className: "bg-success/15 text-success border-success/30" },
  cancelled: { label: "已取消", className: "bg-muted text-muted-foreground border-muted" },
};

export function RecentOrders() {
  return (
    <div className="table-container">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="font-semibold text-foreground">最近订单</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                订单号
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                商品
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                客户
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                金额
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                状态
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                时间
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order, index) => (
              <tr
                key={order.id}
                className="hover:bg-muted/30 transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="px-5 py-4 text-sm font-medium text-foreground">
                  {order.id}
                </td>
                <td className="px-5 py-4 text-sm text-foreground max-w-[200px] truncate">
                  {order.product}
                </td>
                <td className="px-5 py-4 text-sm text-muted-foreground">
                  {order.customer}
                </td>
                <td className="px-5 py-4 text-sm font-medium text-foreground">
                  {order.amount}
                </td>
                <td className="px-5 py-4">
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-normal",
                      statusConfig[order.status].className
                    )}
                  >
                    {statusConfig[order.status].label}
                  </Badge>
                </td>
                <td className="px-5 py-4 text-sm text-muted-foreground">
                  {order.time}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
