"use client"

import { cn } from "@/lib/utils"
import {
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  SendHorizontal,
  QrCode,
  Plus,
  ArrowRight,
  CreditCard,
  Trash2,
  X,
} from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AccountItem {
  id: string
  title: string
  description?: string
  balance: string
  type: "savings" | "checking" | "investment" | "debt"
}

interface List01Props {
  totalBalance?: string
  accounts?: AccountItem[]
  className?: string
}

const DEFAULT_ACCOUNTS: AccountItem[] = [
  {
    id: "1",
    title: "Primary Savings",
    description: "Emergency fund",
    balance: "$12,459.45",
    type: "savings",
  },
  {
    id: "2",
    title: "Everyday Spending",
    description: "Monthly expenses",
    balance: "$3,850.00",
    type: "checking",
  },
  {
    id: "3",
    title: "Market Portfolio",
    description: "Stocks & ETFs",
    balance: "$22,730.80",
    type: "investment",
  },
  {
    id: "4",
    title: "Platinum Card",
    description: "Current balance",
    balance: "$2,100.00",
    type: "debt",
  },
]

export default function List01({
  totalBalance: initialTotalBalance = "$39,040.25",
  accounts: initialAccounts = DEFAULT_ACCOUNTS,
  className,
}: List01Props) {
  const [accounts, setAccounts] = useState<AccountItem[]>(initialAccounts)
  const [totalBalance, setTotalBalance] = useState(initialTotalBalance)
  const [newAccount, setNewAccount] = useState<Partial<AccountItem>>({
    title: "",
    description: "",
    balance: "",
    type: "checking",
  })
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null)

  const handleAddAccount = () => {
    if (!newAccount.title || !newAccount.balance) return

    const newAccountItem: AccountItem = {
      id: `account-${Date.now()}`,
      title: newAccount.title || "New Account",
      description: newAccount.description,
      balance: newAccount.balance.startsWith("$") ? newAccount.balance : `$${newAccount.balance}`,
      type: newAccount.type as "savings" | "checking" | "investment" | "debt",
    }

    setAccounts([...accounts, newAccountItem])

    // Recalculate total balance
    const numericBalance = Number.parseFloat(newAccount.balance.replace(/[$,]/g, ""))
    const currentTotalBalance = Number.parseFloat(totalBalance.replace(/[$,]/g, ""))
    const newTotalBalance = (currentTotalBalance + numericBalance).toFixed(2)
    setTotalBalance(`$${newTotalBalance}`)

    // Reset form
    setNewAccount({
      title: "",
      description: "",
      balance: "",
      type: "checking",
    })

    setIsAddDialogOpen(false)
  }

  const handleDeleteAccount = (id: string) => {
    setAccountToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteAccount = () => {
    if (!accountToDelete) return

    const accountToRemove = accounts.find((acc) => acc.id === accountToDelete)
    if (!accountToRemove) return

    // Recalculate total balance
    const numericBalance = Number.parseFloat(accountToRemove.balance.replace(/[$,]/g, ""))
    const currentTotalBalance = Number.parseFloat(totalBalance.replace(/[$,]/g, ""))
    const newTotalBalance = (currentTotalBalance - numericBalance).toFixed(2)
    setTotalBalance(`$${newTotalBalance}`)

    setAccounts(accounts.filter((account) => account.id !== accountToDelete))
    setIsDeleteDialogOpen(false)
    setAccountToDelete(null)
  }

  return (
    <div
      className={cn(
        "w-full max-w-xl mx-auto",
        "bg-white dark:bg-zinc-900/70",
        "border border-zinc-100 dark:border-zinc-800",
        "rounded-xl shadow-sm backdrop-blur-xl",
        className,
      )}
    >
      {/* Total Balance Section */}
      <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
        <p className="text-xs text-zinc-600 dark:text-zinc-400">Total Balance</p>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{totalBalance}</h1>
      </div>

      {/* Accounts List */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-medium text-zinc-900 dark:text-zinc-100">Your Accounts</h2>
        </div>

        <div className="space-y-1">
          {accounts.map((account) => (
            <div
              key={account.id}
              className={cn(
                "group flex items-center justify-between",
                "p-2 rounded-lg",
                "hover:bg-zinc-100 dark:hover:bg-zinc-800/50",
                "transition-all duration-200",
              )}
            >
              <div className="flex items-center gap-2">
                <div
                  className={cn("p-1.5 rounded-lg", {
                    "bg-emerald-100 dark:bg-emerald-900/30": account.type === "savings",
                    "bg-blue-100 dark:bg-blue-900/30": account.type === "checking",
                    "bg-purple-100 dark:bg-purple-900/30": account.type === "investment",
                    "bg-red-100 dark:bg-red-900/30": account.type === "debt",
                  })}
                >
                  {account.type === "savings" && (
                    <Wallet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  )}
                  {account.type === "checking" && <QrCode className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                  {account.type === "investment" && (
                    <ArrowUpRight className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  )}
                  {account.type === "debt" && <CreditCard className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />}
                </div>
                <div>
                  <h3 className="text-xs font-medium text-zinc-900 dark:text-zinc-100">{account.title}</h3>
                  {account.description && (
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400">{account.description}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">{account.balance}</span>
                <button
                  onClick={() => handleDeleteAccount(account.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Updated footer with four buttons */}
      <div className="p-2 border-t border-zinc-100 dark:border-zinc-800">
        <div className="grid grid-cols-4 gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                className={cn(
                  "flex items-center justify-center gap-2",
                  "py-2 px-3 rounded-lg",
                  "text-xs font-medium",
                  "bg-gradient-to-r from-teal-500 to-cyan-600",
                  "text-white",
                  "hover:from-teal-600 hover:to-cyan-700",
                  "shadow-sm hover:shadow",
                  "transition-all duration-200",
                )}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Account</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="account-name">Account Name</Label>
                  <Input
                    id="account-name"
                    value={newAccount.title}
                    onChange={(e) => setNewAccount({ ...newAccount, title: e.target.value })}
                    placeholder="e.g. Vacation Fund"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="account-description">Description (Optional)</Label>
                  <Input
                    id="account-description"
                    value={newAccount.description}
                    onChange={(e) => setNewAccount({ ...newAccount, description: e.target.value })}
                    placeholder="e.g. Savings for summer trip"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="account-balance">Balance</Label>
                  <Input
                    id="account-balance"
                    value={newAccount.balance}
                    onChange={(e) => setNewAccount({ ...newAccount, balance: e.target.value })}
                    placeholder="e.g. 5000.00"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="account-type">Account Type</Label>
                  <Select
                    value={newAccount.type}
                    onValueChange={(value) => setNewAccount({ ...newAccount, type: value as any })}
                  >
                    <SelectTrigger id="account-type">
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="savings">Savings</SelectItem>
                      <SelectItem value="checking">Checking</SelectItem>
                      <SelectItem value="investment">Investment</SelectItem>
                      <SelectItem value="debt">Debt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddAccount}>Add Account</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <button
            type="button"
            className={cn(
              "flex items-center justify-center gap-2",
              "py-2 px-3 rounded-lg",
              "text-xs font-medium",
              "bg-zinc-900 dark:bg-zinc-50",
              "text-zinc-50 dark:text-zinc-900",
              "hover:bg-zinc-800 dark:hover:bg-zinc-200",
              "shadow-sm hover:shadow",
              "transition-all duration-200",
            )}
          >
            <SendHorizontal className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
          <button
            type="button"
            className={cn(
              "flex items-center justify-center gap-2",
              "py-2 px-3 rounded-lg",
              "text-xs font-medium",
              "bg-zinc-900 dark:bg-zinc-50",
              "text-zinc-50 dark:text-zinc-900",
              "hover:bg-zinc-800 dark:hover:bg-zinc-200",
              "shadow-sm hover:shadow",
              "transition-all duration-200",
            )}
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>Top-up</span>
          </button>
          <button
            type="button"
            className={cn(
              "flex items-center justify-center gap-2",
              "py-2 px-3 rounded-lg",
              "text-xs font-medium",
              "bg-zinc-900 dark:bg-zinc-50",
              "text-zinc-50 dark:text-zinc-900",
              "hover:bg-zinc-800 dark:hover:bg-zinc-200",
              "shadow-sm hover:shadow",
              "transition-all duration-200",
            )}
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>More</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Remove Account</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Are you sure you want to remove this account? This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteAccount}>
              <Trash2 className="mr-2 h-4 w-4" />
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
