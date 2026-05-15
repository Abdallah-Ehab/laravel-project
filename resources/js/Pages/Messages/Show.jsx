import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Card, CardContent } from '@/ui/card';
import { MessageCircle } from 'lucide-react';

export default function Show({ conversation, messages }) {
    return (
        <AppLayout title="Messages">
            <Head title="Messages" />
            <Card className="border border-gray-100 shadow-sm">
                <CardContent className="p-8 text-center">
                    <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm font-medium text-[#1a1f36]">Conversation coming soon</p>
                    <p className="text-xs text-gray-400 mt-1">Message thread will appear here</p>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
