import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ data }) {
    if (data.last_page <= 1) return null;

    const btn = (page, current) =>
        page === current
            ? 'h-8 min-w-[32px] px-2 inline-flex items-center justify-center text-sm font-medium bg-[#14a800] text-white rounded-lg'
            : 'h-8 min-w-[32px] px-2 inline-flex items-center justify-center text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition';

    return (
        <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
                Showing <span className="font-medium text-gray-700">{data.from}</span> to{' '}
                <span className="font-medium text-gray-700">{data.to}</span> of{' '}
                <span className="font-medium text-gray-700">{data.total}</span> results
            </p>
            <div className="flex items-center gap-1">
                {data.prev_page_url ? (
                    <Link href={data.prev_page_url} className={btn('prev', data.current_page)}>
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                ) : (
                    <span className="h-8 min-w-[32px] px-2 inline-flex items-center justify-center text-sm text-gray-300 rounded-lg cursor-default">
                        <ChevronLeft className="h-4 w-4" />
                    </span>
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
                            <span key={i} className="h-8 px-1 inline-flex items-center text-sm text-gray-400">...</span>
                        ) : (
                            <Link
                                key={i}
                                href={item === data.current_page ? '#' : data.path + '?page=' + item}
                                className={btn(item, data.current_page)}
                            >
                                {item}
                            </Link>
                        )
                    )}
                {data.next_page_url ? (
                    <Link href={data.next_page_url} className={btn('next', data.current_page)}>
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                ) : (
                    <span className="h-8 min-w-[32px] px-2 inline-flex items-center justify-center text-sm text-gray-300 rounded-lg cursor-default">
                        <ChevronRight className="h-4 w-4" />
                    </span>
                )}
            </div>
        </div>
    );
}
