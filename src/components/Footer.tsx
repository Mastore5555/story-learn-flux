import { Brain, Mail, MessageCircle, Github, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/20 bg-card/50">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="gradient-text text-xl font-bold">Techflix Academy</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              A plataforma de aprendizado que está revolucionando a educação tech no Brasil. 
              Aprenda as habilidades do futuro com os melhores especialistas.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 glass rounded-lg border border-border/50 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 glass rounded-lg border border-border/50 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 glass rounded-lg border border-border/50 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 glass rounded-lg border border-border/50 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          {/* Navigation */}
          <div>
            <h3 className="font-semibold mb-4">Plataforma</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-smooth">Todos os Cursos</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Trilhas de Aprendizado</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Certificações</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Comunidade</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Blog</a></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Suporte</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-smooth">Central de Ajuda</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Contato</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Política de Privacidade</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Status do Sistema</a></li>
            </ul>
          </div>
        </div>
        
        {/* Newsletter */}
        <div className="border-t border-border/20 pt-8 mt-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="font-semibold mb-2">Fique por dentro das novidades</h3>
              <p className="text-sm text-muted-foreground">Receba dicas exclusivas e novos cursos direto no seu email</p>
            </div>
            
            <div className="flex space-x-2 w-full md:w-auto">
              <div className="flex-1 md:w-64 glass rounded-lg px-3 py-2 border border-border/50">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <input 
                    type="email" 
                    placeholder="Seu melhor email" 
                    className="bg-transparent text-sm border-none outline-none placeholder:text-muted-foreground flex-1"
                  />
                </div>
              </div>
              <button className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-6 py-2 rounded-lg font-medium hover:scale-105 transition-smooth">
                Inscrever
              </button>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-border/20 pt-8 mt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Techflix Academy. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;