import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  price: string;
  originalPrice: string;
  status: "active" | "pending" | "sold" | "offline";
  views: number;
  likes: number;
  image: string;
}

const products: Product[] = [
  {
    id: "1",
    name: "iPhone 14 Pro Max 256G 深紫色 国行 99新",
    price: "¥5,899",
    originalPrice: "¥8,999",
    status: "active",
    views: 1234,
    likes: 56,
    image: "📱",
  },
  {
    id: "2",
    name: "索尼 WH-1000XM5 头戴式降噪耳机 黑色",
    price: "¥1,899",
    originalPrice: "¥2,999",
    status: "active",
    views: 856,
    likes: 34,
    image: "🎧",
  },
  {
    id: "3",
    name: "MacBook Air M2 8+256 午夜色",
    price: "¥6,499",
    originalPrice: "¥9,499",
    status: "pending",
    views: 2341,
    likes: 89,
    image: "💻",
  },
  {
    id: "4",
    name: "Nintendo Switch OLED 日版 白色",
    price: "¥1,799",
    originalPrice: "¥2,480",
    status: "sold",
    views: 567,
    likes: 23,
    image: "🎮",
  },
  {
    id: "5",
    name: "戴森 V15 Detect 无线吸尘器",
    price: "¥3,299",
    originalPrice: "¥5,999",
    status: "active",
    views: 432,
    likes: 18,
    image: "🧹",
  },
  {
    id: "6",
    name: "Apple Watch Ultra 2 钛金属 49mm",
    price: "¥5,199",
    originalPrice: "¥6,499",
    status: "offline",
    views: 789,
    likes: 45,
    image: "⌚",
  },
];

const statusConfig = {
  active: { label: "在售中", className: "bg-success/15 text-success border-success/30" },
  pending: { label: "审核中", className: "bg-warning/15 text-warning border-warning/30" },
  sold: { label: "已售出", className: "bg-muted text-muted-foreground border-muted" },
  offline: { label: "已下架", className: "bg-destructive/15 text-destructive border-destructive/30" },
};

const Products = () => {
  return (
    <MainLayout title="商品管理">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="搜索商品名称、描述..."
            className="pl-9 bg-card"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">
            <Filter className="w-4 h-4 mr-2" />
            筛选
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            发布商品
          </Button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="stat-card group cursor-pointer animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex gap-4">
              {/* Product Image */}
              <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center text-3xl flex-shrink-0">
                {product.image}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-lg font-semibold text-primary">
                    {product.price}
                  </span>
                  <span className="text-xs text-muted-foreground line-through">
                    {product.originalPrice}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className={cn("font-normal text-xs", statusConfig[product.status].className)}
                  >
                    {statusConfig[product.status].label}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {product.views} 浏览 · {product.likes} 想要
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
};

export default Products;
