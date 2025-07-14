import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function useRealtimeComments(postId: string) {
  const [comments, setComments] = useState<any[]>([]);
  const router = useRouter();

  // Fetch all comments with user info
  const fetchComments = async () => {
    const { data } = await supabase
      .from("post_comments")
      .select("*, user_profiles (first_name, last_name)")
      .eq("post_id", postId);
    setComments(data || []);
  };

  useEffect(() => {
    fetchComments();

    const channel = supabase
      .channel('public:post_comments')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'post_comments', filter: `post_id=eq.${postId}` },
        () => {
          // Refetch all comments to get user info for new comments
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId]);

  return comments;
} 