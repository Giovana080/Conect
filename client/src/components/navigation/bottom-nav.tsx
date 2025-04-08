import { Home, Settings, BookOpen, Users } from "lucide-react";
import { Link } from "wouter";

type BottomNavProps = {
  active: "home" | "skills" | "connections" | "specialties";
};

export default function BottomNav({ active }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-6">
      <div className="flex justify-around items-center">
        <Link href="/">
          <a className={`flex flex-col items-center py-1 px-3 ${active === "home" ? "text-primary" : "text-gray-500"}`}>
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Início</span>
          </a>
        </Link>
        
        <Link href="/skills">
          <a className={`flex flex-col items-center py-1 px-3 ${active === "skills" ? "text-primary" : "text-gray-500"}`}>
            <Settings className="h-5 w-5" />
            <span className="text-xs mt-1">Habilidades</span>
          </a>
        </Link>
        
        <Link href="/connections">
          <a className={`flex flex-col items-center py-1 px-3 ${active === "connections" ? "text-primary" : "text-gray-500"}`}>
            <Users className="h-5 w-5" />
            <span className="text-xs mt-1">Conexões</span>
          </a>
        </Link>
        
        <Link href="/specialties">
          <a className={`flex flex-col items-center py-1 px-3 ${active === "specialties" ? "text-primary" : "text-gray-500"}`}>
            <BookOpen className="h-5 w-5" />
            <span className="text-xs mt-1">Especialidades</span>
          </a>
        </Link>
      </div>
    </div>
  );
}
