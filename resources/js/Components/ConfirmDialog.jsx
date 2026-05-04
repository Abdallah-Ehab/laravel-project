import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/ui/dialog';
import { Button } from '@/ui/button';

export default function ConfirmDialog({ trigger, title, description, onConfirm, confirmLabel = 'Confirm', variant = 'destructive' }) {
    return (
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogTrigger asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogTrigger>
                    <Button variant={variant} onClick={onConfirm}>{confirmLabel}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}