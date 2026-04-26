
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo-vyk.png";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

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

            {user && (
              <div className="flex items-center gap-3">
                <span className="hidden md:block text-sm text-muted-foreground">{user.email}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="gap-2 text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:block">Sair</span>
                </Button>
              </div>
            )}
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
