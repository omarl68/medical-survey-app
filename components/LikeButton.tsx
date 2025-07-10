import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/auth-context";
import { useLikeCount } from "@/hooks/useLikeCount";

export default function LikeButton({ postId }: { postId: string }) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const likeCount = useLikeCount(postId);

  // Check if the user already liked the post
  useEffect(() => {
    if (!user) {
      setLiked(false);
      return;
    }
    let isMounted = true;
    supabase
      .from("post_likes")
      .select("id", { count: "exact" })
      .eq("post_id", postId)
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (isMounted) setLiked(!!data && data.length > 0);
      });
    return () => {
      isMounted = false;
    };
  }, [user, postId, likeCount]);

  const handleLike = async () => {
    if (!user) return;
    setLoading(true);
    if (liked) {
      await supabase.from("post_likes").delete().eq("post_id", postId).eq("user_id", user.id);
      setLiked(false);
    } else {
      await supabase.from("post_likes").insert({ post_id: postId, user_id: user.id });
      setLiked(true);
    }
    setLoading(false);
  };

  return (
    <button onClick={handleLike} disabled={!user || loading} style={{ cursor: !user ? "not-allowed" : "pointer" }}>
      {liked ? "💖" : "🤍"} {likeCount}
    </button>
  );
} 