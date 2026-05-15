import { useEffect, useRef, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import AppLayout from '@/Layouts/AppLayout';
import { Card, CardContent } from '@/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/ui/avatar';
import { ChevronLeft, Send } from 'lucide-react';

export default function Show({ conversation, messages }) {
    const user = usePage().props.auth.user;
    const [body, setBody] = useState('');
    const [messageList, setMessageList] = useState(messages.data || []);
    const [sending, setSending] = useState(false);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);



    useEffect(() => {
        setMessageList(messages.data || []);
    }, [messages.data]);

    useEffect(() => {
        if (!window.Echo) return;

        const channel = window.Echo.private(`conversation.${conversation.id}`);
        channel.listen('.MessageSent', (e) => {
            setMessageList(prev => [...prev, {
                id: e.id,
                body: e.body,
                user_id: e.user_id,
                created_at: e.created_at,
                user: e.user,
            }]);
            scrollToBottom();
        });

        axios.post(route('messages.read', conversation.id));

        return () => {
            channel.stopListening('.MessageSent');
            window.Echo.leave(`conversation.${conversation.id}`);
        };
    }, [conversation.id]);

    const sendMessage = async () => {
        if (!body.trim() || sending) return;
        setSending(true);
        const text = body;
        setBody('');
        try {
            const { data } = await axios.post(route('messages.store'), {
                conversation_id: conversation.id,
                body: text,
            });
            setMessageList(prev => [...prev, {
                id: data.id,
                body: data.body,
                user_id: data.user_id,
                created_at: data.created_at,
                user: data.user,
            }]);
            scrollToBottom();
        } finally {
            setSending(false);
            inputRef.current?.focus();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const initials = (name) =>
        name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

    return (
        <AppLayout title={conversation.other?.name || 'Messages'}>
            <Head title={conversation.other?.name || 'Messages'} />

            <div className="flex flex-col h-[calc(100vh-12rem)]">
                {/* Header */}
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                    <Link href={route('messages.index')} className="text-gray-400 hover:text-gray-600 transition">
                        <ChevronLeft className="h-5 w-5" />
                    </Link>
                    <Avatar className="h-9 w-9">
                        {conversation.other?.avatar && <AvatarImage src={`/storage/${conversation.other.avatar}`} />}
                        <AvatarFallback className="text-xs font-medium bg-gray-100 text-gray-600">{initials(conversation.other?.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-semibold text-[#1a1f36]">{conversation.other?.name || 'Unknown'}</p>
                        {conversation.subject && (
                            <p className="text-xs text-gray-400">{conversation.subject}</p>
                        )}
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto py-4 space-y-3 scroll-smooth">
                    {messageList.length > 0 ? (
                        messageList.slice().reverse().map((m) => {
                            const isMine = m.user_id === user.id;
                            return (
                                <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`flex items-end gap-2 max-w-[75%] ${isMine ? 'flex-row-reverse' : ''}`}>
                                        {!isMine && (
                                            <Avatar className="h-7 w-7 shrink-0">
                                                {m.user?.avatar && <AvatarImage src={`/storage/${m.user.avatar}`} />}
                                                <AvatarFallback className="text-[9px] font-medium bg-gray-100 text-gray-600">{initials(m.user?.name)}</AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div>
                                            <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                                                isMine
                                                    ? 'bg-[#14a800] text-white rounded-br-lg'
                                                    : 'bg-gray-100 text-[#1a1f36] rounded-bl-lg'
                                            }`}>
                                                {m.body}
                                            </div>
                                            <p className={`text-[10px] text-gray-400 mt-1 ${isMine ? 'text-right' : 'text-left'}`}>
                                                {m.created_at}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-sm text-gray-400">No messages yet. Say hello!</p>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-end gap-2">
                        <textarea
                            ref={inputRef}
                            value={body}
                            onChange={e => setBody(e.target.value)}
                            onKeyDown={handleKeyDown}
                            rows={1}
                            placeholder="Type a message..."
                            className="flex-1 min-h-[44px] max-h-32 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#14a800] focus:ring-1 focus:ring-[#14a800] resize-none"
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!body.trim() || sending}
                            className="h-11 w-11 rounded-xl bg-[#14a800] hover:bg-[#108a00] disabled:bg-gray-200 text-white flex items-center justify-center shrink-0 transition"
                        >
                            <Send className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
