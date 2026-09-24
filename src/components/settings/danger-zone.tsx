"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { AlertTriangle, LogOut } from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
  ModalClose,
} from "@/components/ui/modal";

export function DangerZone() {
  const { logout } = useAuth();
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeleteAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (deleteConfirmation !== "DELETE") {
      return; // Handled by button disabled state mostly, but a safety check
    }
    
    setIsDeleting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsDeleting(false);
      setIsModalOpen(false);
      setDeleteConfirmation("");
      logout();
      toast.success("Account deleted", {
        description: "Your MoneyFlow account has been permanently deleted.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <Card className="border-destructive/30 shadow-sm overflow-hidden bg-destructive/5">
        <CardHeader className="border-b border-destructive/10 pb-4">
          <CardTitle className="text-destructive flex items-center text-xl">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Danger Zone
          </CardTitle>
          <CardDescription className="text-destructive/80">
            Destructive actions for your MoneyFlow account.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <h4 className="font-semibold text-sm text-foreground">Sign Out</h4>
              <p className="text-xs text-muted-foreground">Sign out from this device.</p>
            </div>
            <Button variant="outline" onClick={logout} className="border-border/50 hover:bg-secondary">
              <LogOut className="w-4 h-4 mr-2 text-muted-foreground" />
              Sign Out
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-destructive/10">
            <div className="space-y-1">
              <h4 className="font-semibold text-sm text-foreground">Delete Account</h4>
              <p className="text-xs text-muted-foreground">Permanently delete your account and associated data.</p>
            </div>
            
            <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
              <ModalTrigger asChild>
                <Button variant="destructive">
                  Delete Account
                </Button>
              </ModalTrigger>
              <ModalContent>
                <ModalHeader>
                  <ModalTitle className="text-destructive flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Delete Account
                  </ModalTitle>
                  <ModalDescription className="pt-2">
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                  </ModalDescription>
                </ModalHeader>
                
                <div className="my-6 space-y-3">
                  <label className="text-sm font-medium text-foreground">
                    Please type <span className="font-bold text-destructive">DELETE</span> to confirm.
                  </label>
                  <Input 
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    placeholder="DELETE" 
                    className="border-destructive/30 focus-visible:ring-destructive"
                  />
                </div>
                
                <ModalFooter>
                  <ModalClose asChild>
                    <Button variant="outline" onClick={() => setDeleteConfirmation("")} disabled={isDeleting}>
                      Cancel
                    </Button>
                  </ModalClose>
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirmation !== "DELETE" || isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete Account"}
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
