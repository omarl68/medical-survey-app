import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useRealtimeComments(postId: string) {
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from("post_comments")
      .select("*, user_profiles (first_name, last_name)")
      .eq("post_id", postId)
      .then(({ data }) => setComments(data || []));

    const channel = supabase
      .channel('public:post_comments')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'post_comments', filter: `post_id=eq.${postId}` },
        (payload) => {
          setComments((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId]);

  return comments;
} 