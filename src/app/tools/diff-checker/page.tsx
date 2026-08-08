'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GitCompare, Trash2, ArrowLeftRight, Upload, FileText, CheckCircle2, 
  Eye, Columns, Code, LayoutList, Copy, Check, ChevronLeft, ChevronRight, X, Undo2
} from 'lucide-react';
import { SeoSection } from '@/components/SeoSection';
import ScrollToTop from '@/components/ScrollToTop';

// Presets for demo
const PRESETS = {
  text: {
    original: `The quick brown fox jumps over the lazy dog.
This paragraph contains some information that is outdated.
We need to revise it to reflect the new updates.
Hope you have a great day ahead!`,
    changed: `The extremely quick red fox jumps over the active dog.
This paragraph contains some information that is newly updated in 2026.
We must rewrite this section completely.
Hope you have an awesome day ahead!`
  },
  code: {
    original: `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    if (item.price > 10) {
      total += item.price * 0.9;
    } else {
      total += item.price;
    }
  }
  return total;
}`,
    changed: `/**
 * Calculates the total discounted price of items.
 */
function calculateTotal(items) {
  return items.reduce((total, item) => {
    const discount = item.price > 10 ? 0.9 : 1.0;
    return total + (item.price * discount);
  }, 0);
}`
  },
  json: {
    original: `{
  "name": "UseBro",
  "version": "1.0.0",
  "description": "Free web utility portal",
  "author": "FixBro",
  "features": [
    "PDF tools",
    "Image tools",
    "Calculators"
  ]
}`,
    changed: `{
  "name": "UseBro.in",
  "version": "2.0.0",
  "description": "Premium browser-based client-side tools suite",
  "license": "MIT",
  "features": [
    "PDF tools",
    "Image converters",
    "Corporate salary calculators",
    "Text diff checker"
  ]
}`
  }
};

