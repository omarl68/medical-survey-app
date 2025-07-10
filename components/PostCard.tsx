import { useLikeCount } from "@/hooks/useLikeCount";
import { useRealtimeComments } from "@/hooks/useRealtimeComments";
import LikeButton from "@/components/LikeButton";

export default function PostCard({ post }: { post: any }) {
  const likeCount = useLikeCount(post.id);
  const comments = useRealtimeComments(post.id);

  return (
    <div style={{ border: "1px solid #eee", borderRadius: 8, padding: 16, marginBottom: 16 }}>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
        <LikeButton postId={post.id} />
        <span>💬 {comments.length} comments</span>
      </div>
    </div>
  );
} 