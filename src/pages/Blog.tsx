import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, Clock, Eye, Search, User } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string | null;
  published_at: string;
  reading_time: number | null;
  views_count: number;
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

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  useEffect(() => {
    loadBlogData();
  }, []);

  const loadBlogData = async () => {
    try {
      setLoading(true);
      
      // Load categories
      const { data: categoriesData } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name');
      
      if (categoriesData) {
        setCategories(categoriesData);
      }

      // Load posts with related data
      const { data: postsData } = await supabase
        .from('blog_posts')
        .select(`
          *,
          blog_categories (name, slug),
          profiles (display_name),
          blog_post_tags (
            blog_tags (name, slug)
          )
        `)
        .eq('published', true)
        .order('published_at', { ascending: false });

      if (postsData) {
        setPosts(postsData as BlogPost[]);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || 
                           post.blog_categories?.slug === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd 'de' MMMM, yyyy", { locale: ptBR });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-video bg-muted rounded-t-lg"></div>
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-24">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Blog da <span className="text-primary">Techflix</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Artigos, tutoriais e insights sobre tecnologia, programação e desenvolvimento profissional
          </p>
        </section>

        {/* Filters */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar artigos..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={(value) => {
              setSelectedCategory(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.slug}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="mb-16">
          {currentPosts.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-2xl font-semibold mb-4">Nenhum artigo encontrado</h3>
              <p className="text-muted-foreground">
                {searchTerm || selectedCategory !== "all" 
                  ? "Tente ajustar os filtros de busca"
                  : "Em breve teremos artigos incríveis para você!"
                }
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentPosts.map((post) => (
                  <Card key={post.id} className="group hover:shadow-lg transition-all duration-300">
                    <Link to={`/blog/${post.slug}`}>
                      {post.featured_image && (
                        <div className="aspect-video overflow-hidden rounded-t-lg">
                          <img
                            src={post.featured_image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          {post.blog_categories && (
                            <Badge variant="secondary" className="text-xs">
                              {post.blog_categories.name}
                            </Badge>
                          )}
                        </div>
                        
                        <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </CardTitle>
                        
                        {post.excerpt && (
                          <p className="text-muted-foreground line-clamp-3">
                            {post.excerpt}
                          </p>
                        )}
                      </CardHeader>
                      
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(post.published_at)}
                            </div>
                            
                            {post.reading_time && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {post.reading_time} min
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {post.views_count}
                          </div>
                        </div>

                        {post.profiles?.display_name && (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span className="text-sm">Por {post.profiles.display_name}</span>
                          </div>
                        )}

                        {post.blog_post_tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {post.blog_post_tags.slice(0, 3).map((tagRel) => (
                              <Badge key={tagRel.blog_tags.slug} variant="outline" className="text-xs">
                                {tagRel.blog_tags.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </Button>
                  
                  <div className="flex gap-1">
                    {[...Array(totalPages)].map((_, i) => (
                      <Button
                        key={i + 1}
                        variant={currentPage === i + 1 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Próxima
                  </Button>
                </div>
              )}
            </>
          )}
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;