import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, Clock, Eye, User, ArrowLeft, Share2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  published_at: string;
  reading_time: number | null;
  views_count: number;
  seo_title: string | null;
  seo_description: string | null;
  blog_categories: {
    name: string;
    slug: string;
  } | null;
  profiles: {
    display_name: string | null;
  } | null;
  blog_post_tags: {
    blog_tags: {
      name: string;
      slug: string;
    };
  }[];
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (slug) {
      loadPost();
    }
  }, [slug]);

  const loadPost = async () => {
    try {
      setLoading(true);
      
      // Load the main post
      const { data: postData } = await supabase
        .from('blog_posts')
        .select(`
          *,
          blog_categories (name, slug),
          profiles (display_name),
          blog_post_tags (
            blog_tags (name, slug)
          )
        `)
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (postData) {
        setPost(postData as BlogPost);
        
        // Increment views count
        await supabase.rpc('increment_blog_post_views', { 
          post_id: postData.id 
        });

        // Load related posts (same category, excluding current post)
        if (postData.blog_categories) {
          const { data: relatedData } = await supabase
            .from('blog_posts')
            .select(`
              id, title, slug, excerpt, featured_image, published_at, reading_time,
              blog_categories (name, slug),
              profiles (display_name)
            `)
            .eq('published', true)
            .eq('category_id', postData.category_id)
            .neq('id', postData.id)
            .limit(3);
          
          if (relatedData) {
            setRelatedPosts(relatedData as BlogPost[]);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao carregar post:', error);
    } finally {
      setLoading(false);
    }
  };

  const sharePost = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt || post.title,
          url: window.location.href,
        });
      } catch (error) {
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copiado!",
      description: "O link do artigo foi copiado para a área de transferência.",
    });
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd 'de' MMMM, yyyy", { locale: ptBR });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/4"></div>
              <div className="h-12 bg-muted rounded w-3/4"></div>
              <div className="h-6 bg-muted rounded w-1/2"></div>
              <div className="aspect-video bg-muted rounded"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
                <div className="h-4 bg-muted rounded w-4/5"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">Artigo não encontrado</h1>
            <p className="text-muted-foreground mb-8">
              O artigo que você está procurando não existe ou foi removido.
            </p>
            <Link to="/blog">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Blog
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* SEO Meta Tags */}
      <title>{post.seo_title || post.title} | Techflix Academy Blog</title>
      <meta name="description" content={post.seo_description || post.excerpt || ""} />
      <meta property="og:title" content={post.title} />
      <meta property="og:description" content={post.excerpt || ""} />
      <meta property="og:image" content={post.featured_image || ""} />
      <meta property="og:type" content="article" />
      <link rel="canonical" href={window.location.href} />
      
      <Header />
      
      <main className="container mx-auto px-4 py-24">
        <article className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link to="/blog" className="text-primary hover:underline flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Blog
            </Link>
          </nav>

          {/* Article Header */}
          <header className="mb-12">
            {post.blog_categories && (
              <Badge variant="secondary" className="mb-4">
                {post.blog_categories.name}
              </Badge>
            )}
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>
            
            {post.excerpt && (
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b">
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(post.published_at)}
                </div>
                
                {post.reading_time && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {post.reading_time} min de leitura
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  {post.views_count} visualizações
                </div>
                
                {post.profiles?.display_name && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Por {post.profiles.display_name}
                  </div>
                )}
              </div>

              <Button onClick={sharePost} variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
            </div>
          </header>

          {/* Featured Image */}
          {post.featured_image && (
            <div className="mb-12">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          )}

          {/* Article Content */}
          <div 
            className="prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.blog_post_tags.length > 0 && (
            <div className="mb-12 pb-8 border-b">
              <h3 className="text-lg font-semibold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.blog_post_tags.map((tagRel) => (
                  <Badge key={tagRel.blog_tags.slug} variant="outline">
                    {tagRel.blog_tags.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-8">Artigos Relacionados</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link 
                    key={relatedPost.id} 
                    to={`/blog/${relatedPost.slug}`}
                    className="group"
                  >
                    <div className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                      {relatedPost.featured_image && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={relatedPost.featured_image}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {relatedPost.title}
                        </h3>
                        {relatedPost.excerpt && (
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {relatedPost.excerpt}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;