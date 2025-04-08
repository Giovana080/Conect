import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Category, Skill } from "@shared/schema";
import { useLocation } from "wouter";
import { Loader2, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import BottomNav from "@/components/navigation/bottom-nav";

export default function SkillsPage() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get all skills
  const {
    data: skills,
    isLoading: skillsLoading,
    error: skillsError,
  } = useQuery<Skill[]>({
    queryKey: ["/api/skills"],
  });

  // Get user skills
  const {
    data: userSkills,
    isLoading: userSkillsLoading,
    error: userSkillsError,
  } = useQuery<any[]>({
    queryKey: ["/api/user-skills"],
  });

  const isLoading = skillsLoading || userSkillsLoading;
  const hasError = skillsError || userSkillsError;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Erro ao carregar habilidades.</p>
      </div>
    );
  }
  
  // Mocking data for now
  const selectedSkills = [
    { id: 1, name: "Desenvolvimento Web" },
    { id: 2, name: "JavaScript" },
    { id: 3, name: "React" },
  ];
  
  // Group skills by category
  const skillsByCategory: Record<string, Skill[]> = {};
  
  skills?.forEach(skill => {
    if (!skillsByCategory[skill.category]) {
      skillsByCategory[skill.category] = [];
    }
    skillsByCategory[skill.category].push(skill);
  });

  const filteredSkillsByCategory: Record<string, Skill[]> = {};
  
  if (searchQuery.trim()) {
    Object.entries(skillsByCategory).forEach(([category, categorySkills]) => {
      const filtered = categorySkills.filter(skill => 
        skill.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      if (filtered.length > 0) {
        filteredSkillsByCategory[category] = filtered;
      }
    });
  } else {
    Object.assign(filteredSkillsByCategory, skillsByCategory);
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center">
          <button 
            onClick={() => navigate("/")}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition mr-2"
          >
            <ArrowLeft className="text-lg text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-dark">Habilidades Técnicas</h1>
        </div>
      </header>
      
      <section className="px-6 py-6">
        <p className="text-gray-600 mb-6">Selecione as habilidades que você possui ou deseja aprender.</p>
        
        {/* Search Skills */}
        <div className="mb-6">
          <div className="relative">
            <Input
              type="search"
              placeholder="Buscar habilidades"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Selected Skills */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-dark mb-3">Suas habilidades selecionadas</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedSkills.map((skill) => (
              <Badge key={skill.id} variant="secondary" className="bg-blue-100 text-primary">
                {skill.name}
                <button className="ml-1 rounded-full hover:bg-blue-200 h-5 w-5 inline-flex items-center justify-center">
                  <i className="ri-close-line text-xs"></i>
                </button>
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Skill Categories */}
        <div>
          <h3 className="text-lg font-semibold text-dark mb-3">Categorias de habilidades</h3>
          
          {Object.entries(filteredSkillsByCategory).map(([category, categorySkills]) => (
            <div key={category} className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{category}</h4>
                <Button variant="link" size="sm" className="text-primary p-0">Ver todas</Button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {categorySkills.map((skill) => (
                  <div key={skill.id} className="border border-gray-200 rounded-lg p-3 bg-white">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-primary mr-3">
                        <i className={`ri-${skill.iconName || 'code-line'}`}></i>
                      </div>
                      <div>
                        <h5 className="font-medium text-sm">{skill.name}</h5>
                        <p className="text-xs text-gray-500">{skill.description || category}</p>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 mr-1">Ensinar</span>
                        <Switch id={`teach-${skill.id}`} className="h-4 data-[state=checked]:bg-secondary" />
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 mr-1">Aprender</span>
                        <Switch id={`learn-${skill.id}`} className="h-4 data-[state=checked]:bg-primary" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Bottom Navigation */}
      <BottomNav active="skills" />
    </div>
  );
}
