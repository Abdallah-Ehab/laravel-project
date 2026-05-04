import { Badge } from '@/ui/badge';

const variants = { pending: 'warning', approved: 'success', rejected: 'destructive' };

export default function JobStatusBadge({ status }) {
    return <Badge variant={variants[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
}