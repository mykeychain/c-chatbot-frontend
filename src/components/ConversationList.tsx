import { useConversations, useCreateConversation } from '../hooks/useConversations';

export function ConversationList() {
  const { data: convos, isLoading } = useConversations('1');
  const { mutate: create } = useCreateConversation();

  if (isLoading) return <p>Loading…</p>;

  return (
    <div>
      <ul>
        {convos?.map(c => (
          <li key={c.id}>{c.id}</li>
        ))}
      </ul>

      {/* <button
        onClick={() => create(prompt('Title for new conversation?') || 'Untitled')}
        disabled={creating}
      >
        {creating ? 'Creating…' : 'New Conversation'}
      </button> */}
    </div>
  );
}
