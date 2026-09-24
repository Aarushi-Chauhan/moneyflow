import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface BudgetCardProps {
  budget: any;
  onEdit: (budget: any) => void;
  onDelete: (id: string) => void;
}

export function BudgetCard({ budget, onEdit, onDelete }: BudgetCardProps) {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Determine progress bar color based on status
  let progressColor = "bg-emerald-500";
  let statusColor = "text-emerald-500";
  
  if (budget.status === 'over budget') {
    progressColor = "bg-destructive";
    statusColor = "text-destructive";
  } else if (budget.status === 'almost reached') {
    progressColor = "bg-amber-500";
    statusColor = "text-amber-500";
  }

  // Format date display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Constrain percentage for the progress bar visual (max 100%)
  const visualPercentage = Math.min(Math.max(budget.percentageUsed, 0), 100);

  return (
    <Card className="hover:border-primary/50 transition-colors relative overflow-hidden">
      {/* Top colorful accent bar */}
      <div className={`h-1 w-full ${progressColor} opacity-70`} />
      
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm uppercase">
              {budget.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{budget.name}</h3>
              <p className="text-xs text-muted-foreground">{budget.category.name}</p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onSelect={(e) => {
                  e.preventDefault();
                  setTimeout(() => onEdit(budget), 100);
                }} 
                className="cursor-pointer"
              >
                <Pencil className="w-4 h-4 mr-2" /> Edit Budget
              </DropdownMenuItem>
              <DropdownMenuItem 
                onSelect={(e) => {
                  e.preventDefault();
                  // We must delay opening the AlertDialog to avoid Radix UI focus lock race conditions
                  setTimeout(() => onDelete(budget.id), 100);
                }} 
                className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete Budget
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-2xl font-bold">{formatCurrency(budget.spent)}</span>
              <span className="text-sm text-muted-foreground ml-1">spent</span>
            </div>
            <div className="text-sm font-medium text-muted-foreground">
              of {formatCurrency(budget.limit)}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
            <div 
              className={`h-full ${progressColor} transition-all duration-500 rounded-full`}
              style={{ width: `${visualPercentage}%` }}
            />
          </div>

          <div className="flex justify-between text-sm font-medium">
            <span>{budget.percentageUsed.toFixed(1)}% used</span>
            <span className={budget.remaining < 0 ? "text-destructive" : ""}>
              {budget.remaining < 0 ? "-" : ""}{formatCurrency(Math.abs(budget.remaining))} remaining
            </span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t text-xs">
            <div className="flex items-center gap-1.5 font-medium">
              <span className={`w-2 h-2 rounded-full ${progressColor}`} />
              <span className="capitalize">{budget.status}</span>
            </div>
            <div className="text-muted-foreground capitalize">
              {formatDate(budget.startDate)} - {formatDate(budget.endDate)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
