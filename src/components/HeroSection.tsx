import { Button } from "@/components/ui/button";
import { Play, BookOpen, Users, Star } from "lucide-react";
import heroImage from "@/assets/hero-learning.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Story Academy Learning Platform" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/80" />
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 z-10 text-center">
        <div className="max-w-4xl mx-auto animate-slide-up">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            O <span className="gradient-text">Netflix</span> dos
            <br />
            <span className="gradient-text">Cursos Tech</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Domine Marketing, IA, Programação e Automação com nossa plataforma de aprendizado ilimitado
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-2xl mx-auto">
            <div className="glass rounded-lg p-4 border border-border/50">
              <div className="flex items-center justify-center mb-2">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary">50+</div>
              <div className="text-sm text-muted-foreground">Cursos</div>
            </div>
            
            <div className="glass rounded-lg p-4 border border-border/50">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <div className="text-2xl font-bold text-accent">1000+</div>
              <div className="text-sm text-muted-foreground">Alunos</div>
            </div>
            
            <div className="glass rounded-lg p-4 border border-border/50">
              <div className="flex items-center justify-center mb-2">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary">4.8</div>
              <div className="text-sm text-muted-foreground">Avaliação</div>
            </div>
            
            <div className="glass rounded-lg p-4 border border-border/50">
              <div className="flex items-center justify-center mb-2">
                <Play className="w-6 h-6 text-accent" />
              </div>
              <div className="text-2xl font-bold text-accent">100h+</div>
              <div className="text-sm text-muted-foreground">Conteúdo</div>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="hero" size="lg" className="text-lg px-8 py-6">
              <Play className="w-5 h-5 mr-2" />
              Começar Gratuitamente
            </Button>
            
            <Button variant="glass" size="lg" className="text-lg px-8 py-6">
              Ver Demo
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mt-6">
            7 dias grátis • Cancele quando quiser • Acesso ilimitado
          </p>
        </div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-1/4 left-10 animate-float">
        <div className="glass rounded-lg p-3 border border-primary/20">
          <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">AI</span>
          </div>
        </div>
      </div>
      
      <div className="absolute top-1/3 right-10 animate-float" style={{ animationDelay: '1s' }}>
        <div className="glass rounded-lg p-3 border border-accent/20">
          <div className="w-12 h-12 bg-gradient-to-r from-accent to-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">{'</>'}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;