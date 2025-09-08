import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCertificates } from '@/hooks/useCertificates';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, Download, Calendar, Clock, User, BookOpen } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Certificates = () => {
  const { certificates, loading, generateCertificatePDF } = useCertificates();

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
            <Award className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Meus Certificados</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Seus certificados de conclusão de curso
          </p>
        </div>

        {/* Content */}
        {certificates.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhum certificado ainda</h3>
              <p className="text-muted-foreground mb-4">
                Complete cursos para ganhar certificados
              </p>
              <p className="text-sm text-muted-foreground">
                Os certificados são gerados automaticamente quando você conclui 100% de um curso
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-muted-foreground">
                {certificates.length} {certificates.length === 1 ? 'certificado' : 'certificados'} obtidos
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((certificate) => (
                <Card key={certificate.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2 line-clamp-2">
                          {certificate.courses.title}
                        </CardTitle>
                        <Badge variant="secondary" className="mb-2">
                          {certificate.courses.category}
                        </Badge>
                      </div>
                      <Award className="h-8 w-8 text-primary flex-shrink-0 ml-2" />
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>{certificate.courses.instructor}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>
                          {Math.floor(certificate.courses.duration_minutes / 60)}h{' '}
                          {certificate.courses.duration_minutes % 60}m
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Concluído em{' '}
                          {format(new Date(certificate.issued_at), 'dd/MM/yyyy', { locale: ptBR })}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-muted/50 rounded-lg p-3 mb-4">
                      <p className="text-xs text-muted-foreground mb-1">Número do Certificado</p>
                      <p className="font-mono text-sm font-medium">{certificate.certificate_number}</p>
                    </div>
                    
                    <Button 
                      onClick={() => generateCertificatePDF(certificate)}
                      className="w-full"
                      variant="outline"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Baixar Certificado
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Certificates;