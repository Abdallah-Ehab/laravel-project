import { useState, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import AppLayout from '@/Layouts/AppLayout';
import { Card, CardContent } from '@/ui/card';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/ui/dialog';
import { MessageCircle, Plus, Search, Send, ChevronRight } from 'lucide-react';

export default function Index({ conversations }) {
    const [recipientQuery, setRecipientQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedRecipient, setSelectedRecipient] = useState(null);
    const [newMessageBody, setNewMessageBody] = useState('');
    const [sending, setSending] = useState(false);
    const [open, setOpen] = useState(false);
    const debounceRef = useRef(null);

    const searchUsers = (q) => {
        setRecipientQuery(q);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (q.length < 2) { setSearchResults([]); return; }
        debounceRef.current = setTimeout(async () => {
            try {
                const { data } = await axios.get(route('messages.users.search'), { params: { q } });
                setSearchResults(data);
            } catch {
                setSearchResults([]);
            }
        }, 300);
    };

    const sendMessage = async () => {
        if (!selectedRecipient || !newMessageBody.trim()) return;
        setSending(true);
        try {
            const { data } = await axios.post(route('messages.store'), {
                recipient_id: selectedRecipient.id,
                body: newMessageBody,
            });
            setOpen(false);
            setRecipientQuery('');
            setSearchResults([]);
            setSelectedRecipient(null);
            setNewMessageBody('');
            router.visit(route('messages.show', data.conversation_id));
        } catch {
            setSending(false);
        }
    };

    const initials = (name) =>
        name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

    return (
        <AppLayout title="Messages">
            <Head title="Messages" />
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#1a1f36]">Messages</h1>
                    <p className="text-sm text-gray-500 mt-1">Your conversations with employers and candidates</p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#14a800] hover:bg-[#108a00] text-white h-10 rounded-lg text-sm">
                            <Plus className="h-4 w-4 mr-1.5" />New Message
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-lg">New Message</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    value={recipientQuery}
                                    onChange={e => searchUsers(e.target.value)}
                                    placeholder="Search by name or email..."
                                    className="pl-9 h-11 rounded-lg border-gray-200"
                                />
                            </div>
                            {searchResults.length > 0 && (
                                <div className="border border-gray-100 rounded-lg max-h-40 overflow-y-auto divide-y divide-gray-50">
                                    {searchResults.map(u => (
                                        <button
                                            key={u.id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedRecipient(u);
                                                setRecipientQuery(u.name);
                                                setSearchResults([]);
                                            }}
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition ${
                                                selectedRecipient?.id === u.id
                                                    ? 'bg-[#f0faf0]'
                                                    : 'hover:bg-gray-50'
                                            }`}
                                        >
                                            <Avatar className="h-8 w-8">
                                                {u.avatar && <AvatarImage src={`/storage/${u.avatar}`} />}
                                                <AvatarFallback className="text-[10px] font-medium bg-gray-100 text-gray-600">{initials(u.name)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-medium text-[#1a1f36]">{u.name}</p>
                                                <p className="text-xs text-gray-400">{u.email}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                            {selectedRecipient && (
                                <textarea
                                    value={newMessageBody}
                                    onChange={e => setNewMessageBody(e.target.value)}
                                    rows={4}
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#14a800] focus:ring-1 focus:ring-[#14a800] resize-none"
                                    placeholder="Type your message..."
                                />
                            )}
                            <div className="flex justify-end gap-2 pt-1">
                                <Button variant="outline" onClick={() => setOpen(false)} className="h-10 rounded-lg text-sm">
                                    Cancel
                                </Button>
                                <Button
                                    onClick={sendMessage}
                                    disabled={!selectedRecipient || !newMessageBody.trim() || sending}
                                    className="bg-[#14a800] hover:bg-[#108a00] text-white h-10 rounded-lg text-sm"
                                >
                                    {sending ? 'Sending...' : 'Send'}
                                    <Send className="h-3.5 w-3.5 ml-1.5" />
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {conversations.data?.length > 0 ? (
                <div className="space-y-2">
                    {conversations.data.map((c) => (
                        <Link key={c.id} href={route('messages.show', c.id)}>
                            <Card className={`border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer ${
                                c.unread > 0 ? 'border-l-[3px] border-l-[#14a800]' : ''
                            }`}>
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-11 w-11 shrink-0">
                                            {c.other?.avatar && <AvatarImage src={`/storage/${c.other.avatar}`} />}
                                            <AvatarFallback className="text-xs font-medium bg-gray-100 text-gray-600">{initials(c.other?.name)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="text-sm font-semibold text-[#1a1f36] truncate">
                                                    {c.other?.name || 'Unknown'}
                                                </p>
                                                <span className="text-[11px] text-gray-400 shrink-0">{c.updated_at}</span>
                                            </div>
                                            <div className="flex items-center justify-between gap-2 mt-0.5">
                                                <p className="text-xs text-gray-500 truncate">
                                                    {c.last_message?.body || 'No messages yet'}
                                                </p>
                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    {c.unread > 0 && (
                                                        <span className="h-5 min-w-[20px] rounded-full bg-[#14a800] text-white text-[10px] font-bold flex items-center justify-center px-1">
                                                            {c.unread}
                                                        </span>
                                                    )}
                                                    <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            ) : (
                <Card className="border border-gray-100 shadow-sm">
                    <CardContent className="p-12 text-center">
                        <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm font-medium text-[#1a1f36]">No conversations yet</p>
                        <p className="text-xs text-gray-400 mt-1 mb-4">Start a new conversation to connect with employers or candidates</p>
                    </CardContent>
                </Card>
            )}
        </AppLayout>
    );
}
