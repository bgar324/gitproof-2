import { Save, Loader2 } from "lucide-react";

interface SaveButtonProps {
  isSaving: boolean;
  onSave: () => void;
}

export function SaveButton({ isSaving, onSave }: SaveButtonProps) {
  return (
    <div className="fixed bottom-6 right-6 md:right-10 z-50">
      <button
        onClick={onSave}
        disabled={isSaving}
        className="shadow-2xl shadow-primary/20 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium text-sm flex items-center gap-2 hover:scale-105 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-wait hover:cursor-pointer"
      >
        {isSaving ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Save size={16} />
        )}
        Save All Changes
      </button>
    </div>
  );
}
