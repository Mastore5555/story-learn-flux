import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CourseCard from '@/components/CourseCard';
import { SearchFiltersComponent } from '@/components/SearchFilters';
import SmartSearchBox from '@/components/SmartSearchBox';
import { useSearch } from '@/hooks/useSearch';
import { BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { courses, loading, searchQuery, filters, updateSearch, updateFilters, getAllCourses } = useSearch();
  const [smartResults, setSmartResults] = useState<any[]>([]);
  const [isUsingSmartSearch, setIsUsingSmartSearch] = useState(false);

  // Sincroniza com URL params
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      updateSearch(urlSearch);
    } else {
      getAllCourses();
    }
  }, []);

  const handleSmartSearch = (query: string, results: any[]) => {
    setSearchParams({ search: query });
    setSmartResults(results);
    setIsUsingSmartSearch(true);
    updateSearch(query);
  };

  const handleClearFilters = () => {
    updateFilters({});
    setSearchParams({});
    setSmartResults([]);
    setIsUsingSmartSearch(false);
    getAllCourses();
  };

  // Use smart search results if available, otherwise use regular search
  const displayCourses = isUsingSmartSearch ? smartResults : courses;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-24">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Todos os Cursos
          </h1>
          <p className="text-xl text-muted-foreground">
            Encontre o curso perfeito para sua jornada de aprendizado
          </p>
        </div>

        {/* Smart Search Bar */}
        <SmartSearchBox 
          onSearch={handleSmartSearch}
          className="mb-8"
        />

        {/* Filters */}
        <SearchFiltersComponent 
          filters={filters}
          onFiltersChange={updateFilters}
          onClearFilters={handleClearFilters}
        />

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-muted-foreground">
            {loading ? (
              "Buscando..."
            ) : searchQuery ? (
              <>
                {`${displayCourses.length} resultado(s) para "${searchQuery}"`}
                {isUsingSmartSearch && (
                  <span className="ml-2 text-primary font-medium">✨ Busca inteligente</span>
                )}
              </>
            ) : (
              `${displayCourses.length} curso(s) disponível(is)`
            )}
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : displayCourses.length === 0 ? (
          /* No Results */
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {searchQuery || Object.keys(filters).length > 0 ? 'Nenhum curso encontrado' : 'Nenhum curso disponível'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || Object.keys(filters).length > 0 
                  ? 'Tente ajustar sua busca ou filtros para encontrar mais cursos'
                  : 'Em breve teremos cursos incríveis para você!'
                }
              </p>
              {(searchQuery || Object.keys(filters).length > 0) && (
                <button 
                  onClick={handleClearFilters}
                  className="text-primary hover:underline"
                >
                  Limpar busca e filtros
                </button>
              )}
            </CardContent>
          </Card>
        ) : (
          /* Courses Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                showFavoriteButton={true}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Courses;