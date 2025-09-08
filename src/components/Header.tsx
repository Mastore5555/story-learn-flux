import { Button } from "@/components/ui/button";
import { Search, User, Menu } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/20">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="gradient-text text-xl font-bold">Story Academy</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-foreground hover:text-primary transition-smooth">Início</a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">Cursos</a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">Trilhas</a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">Sobre</a>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 glass rounded-lg px-3 py-2 border border-border/50">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Buscar cursos..." 
              className="bg-transparent text-sm border-none outline-none placeholder:text-muted-foreground w-32"
            />
          </div>
          
          <Button variant="ghost" size="icon">
            <User className="w-4 h-4" />
          </Button>
          
          <Button variant="hero" size="sm" className="hidden md:flex">
            Começar Agora
          </Button>
          
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;