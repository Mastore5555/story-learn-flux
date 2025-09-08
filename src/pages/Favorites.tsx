import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CourseCard from '@/components/CourseCard';
import { useFavorites } from '@/hooks/useFavorites';
import { Heart, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const Favorites = () => {
  const { favorites, loading } = useFavorites();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="h-8 w-8 text-red-500 fill-red-500" />
            <h1 className="text-4xl font-bold text-foreground">Meus Favoritos</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Seus cursos favoritos em um só lugar
          </p>
        </div>

        {/* Content */}
        {favorites.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhum favorito ainda</h3>
              <p className="text-muted-foreground mb-4">
                Comece a favoritar cursos para vê-los aqui
              </p>
              <p className="text-sm text-muted-foreground">
                Clique no ❤️ em qualquer curso para adicioná-lo aos favoritos
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-muted-foreground">
                {favorites.length} {favorites.length === 1 ? 'curso favorito' : 'cursos favoritos'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((favorite) => (
                <CourseCard
                  key={favorite.id}
                  course={favorite.courses}
                  showFavoriteButton={true}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Favorites;