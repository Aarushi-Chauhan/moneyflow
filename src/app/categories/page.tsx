"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [type, setType] = useState("expense");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/categories');
      if (res) {
        setCategories(res);
      }
    } catch (err) {
      toast.error("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentCategoryId(null);
    setName("");
    setType("expense");
    setIsModalOpen(true);
  };

  const openEditModal = (category: any) => {
    setIsEditing(true);
    setCurrentCategoryId(category.id);
    setName(category.name);
    setType(category.type);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    try {
      if (isEditing && currentCategoryId) {
        await api.put(`/categories/${currentCategoryId}`, { name, type });
        toast.success("Category updated");
      } else {
        await api.post('/categories', { name, type });
        toast.success("Category added");
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      toast.error(err.message || "Failed to save category");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success("Category deleted");
      fetchCategories();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete category");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-500 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Categories</h2>
          <p className="text-muted-foreground mt-1">
            Organize your transactions for better analytics.
          </p>
        </div>
        <Button className="h-11 px-6" onClick={openAddModal}>
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <Card key={category.id} className="hover:border-primary/50 transition-colors group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-base font-semibold flex items-center gap-3 w-full">
                  <div
                    className="w-10 h-10 rounded-full flex flex-shrink-0 items-center justify-center opacity-80 bg-primary/10 text-primary"
                    style={category.color ? { backgroundColor: `${category.color}20`, color: category.color } : {}}
                  >
                    <span className="font-bold text-sm uppercase">{category.name.charAt(0)}</span>
                  </div>
                  <span className="truncate flex-1" title={category.name}>{category.name}</span>
                </CardTitle>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEditModal(category)} className="cursor-pointer">
                      <Pencil className="w-4 h-4 mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(category.id)} className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <Badge
                    variant="outline"
                    className={category.type === "income"
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-200"
                      : "bg-background text-muted-foreground"
                    }
                  >
                    {category.type.charAt(0).toUpperCase() + category.type.slice(1)}
                  </Badge>
                  <div className="text-xs font-medium text-muted-foreground">
                    {category.transaction_count || 0} transactions
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {categories.length === 0 && (
            <div className="col-span-full py-12 text-center border border-dashed rounded-xl border-border">
              <p className="text-muted-foreground">No categories found. Create one to get started.</p>
            </div>
          )}
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit Category" : "Add Category"}</DialogTitle>
              <DialogDescription>
                {isEditing ? "Modify your category details." : "Create a new category to organize your transactions."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Category Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Groceries"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Type</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Add Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
