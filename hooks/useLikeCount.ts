import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useLikeCount(postId: string) {
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      const { count } = await supabase
        .from("post_likes")
        .select("*", { count: "exact", head: true })
        .eq("post_id", postId);
      setLikeCount(count || 0);
    };
    fetchCount();
  }, [postId]);

  return likeCount;
} 