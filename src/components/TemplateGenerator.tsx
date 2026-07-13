'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Copy, Download, Sparkles, FileText, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface GeneratorProps {
  type: 'email-writer' | 'caption-generator' | 'cover-letter' | 'prompt-generator' | 'bio-generator' | 'business-name-generator' | 'video-title-generator' | 'hashtag-generator' | 'youtube-tag-generator';
  title: string;
  description: string;
}

export function TemplateGenerator({ type, title, description }: GeneratorProps) {
  // Input fields state
  const [field1, setField1] = useState(''); // Purpose / Key points / Topic
  const [field2, setField2] = useState(''); // Recipient / Company / Platform
  const [tone, setTone] = useState('professional');
  const [output, setOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const handleGenerate = () => {
    setIsGenerating(true);
    
    // Simulate a brief loading sequence to feel premium and professional
    setTimeout(() => {
      let result = '';

      if (type === 'email-writer') {
        const recipient = field2 || 'Recipient';
        const points = field1 || 'the updates';
        
        const professionalTemplates = [
          `Subject: Update regarding ${points}\n\nDear ${recipient},\n\nI hope this email finds you well.\n\nI wanted to share a brief update concerning: ${points}.\n\nPlease let me know if you would like to schedule a call to discuss this further.\n\nBest regards,\n[Your Name]`,
          `Subject: Discussion: ${points}\n\nDear ${recipient},\n\nFollowing up on our recent communications, I am writing to outline the key aspects regarding: ${points}.\n\nLet me know your thoughts when you have a moment.\n\nSincerely,\n[Your Name]`
        ];

        const casualTemplates = [
          `Hey ${recipient},\n\nHope you're having a great week!\n\nJust a quick heads-up about: ${points}.\n\nLet me know what you think.\n\nTalk soon,\n[Your Name]`,
          `Hi ${recipient},\n\nQuick note to loop you in on: ${points}.\n\nCatch you later,\n[Your Name]`
        ];

        const apologyTemplates = [
          `Subject: Apology for the inconvenience regarding ${points}\n\nDear ${recipient},\n\nPlease accept our sincere apologies regarding: ${points}.\n\nWe appreciate your patience as we rectify the situation.\n\nSincerely,\n[Your Name]`,
          `Subject: Re: Update on ${points}\n\nHi ${recipient},\n\nI am writing to apologize for the delay regarding: ${points}.\n\nThank you for understanding.\n\nBest,\n[Your Name]`
        ];

        const requestTemplates = [
          `Subject: Request: Information on ${points}\n\nDear ${recipient},\n\nCould you please assist me with: ${points}?\n\nYour help is highly appreciated.\n\nRegards,\n[Your Name]`,
          `Hi ${recipient},\n\nHope you are well. Could you share some updates regarding: ${points}?\n\nThanks,\n[Your Name]`
        ];

        let list = professionalTemplates;
        if (tone === 'casual') list = casualTemplates;
        if (tone === 'apology') list = apologyTemplates;
        if (tone === 'request') list = requestTemplates;

        result = list[Math.floor(Math.random() * list.length)];

      } else if (type === 'caption-generator') {
        const topic = field1 || 'daily highlight';
        const platform = field2 || 'instagram';

        const linkedinTemplates = [
          `🚀 Excited to share a quick insight on: ${topic}.\n\nKey takeaways:\n🔹 Focus on consistency\n🔹 Build meaningful relationships\n\nWhat are your thoughts on this? Let's discuss in the comments!\n\n#ProfessionalGrowth #Careers #Leadership`,
          `💡 Insights on: ${topic}.\n\nIn my experience, focusing on the fundamentals makes all the difference.\n\nAgree? Let me know below.\n\n#BusinessStrategy #Networking #Success`
        ];

        const twitterTemplates = [
          `Reflecting on: ${topic}. 🧵\n\nHere's the quick breakdown:\n1. Keep moving.\n2. Embrace change.\n3. Stay curious.\n\nThoughts? 👇`,
          `Just realized that ${topic} is all about timing. What's your take? ⚡`
        ];

        const instaTemplates = [
          `✨ Finding beauty in the details. Today's focus: ${topic}. ✨\n\nEnjoy the little things. 📸\n\n#GoodVibes #Mindset #DailyInspo #ExplorePage`,
          `Current mood: exploring ${topic}. 🍂☀️\n\n#Aesthetics #Mood #DailyCheck`
        ];

        let list = instaTemplates;
        if (platform === 'linkedin') list = linkedinTemplates;
        if (platform === 'twitter') list = twitterTemplates;

        result = list[Math.floor(Math.random() * list.length)];

      } else if (type === 'cover-letter') {
        const jobTitle = field1 || 'Developer';
        const company = field2 || 'Company';

        const coverTemplates = [
          `Dear Hiring Team at ${company},\n\nI am writing to apply for the position of ${jobTitle} at your company. With my skills in problem-solving and design, I am excited about the opportunity to add value to your team.\n\nThank you for your time.\n\nSincerely,\n[Your Name]`,
          `Dear Hiring Manager,\n\nI am thrilled to submit my application for the ${jobTitle} opening at ${company}. I have spent years honing my skillset and believe I would be a great cultural and technical fit.\n\nBest regards,\n[Your Name]`
        ];
        result = coverTemplates[Math.floor(Math.random() * coverTemplates.length)];

      } else if (type === 'prompt-generator') {
        const idea = field1 || 'design a minimalist landing page';
        const prompts = [
          `Act as an expert designer. Create a prompt for: ${idea}. The style should be modern, clean, with dark-mode presets.`,
          `Role: AI Artist. Objective: generate a high-definition output of: ${idea}. Use detailed textures and warm lighting.`
        ];
        result = prompts[Math.floor(Math.random() * prompts.length)];

      } else if (type === 'bio-generator') {
        const profession = field1 || 'Designer';
        const hobbies = field2 || 'coding, photography';
        
        const bioPool = [
          `1️⃣ ${profession} | Passionate about ${hobbies}. Let's create something cool.`,
          `2️⃣ Building products & drinking coffee. ☕ | Focus: ${profession} | Skill: ${hobbies}.`,
          `3️⃣ Making things simple. ✨ | Professional ${profession} | Love ${hobbies}.`
        ];
        result = bioPool.join('\n\n');

      } else if (type === 'business-name-generator') {
        const keyword = field1 || 'Tech';
        const industry = field2 || 'software';

        // Pools of creative naming elements
        const prefixes = ['Apex', 'Nova', 'Quantum', 'Zen', 'Summit', 'Alpha', 'Vertex', 'Stellar', 'Vortex', 'Aero', 'Sync', 'Core', 'Inno', 'Meta', 'Net', 'Sky', 'Omni', 'Blue', 'Swift', 'Opti', 'True', 'Prime', 'Peak', 'Matrix', 'Echo', 'Flux', 'Vibe', 'Spark', 'Grid'];
        const suffixes = ['Labs', 'Core', 'Wave', 'Systems', 'Hub', 'Grid', 'Pulse', 'Flow', 'Link', 'Node', 'Base', 'Zone', 'Draft', 'Shift', 'Spark', 'Ventures', 'HQ', 'Craft', 'Logic', 'Design', 'Line', 'Works', 'Studio', 'Force', 'Partners', 'Global'];

        // Clean and capitalize keywords
        const cleanKw = keyword.split(' ').map(capitalize).join('');

        const generatedNames: string[] = [];
        for (let i = 0; i < 10; i++) {
          const randPref = prefixes[Math.floor(Math.random() * prefixes.length)];
          const randSuff = suffixes[Math.floor(Math.random() * suffixes.length)];
          const roll = Math.random();

          let name = '';
          if (roll < 0.3) {
            name = `${randPref}${cleanKw}`;
          } else if (roll < 0.6) {
            name = `${cleanKw}${randSuff}`;
          } else {
            name = `${randPref} ${cleanKw} ${randSuff}`;
          }
          
          if (!generatedNames.includes(name)) {
            generatedNames.push(name);
          } else {
            i--; // retry unique
          }
        }

        result = `Here are 10 brandable business names for "${keyword}" (${industry}):\n\n` + 
                 generatedNames.map((name, index) => `${index + 1}. ${name}`).join('\n');

      } else if (type === 'video-title-generator') {
        const topic = field1 || 'coding';
        const titles = [
          `I tried learning ${topic} in 24 hours (Here is what happened)`,
          `The ultimate guide to ${topic} in 2026`,
          `Stop doing this when you learn ${topic}`,
          `X Secrets to mastering ${topic}`,
          `How to start ${topic} from absolute scratch`,
          `${topic} tutorial for absolute beginners`
        ];
        // Shuffle and pick 5
        const shuffled = titles.sort(() => 0.5 - Math.random());
        result = shuffled.slice(0, 5).map((t, idx) => `${idx + 1}. ${t}`).join('\n');

      } else if (type === 'hashtag-generator') {
        const kw = field1.toLowerCase() || 'marketing';
        const variants = [`#${kw}`, `#${kw}strategy`, `#${kw}tips`, `#${kw}expert`, `#${kw}life`, `#${kw}life`, `#explore${capitalize(kw)}`, `#${kw}trending`, `#${kw}ideas`, `#${kw}community`];
        const shuffled = variants.sort(() => 0.5 - Math.random());
        result = shuffled.slice(0, 6).join(' ');

      } else if (type === 'youtube-tag-generator') {
        const topic = field1 || 'web design';
        const baseTags = [topic, `${topic} tutorial`, `learn ${topic}`, `how to do ${topic}`, `${topic} tips`, `${topic} 2026`];
        const shuffled = baseTags.sort(() => 0.5 - Math.random());
        result = shuffled.join(', ');
      }

      setOutput(result);
      setIsGenerating(false);
      toast({ title: 'Generated successfully!' });
    }, 400);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    toast({ title: 'Copied to Clipboard!' });
  };

  const downloadTxt = () => {
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `generated-${type}.txt`;
    a.click();
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input parameters */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="shadow-lg border-primary/10">
            <CardHeader className="bg-primary/5 border-b p-4">
              <CardTitle className="flex items-center gap-2 italic font-black text-2xl">
                <Sparkles className="h-6 w-6 text-primary" /> {title}
              </CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              
              {/* Context inputs */}
              <div className="space-y-4">
                {type === 'email-writer' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="recipient">Recipient Name</Label>
                      <Input id="recipient" value={field2} onChange={(e) => setField2(e.target.value)} placeholder="e.g. John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="points">Key Points to Cover</Label>
                      <Textarea id="points" value={field1} onChange={(e) => setField1(e.target.value)} placeholder="e.g. reschedule tomorrow's sync to 3 PM" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tone">Email Tone</Label>
                      <Select value={tone} onValueChange={setTone}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="apology">Apology</SelectItem>
                          <SelectItem value="request">Request</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {type === 'caption-generator' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="topic">Topic / What is the post about?</Label>
                      <Input id="topic" value={field1} onChange={(e) => setField1(e.target.value)} placeholder="e.g. morning coffee vibes" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="platform">Social Platform</Label>
                      <Select value={field2} onValueChange={setField2}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="linkedin">LinkedIn</SelectItem>
                          <SelectItem value="twitter">Twitter / X</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {type === 'cover-letter' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="job">Job Title</Label>
                      <Input id="job" value={field1} onChange={(e) => setField1(e.target.value)} placeholder="e.g. Frontend Developer" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name</Label>
                      <Input id="company" value={field2} onChange={(e) => setField2(e.target.value)} placeholder="e.g. Google" />
                    </div>
                  </>
                )}

                {type === 'prompt-generator' && (
                  <div className="space-y-2">
                    <Label htmlFor="idea">Describe what you want to build/generate</Label>
                    <Textarea id="idea" value={field1} onChange={(e) => setField1(e.target.value)} placeholder="e.g. a beautiful sunset landscape painting" />
                  </div>
                )}

                {type === 'bio-generator' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="prof">Your Profession / Title</Label>
                      <Input id="prof" value={field1} onChange={(e) => setField1(e.target.value)} placeholder="e.g. Product Manager" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hobbies">Hobbies & Core Skills</Label>
                      <Input id="hobbies" value={field2} onChange={(e) => setField2(e.target.value)} placeholder="e.g. photography, coffee roasting" />
                    </div>
                  </>
                )}

                {type === 'business-name-generator' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="kw">Seed Keyword</Label>
                      <Input id="kw" value={field1} onChange={(e) => setField1(e.target.value)} placeholder="e.g. Cloud" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ind">Industry</Label>
                      <Input id="ind" value={field2} onChange={(e) => setField2(e.target.value)} placeholder="e.g. web hosting" />
                    </div>
                  </>
                )}

                {type === 'video-title-generator' && (
                  <div className="space-y-2">
                    <Label htmlFor="vt">Video Topic</Label>
                    <Input id="vt" value={field1} onChange={(e) => setField1(e.target.value)} placeholder="e.g. learning Python" />
                  </div>
                )}

                {type === 'hashtag-generator' && (
                  <div className="space-y-2">
                    <Label htmlFor="hash">Core Keyword</Label>
                    <Input id="hash" value={field1} onChange={(e) => setField1(e.target.value)} placeholder="e.g. travel" />
                  </div>
                )}

                {type === 'youtube-tag-generator' && (
                  <div className="space-y-2">
                    <Label htmlFor="tag">Video Core Topic</Label>
                    <Input id="tag" value={field1} onChange={(e) => setField1(e.target.value)} placeholder="e.g. web design" />
                  </div>
                )}
              </div>

            </CardContent>
            <CardFooter className="bg-muted/30 p-6 border-t">
              <Button onClick={handleGenerate} disabled={isGenerating} className="w-full h-12 rounded-xl font-bold">
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> GENERATING...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" /> GENERATE IDEAS
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Output */}
        <div className="lg:col-span-6">
          <Card className="shadow-lg border-primary/10 h-full flex flex-col">
            <CardHeader className="bg-muted/50 border-b flex flex-row justify-between items-center p-4">
              <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground">Generated Output</CardTitle>
              {output && (
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={handleCopy} className="h-8 w-8 rounded-lg"><Copy className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={downloadTxt} className="h-8 w-8 rounded-lg"><Download className="h-4 w-4" /></Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="flex-1 p-4 flex flex-col min-h-[300px]">
              {output ? (
                <Textarea
                  readOnly
                  value={output}
                  className="flex-1 min-h-[350px] font-mono text-sm leading-relaxed rounded-xl p-4 bg-muted/10 border resize-none"
                />
              ) : (
                <div className="text-center space-y-3 opacity-40 my-auto">
                  <FileText className="h-16 w-16 mx-auto stroke-[1.5]" />
                  <p className="text-sm font-bold uppercase tracking-widest">Awaiting Generation</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
