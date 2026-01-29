import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { AccountForm } from "@/components/accounts/AccountForm";
import { AccountList } from "@/components/accounts/AccountList";
import { Account } from "@/types";

// Mock data for demonstration
const mockAccounts: Account[] = [
  {
    id: "acc_001",
    cookies: "mock_cookie_string_1",
    userId: "12345678",
    nickname: "闲鱼小能手",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    enabled: true,
    remark: "主账号",
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-01-20T10:30:00Z",
    status: {
      accountId: "acc_001",
      connected: true,
      lastHeartbeat: "2024-01-20T10:30:00Z",
    },
  },
  {
    id: "acc_002",
    cookies: "mock_cookie_string_2",
    userId: "87654321",
    nickname: "二手交易达人",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bella",
    enabled: true,
    remark: "副账号",
    proxyType: "http",
    proxyHost: "127.0.0.1",
    proxyPort: 7890,
    createdAt: "2024-01-10T12:00:00Z",
    updatedAt: "2024-01-18T15:45:00Z",
    status: {
      accountId: "acc_002",
      connected: false,
      errorMessage: "Cookie已过期",
    },
  },
];

export default function Accounts() {
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = (account: Partial<Account>) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (editingAccount) {
        setAccounts(accounts.map(a => 
          a.id === editingAccount.id ? { ...a, ...account } : a
        ));
      } else {
        const newAccount: Account = {
          ...account as Account,
          id: `acc_${Date.now()}`,
          cookies: account.cookies || "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: { accountId: `acc_${Date.now()}`, connected: false },
        };
        setAccounts([...accounts, newAccount]);
      }
      setEditingAccount(null);
      setIsLoading(false);
    }, 1000);
  };

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
  };

  const handleDelete = (accountId: string) => {
    setAccounts(accounts.filter(a => a.id !== accountId));
  };

  const handleCancel = () => {
    setEditingAccount(null);
  };

  const handleToggleStatus = (accountId: string, connected: boolean) => {
    setAccounts(accounts.map(a => 
      a.id === accountId 
        ? { ...a, status: { ...a.status!, connected } }
        : a
    ));
  };

  return (
    <MainLayout>
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Form Area - 1/3 width on desktop */}
          <div className="w-full lg:w-1/3">
            <AccountForm
              account={editingAccount}
              onSave={handleSave}
              onCancel={handleCancel}
              isLoading={isLoading}
            />
          </div>

          {/* Right List Area - 2/3 width on desktop */}
          <div className="w-full lg:w-2/3">
            <AccountList
              accounts={accounts}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
