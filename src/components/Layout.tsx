
import { Link } from "react-router-dom";
import logo from "@/assets/logo-vyk.png";

const Layout = ({ children }: { children: React.ReactNode }) => {

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex h-16 md:h-20 items-center justify-between">
            <Link to="/" className="flex items-center gap-2 md:gap-3 transition-transform hover:scale-105">
              <img src={logo} alt="VLK Logo" className="h-10 w-10 md:h-12 md:w-12 mix-blend-multiply rounded-md" />
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                  VLK
                </span>
                <span className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider">
                  Value Your Key Personal System
                </span>
              </div>
            </Link>


          </div>
        </div>
      </header>

      <main className="relative z-10">
        {children}
      </main>
    </div>
  );
};

export default Layout;
