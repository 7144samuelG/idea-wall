import { useState, useRef, useEffect } from 'react';
import { Trash2, GripVertical } from 'lucide-react';
import { Button } from './ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { toast } from 'sonner';
import { useUpdateCardPosition, useDeleteCard } from '../use-queries';

export const NoteCard=( card )=> {
  
  const [position, setPosition] = useState({ x: Number(card.card.x), y: Number(card.card.y) });
  const [isDragging, setIsDragging] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const dragRef = useRef(null);
  const cardRef = useRef(null);
  
  const updatePositionMutation = useUpdateCardPosition();
  const deleteCardMutation = useDeleteCard();

  // Sync position with card prop when it changes
  useEffect(() => {
    setPosition({ x: Number(card.card.x), y: Number(card.card.y) });
  }, [card.card.x, card.card.y]);

  const handleMouseDown = (e) => {
    if ((e.target).closest('button')) {
      return;
    }
    
    e.preventDefault();
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !dragRef.current) return;

    const deltaX = e.clientX - dragRef.current.startX;
    const deltaY = e.clientY - dragRef.current.startY;

    setPosition({
      x: dragRef.current.initialX + deltaX,
      y: dragRef.current.initialY + deltaY,
    });
  };

  const handleMouseUp = async () => {
    if (!isDragging || !dragRef.current) return;

    setIsDragging(false);

    // Only update if position actually changed
    if (position.x !== Number(card.card.x) || position.y !== Number(card.card.y)) {
      try {
        await updatePositionMutation.mutateAsync({
          id: card.card.id,
          x: BigInt(Math.round(position.x)),
          y: BigInt(Math.round(position.y)),
        });
      } catch (error) {
        toast.error('Failed to update note position');
        console.error('Error updating position:', error);
        // Revert to original position on error
        setPosition({ x: Number(card.card.x), y: Number(card.card.y) });
      }
    }

    dragRef.current = null;
  };

  const handleDelete = async () => {
    try {
      await deleteCardMutation.mutateAsync(card.card.id);
      toast.success('Note deleted');
    } catch (error) {
      toast.error('Failed to delete note');
      console.error('Error deleting card:', error);
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, position]);

  return (
    <>
      <div
        ref={cardRef}
        className={`absolute group ${isDragging ? 'cursor-grabbing z-50' : 'cursor-grab z-10'}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: isDragging ? 'rotate(-2deg) scale(1.05)' : 'rotate(0deg) scale(1)',
          transition: isDragging ? 'none' : 'transform 0.2s ease-out',
        }}
        onMouseDown={handleMouseDown}
      >
        <div
          className={`
            w-64 min-h-[160px] p-4 rounded-lg shadow-lg
            bg-gradient-to-br from-accent/90 to-accent
            border-2 border-accent-foreground/10
            ${isDragging ? 'shadow-2xl' : 'hover:shadow-xl'}
            transition-shadow duration-200
          `}
        >
          {/* Drag handle */}
          <div className="flex items-center justify-between mb-2">
            <GripVertical className="h-4 w-4 text-accent-foreground/40" />
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20 hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteDialog(true);
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>

          {/* Note content */}
          <div className="text-accent-foreground whitespace-pre-wrap break-words text-sm leading-relaxed">
            {card.card.content}
          </div>

          {/* Timestamp */}
          <div className="mt-3 pt-2 border-t border-accent-foreground/10">
            <p className="text-xs text-accent-foreground/60">
              {new Date(Number(card.card.created) / 1000000).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this note?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your note from the wall.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-black hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
