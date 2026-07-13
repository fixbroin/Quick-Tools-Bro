'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { FileText, Plus, Trash2, Search, Download, Copy, Edit3 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Note {
  id: string;
  title: string;
  body: string;
  updatedAt: number;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('quick_tools_bro_notes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Note[];
        setNotes(parsed);
        if (parsed.length > 0) {
          setActiveNoteId(parsed[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      // Default initial note
      const defaultNote: Note = {
        id: '1',
        title: 'Welcome Note',
        body: 'Welcome to your private browser Notepad!\n\n- All notes are auto-saved to your browser\'s local storage.\n- No data is ever sent to any server.\n- Click "+ New Note" to create a note.\n- Click the Copy or Download icons to extract your contents.',
        updatedAt: Date.now()
      };
      setNotes([defaultNote]);
      setActiveNoteId('1');
    }
  }, []);

  // Save to localStorage
  const saveToStorage = (updatedNotes: Note[]) => {
    localStorage.setItem('quick_tools_bro_notes', JSON.stringify(updatedNotes));
  };

  const activeNote = notes.find(note => note.id === activeNoteId);

  const handleCreateNote = () => {
    const newNote: Note = {
      id: String(Date.now()),
      title: 'Untitled Note',
      body: '',
      updatedAt: Date.now()
    };
    const updated = [newNote, ...notes];
    setNotes(updated);
    setActiveNoteId(newNote.id);
    saveToStorage(updated);
  };

  const handleUpdateNote = (field: 'title' | 'body', value: string) => {
    if (!activeNoteId) return;
    const updated = notes.map(note => {
      if (note.id === activeNoteId) {
        return {
          ...note,
          [field]: value,
          updatedAt: Date.now()
        };
      }
      return note;
    });
    setNotes(updated);
    saveToStorage(updated);
  };

  const handleDeleteNote = (id: string) => {
    const updated = notes.filter(note => note.id !== id);
    setNotes(updated);
    saveToStorage(updated);
    
    if (activeNoteId === id) {
      if (updated.length > 0) {
        setActiveNoteId(updated[0].id);
      } else {
        setActiveNoteId(null);
      }
    }
    toast({ title: 'Note Deleted' });
  };

  const handleCopy = () => {
    if (!activeNote) return;
    navigator.clipboard.writeText(activeNote.body);
    toast({ title: 'Note Copied to Clipboard!' });
  };

  const handleDownload = () => {
    if (!activeNote) return;
    const blob = new Blob([activeNote.body], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${activeNote.title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.txt`;
    a.click();
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (<>
      <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 min-h-[500px]">
        
        {/* Sidebar */}
        <div className="md:col-span-4 space-y-4 flex flex-col">
          <Card className="shadow-lg border-primary/10 flex-1 flex flex-col overflow-hidden">
            <CardHeader className="bg-primary/5 border-b p-4 space-y-3">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2 italic font-black text-xl">
                  <FileText className="h-5 w-5 text-primary" /> NOTES MANAGER
                </CardTitle>
                <Button size="icon" onClick={handleCreateNote} className="h-8 w-8 rounded-lg">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 rounded-lg"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-y-auto max-h-[400px] md:max-h-[500px] custom-scrollbar">
              <div className="divide-y">
                {filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => setActiveNoteId(note.id)}
                    className={`p-4 cursor-pointer hover:bg-muted/30 transition-all flex justify-between items-center group ${activeNoteId === note.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`}
                  >
                    <div className="min-w-0 pr-2">
                      <p className="font-bold text-xs truncate">{note.title}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{note.body || 'Empty note...'}</p>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }}
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10 rounded-md shrink-0 transition-opacity"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
                {filteredNotes.length === 0 && (
                  <div className="text-center py-10 opacity-30 text-xs uppercase font-bold tracking-widest">
                    No notes found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Editor Area */}
        <div className="md:col-span-8">
          {activeNote ? (
            <Card className="shadow-lg border-primary/10 h-full flex flex-col">
              <CardHeader className="bg-muted/50 border-b p-4 flex flex-row items-center justify-between">
                <Input
                  value={activeNote.title}
                  onChange={(e) => handleUpdateNote('title', e.target.value)}
                  className="font-bold text-sm bg-transparent border-none p-0 focus-visible:ring-0 max-w-sm h-auto focus:outline-none"
                  placeholder="Note Title"
                />
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={handleCopy} className="h-8 w-8 text-muted-foreground hover:text-primary rounded-lg"><Copy className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={handleDownload} className="h-8 w-8 text-muted-foreground hover:text-primary rounded-lg"><Download className="h-4 w-4" /></Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0 min-h-[350px] flex flex-col">
                <Textarea
                  value={activeNote.body}
                  onChange={(e) => handleUpdateNote('body', e.target.value)}
                  placeholder="Start writing here..."
                  className="flex-1 border-none focus-visible:ring-0 rounded-none p-6 font-mono text-sm leading-relaxed resize-none focus:outline-none min-h-[350px]"
                />
              </CardContent>
            </Card>
          ) : (
            <div className="border-2 border-dashed rounded-2xl p-10 flex flex-col justify-center items-center h-full text-center opacity-40">
              <Edit3 className="h-12 w-12 mb-2 stroke-[1.5]" />
              <p className="text-sm font-bold uppercase tracking-widest mb-2">No Active Note</p>
              <Button size="sm" onClick={handleCreateNote}>Create one now</Button>
            </div>
          )}
        </div>

      </div>
    </div>
      
      <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
            <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our Notes Notepad?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Free & Secure:</strong> Our Notes Notepad is 100% free and runs completely in your web browser. No registration, signup, or installation is required.
                    </p>
                    <p>
                        Take private browser notes with local storage auto-saving.
                    </p>
                </div>
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Step-by-Step Guide:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Open the Notes Notepad tool on UseBro.</li>
                        <li>Input your parameters or upload the required file in the field controls.</li>
                        <li>Wait for the tool to process the details dynamically in your browser.</li>
                        <li>Click download, save, or copy the final outputs to your device.</li>
                    </ul>
                </div>
            </div>
        </div>

        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-headline">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Is the Notes Notepad tool free to use?</h4>
                    <p className="text-muted-foreground text-sm">Yes! All tools on UseBro are 100% free with no monthly subscription limits, hidden fees, or signup forms.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Does this Notes Notepad upload my files to a server?</h4>
                    <p className="text-muted-foreground text-sm">No. To guarantee security and privacy, all processing is performed locally inside your web browser. Your private files never leave your device.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Can I use Notes Notepad on my mobile device?</h4>
                    <p className="text-muted-foreground text-sm">Yes! UseBro is fully mobile-friendly and responsive, running smoothly on Android, iPhone, iPad, and desktop browsers.</p>
                </div>
            </div>
        </div>
      </section>
    </>);
}
