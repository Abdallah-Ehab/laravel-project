<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MessageController extends Controller
{
    public function searchRecipients(Request $request)
    {
        $q = $request->get('q');
        $users = User::where('id', '!=', Auth::id())
            ->where(function ($query) use ($q) {
                $query->where('name', 'like', "%{$q}%")
                    ->orWhere('email', 'like', "%{$q}%");
            })
            ->take(10)
            ->get()
            ->map(fn($u) => $u->only(['id', 'name', 'email', 'avatar']));

        return response()->json($users);
    }
    public function index()
    {
        $user = Auth::user();

        $conversations = $user->conversations()
            ->with(['participants', 'lastMessage'])
            ->withCount(['messages as unread_count' => function ($q) use ($user) {
                $q->where('created_at', '>', DB::raw(
                    'COALESCE((SELECT last_read_at FROM conversation_participants WHERE conversation_id = messages.conversation_id AND user_id = ' . $user->id . '), \'1970-01-01\')'
                ));
            }])
            ->latest('updated_at')
            ->paginate(20)
            ->through(fn($c) => [
                'id' => $c->id,
                'subject' => $c->subject,
                'unread' => $c->unread_count,
                'updated_at' => $c->updated_at->diffForHumans(),
                'other' => $c->participants->first(fn($p) => $p->id !== $user->id)?->only(['id', 'name', 'avatar']),
                'last_message' => $c->lastMessage?->only(['body', 'created_at', 'user_id']),
            ]);

        return Inertia::render('Messages/Index', [
            'conversations' => $conversations,
        ]);
    }

    public function show(Conversation $conversation)
    {
        $user = Auth::user();

        if (!$conversation->participants()->where('user_id', $user->id)->exists()) {
            abort(403);
        }

        $messages = $conversation->messages()
            ->with('user')
            ->latest()
            ->paginate(50)
            ->through(fn($m) => [
                'id' => $m->id,
                'body' => $m->body,
                'user_id' => $m->user_id,
                'created_at' => $m->created_at->diffForHumans(),
                'user' => $m->user->only(['id', 'name', 'avatar']),
            ]);

        $conversation->participants()->updateExistingPivot($user->id, [
            'last_read_at' => now(),
        ]);

        return Inertia::render('Messages/Show', [
            'conversation' => [
                'id' => $conversation->id,
                'subject' => $conversation->subject,
                'other' => $conversation->participants
                    ->first(fn($p) => $p->id !== $user->id)
                    ?->only(['id', 'name', 'avatar']),
            ],
            'messages' => $messages,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'conversation_id' => 'nullable|exists:conversations,id',
            'recipient_id' => 'required_without:conversation_id|exists:users,id',
            'body' => 'required|string|max:10000',
        ]);

        $user = Auth::user();

        $conversation = null;

        if ($request->conversation_id) {
            $conversation = Conversation::findOrFail($request->conversation_id);
            if (!$conversation->participants()->where('user_id', $user->id)->exists()) {
                abort(403);
            }
        } else {
            $existing = $user->conversations()
                ->whereHas('participants', fn($q) => $q->where('user_id', $request->recipient_id))
                ->first();

            if ($existing) {
                $conversation = $existing;
            } else {
                $conversation = Conversation::create();
                $conversation->participants()->attach([$user->id, $request->recipient_id]);
            }
        }

        $message = $conversation->messages()->create([
            'user_id' => $user->id,
            'body' => $request->body,
        ]);

        $conversation->touch();

        $message->load('user');

        broadcast(new MessageSent($message))->toOthers();

        return response()->json([
            'id' => $message->id,
            'conversation_id' => $conversation->id,
            'body' => $message->body,
            'user_id' => $message->user_id,
            'created_at' => $message->created_at->diffForHumans(),
            'user' => $message->user->only(['id', 'name', 'avatar']),
        ]);
    }

    public function read(Conversation $conversation)
    {
        $user = Auth::user();

        if (!$conversation->participants()->where('user_id', $user->id)->exists()) {
            abort(403);
        }

        $conversation->participants()->updateExistingPivot($user->id, [
            'last_read_at' => now(),
        ]);

        return response()->json(['status' => 'ok']);
    }
}