// Word-level diffing helper (strict whole-word matching to avoid middle-cutting)
function diffWords(oldStr: string, newStr: string) {
  // Split strictly by spaces and common punctuation tokens, preserving them
  const oldWords = oldStr.split(/(\s+|[.,:;!"'()\[\]{}]+)/).filter(Boolean);
  const newWords = newStr.split(/(\s+|[.,:;!"'()\[\]{}]+)/).filter(Boolean);

  const dp: number[][] = Array(oldWords.length + 1)
    .fill(0)
    .map(() => Array(newWords.length + 1).fill(0));

  for (let i = 1; i <= oldWords.length; i++) {
    for (let j = 1; j <= newWords.length; j++) {
      if (oldWords[i - 1] === newWords[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  let i = oldWords.length;
  let j = newWords.length;
  const result: { type: 'added' | 'removed' | 'unchanged'; value: string }[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldWords[i - 1] === newWords[j - 1]) {
      result.unshift({ type: 'unchanged', value: oldWords[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: 'added', value: newWords[j - 1] });
      j--;
    } else if (i > 0 && (j === 0 || dp[i - 1][j] >= dp[i][j - 1])) {
      result.unshift({ type: 'removed', value: oldWords[i - 1] });
      i--;
    }
  }
  return result;
}

// Line-level diffing helper
function getDiff(oldText: string, newText: string) {
  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');

  const dp: number[][] = Array(oldLines.length + 1)
    .fill(0)
    .map(() => Array(newLines.length + 1).fill(0));

  for (let i = 1; i <= oldLines.length; i++) {
    for (let j = 1; j <= newLines.length; j++) {
      if (oldLines[i - 1] === newLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  let i = oldLines.length;
  let j = newLines.length;
  
  const rawDiff: { type: 'added' | 'removed' | 'unchanged'; value: string; lineNum?: number }[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      rawDiff.unshift({ type: 'unchanged', value: oldLines[i - 1], lineNum: i });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      rawDiff.unshift({ type: 'added', value: newLines[j - 1], lineNum: j });
      j--;
    } else if (i > 0 && (j === 0 || dp[i - 1][j] >= dp[i][j - 1])) {
      rawDiff.unshift({ type: 'removed', value: oldLines[i - 1], lineNum: i });
      i--;
    }
  }

  // Align side-by-side
  const alignedPairs: {
    left: { type: 'removed' | 'unchanged' | 'empty'; value: string; lineNum?: number; words?: { type: 'added' | 'removed' | 'unchanged'; value: string }[] };
    right: { type: 'added' | 'unchanged' | 'empty'; value: string; lineNum?: number; words?: { type: 'added' | 'removed' | 'unchanged'; value: string }[] };
  }[] = [];

  let idx = 0;
  let additionsCount = 0;
  let removalsCount = 0;

  while (idx < rawDiff.length) {
    if (rawDiff[idx].type === 'unchanged') {
      alignedPairs.push({
        left: { type: 'unchanged', value: rawDiff[idx].value, lineNum: rawDiff[idx].lineNum },
        right: { type: 'unchanged', value: rawDiff[idx].value, lineNum: rawDiff[idx].lineNum }
      });
      idx++;
    } else {
      const removals: typeof rawDiff = [];
      const additions: typeof rawDiff = [];
      
      while (idx < rawDiff.length && rawDiff[idx].type !== 'unchanged') {
        if (rawDiff[idx].type === 'removed') {
          removals.push(rawDiff[idx]);
          removalsCount++;
        } else {
          additions.push(rawDiff[idx]);
          additionsCount++;
        }
        idx++;
      }

      const maxLen = Math.max(removals.length, additions.length);
      for (let k = 0; k < maxLen; k++) {
        const rem = removals[k];
        const add = additions[k];

        // Perform inline word-diff if both removal and addition exist at the same slot
        let leftWords: any[] | undefined = undefined;
        let rightWords: any[] | undefined = undefined;

        if (rem && add) {
          const wordDiff = diffWords(rem.value, add.value);
          leftWords = wordDiff.filter(w => w.type !== 'added');
          rightWords = wordDiff.filter(w => w.type !== 'removed');
        }

        alignedPairs.push({
          left: rem 
            ? { type: 'removed', value: rem.value, lineNum: rem.lineNum, words: leftWords } 
            : { type: 'empty', value: '' },
          right: add 
            ? { type: 'added', value: add.value, lineNum: add.lineNum, words: rightWords } 
            : { type: 'empty', value: '' }
        });
      }
    }
  }

  return {
    pairs: alignedPairs,
    additions: additionsCount,
    removals: removalsCount,
    totalLines: Math.max(oldLines.length, newLines.length)
  };
}

export default function DiffCheckerPage() {
  const [originalText, setOriginalText] = useState<string>('');
  const [changedText, setChangedText] = useState<string>('');
  const [diffResult, setDiffResult] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split');
  const [copiedLeft, setCopiedLeft] = useState(false);
  const [copiedRight, setCopiedRight] = useState(false);
  
  // Merge and Undo states
  const [mergedIndices, setMergedIndices] = useState<number[]>([]);
  const [history, setHistory] = useState<{ originalText: string; changedText: string; mergedIndices: number[]; originalMergedState: Record<number, any> }[]>([]);
  const [originalMergedState, setOriginalMergedState] = useState<Record<number, any>>({});
  const isMergingRef = useRef(false);
  
  // Merge Navigation states (stores absolute index of the selected pair row)
  const [selectedPairIdx, setSelectedPairIdx] = useState<number | null>(null);

  // Line-editing input states
  const [leftEditValue, setLeftEditValue] = useState<string>('');
  const [rightEditValue, setRightEditValue] = useState<string>('');

  // Sync edits when selected line changes (including pre-merge values for merged rows)
  useEffect(() => {
    if (selectedPairIdx !== null && diffResult && diffResult.pairs[selectedPairIdx]) {
      const pair = diffResult.pairs[selectedPairIdx];
      const preMerge = originalMergedState[selectedPairIdx];
      
      const leftVal = preMerge?.left !== undefined 
        ? preMerge.left.value 
        : (pair.left.type !== 'empty' ? pair.left.value : '');
      const rightVal = preMerge?.right !== undefined 
        ? preMerge.right.value 
        : (pair.right.type !== 'empty' ? pair.right.value : '');
        
      setLeftEditValue(leftVal);
      setRightEditValue(rightVal);
    } else {
      setLeftEditValue('');
      setRightEditValue('');
    }
  }, [selectedPairIdx, diffResult, originalMergedState]);

  // Derive change points dynamically for easy merge navigation
  const changePoints = useMemo(() => {
    if (!diffResult) return [];
    return diffResult.pairs
      .map((pair: any, idx: number) => ({ pair, idx }))
      .filter((item: any) => item.pair.left.type === 'removed' || item.pair.right.type === 'added');
  }, [diffResult]);

  // Derive selectedChangeIdx (index in active changes list) for layout display
  const selectedChangeIdx = useMemo(() => {
    if (selectedPairIdx === null) return null;
    const idx = changePoints.findIndex((cp: any) => cp.idx === selectedPairIdx);
    return idx === -1 ? -1 : idx;
  }, [selectedPairIdx, changePoints]);
  // Derive minimap markers dynamically
  const minimapMarkers = useMemo(() => {
    if (!diffResult || diffResult.pairs.length === 0) return [];
    
    return diffResult.pairs
      .map((pair: any, idx: number) => {
        const isRemoved = pair.left.type === 'removed';
        const isAdded = pair.right.type === 'added';
        const isMerged = mergedIndices.includes(idx);
        
        if (!isRemoved && !isAdded && !isMerged) return null;
        
        return {
          idx,
          isRemoved,
          isAdded,
          isMerged,
          percentage: (idx / diffResult.pairs.length) * 100
        };
      })
      .filter(Boolean) as any[];
  }, [diffResult, mergedIndices]);
  // Hydrate states from localStorage on client mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const orig = localStorage.getItem('diff_original_text') || '';
      const chng = localStorage.getItem('diff_changed_text') || '';
      
      let merged: number[] = [];
      try { merged = JSON.parse(localStorage.getItem('diff_merged_indices') || '[]'); } catch (e) {}

      let hist: any[] = [];
      try { hist = JSON.parse(localStorage.getItem('diff_history') || '[]'); } catch (e) {}

      let states: Record<number, any> = {};
      try { states = JSON.parse(localStorage.getItem('diff_original_merged_state') || '{}'); } catch (e) {}

      setOriginalText(orig);
      setChangedText(chng);
      setMergedIndices(merged);
      setHistory(hist);
      setOriginalMergedState(states);

      if (orig || chng) {
        const result = getDiff(orig, chng);
        setDiffResult(result);
      }
    }
  }, []);

  // Persist states to localStorage on changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('diff_original_text', originalText);
      localStorage.setItem('diff_changed_text', changedText);
      localStorage.setItem('diff_merged_indices', JSON.stringify(mergedIndices));
      localStorage.setItem('diff_history', JSON.stringify(history));
      localStorage.setItem('diff_original_merged_state', JSON.stringify(originalMergedState));
    }
  }, [originalText, changedText, mergedIndices, history, originalMergedState]);

  // Reset selected index when diff is recalculated or inputs change
  useEffect(() => {
    setSelectedPairIdx(null);
  }, [originalText, changedText, diffResult]);

  // Global Ctrl+Z Keyboard Shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        const activeEl = document.activeElement;
        const isInput = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA');
        if (!isInput && history.length > 0) {
          e.preventDefault();
          handleUndo();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [history, mergedIndices]);

  // Scroll to results section when a new comparison is generated
  useEffect(() => {
    if (diffResult) {
      if (isMergingRef.current) return;
      
      const timer = setTimeout(() => {
        const btn = document.getElementById('compare-btn');
        if (btn) {
          // Scroll so that the bottom of the button is pushed just 5px past the top of the screen.
          // This hides the button and aligns the results card exactly at the top of the viewport.
          const rect = btn.getBoundingClientRect();
          const targetY = rect.bottom + window.pageYOffset - 5;
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [diffResult]);

  // Scroll target change row into screen center during merge navigation
  useEffect(() => {
    if (selectedPairIdx !== null) {
      if (isMergingRef.current) return;
      const element = document.getElementById(`diff-row-${selectedPairIdx}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedPairIdx]);

  const handlePreset = (type: 'text' | 'code' | 'json') => {
    setOriginalText(PRESETS[type].original);
    setChangedText(PRESETS[type].changed);
    setDiffResult(null);
    setMergedIndices([]);
    setHistory([]);
    setOriginalMergedState({});
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, panel: 'original' | 'changed') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (panel === 'original') {
        setOriginalText(text);
      } else {
        setChangedText(text);
      }
      setDiffResult(null);
      setMergedIndices([]);
      setHistory([]);
      setOriginalMergedState({});
    };
    reader.readAsText(file);
  };

  const handleCompare = () => {
    const result = getDiff(originalText, changedText);
    setDiffResult(result);
    setMergedIndices([]);
    setHistory([]);
    setOriginalMergedState({});
  };

  const handleSwap = () => {
    const temp = originalText;
    setOriginalText(changedText);
    setChangedText(temp);
    setDiffResult(null);
    setMergedIndices([]);
    setHistory([]);
    setOriginalMergedState({});
  };

  const handleClear = () => {
    setOriginalText('');
    setChangedText('');
    setDiffResult(null);
    setMergedIndices([]);
    setHistory([]);
    setOriginalMergedState({});
  };

  const handleCopy = (text: string, direction: 'left' | 'right') => {
    navigator.clipboard.writeText(text);
    if (direction === 'left') {
      setCopiedLeft(true);
      setTimeout(() => setCopiedLeft(false), 2000);
    } else {
      setCopiedRight(true);
      setTimeout(() => setCopiedRight(false), 2000);
    }
  };

  // Save manual line edits from the pop-up panel to original or changed document strings
  const handleSaveLineEdit = (side: 'left' | 'right') => {
    if (selectedPairIdx === null || !diffResult || !diffResult.pairs[selectedPairIdx]) return;
    const pair = diffResult.pairs[selectedPairIdx];

    // Disable auto-scroll transitions during line edit save
    isMergingRef.current = true;
    setTimeout(() => {
      isMergingRef.current = false;
    }, 200);

    // Save history Memento before updating
    setHistory(prev => [
      ...prev,
      {
        originalText,
        changedText,
        mergedIndices: [...mergedIndices],
        originalMergedState: { ...originalMergedState }
      }
    ]);

    if (side === 'left') {
      const lineNum = pair.left.lineNum;
      if (lineNum !== undefined) {
        const lines = originalText.split('\n');
        lines[lineNum - 1] = leftEditValue;
        const newText = lines.join('\n');
        setOriginalText(newText);
        localStorage.setItem('diff_original_text', newText);

        const newDiff = getDiff(newText, changedText);
        setDiffResult(newDiff);
      }
    } else {
      const lineNum = pair.right.lineNum;
      if (lineNum !== undefined) {
        const lines = changedText.split('\n');
        lines[lineNum - 1] = rightEditValue;
        const newText = lines.join('\n');
        setChangedText(newText);
        localStorage.setItem('diff_changed_text', newText);

        const newDiff = getDiff(originalText, newText);
        setDiffResult(newDiff);
      }
    }

    // If this line was in mergedIndices (meaning we are editing a merged row),
    // remove it from mergedIndices since it is now manually updated
    if (mergedIndices.includes(selectedPairIdx)) {
      setMergedIndices(prev => prev.filter(idx => idx !== selectedPairIdx));
    }
  };

  // Perform interactive merge actions (Left-to-Right or Right-to-Left)
  const applyMerge = (direction: 'to-right' | 'to-left') => {
    if (!diffResult || selectedPairIdx === null) return;
    
    const targetPairIdx = selectedPairIdx;
    const newPairs = [...diffResult.pairs];
    
    // Save history Memento before updating text
    setHistory(prev => [...prev, { originalText, changedText, mergedIndices, originalMergedState }]);
    
    // Disable any automatic scroll events during this render transition
    isMergingRef.current = true;
    setTimeout(() => {
      isMergingRef.current = false;
    }, 200);

    // Apply any unsaved inputs before merging
    if (newPairs[targetPairIdx].left.type !== 'empty') {
      newPairs[targetPairIdx].left.value = leftEditValue;
    }
    if (newPairs[targetPairIdx].right.type !== 'empty') {
      newPairs[targetPairIdx].right.value = rightEditValue;
    }

    // Deep copy the original left and right objects before any mutation
    const originalLeftCopy = { 
      ...newPairs[targetPairIdx].left,
      words: newPairs[targetPairIdx].left.words ? [...newPairs[targetPairIdx].left.words] : undefined
    };
    const originalRightCopy = { 
      ...newPairs[targetPairIdx].right,
      words: newPairs[targetPairIdx].right.words ? [...newPairs[targetPairIdx].right.words] : undefined
    };

    setOriginalMergedState(prev => ({
      ...prev,
      [targetPairIdx]: {
        left: originalLeftCopy,
        right: originalRightCopy
      }
    }));

    // Track merged index
    setMergedIndices(prev => [...prev, targetPairIdx]);
    
    if (direction === 'to-right') {
      // Merge original (left) into changed (right)
      if (newPairs[targetPairIdx].left.type === 'empty') {
        // Left is empty, so we delete from right to match
        newPairs[targetPairIdx].right = { type: 'empty', value: '' };
      } else {
        // Copy left value to right and mark both as unchanged
        newPairs[targetPairIdx].right = { 
          type: 'unchanged', 
          value: newPairs[targetPairIdx].left.value,
          lineNum: newPairs[targetPairIdx].left.lineNum 
        };
        newPairs[targetPairIdx].left = {
          ...newPairs[targetPairIdx].left,
          type: 'unchanged'
        };
      }
    } else {
      // Merge changed (right) into original (left)
      if (newPairs[targetPairIdx].right.type === 'empty') {
        // Right is empty, so we delete from left to match
        newPairs[targetPairIdx].left = { type: 'empty', value: '' };
      } else {
        // Copy right value to left and mark both as unchanged
        newPairs[targetPairIdx].left = { 
          type: 'unchanged', 
          value: newPairs[targetPairIdx].right.value,
          lineNum: newPairs[targetPairIdx].right.lineNum 
        };
        newPairs[targetPairIdx].right = {
          ...newPairs[targetPairIdx].right,
          type: 'unchanged'
        };
      }
    }
    
    // Reconstruct the raw text bodies from the aligned pairs
    const newOriginalText = newPairs
      .filter(p => p.left.type !== 'empty')
      .map(p => p.left.value)
      .join('\n');
      
    const newChangedText = newPairs
      .filter(p => p.right.type !== 'empty')
      .map(p => p.right.value)
      .join('\n');
      
    setOriginalText(newOriginalText);
    setChangedText(newChangedText);
    
    // Immediately calculate the updated diff
    const newDiff = getDiff(newOriginalText, newChangedText);
    setDiffResult(newDiff);
    
    // Close the pop-up after a successful merge
    setSelectedPairIdx(null);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const prevState = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    
    // Identify which row is being undone (was merged, but now is restored to difference state)
    const undoneRowIdx = mergedIndices[mergedIndices.length - 1];
    
    // Disable any automatic scroll events during this render transition
    isMergingRef.current = true;
    setTimeout(() => {
      isMergingRef.current = false;
    }, 200);
    
    setOriginalText(prevState.originalText);
    setChangedText(prevState.changedText);
    setMergedIndices(prevState.mergedIndices);
    setOriginalMergedState(prevState.originalMergedState);
    
    const newDiff = getDiff(prevState.originalText, prevState.changedText);
    setDiffResult(newDiff);
    
    // Close selection on undo
    setSelectedPairIdx(null);

    // Scroll viewport to the restored line
    if (undoneRowIdx !== undefined) {
      setTimeout(() => {
        const element = document.getElementById(`diff-row-${undoneRowIdx}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  };

  const handleRevertLineMerge = (pairIdx: number) => {
    const original = originalMergedState[pairIdx];
    if (!original || !diffResult) return;

    // Save history Memento before updating text
    setHistory(prev => [...prev, { originalText, changedText, mergedIndices, originalMergedState }]);
    
    // Disable any automatic scroll events during this render transition
    isMergingRef.current = true;
    setTimeout(() => {
      isMergingRef.current = false;
    }, 200);

    const newPairs = [...diffResult.pairs];
    // Revert the row states
    newPairs[pairIdx].left = original.left;
    newPairs[pairIdx].right = original.right;

    // Reconstruct the raw text bodies from the aligned pairs
    const newOriginalText = newPairs
      .filter(p => p.left.type !== 'empty')
      .map(p => p.left.value)
      .join('\n');
      
    const newChangedText = newPairs
      .filter(p => p.right.type !== 'empty')
      .map(p => p.right.value)
      .join('\n');
      
    setOriginalText(newOriginalText);
    setChangedText(newChangedText);
    
    // Remove from mergedIndices and originalMergedState mapping
    setMergedIndices(prev => prev.filter(i => i !== pairIdx));
    setOriginalMergedState(prev => {
      const copy = { ...prev };
      delete copy[pairIdx];
      return copy;
    });

    // Close the pop-up
    setSelectedPairIdx(null);

    // Recalculate updated diff
    const newDiff = getDiff(newOriginalText, newChangedText);
    setDiffResult(newDiff);
  };

  const handleSelectRow = (pairIdx: number) => {
    setSelectedPairIdx(pairIdx);
  };

  return (
    <div className="container mx-auto px-4 py-4 md:py-4 space-y-12">
      
      {/* Banner / Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight uppercase italic text-primary flex items-center justify-center gap-2">
          <GitCompare className="h-9 w-9 text-primary" /> Text Diff Checker
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          Compare two versions of code, configurations, or texts. Highlight differences, additions, and removals side-by-side, processed 100% locally in your browser.
        </p>
      </div>

      {/* Control Presets */}
      <div className="flex flex-wrap gap-2.5 justify-center">
        <Button variant="outline" size="sm" onClick={() => handlePreset('text')} className="rounded-full">
          <FileText className="h-4 w-4 mr-2" /> Load Text Demo
        </Button>
        <Button variant="outline" size="sm" onClick={() => handlePreset('code')} className="rounded-full">
          <Code className="h-4 w-4 mr-2" /> Load Code Demo
        </Button>
        <Button variant="outline" size="sm" onClick={() => handlePreset('json')} className="rounded-full">
          <BracesIcon className="h-4 w-4 mr-2" /> Load JSON Demo
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleSwap} 
          className="rounded-full border border-border text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
        >
          <ArrowLeftRight className="h-4 w-4 mr-2" /> Swap Text
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

      {/* Input Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side: Original */}
        <Card className="shadow-md hover:border-primary/20 transition-all flex flex-col">
          <CardHeader className="bg-muted/40 p-4 border-b flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Original Text (Left)</CardTitle>
              <CardDescription className="text-xs">Paste your original text or upload a file</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="upload-original" className="cursor-pointer p-2 rounded-lg bg-background hover:bg-muted border flex items-center gap-2 text-xs font-semibold shadow-sm transition-colors">
                <Upload className="h-3.5 w-3.5" /> Upload File
                <input 
                  type="file" 
                  id="upload-original" 
                  accept=".txt,.js,.ts,.tsx,.json,.html,.css,.md" 
                  onChange={(e) => handleFileUpload(e, 'original')} 
                  className="hidden" 
                />
              </Label>
              {originalText && (
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleCopy(originalText, 'left')}>
                  {copiedLeft ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4 flex-grow flex">
            <Textarea
              placeholder="Paste original source text here..."
              value={originalText}
              onChange={(e) => {
                setOriginalText(e.target.value);
                setDiffResult(null);
              }}
              className="min-h-[300px] font-mono text-sm leading-relaxed flex-grow focus-visible:ring-primary"
            />
          </CardContent>
          <CardFooter className="p-2.5 bg-muted/20 border-t justify-end text-xs text-muted-foreground">
            {originalText.split('\n').filter(Boolean).length} lines | {originalText.length} characters
          </CardFooter>
        </Card>

        {/* Right Side: Changed */}
        <Card className="shadow-md hover:border-primary/20 transition-all flex flex-col">
          <CardHeader className="bg-muted/40 p-4 border-b flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Modified Text (Right)</CardTitle>
              <CardDescription className="text-xs">Paste your changed text or upload a file</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="upload-changed" className="cursor-pointer p-2 rounded-lg bg-background hover:bg-muted border flex items-center gap-2 text-xs font-semibold shadow-sm transition-colors">
                <Upload className="h-3.5 w-3.5" /> Upload File
                <input 
                  type="file" 
                  id="upload-changed" 
                  accept=".txt,.js,.ts,.tsx,.json,.html,.css,.md" 
                  onChange={(e) => handleFileUpload(e, 'changed')} 
                  className="hidden" 
                />
              </Label>
              {changedText && (
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleCopy(changedText, 'right')}>
                  {copiedRight ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4 flex-grow flex">
            <Textarea
              placeholder="Paste modified changed text here..."
              value={changedText}
              onChange={(e) => {
                setChangedText(e.target.value);
                setDiffResult(null);
              }}
              className="min-h-[300px] font-mono text-sm leading-relaxed flex-grow focus-visible:ring-primary"
            />
          </CardContent>
          <CardFooter className="p-2.5 bg-muted/20 border-t justify-end text-xs text-muted-foreground">
            {changedText.split('\n').filter(Boolean).length} lines | {changedText.length} characters
          </CardFooter>
        </Card>
      </div>

      {/* Compare Button Action */}
      <div className="flex justify-center">
        <Button 
          id="compare-btn"
          size="lg" 
          onClick={handleCompare} 
          disabled={!originalText && !changedText}
          className="rounded-full shadow-lg font-bold px-8 h-12 bg-primary hover:bg-primary/95 text-white transition-all transform hover:scale-[1.02]"
        >
          <GitCompare className="h-5 w-5 mr-2 animate-pulse" /> Find Differences
        </Button>
      </div>

      {/* Diff Results Container */}
      {diffResult && (
        <Card id="diff-results-section" className="relative shadow-lg border-primary/20 overflow-hidden">
          <CardHeader className="bg-primary/5 p-4 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                <Eye className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold">Difference Comparison Results</CardTitle>
                <CardDescription className="text-xs">
                  Found <span className="font-bold text-red-500">{diffResult.removals} deletions</span> and <span className="font-bold text-green-500">{diffResult.additions} additions</span>. Click any changed row to merge.
                </CardDescription>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleCopy(originalText, 'left')}
                className="text-xs flex items-center gap-1.5 h-8 font-bold border border-border bg-background text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              >
                {copiedLeft ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                Copy Left Text
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleCopy(changedText, 'right')}
                className="text-xs flex items-center gap-1.5 h-8 font-bold border border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              >
                {copiedRight ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                Copy Right (Merged)
              </Button>

              {/* View options Split / Inline */}
              <Tabs 
                value={viewMode} 
                onValueChange={(val: any) => setViewMode(val)} 
                className="w-auto"
              >
                <TabsList className="bg-muted p-1 rounded-lg">
                  <TabsTrigger value="split" className="text-xs px-3 py-1.5 flex items-center gap-1.5 font-semibold">
                    <Columns className="h-3.5 w-3.5" /> Side-by-Side
                  </TabsTrigger>
                  <TabsTrigger value="unified" className="text-xs px-3 py-1.5 flex items-center gap-1.5 font-semibold">
                    <LayoutList className="h-3.5 w-3.5" /> Unified (Inline)
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            {viewMode === 'split' ? (
              /* Side-by-Side Split Code View */
              <div className="min-w-[800px] divide-x border-b">
                <div className="grid grid-cols-2 bg-muted/40 font-bold text-xs text-muted-foreground uppercase border-b divide-x">
                  <div className="p-2 px-4 flex items-center gap-2">
                    <span className="w-14 text-right opacity-60 shrink-0">Line</span> Original File
                  </div>
                  <div className="p-2 px-4 flex items-center gap-2">
                    <span className="w-14 text-right opacity-60 shrink-0">Line</span> Changed File
                  </div>
                </div>
                
                <div className="font-mono text-sm leading-relaxed divide-y">
                  {diffResult.pairs.map((pair: any, idx: number) => {
                    const hasLeft = pair.left.type !== 'empty';
                    const hasRight = pair.right.type !== 'empty';
                    const isChanged = pair.left.type === 'removed' || pair.right.type === 'added';
                    const isSelected = selectedPairIdx === idx;
                    const isMerged = mergedIndices.includes(idx);
                    
                    let leftBg = 'bg-background';
                    if (pair.left.type === 'removed') leftBg = 'bg-red-500/10 text-red-900 dark:text-red-300';
                    if (pair.left.type === 'empty') leftBg = 'bg-muted/10 opacity-30 select-none';
                    if (isMerged) leftBg = 'bg-violet-500/10 text-violet-900 dark:text-violet-300 border-l-2 border-violet-500';

                    let rightBg = 'bg-background';
                    if (pair.right.type === 'added') rightBg = 'bg-green-500/10 text-green-900 dark:text-green-300';
                    if (pair.right.type === 'empty') rightBg = 'bg-muted/10 opacity-30 select-none';
                    if (isMerged) rightBg = 'bg-violet-500/10 text-violet-900 dark:text-violet-300 border-l-2 border-violet-500';

                    return (
                      <div 
                        key={idx} 
                        id={`diff-row-${idx}`}
                        onClick={() => (isChanged || isMerged) && handleSelectRow(idx)}
                        className={`grid grid-cols-2 divide-x hover:bg-muted/10 transition-all cursor-pointer ${
                          isChanged || isMerged ? 'hover:brightness-95' : ''
                        } ${isSelected ? 'ring-2 ring-primary ring-inset bg-primary/5' : ''}`}
                      >
                        {/* Original Side (Left) */}
                        <div className={`p-1 px-4 flex gap-4 ${leftBg} whitespace-pre-wrap break-all relative group`}>
                          <span className="w-14 text-right text-xs text-muted-foreground select-none font-mono pr-2 border-r opacity-50 shrink-0 whitespace-nowrap">
                            {hasLeft ? pair.left.lineNum : ''}
                          </span>
                          <span className="flex-1 pl-1">
                            {pair.left.type === 'removed' && pair.left.words ? (
                              pair.left.words.map((w: any, wIdx: number) => (
                                <span 
                                  key={wIdx} 
                                  className={w.type === 'removed' ? 'bg-red-500/30 font-bold rounded px-0.5 border border-red-500/40 text-red-700 dark:text-red-300' : ''}
                                >
                                  {w.value}
                                </span>
                              ))
                            ) : (
                              pair.left.value
                            )}
                          </span>
                        </div>

                        {/* Changed Side (Right) */}
                        <div className={`p-1 px-4 flex gap-4 ${rightBg} whitespace-pre-wrap break-all relative group`}>
                          <span className="w-14 text-right text-xs text-muted-foreground select-none font-mono pr-2 border-r opacity-50 shrink-0 whitespace-nowrap">
                            {hasRight ? pair.right.lineNum : ''}
                          </span>
                          <span className="flex-1 pl-1">
                            {pair.right.type === 'added' && pair.right.words ? (
                              pair.right.words.map((w: any, wIdx: number) => (
                                <span 
                                  key={wIdx} 
                                  className={w.type === 'added' ? 'bg-green-500/30 font-bold rounded px-0.5 border border-green-500/40 text-green-700 dark:text-green-300' : ''}
                                >
                                  {w.value}
                                </span>
                              ))
                            ) : (
                              pair.right.value
                            )}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Unified Inline View */
              <div className="min-w-[600px] font-mono text-sm leading-relaxed divide-y">
                {diffResult.pairs.map((pair: any, idx: number) => {
                  const isLUnchanged = pair.left.type === 'unchanged';
                  const isLEmpty = pair.left.type === 'empty';
                  const isREmpty = pair.right.type === 'empty';
                  const isChanged = pair.left.type === 'removed' || pair.right.type === 'added';
                  const isSelected = selectedPairIdx === idx;
                  const isMerged = mergedIndices.includes(idx);

                  if (isLUnchanged) {
                    return (
                      <div 
                        key={idx} 
                        id={`diff-row-${idx}`}
                        onClick={() => isMerged && handleSelectRow(idx)}
                        className={`p-1 px-4 flex gap-4 transition-colors whitespace-pre-wrap break-all ${
                          isMerged 
                            ? 'bg-violet-500/10 text-violet-900 dark:text-violet-300 border-l-2 border-violet-500 hover:brightness-95 cursor-pointer' 
                            : 'bg-background hover:bg-muted/10'
                        } ${isSelected ? 'ring-2 ring-primary ring-inset bg-primary/5' : ''}`}
                      >
                        <span className="w-14 text-right text-xs text-muted-foreground select-none opacity-40 shrink-0">{pair.left.lineNum}</span>
                        <span className="w-14 text-right text-xs text-muted-foreground select-none opacity-40 shrink-0">{pair.right.lineNum}</span>
                        <span className="text-muted-foreground/60 w-4 select-none text-center shrink-0"> </span>
                        <span className="flex-1">{pair.left.value}</span>
                      </div>
                    );
                  }

                  return (
                    <div 
                      key={idx} 
                      id={`diff-row-${idx}`}
                      onClick={() => (isChanged || isMerged) && handleSelectRow(idx)}
                      className={`flex flex-col divide-y divide-dashed cursor-pointer ${
                        isSelected ? 'ring-2 ring-primary ring-inset bg-primary/5' : ''
                      }`}
                    >
                      {/* Removal Row */}
                      {!isLEmpty && (
                        <div className="p-1 px-4 flex gap-4 bg-red-500/10 text-red-900 dark:text-red-300 whitespace-pre-wrap break-all">
                          <span className="w-14 text-right text-xs text-red-500/60 select-none shrink-0">{pair.left.lineNum}</span>
                          <span className="w-14 text-right text-xs select-none opacity-0 shrink-0">-</span>
                          <span className="text-red-500 font-bold w-4 select-none text-center shrink-0">-</span>
                          <span className="flex-1">
                            {pair.left.words ? (
                              pair.left.words.map((w: any, wIdx: number) => (
                                <span 
                                  key={wIdx} 
                                  className={w.type === 'removed' ? 'bg-red-500/30 font-bold rounded px-0.5 border border-red-500/40 text-red-700 dark:text-red-300' : ''}
                                >
                                  {w.value}
                                </span>
                              ))
                            ) : (
                              pair.left.value
                            )}
                          </span>
                        </div>
                      )}

                      {/* Addition Row */}
                      {!isREmpty && (
                        <div className="p-1 px-4 flex gap-4 bg-green-500/10 text-green-900 dark:text-green-300 whitespace-pre-wrap break-all">
                          <span className="w-14 text-right text-xs select-none opacity-0 shrink-0">+</span>
                          <span className="w-14 text-right text-xs text-green-500/60 select-none shrink-0">{pair.right.lineNum}</span>
                          <span className="text-green-500 font-bold w-4 select-none text-center shrink-0">+</span>
                          <span className="flex-1">
                            {pair.right.words ? (
                              pair.right.words.map((w: any, wIdx: number) => (
                                <span 
                                  key={wIdx} 
                                  className={w.type === 'added' ? 'bg-green-500/30 font-bold rounded px-0.5 border border-green-500/40 text-green-700 dark:text-green-300' : ''}
                                >
                                  {w.value}
                                </span>
                              ))
                            ) : (
                              pair.right.value
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Diff Minimap overview ruler (runs full height of browser viewport window, never scrolls vertically) */}
            <div className="fixed right-0 top-[120px] bottom-[20px] w-4 bg-muted/10 border-l border-border select-none z-30 hidden md:block">
              {minimapMarkers.map((marker) => (
                <div
                  key={marker.idx}
                  onClick={() => {
                    const el = document.getElementById(`diff-row-${marker.idx}`);
                    if (el) {
                      // Scroll the browser window smoothly to target row
                      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }}
                  className="absolute left-0 right-0 h-[3px] cursor-pointer hover:h-[5px] transition-all hover:scale-x-110 flex"
                  style={{ top: `${marker.percentage}%` }}
                  title={`Jump to line ${marker.idx + 1}`}
                >
                  {marker.isMerged ? (
                    <div className="flex-1 bg-violet-500/80 hover:bg-violet-600 h-full" />
                  ) : (
                    <>
                      {marker.isRemoved && (
                        <div className="flex-1 bg-red-500/70 hover:bg-red-500 h-full" />
                      )}
                      {marker.isAdded && (
                        <div className="flex-1 bg-green-500/70 hover:bg-green-500 h-full" />
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Floating Interactive Merge Control Panel */}
      {selectedPairIdx !== null && diffResult && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-background/95 backdrop-blur border shadow-2xl rounded-2xl p-4 w-[95%] max-w-3xl animate-in slide-in-from-bottom duration-300 border-primary/20">
          <div className="flex items-center justify-between border-b pb-3 mb-3">
            <div className="flex items-center gap-2">
              {selectedChangeIdx !== -1 && changePoints.length > 0 ? (
                <>
                  <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-bold">
                    Change {selectedChangeIdx + 1} of {changePoints.length}
                  </span>
                  <span className="text-xs text-muted-foreground">Select a merge path to reconcile this line diff</span>
                </>
              ) : (
                <>
                  <span className="px-2 py-0.5 rounded bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 text-xs font-bold">
                    Merged Line
                  </span>
                  <span className="text-xs text-muted-foreground">Before you merged like this. Do you want to go back?</span>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-1.5">
              {history.length > 0 && selectedChangeIdx !== -1 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleUndo}
                  className="h-8 gap-1.5 text-xs font-bold border-violet-500/30 bg-violet-500/5 hover:bg-violet-500 hover:text-white text-violet-700 dark:text-violet-300 dark:hover:text-white transition-all duration-200 mr-1"
                >
                  <Undo2 className="h-3.5 w-3.5" /> Undo Last Action
                </Button>
              )}
              {changePoints.length > 0 && (
                <>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8"
                    disabled={changePoints.filter((cp: any) => cp.idx < selectedPairIdx).length === 0}
                    onClick={() => {
                      const prevChanges = changePoints.filter((cp: any) => cp.idx < selectedPairIdx);
                      if (prevChanges.length > 0) {
                        setSelectedPairIdx(prevChanges[prevChanges.length - 1].idx);
                      }
                    }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8"
                    disabled={changePoints.filter((cp: any) => cp.idx > selectedPairIdx).length === 0}
                    onClick={() => {
                      const nextChanges = changePoints.filter((cp: any) => cp.idx > selectedPairIdx);
                      if (nextChanges.length > 0) {
                        setSelectedPairIdx(nextChanges[0].idx);
                      }
                    }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                onClick={() => setSelectedPairIdx(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {selectedChangeIdx !== -1 && changePoints.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono mb-4">
              {/* Left Preview */}
              <div className="bg-red-500/5 rounded-xl border border-red-500/20 p-3 flex flex-col justify-between min-h-[90px]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-red-500/60">
                    Original Line {diffResult.pairs[selectedPairIdx].left.lineNum || ''}
                  </span>
                  {diffResult.pairs[selectedPairIdx].left.type === 'empty' ? (
                    <p className="mt-1 whitespace-pre-wrap break-all leading-relaxed italic text-muted-foreground/40 text-xs">
                      (Empty line)
                    </p>
                  ) : (
                    <textarea
                      value={leftEditValue}
                      onChange={(e) => setLeftEditValue(e.target.value)}
                      className="mt-1.5 w-full h-[65px] p-2 text-xs font-mono bg-background border border-red-500/20 focus:border-red-500/50 rounded-lg focus:outline-none resize-none leading-relaxed text-foreground"
                      placeholder="Edit original line..."
                    />
                  )}
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => applyMerge('to-right')} 
                    className="font-sans font-bold h-8 text-[11px]"
                  >
                    Merge change &gt;
                  </Button>
                  {diffResult.pairs[selectedPairIdx].left.type !== 'empty' && leftEditValue !== diffResult.pairs[selectedPairIdx].left.value && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSaveLineEdit('left')}
                      className="h-8 text-[11px] font-sans font-bold bg-blue-500/10 border-blue-500 hover:bg-blue-500 hover:text-white text-blue-700 dark:text-blue-300 dark:hover:text-white gap-1 transition-all"
                    >
                      <Check className="h-3.5 w-3.5" /> Save Edit
                    </Button>
                  )}
                </div>
              </div>

              {/* Right Preview */}
              <div className="bg-green-500/5 rounded-xl border border-green-500/20 p-3 flex flex-col justify-between min-h-[90px]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-green-500/60">
                    Modified Line {diffResult.pairs[selectedPairIdx].right.lineNum || ''}
                  </span>
                  {diffResult.pairs[selectedPairIdx].right.type === 'empty' ? (
                    <p className="mt-1 whitespace-pre-wrap break-all leading-relaxed italic text-muted-foreground/40 text-xs">
                      (Empty line)
                    </p>
                  ) : (
                    <textarea
                      value={rightEditValue}
                      onChange={(e) => setRightEditValue(e.target.value)}
                      className="mt-1.5 w-full h-[65px] p-2 text-xs font-mono bg-background border border-green-500/20 focus:border-green-500/50 rounded-lg focus:outline-none resize-none leading-relaxed text-foreground"
                      placeholder="Edit modified line..."
                    />
                  )}
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={() => applyMerge('to-left')} 
                    className="font-sans font-bold h-8 text-[11px] bg-green-600 hover:bg-green-700 text-white"
                  >
                    &lt; Merge change
                  </Button>
                  {diffResult.pairs[selectedPairIdx].right.type !== 'empty' && rightEditValue !== diffResult.pairs[selectedPairIdx].right.value && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSaveLineEdit('right')}
                      className="h-8 text-[11px] font-sans font-bold bg-blue-500/10 border-blue-500 hover:bg-blue-500 hover:text-white text-blue-700 dark:text-blue-300 dark:hover:text-white gap-1 transition-all"
                    >
                      <Check className="h-3.5 w-3.5" /> Save Edit
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Merged Line Revert/Undo View using Unified 2-Column Pre-Merge Layout */
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                {/* Left pre-merged original state */}
                <div className="bg-red-500/5 rounded-xl border border-red-500/20 p-3 flex flex-col justify-between min-h-[90px]">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-red-500/60">
                      Original Left (Before Merge)
                    </span>
                    {((originalMergedState[selectedPairIdx]?.left?.type ?? diffResult.pairs[selectedPairIdx]?.left?.type) === 'empty') ? (
                      <p className="mt-1 whitespace-pre-wrap break-all leading-relaxed italic text-muted-foreground/40 text-xs">
                        (Empty line)
                      </p>
                    ) : (
                      <textarea
                        value={leftEditValue}
                        onChange={(e) => setLeftEditValue(e.target.value)}
                        className="mt-1.5 w-full h-[65px] p-2 text-xs font-mono bg-background border border-red-500/20 focus:border-red-500/50 rounded-lg focus:outline-none resize-none leading-relaxed text-foreground"
                        placeholder="Edit left line..."
                      />
                    )}
                  </div>
                  {((originalMergedState[selectedPairIdx]?.left?.type ?? diffResult.pairs[selectedPairIdx]?.left?.type) !== 'empty') && 
                    leftEditValue !== (originalMergedState[selectedPairIdx]?.left?.value ?? diffResult.pairs[selectedPairIdx].left.value) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSaveLineEdit('left')}
                        className="h-8 text-[11px] font-sans font-bold bg-blue-500/10 border-blue-500 hover:bg-blue-500 hover:text-white text-blue-700 dark:text-blue-300 dark:hover:text-white gap-1 transition-all mt-3 self-start"
                      >
                        <Check className="h-3.5 w-3.5" /> Save Edit
                      </Button>
                    )}
                </div>

                {/* Right pre-merged original state */}
                <div className="bg-green-500/5 rounded-xl border border-green-500/20 p-3 flex flex-col justify-between min-h-[90px]">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-green-500/60">
                      Original Right (Before Merge)
                    </span>
                    {((originalMergedState[selectedPairIdx]?.right?.type ?? diffResult.pairs[selectedPairIdx]?.right?.type) === 'empty') ? (
                      <p className="mt-1 whitespace-pre-wrap break-all leading-relaxed italic text-muted-foreground/40 text-xs">
                        (Empty line)
                      </p>
                    ) : (
                      <textarea
                        value={rightEditValue}
                        onChange={(e) => setRightEditValue(e.target.value)}
                        className="mt-1.5 w-full h-[65px] p-2 text-xs font-mono bg-background border border-green-500/20 focus:border-green-500/50 rounded-lg focus:outline-none resize-none leading-relaxed text-foreground"
                        placeholder="Edit right line..."
                      />
                    )}
                  </div>
                  {((originalMergedState[selectedPairIdx]?.right?.type ?? diffResult.pairs[selectedPairIdx]?.right?.type) !== 'empty') && 
                    rightEditValue !== (originalMergedState[selectedPairIdx]?.right?.value ?? diffResult.pairs[selectedPairIdx].right.value) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSaveLineEdit('right')}
                        className="h-8 text-[11px] font-sans font-bold bg-blue-500/10 border-blue-500 hover:bg-blue-500 hover:text-white text-blue-700 dark:text-blue-300 dark:hover:text-white gap-1 transition-all mt-3 self-start"
                      >
                        <Check className="h-3.5 w-3.5" /> Save Edit
                      </Button>
                    )}
                </div>
              </div>

              {/* Bottom centered revert action trigger */}
              <div className="flex flex-col items-center justify-center gap-1.5 pt-3 border-t w-full mt-2">
                <p className="text-[11px] text-muted-foreground text-center">
                  You merged this line. Click below to undo your last action.
                </p>
                {history.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={handleUndo}
                    className="bg-violet-500/10 border-violet-500 hover:bg-violet-500 hover:text-white text-violet-700 dark:text-violet-300 dark:hover:text-white font-bold h-9 px-6 gap-2 transition-all mt-1"
                  >
                    <Undo2 className="h-4 w-4" /> Undo Last Action
                  </Button>
                )}
              </div>
            </div>
          )}        </div>
      )}

      {/* FAQs / Informative Section */}
      <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
          <h2 className="text-3xl font-bold font-headline mb-6">Compare Text & Code Online Instantly</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
            <div className="space-y-4">
              <p>
                <strong className="text-primary font-bold">100% Client-Side Comparison:</strong> Unlike commercial diff checkers, our tool processes both inputs completely inside your browser. No contents are ever uploaded to any web servers, ensuring complete privacy for your sensitive programming code, database configurations, and personal documents.
              </p>
              <p>
                Whether you need to check version deltas, inspect code rewrites, or track changes in standard contracts, our online tool highlights changes on both a line level and character level instantly.
              </p>
            </div>
            <div className="space-y-4">
              <p>
                <strong className="text-primary font-bold">Key Capabilities:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Word Highlight:</strong> Highlights precise whole word additions/deletions inside modified lines.</li>
                <li><strong>Interactive Merging:</strong> Click any changed line to reveal merge helper controls. Resolve changes left-to-right or right-to-left instantly.</li>
                <li><strong>File Uploading:</strong> Select any text file to immediately parse it into comparison panels.</li>
                <li><strong>Side-by-Side vs Unified:</strong> Switch easily between git-style split view and unified line merge layout.</li>
                <li><strong>Swap Content:</strong> One-click swap to swap left and right panes.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Side Copy Buttons */}
      {diffResult && (
        <>
          {/* Left FAB: Copy Original */}
          <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40 group flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleCopy(originalText, 'left')}
              className="h-12 w-12 rounded-full shadow-lg border border-primary/20 bg-background text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 flex items-center justify-center"
            >
              {copiedLeft ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
            </Button>
            <span className="hidden group-hover:flex absolute left-16 bg-slate-950 text-slate-50 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-md shadow-md select-none pointer-events-none whitespace-nowrap z-50 border border-slate-800 animate-in fade-in zoom-in-95 duration-150">
              Copy Left Text
            </span>
          </div>

          {/* Right FAB: Copy Merged */}
          <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 group flex flex-row-reverse items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleCopy(changedText, 'right')}
              className="h-12 w-12 rounded-full shadow-lg bg-primary text-primary-foreground border border-transparent hover:bg-background hover:text-primary hover:border-primary/20 transition-all duration-200 flex items-center justify-center"
            >
              {copiedRight ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
            </Button>
            <span className="hidden group-hover:flex absolute right-16 bg-slate-950 text-slate-50 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-md shadow-md select-none pointer-events-none whitespace-nowrap z-50 border border-slate-800 animate-in fade-in zoom-in-95 duration-150">
              Copy Right Text
            </span>
          </div>
        </>
      )}

      
      <ScrollToTop />
    </div>
  );
}

// Help icon component placeholder
function BracesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-2 2-2-2" />
      <path d="M9 10a3 3 0 0 1 3-3h0a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3h0a3 3 0 0 1-3-3v-2z" />
      <path d="M19 14v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-4" />
      <path d="M5 10V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4" />
    </svg>
  );
}
