"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Heart, MessageCircle, ArrowLeft, Send, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { useRealtimeComments } from "@/hooks/useRealtimeComments";
import { format } from "date-fns";

interface Post {
  id: string
  title: string
  content: string
  image_url: string | null
  is_anonymous: boolean
  likes_count: number
  comments_count: number
  created_at: string
  user_profiles: {
    first_name: string
    last_name: string
  } | null
}

interface Comment {
  id: string
  content: string
  is_anonymous: boolean
  created_at: string
  user_profiles: {
    first_name: string
    last_name: string
  } | null
}

export default function PostDetailPage() {
  const { user, profile } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string

  const [post, setPost] = useState<Post | null>(null)
  const comments = useRealtimeComments(postId);
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [newComment, setNewComment] = useState("")
  const [submittingComment, setSubmittingComment] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }
    if (!profile?.form_completed) {
      router.push("/survey")
      return
    }
    fetchPost()
    fetchLikeStatus()
    fetchLikeCount()
  }, [user, profile, router, postId])

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(`*, user_profiles (first_name, last_name)`)
        .eq("id", postId)
        .single()
      if (error) throw error
      setPost(data)
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to fetch post", variant: "destructive" })
      router.push("/posts")
    } finally {
      setLoading(false)
    }
  }

  const fetchLikeStatus = async () => {
    if (!user) return
    const { data, error } = await supabase
      .from("post_likes")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", user.id)
    setIsLiked(!!data && data.length > 0)
  }

  const fetchLikeCount = async () => {
    const { count } = await supabase
      .from("post_likes")
      .select("*", { count: "exact", head: true })
      .eq("post_id", postId)
    setLikeCount(count || 0)
  }

  const handleLike = async () => {
    if (!user) return
    try {
      if (isLiked) {
        await supabase.from("post_likes").delete().eq("post_id", postId).eq("user_id", user.id)
      } else {
        await supabase.from("post_likes").insert({ post_id: postId, user_id: user.id })
      }
      fetchLikeStatus()
      fetchLikeCount()
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to update like", variant: "destructive" })
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return
    setSubmittingComment(true)
    try {
      const { error } = await supabase.from("post_comments").insert({
        post_id: postId,
        user_id: user!.id,
        content: newComment,
        is_anonymous: false,
      })
      if (error) throw error
      setNewComment("")
      toast({ title: "Success", description: "Comment added successfully!" })
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setSubmittingComment(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Post not found</h2>
          <Link href="/posts">
            <Button>Back to Posts</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/posts">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Posts
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Post Content */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="w-12 h-12">
                  <AvatarFallback>
                    {post.is_anonymous
                      ? "A"
                      : `${post.user_profiles?.first_name?.[0] || ""}${post.user_profiles?.last_name?.[0] || ""}`}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-lg">
                    {post.is_anonymous
                      ? "Anonymous"
                      : `${post.user_profiles?.first_name || ""} ${post.user_profiles?.last_name || ""}`}
                  </p>
                  <p className="text-sm text-gray-500">{format(new Date(post.created_at), "yyyy-MM-dd")}</p>
                </div>
              </div>
              {post.is_anonymous && <Badge variant="secondary">Anonymous</Badge>}
            </div>
            <CardTitle className="text-2xl mt-4">{post.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{post.content}</p>
            </div>
            {post.image_url && (
              <img
                src={post.image_url || "/placeholder.svg"}
                alt="Post image"
                className="mt-6 rounded-lg max-w-full h-auto"
              />
            )}
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant={isLiked ? "default" : "outline"}
                size="sm"
                onClick={handleLike}
                className="flex items-center space-x-2"
              >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                <span>{likeCount}</span>
              </Button>
              <div className="flex items-center space-x-2 text-gray-500">
                <MessageCircle className="w-4 h-4" />
                <span>{comments.length} comments</span>
              </div>
            </div>
          </CardFooter>
        </Card>

        {/* Comments Section */}
        <Card>
          <CardHeader>
            <CardTitle>Comments ({comments.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Add Comment Form */}
            <form onSubmit={handleSubmitComment} className="space-y-4">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="min-h-[100px]"
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={submittingComment || !newComment.trim()}>
                  {submittingComment ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Post Comment
                </Button>
              </div>
            </form>

            <Separator />

            {/* Comments List */}
            {comments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
            ) : (
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <Avatar>
                      <AvatarFallback>
                        {comment.is_anonymous
                          ? "A"
                          : `${comment.user_profiles?.first_name?.[0] || ""}${comment.user_profiles?.last_name?.[0] || ""}`}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-medium text-sm">
                          {comment.is_anonymous
                            ? "Anonymous"
                            : `${comment.user_profiles?.first_name || ""} ${comment.user_profiles?.last_name || ""}`}
                        </p>
                        <p className="text-xs text-gray-500">{format(new Date(comment.created_at), "yyyy-MM-dd")}</p>
                        {comment.is_anonymous && (
                          <Badge variant="outline" className="text-xs">
                            Anonymous
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
