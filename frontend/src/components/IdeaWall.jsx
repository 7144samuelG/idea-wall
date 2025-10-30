import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { useGetAllCards, useCreateCard } from '../use-queries';
import { NoteCard } from './NoteCard';
import { Header } from './Header';
import { Footer } from './Footer';

export const IdeaWall = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const { data: cards = [], isLoading } = useGetAllCards();
  const createCardMutation = useCreateCard();
  const generateuniqueCodes = () => {
    const length = 10;

    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  const handleCreateCard = async () => {
    if (!noteContent.trim()) {
      toast.error('Please enter some content for your note');
      return;
    }

    // Create card at a random position in the center area
    const x = Math.floor(Math.random() * 400) + 200;
    const y = Math.floor(Math.random() * 300) + 150;
    const id = generateuniqueCodes();
    try {
      await createCardMutation.mutateAsync({
        id,
        content: noteContent,
        x: BigInt(x),
        y: BigInt(y),
      });
      setNoteContent('');
      setIsDialogOpen(false);
      toast.success('Note added to the wall!');
    } catch (error) {
      toast.error('Failed to create note');
      console.error('Error creating card:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 relative overflow-hidden">
        {/* Canvas area */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/20 to-background">
          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(oklch(var(--foreground) / 0.1) 1px, transparent 1px),
                linear-gradient(90deg, oklch(var(--foreground) / 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          />

          {/* Cards container */}
          <div className="relative w-full h-full">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-muted-foreground">Loading your ideas...</div>
              </div>
            ) : cards.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-4">
                  <p className="text-2xl font-semibold text-foreground">Your idea wall is empty</p>
                  <p className="text-muted-foreground">Click the button below to add your first note</p>
                </div>
              </div>
            ) : (
              cards.map((card) => (
                <NoteCard
                  key={card.id.toString()}
                  card={card}
                />
              ))
            )}
          </div>
        </div>

        {/* Floating action button */}
        <div className="fixed bottom-8 right-8 z-50">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="h-16 w-16 rounded-full shadow-2xl hover:scale-110 transition-transform"
              >
                <Plus className="h-8 w-8" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add a New Note</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="note-content">What's on your mind?</Label>
                  <Textarea
                    id="note-content"
                    placeholder="Type your idea here..."
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    className="min-h-[120px] resize-none"
                    autoFocus
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setNoteContent('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateCard}
                    disabled={createCardMutation.isPending || !noteContent.trim()}
                  >
                    {createCardMutation.isPending ? 'Adding...' : 'Add Note'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </main>

      <Footer />
    </div>
  );
}
