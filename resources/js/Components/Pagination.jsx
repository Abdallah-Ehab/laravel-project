import { Link } from '@inertiajs/react';
import { Button } from '@/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ data }) {
    if (data.last_page <= 1) return null;

    return (
        <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-muted-foreground">
                Showing {data.from} to {data.to} of {data.total} results
            </p>
            <div className="flex gap-1">
                {data.prev_page_url ? (
                    <Link href={data.prev_page_url}>
                        <Button variant="outline" size="sm"><ChevronLeft className="h-4 w-4 mr-1" /> Previous</Button>
                    </Link>
                ) : (
                    <Button variant="outline" size="sm" disabled><ChevronLeft className="h-4 w-4 mr-1" /> Previous</Button>
                )}
                {Array.from({ length: data.last_page }, (_, i) => i + 1)
                    .filter(page => page === 1 || page === data.last_page || Math.abs(page - data.current_page) <= 1)
                    .reduce((acc, page, i, arr) => {
                        if (i > 0 && page - arr[i - 1] > 1) acc.push('...');
                        acc.push(page);
                        return acc;
                    }, [])
                    .map((item, i) =>
                        item === '...' ? (
                            <span key={i} className="px-2 py-1 text-sm text-muted-foreground">...</span>
                        ) : (
                            <Link key={i} href={item === data.current_page ? '#' : data.path + '?page=' + item}>
                                <Button variant={item === data.current_page ? 'default' : 'outline'} size="sm" disabled={item === data.current_page}>{item}</Button>
                            </Link>
                        )
                    )}
                {data.next_page_url ? (
                    <Link href={data.next_page_url}>
                        <Button variant="outline" size="sm">Next <ChevronRight className="h-4 w-4 ml-1" /></Button>
                    </Link>
                ) : (
                    <Button variant="outline" size="sm" disabled>Next <ChevronRight className="h-4 w-4 ml-1" /></Button>
                )}
            </div>
        </div>
    );
}