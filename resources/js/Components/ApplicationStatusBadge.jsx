import { Badge } from '@/ui/badge';

const variants = { pending: 'warning', accepted: 'success', rejected: 'destructive' };
const labels = { pending: 'Pending', accepted: 'Accepted', rejected: 'Rejected' };

export default function ApplicationStatusBadge({ status }) {
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
}