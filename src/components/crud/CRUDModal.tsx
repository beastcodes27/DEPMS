import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';

interface CRUDModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  onSubmit?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
  mode: 'create' | 'edit' | 'view';
}

export function CRUDModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  onSubmit,
  submitLabel: _submitLabel = 'Save',
  cancelLabel = 'Cancel',
  isSubmitting = false,
  mode,
}: CRUDModalProps) {
  const getTitle = () => {
    switch (mode) {
      case 'create':
        return `Create ${title}`;
      case 'edit':
        return `Edit ${title}`;
      case 'view':
        return `View ${title}`;
      default:
        return title;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 gap-0 rounded-2xl">
        <DialogHeader className="px-6 py-4 border-b border-border/50">
          <DialogTitle className="text-lg font-semibold">{getTitle()}</DialogTitle>
          {description && (
            <DialogDescription className="text-sm text-muted-foreground">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="px-6 py-4">{children}</div>
        </ScrollArea>

        {mode !== 'view' && onSubmit && (
          <DialogFooter className="px-6 py-4 border-t border-border/50 gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl h-10"
            >
              {cancelLabel}
            </Button>
            <Button
              onClick={onSubmit}
              disabled={isSubmitting}
              className="rounded-xl h-10"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === 'create' ? 'Create' : 'Update'}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
