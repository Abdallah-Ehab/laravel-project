import { useState } from 'react';
import { Link, Head, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Card, CardContent } from '@/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Badge } from '@/ui/badge';
import { Avatar, AvatarFallback } from '@/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { Search, Eye, Users, X } from 'lucide-react';

const roleBadge = {
    employer: 'bg-blue-50 text-blue-600 border-blue-200',
    candidate: 'bg-purple-50 text-purple-600 border-purple-200',
};

const statusBadge = (bannedAt) =>
    bannedAt
        ? 'bg-red-50 text-red-600 border-red-200'
        : 'bg-[#f0faf0] text-[#14a800] border-[#14a800]/20';

export default function Index({ users, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.users.index'), { ...filters, search }, { preserveState: true });
    };

    const clearSearch = () => {
        setSearch('');
        router.get(route('admin.users.index'), { ...filters, search: '' }, { preserveState: true });
    };

    const setFilter = (key, value) => {
        router.get(route('admin.users.index'), { ...filters, [key]: value === 'all' ? '' : value }, { preserveState: true });
    };

    return (
        <AppLayout title="User Management">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#1a1f36]">User Management</h1>
                    <p className="text-sm text-gray-500 mt-1">{users.total} users registered</p>
                </div>
            </div>

            <Card className="border border-gray-100 shadow-sm mb-6">
                <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                        <form onSubmit={handleSearch} className="relative flex-1 max-w-xs">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search by name or email..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="h-10 pl-9 pr-8 rounded-lg border-gray-200 text-sm"
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </form>
                        <Select defaultValue={filters.role || ''} onValueChange={(v) => setFilter('role', v)}>
                            <SelectTrigger className="w-36 h-10 rounded-lg border-gray-200 text-sm">
                                <SelectValue placeholder="All Roles" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="employer">Employers</SelectItem>
                                <SelectItem value="candidate">Candidates</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select defaultValue={filters.status || ''} onValueChange={(v) => setFilter('status', v)}>
                            <SelectTrigger className="w-36 h-10 rounded-lg border-gray-200 text-sm">
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="banned">Banned</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card className="border border-gray-100 shadow-sm">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="text-xs font-medium text-gray-500 h-10">User</TableHead>
                                <TableHead className="text-xs font-medium text-gray-500 h-10">Email</TableHead>
                                <TableHead className="text-xs font-medium text-gray-500 h-10">Role</TableHead>
                                <TableHead className="text-xs font-medium text-gray-500 h-10">Status</TableHead>
                                <TableHead className="text-xs font-medium text-gray-500 h-10">Member Since</TableHead>
                                <TableHead className="text-xs font-medium text-gray-500 h-10 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.data?.length > 0 ? (
                                users.data.map(user => (
                                    <TableRow key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                        <TableCell className="py-3.5">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback className="text-xs font-semibold bg-gray-100 text-gray-600">
                                                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm font-medium text-[#1a1f36]">{user.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-3.5 text-sm text-gray-500">{user.email}</TableCell>
                                        <TableCell className="py-3.5">
                                            <Badge variant="outline" className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full capitalize ${roleBadge[user.role] || ''}`}>
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-3.5">
                                            <Badge variant="outline" className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${statusBadge(user.banned_at)}`}>
                                                {user.banned_at ? 'Banned' : 'Active'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-3.5 text-sm text-gray-500">{user.created_at}</TableCell>
                                        <TableCell className="py-3.5 text-right">
                                            <Link href={route('admin.users.show', user.id)}>
                                                <Button variant="ghost" size="sm" className="h-8 text-xs text-gray-500 hover:text-[#14a800]">
                                                    <Eye className="h-3.5 w-3.5 mr-1" />View
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-12">
                                        <Users className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                                        <p className="text-sm font-medium text-gray-500">No users found</p>
                                        <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filters.</p>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Pagination */}
            {users.links?.length > 3 && (
                <div className="mt-6 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Showing {users.from} to {users.to} of {users.total} users
                    </p>
                    <div className="flex items-center gap-1">
                        {users.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                preserveState
                                className={`inline-flex items-center justify-center h-8 min-w-[32px] px-2 text-xs rounded-md transition ${
                                    link.active
                                        ? 'bg-[#14a800] text-white font-medium'
                                        : link.url
                                            ? 'text-gray-500 hover:bg-gray-100'
                                            : 'text-gray-300 cursor-default'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
