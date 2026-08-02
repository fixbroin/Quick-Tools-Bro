'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Code, Eye, Play, Trash2, Copy, Download, Maximize2, Minimize2, 
  RotateCcw, Sparkles, FileCode, Check, Columns, LayoutList, ExternalLink
} from 'lucide-react';
import { SeoSection } from '@/components/SeoSection';
import ScrollToTop from '@/components/ScrollToTop';

const PRESETS = {
  profileCard: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>User Profile Card</title>
  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      height: 100vh;
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #333;
    }
    .card {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      padding: 30px;
      width: 320px;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0,0,0,0.25);
      border: 1px solid rgba(255,255,255,0.3);
      transition: transform 0.3s ease;
    }
    .card:hover {
      transform: translateY(-5px);
    }
    .avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: linear-gradient(45deg, #ff7e5f, #feb47b);
      margin: 0 auto 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
      color: white;
      box-shadow: 0 4px 15px rgba(0,0,0,0.15);
    }
    h2 {
      margin: 10px 0 5px;
      font-size: 24px;
      color: #2d3748;
    }
    p {
      margin: 0 0 20px;
      color: #718096;
      font-size: 14px;
    }
    .skills {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-bottom: 25px;
    }
    .skill-tag {
      background: #edf2f7;
      padding: 5px 12px;
      border-radius: 50px;
      font-size: 12px;
      font-weight: 600;
      color: #4a5568;
    }
    .btn-connect {
      background: #764ba2;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 50px;
      font-weight: bold;
      cursor: pointer;
      width: 100%;
      transition: background 0.2s;
    }
    .btn-connect:hover {
      background: #5a3286;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="avatar">👨‍💻</div>
    <h2>Srikanth Kumar</h2>
    <p>Senior Full-Stack Developer</p>
    <div class="skills">
      <span class="skill-tag">React</span>
      <span class="skill-tag">Next.js</span>
      <span class="skill-tag">Tailwind</span>
    </div>
    <button class="btn-connect" onclick="alert('Connected!')">Follow Profile</button>
  </div>
</body>
</html>`,

  counter: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Interactive Counter</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      text-align: center;
      background: #f7fafc;
      color: #2d3748;
      height: 100vh;
      margin: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .counter-box {
      background: white;
      padding: 40px;
      border-radius: 16px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05), 0 10px 15px rgba(0,0,0,0.1);
      border: 1px solid #e2e8f0;
    }
    h1 {
      font-size: 24px;
      margin-bottom: 30px;
    }
    .value {
      font-size: 72px;
      font-weight: bold;
      color: #3182ce;
      margin: 20px 0;
      transition: transform 0.1s ease;
    }
    .btn-group {
      display: flex;
      gap: 15px;
    }
    button {
      padding: 12px 24px;
      font-size: 16px;
      font-weight: bold;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-dec { background: #feb2b2; color: #9b2c2c; }
    .btn-dec:hover { background: #fc8181; }
    .btn-inc { background: #9ae6b4; color: #22543d; }
    .btn-inc:hover { background: #68d391; }
    .btn-rst { background: #e2e8f0; color: #4a5568; }
    .btn-rst:hover { background: #cbd5e0; }
  </style>
</head>
<body>
  <div class="counter-box">
    <h1>Live JS Counter</h1>
    <div id="counter" class="value">0</div>
    <div class="btn-group">
      <button class="btn-dec" onclick="changeCount(-1)">- Decrease</button>
      <button class="btn-rst" onclick="resetCount()">Reset</button>
      <button class="btn-inc" onclick="changeCount(1)">+ Increase</button>
    </div>
  </div>

  <script>
    let count = 0;
    const valueEl = document.getElementById('counter');

    function changeCount(amount) {
      count += amount;
      valueEl.innerText = count;
      animateVal();
    }

    function resetCount() {
      count = 0;
      valueEl.innerText = count;
      animateVal();
    }

    function animateVal() {
      valueEl.style.transform = 'scale(1.15)';
      setTimeout(() => {
        valueEl.style.transform = 'scale(1)';
      }, 100);
    }
  </script>
</body>
</html>`,

  landingPage: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Landing Page Demo</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 text-slate-800 font-sans">
  <header class="bg-white border-b border-slate-100 sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-2 font-bold text-xl text-indigo-600">
        ⚡ DevPreview
      </div>
      <nav class="hidden md:flex gap-6 text-sm font-semibold text-slate-600">
        <a href="#" class="hover:text-indigo-600 transition-colors">Features</a>
        <a href="#" class="hover:text-indigo-600 transition-colors">Pricing</a>
        <a href="#" class="hover:text-indigo-600 transition-colors">Docs</a>
      </nav>
      <button class="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors">
        Get Started
      </button>
    </div>
  </header>

  <main class="max-w-6xl mx-auto px-6 py-20 flex flex-col items-center text-center gap-6">
    <span class="bg-indigo-50 text-indigo-700 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
      Live Sandboxed Editor
    </span>
    <h1 class="text-4xl md:text-6xl font-black tracking-tight text-slate-900 max-w-3xl">
      Live HTML, CSS & JavaScript Sandbox Previewer
    </h1>
    <p class="text-lg text-slate-500 max-w-2xl">
      Compile, render, and share single-file templates in real-time. Test responsive designs, components, and animations 100% inside your local browser tab.
    </p>
    <div class="flex flex-wrap gap-4 justify-center mt-4">
      <button class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02]">
        Try Live Editor
      </button>
      <button class="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-8 py-3 rounded-xl transition-all">
        View Github
      </button>
    </div>
  </main>
