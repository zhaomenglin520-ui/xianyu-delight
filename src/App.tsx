import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Conversations from "./pages/Conversations";
import WorkflowPage from "./pages/Workflow";
import AutoReply from "./pages/AutoReply";
import AutoSell from "./pages/AutoSell";
import Accounts from "./pages/Accounts";
import NotificationChannels from "./pages/NotificationChannels";
import Notifications from "./pages/Notifications";
import SystemLogs from "./pages/SystemLogs";
import AISettings from "./pages/AISettings";
import UserManagement from "./pages/UserManagement";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Forbidden from "./pages/Forbidden";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/conversations" element={<Conversations />} />
            <Route path="/ship-workflow" element={<WorkflowPage />} />
            <Route path="/auto-reply" element={<AutoReply />} />
            <Route path="/auto-ship" element={<AutoSell />} />
            <Route path="/notification-channels" element={<NotificationChannels />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/logs" element={<SystemLogs />} />
            <Route path="/ai-settings" element={<AISettings />} />
            <Route path="/user-management" element={<UserManagement />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/forbidden" element={<Forbidden />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
