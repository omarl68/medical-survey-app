"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Plus, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { useAuthGuard } from "@/hooks/use-auth-guard"
import { useToast } from "@/hooks/use-toast"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useRealtimeComments } from "@/hooks/useRealtimeComments";

interface Post {
  id: string
  title: string
  content: string
  image_url: string | null
  is_anonymous: boolean
  created_at: string
  user_profiles: {
    first_name: string
    last_name: string
    avatar_url?: string | null
  } | null
  post_likes?: { count: number }[]
  post_comments?: { count: number }[]
}

const POSTS_PER_PAGE = 10

export default function PostsPage() {
  const { user, profile } = useAuthGuard()
  const { signOut } = useAuth()
  const { t } = useLanguage()
  const { toast } = useToast()
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [userLikes, setUserLikes] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    isAnonymous: false,
  })
  const [newPostFile, setNewPostFile] = useState<File | null>(null);

  useEffect(() => {
    if (user && profile?.form_completed) {
      fetchUserLikes();
      fetchPosts(0, true)
    }
  }, [user, profile])

  const fetchUserLikes = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("post_likes")
      .select("post_id")
      .eq("user_id", user.id);
    setUserLikes(new Set((data || []).map((like) => like.post_id)));
  };

  const fetchPosts = async (pageNum: number, reset = false) => {
    if (!isSupabaseConfigured) {
      toast({
        title: t("error"),
        description: "Database not configured. Please add your Supabase credentials.",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    try {
      if (pageNum === 0) setLoading(true)
      else setLoadingMore(true)

      const { data, error } = await supabase
        .from("posts")
        .select(`
      *,
      user_profiles (first_name, last_name),
      post_likes(count),
      post_comments(count)
    `)
        .order("created_at", { ascending: false })
        .range(pageNum * POSTS_PER_PAGE, (pageNum + 1) * POSTS_PER_PAGE - 1)

      if (error) throw error

      // Add userLiked property to each post
      const newPosts = (data || []).map((post) => ({
        ...post,
        userLiked: userLikes.has(post.id),
      }));

      if (reset) {
        setPosts(newPosts)
      } else {
        setPosts(prev => {
          const all = [...prev, ...newPosts];
          return Array.from(new Map(all.map(post => [post.id, post])).values());
        });
      }

      setHasMore(newPosts.length === POSTS_PER_PAGE)
      setPage(pageNum)
    } catch (error: any) {
      toast({
        title: t("error"),
        description: "Failed to fetch posts",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchPosts(page + 1)
    }
  }, [page, loadingMore, hasMore])

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMore()
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [loadMore])

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();

    let imageUrl = null;

    if (newPostFile) {
      const fileExt = newPostFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('post-images')
        .upload(fileName, newPostFile);

      if (error) {
        toast({
          title: t("error"),
          description: "Image upload failed",
          variant: "destructive",
        });
        return;
      }

      const { data: publicUrlData } = supabase.storage.from('post-images').getPublicUrl(fileName);
      imageUrl = publicUrlData.publicUrl;
    }

    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast({
        title: t("error"),
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    if (!isSupabaseConfigured) {
      toast({
        title: t("error"),
        description: "Database not configured. Please add your Supabase credentials.",
        variant: "destructive",
      })
      return
    }

    try {
      const { error } = await supabase.from("posts").insert({
        user_id: user!.id,
        title: newPost.title,
        content: newPost.content,
        is_anonymous: newPost.isAnonymous,
        image_url: imageUrl,
      })

      if (error) throw error

      toast({
        title: t("success"),
        description: "Post created successfully!",
      })

      setNewPost({ title: "", content: "", isAnonymous: false })
      setShowCreateForm(false)
      fetchPosts(0, true)
    } catch (error: any) {
      toast({
        title: t("error"),
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/auth/login")
  }

  const truncateContent = (content: string, maxLength = 1000) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">{t("communityPosts")}</h1>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <span className="text-sm text-gray-600">
                {t("welcome")}, {profile?.first_name} {profile?.last_name}
              </span>
              <Button variant="outline" onClick={handleSignOut}>
                {t("logout")}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create Post Button */}
        <div className="mb-8">
          <Button onClick={() => setShowCreateForm(!showCreateForm)} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            {t("createPost")}
          </Button>
        </div>

        {/* Create Post Form */}
        {showCreateForm && (
          <Card className="mb-8 shadow-lg border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold">{t("createPost")}</CardTitle>
              <p className="text-gray-500 text-sm mt-1">Share your experience or ask a question. You can also add a photo!</p>
            </CardHeader>
            <form onSubmit={handleCreatePost} className="space-y-6 px-6 pb-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="font-semibold">{t("title")}</Label>
                  <Input
                    id="title"
                    value={newPost.title}
                    onChange={(e) => setNewPost((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder={t("title")}
                    required
                    className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content" className="font-semibold">{t("content")}</Label>
                  <Textarea
                    id="content"
                    value={newPost.content}
                    onChange={(e) => setNewPost((prev) => ({ ...prev, content: e.target.value }))}
                    placeholder={t("content")}
                    className="min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image" className="font-semibold">Image (optional)</Label>
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewPostFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {newPostFile && (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(newPostFile)}
                        alt="Preview"
                        className="max-h-40 rounded border border-gray-200 shadow"
                      />
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="anonymous"
                    checked={newPost.isAnonymous}
                    onCheckedChange={(checked) => setNewPost((prev) => ({ ...prev, isAnonymous: checked as boolean }))}
                  />
                  <Label htmlFor="anonymous">{t("anonymous")}</Label>
                </div>
              </div>
              <CardFooter className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)} className="hover:bg-gray-100">
                  {t("cancel")}
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow">
                  {t("submit")}
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}

        {/* Posts List */}
        <div className="space-y-6">
          {!isSupabaseConfigured ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500 mb-4">Database not configured</p>
                <p className="text-sm text-gray-400">Please add your Supabase credentials to see posts</p>
              </CardContent>
            </Card>
          ) : posts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No posts yet. Be the first to share your experience!</p>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <Link href={`/posts/${post.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          {post.user_profiles?.avatar_url ? (
                            <img
                              src={post.user_profiles.avatar_url}
                              alt="User avatar"
                              className="w-8 h-8 rounded-full object-cover"
                              width={32}
                              height={32}
                            />
                          ) : (
                            <AvatarFallback>
                              {post.is_anonymous
                                ? "A"
                                : `${post.user_profiles?.first_name?.[0] || ""}${post.user_profiles?.last_name?.[0] || ""}`}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {post.is_anonymous
                              ? t("anonymous")
                              : `${post.user_profiles?.first_name || ""} ${post.user_profiles?.last_name || ""}`}
                          </p>
                          <p className="text-sm text-gray-500">{new Date(post.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      {post.is_anonymous && <Badge variant="secondary">{t("anonymous")}</Badge>}
                    </div>
                    <CardTitle className="text-xl hover:text-blue-600 transition-colors">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{truncateContent(post.content)}</p>
                    {post.image_url && (
                      <img
                        src={post.image_url}
                        alt="Post image"
                        className="mt-4 rounded border border-gray-200 shadow max-w-full max-h-60 w-auto h-auto"
                        style={{ objectFit: 'cover' }}
                      />
                    )}
                  </CardContent>
                  <CardFooter className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Heart className="w-4 h-4" />
                        <span>{post.post_likes?.[0]?.count || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-500">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.post_comments?.[0]?.count || 0}</span>
                      </div>
                    </div>
                    <span className="text-sm text-blue-600">Read more →</span>
                  </CardFooter>
                </Link>
              </Card>
            ))
          )}
        </div>

        {/* Load More Button / Loading Indicator */}
        {loadingMore && (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        )}

        {!hasMore && posts.length > 0 && (
          <div className="text-center py-8 text-gray-500">You've reached the end of the posts</div>
        )}
      </div>
    </div>
  )
}