</body>
</html>`
};

export default function HtmlPreviewPage() {
  const [code, setCode] = useState(PRESETS.profileCard);
  const [renderedDoc, setRenderedDoc] = useState(PRESETS.profileCard);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [layoutMode, setLayoutMode] = useState<'split' | 'stack'>('split');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Synchronize dynamic preview
  useEffect(() => {
    if (autoRefresh) {
      const handler = setTimeout(() => {
        setRenderedDoc(code);
      }, 300);
      return () => clearTimeout(handler);
    }
  }, [code, autoRefresh]);

  const handleRun = () => {
    setRenderedDoc(code);
  };

  const handleClear = () => {
    setCode('');
    setRenderedDoc('');
  };

  const handlePreset = (presetName: keyof typeof PRESETS) => {
    setCode(PRESETS[presetName]);
    setRenderedDoc(PRESETS[presetName]);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'index.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleOpenNewWindow = () => {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 space-y-12 animate-in fade-in duration-500 max-w-7xl">
      
      {/* Page Title Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight uppercase italic text-primary flex items-center justify-center gap-2">
          <Code className="h-9 w-9 text-primary" /> Live HTML Preview
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          Write or paste your custom HTML markup, inline styles, and JavaScript, then review interactive visual renders immediately inside a secured sandboxed iframe.
        </p>
      </div>

      {/* Control Presets */}
      <div className="flex flex-wrap gap-2.5 justify-center">
        <Button variant="outline" size="sm" onClick={() => handlePreset('profileCard')} className="rounded-full">
          <Sparkles className="h-4 w-4 mr-2" /> Load Profile Card
        </Button>
        <Button variant="outline" size="sm" onClick={() => handlePreset('counter')} className="rounded-full">
          <RotateCcw className="h-4 w-4 mr-2" /> Load Counter Demo
        </Button>
        <Button variant="outline" size="sm" onClick={() => handlePreset('landingPage')} className="rounded-full">
          <ExternalLink className="h-4 w-4 mr-2" /> Load Tailwind Landing Page
        </Button>
        
        {/* Swap View layout buttons */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setLayoutMode(layoutMode === 'split' ? 'stack' : 'split')} 
          className="rounded-full border border-border text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
        >
          {layoutMode === 'split' ? (
            <>
              <LayoutList className="h-4 w-4 mr-2" /> Vertical Layout
            </>
          ) : (
            <>
              <Columns className="h-4 w-4 mr-2" /> Horizontal Layout
            </>
          )}
        </Button>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleClear} 
          className="rounded-full border border-destructive/20 text-destructive hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all duration-200"
        >
          <Trash2 className="h-4 w-4 mr-2" /> Clear All
        </Button>
      </div>

      {/* Editor & Preview Panels Container */}
      <div className={`grid ${layoutMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-6 relative`}>
        
        {/* Left Side: Editor Area */}
        <Card className="shadow-md hover:border-primary/20 transition-all flex flex-col h-[600px] border border-border">
          <CardHeader className="bg-muted/40 p-4 border-b flex flex-row items-center justify-between shrink-0">
            <div>
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <FileCode className="h-4 w-4 text-primary" /> HTML / CSS / JS Code Editor
              </CardTitle>
              <CardDescription className="text-xs">Write, paste, or import web code files</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleCopy} title="Copy HTML Code">
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleDownload} title="Download HTML File">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-grow relative overflow-hidden flex bg-slate-950">
            {/* Editor TextArea */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="<!-- Write HTML here -->&#10;<h1>Hello, World!</h1>"
              className="w-full h-full p-4 font-mono text-sm bg-slate-950 text-slate-100 border-none resize-none focus:outline-none focus:ring-0 leading-relaxed z-10"
              spellCheck="false"
            />
          </CardContent>
          <CardFooter className="p-3 bg-muted/20 border-t flex items-center justify-between text-xs text-muted-foreground shrink-0">
            <div className="flex items-center gap-4">
              <span>{code.split('\n').length} lines</span>
              <span>{code.length} characters</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="auto-refresh-toggle" className="text-xs font-semibold select-none cursor-pointer">Auto-run</Label>
                <Switch 
                  id="auto-refresh-toggle"
                  checked={autoRefresh}
                  onCheckedChange={setAutoRefresh}
                />
              </div>
              {!autoRefresh && (
                <Button size="sm" onClick={handleRun} className="h-7 px-3 gap-1 text-xs font-bold">
                  <Play className="h-3 w-3" /> Run Code
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>

        {/* Right Side: Live Sandbox Preview Frame */}
        <Card className={`shadow-md hover:border-primary/20 transition-all flex flex-col border border-border overflow-hidden ${
          isFullscreen ? 'fixed inset-4 z-50 h-[calc(100vh-32px)]' : 'h-[600px]'
        }`}>
          <CardHeader className="bg-muted/40 p-4 border-b flex flex-row items-center justify-between shrink-0">
            <div>
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Eye className="h-4 w-4 text-emerald-500" /> Interactive Visual Preview
              </CardTitle>
              <CardDescription className="text-xs">Live rendered sandboxed application output</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8" 
                onClick={handleOpenNewWindow}
                title="Open Preview in New Tab"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => setIsFullscreen(!isFullscreen)}
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Preview'}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-grow relative bg-slate-50 dark:bg-slate-900 flex">
            {renderedDoc ? (
              <iframe
                ref={iframeRef}
                title="Live Sandbox Preview"
                srcDoc={renderedDoc}
                sandbox="allow-scripts"
                className="w-full h-full border-none bg-white"
              />
            ) : (
              <div className="flex flex-col items-center justify-center m-auto text-muted-foreground gap-2 p-6 text-center select-none">
                <div className="p-3 bg-muted rounded-full">
                  <Code className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold">Preview panel empty</p>
                <p className="text-xs">Type HTML in the editor or load a preset card to start</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="p-3 bg-muted/20 border-t flex items-center justify-between text-xs text-muted-foreground shrink-0">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Sandboxed Safe Env
            </span>
            <span className="text-[10px]">Changes reflect live in window</span>
          </CardFooter>
        </Card>

      </div>

      {/* FAQs / Informative Section */}
      <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
          <h2 className="text-3xl font-bold font-headline mb-6">Interactive HTML Preview & Live Editor</h2>
          <p className="text-base leading-relaxed text-muted-foreground mb-4">
            Our **HTML Live Preview** tool allows front-end designers, software developers, and students to quickly draft, view, and test mockups instantly without firing up complex IDE environments or development servers. With support for standard browser JavaScript, customized CSS structures, and third-party frameworks like Tailwind CSS, you can model responsive forms, animated landing pages, and interactive UI components in seconds.
          </p>
          <p className="text-base leading-relaxed text-muted-foreground">
            All code compilation and styling injection occurs entirely inside your client-side browser tab. No code structures or text entries are uploaded to any external database servers, ensuring 100% privacy and security for developer projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-border rounded-xl p-6 space-y-3 bg-card">
            <h3 className="text-lg font-bold">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-foreground">Is my code secure and private?</h4>
                <p className="text-xs text-muted-foreground">Yes. The live previews run 100% inside your local web browser using sandboxed variables. No code is transmitted over network sockets or uploaded to a web server.</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">Can I use external styles or scripts?</h4>
                <p className="text-xs text-muted-foreground">Absolutely! You can load CSS libraries (like Tailwind via CDN) or include JavaScript scripts using standard HTML script and style links inside the code editor.</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">Why does the sandbox say "allow-scripts"?</h4>
                <p className="text-xs text-muted-foreground">The script execution is restricted to the isolated sandbox frame context, preventing scripts from breakout access to your main browser cookies or parent document structures.</p>
              </div>
            </div>
          </div>

          <div className="border border-border rounded-xl p-6 space-y-3 bg-card">
            <h3 className="text-lg font-bold">Key Capabilities</h3>
            <ul className="text-xs space-y-2 text-muted-foreground list-disc list-inside">
              <li><strong>Real-time Compilation</strong>: View updates automatically as you type (Auto-run), or configure manual click actions.</li>
              <li><strong>Export Options</strong>: Copy HTML content to your clipboard or download output files as a clean <code className="bg-muted px-1 py-0.5 rounded text-[11px]">index.html</code> package.</li>
              <li><strong>Responsive Preview Toggle</strong>: Switch views from split-screen horizontal layouts to stacked layouts for testing on vertical screens.</li>
              <li><strong>Fullscreen Mode</strong>: Expand the visual viewer container to fullscreen display for standard browser inspection.</li>
            </ul>
          </div>
        </div>

        <SeoSection />
      </section>

      <ScrollToTop />
    </div>
  );
}
