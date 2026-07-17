'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Calculator, GraduationCap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Course {
  id: string;
  name: string;
  credits: number;
  gradePoints: number;
}

const GRADE_VALUES: Record<string, number> = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'F': 0.0
};

export default function GPACalculatorPage() {
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', name: 'Mathematics I', credits: 4, gradePoints: 4.0 },
    { id: '2', name: 'Physics Lab', credits: 2, gradePoints: 3.3 },
  ]);

  const [courseName, setCourseName] = useState('');
  const [credits, setCredits] = useState<number>(3);
  const [grade, setGrade] = useState<string>('A');
  const { toast } = useToast();

  const handleAddCourse = () => {
    if (!courseName.trim()) {
      toast({ title: "Name is required", description: "Please enter a course name.", variant: "destructive" });
      return;
    }
    const newCourse: Course = {
      id: String(Date.now()),
      name: courseName,
      credits,
      gradePoints: GRADE_VALUES[grade] || 4.0,
    };
    setCourses(prev => [...prev, newCourse]);
    setCourseName('');
    setCredits(3);
    setGrade('A');
  };

  const handleRemoveCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  const calculateGPA = () => {
    let totalCredits = 0;
    let totalPoints = 0;

    courses.forEach(c => {
      totalCredits += c.credits;
      totalPoints += c.credits * c.gradePoints;
    });

    const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
    return {
      gpa: Math.round(gpa * 100) / 100,
      totalCredits
    };
  };

  const { gpa, totalCredits } = calculateGPA();

  return (<>
      <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input form */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="shadow-lg border-primary/10">
            <CardHeader className="bg-primary/5 border-b p-4">
              <CardTitle className="flex items-center gap-2 italic font-black text-2xl">
                <GraduationCap className="h-6 w-6 text-primary" /> GPA CALCULATOR
              </CardTitle>
              <CardDescription>Calculate your semester GPA by entering course credits and letter grades.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              
              <div className="grid grid-cols-6 gap-2">
                <div className="col-span-3">
                  <Label htmlFor="cname" className="text-xs font-bold uppercase tracking-wider block mb-1">Course Title</Label>
                  <Input id="cname" placeholder="e.g. Chemistry" value={courseName} onChange={(e) => setCourseName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="ccred" className="text-xs font-bold uppercase tracking-wider block mb-1">Credits</Label>
                  <Input id="ccred" type="number" min={1} value={credits === 0 ? '' : credits} placeholder="3" onChange={(e) => setCredits(Number(e.target.value))} />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs font-bold uppercase tracking-wider block mb-1">Grade</Label>
                  <Select value={grade} onValueChange={setGrade}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.keys(GRADE_VALUES).map((g) => (
                        <SelectItem key={g} value={g}>{g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button onClick={handleAddCourse} variant="outline" className="w-full rounded-xl"><Plus className="h-4 w-4 mr-2" /> Add Course</Button>

              <div className="divide-y max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {courses.map((c) => (
                  <div key={c.id} className="flex justify-between items-center py-3">
                    <div>
                      <p className="font-bold text-xs">{c.name}</p>
                      <p className="text-[10px] text-muted-foreground">{c.credits} Credits • Points: {c.gradePoints.toFixed(1)}</p>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => handleRemoveCourse(c.id)} className="h-7 w-7 text-destructive hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                ))}
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Breakdown */}
        <div className="lg:col-span-5">
          <Card className="shadow-lg border-primary/10 h-full flex flex-col justify-between">
            <CardHeader className="bg-muted/50 border-b">
              <CardTitle className="text-sm uppercase tracking-widest text-center text-muted-foreground flex items-center justify-center gap-1"><Calculator className="h-4 w-4 text-primary" /> Semester GPA</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-6 flex flex-col justify-center items-center space-y-3 min-h-[250px]">
              <span className="font-mono text-5xl font-black italic tracking-tighter text-primary">
                {gpa.toFixed(2)}
              </span>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">GPA Score</p>
              <div className="bg-primary/5 p-3 border border-primary/20 rounded-xl text-xs w-full text-center">
                Total Credit Hours: <span className="font-bold">{totalCredits}</span>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
      
      <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
            <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our GPA Calculator?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Free & Secure:</strong> Our GPA Calculator is 100% free and runs completely in your web browser. No registration, signup, or installation is required.
                    </p>
                    <p>
                        Calculate semester GPA based on grade inputs.
                    </p>
                </div>
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Step-by-Step Guide:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Open the GPA Calculator tool on UseBro.</li>
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
                    <h4 className="font-bold mb-2 text-base">Is the GPA Calculator tool free to use?</h4>
                    <p className="text-muted-foreground text-sm">Yes! All tools on UseBro are 100% free with no monthly subscription limits, hidden fees, or signup forms.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Does this GPA Calculator upload my files to a server?</h4>
                    <p className="text-muted-foreground text-sm">No. To guarantee security and privacy, all processing is performed locally inside your web browser. Your private files never leave your device.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Can I use GPA Calculator on my mobile device?</h4>
                    <p className="text-muted-foreground text-sm">Yes! UseBro is fully mobile-friendly and responsive, running smoothly on Android, iPhone, iPad, and desktop browsers.</p>
                </div>
            </div>
        </div>
      </section>
    </>);
}
