import { StickyNote } from 'lucide-react';

export const Header=()=>{
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
            <StickyNote className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Idea Wall</h1>
            <p className="text-xs text-muted-foreground">Organize your thoughts freely</p>
          </div>
        </div>
      </div>
    </header>
  );
}
