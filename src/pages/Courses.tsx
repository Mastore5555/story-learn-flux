import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CourseCard from '@/components/CourseCard';
import { SearchFiltersComponent } from '@/components/SearchFilters';
import { useSearch } from '@/hooks/useSearch';
import { Input } from '@/components/ui/input';
import { Search, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { courses, loading, searchQuery, filters, updateSearch, updateFilters, getAllCourses } = useSearch();
  const [localSearch, setLocalSearch] = useState('');

  // Sincroniza com URL params
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      setLocalSearch(urlSearch);
      updateSearch(urlSearch);
    } else {
      getAllCourses();
    }
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedSearch = localSearch.trim();
    
    if (trimmedSearch) {
      setSearchParams({ search: trimmedSearch });
      updateSearch(trimmedSearch);
    } else {
      setSearchParams({});
      getAllCourses();
    }
  };

  const handleClearFilters = () => {
    updateFilters({});
    setSearchParams({});
    setLocalSearch('');
    getAllCourses();
  };

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

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Busque por título, instrutor ou palavra-chave..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </form>
        </div>

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
              `${courses.length} resultado(s) para "${searchQuery}"`
            ) : (
              `${courses.length} curso(s) disponível(is)`
            )}
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : courses.length === 0 ? (
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
            {courses.map((course) => (
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