"use client"

import * as React from "react"
import { Check, ChevronDown, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface SelectContextType {
  value?: string;
  onValueChange?: (val: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  itemsMap: Record<string, string>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  disabled?: boolean;
}

const SelectContext = React.createContext<SelectContextType | null>(null);

const getItemsMap = (children: React.ReactNode): Record<string, string> => {
  const map: Record<string, string> = {};
  const traverse = (node: React.ReactNode) => {
    React.Children.forEach(node, (child) => {
      if (!React.isValidElement(child)) return;
      if (child.props && 'value' in child.props) {
        map[child.props.value] = String(child.props.children || '');
      }
      if (child.props && child.props.children) {
        traverse(child.props.children);
      }
    });
  };
  traverse(children);
  return map;
};

export interface SelectProps {
  children?: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
}

export function Select({ children, value, onValueChange, defaultValue, disabled }: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentVal, setCurrentVal] = React.useState(value || defaultValue);

  React.useEffect(() => {
    if (value !== undefined) {
      setCurrentVal(value);
    }
  }, [value]);

  const handleValueChange = (val: string) => {
    setCurrentVal(val);
    if (onValueChange) onValueChange(val);
  };

  const itemsMap = React.useMemo(() => getItemsMap(children), [children]);

  // Reset search when dialog opens/closes
  React.useEffect(() => {
    if (!open) {
      setSearchQuery('');
    }
  }, [open]);

  return (
    <SelectContext.Provider value={{
      value: currentVal,
      onValueChange: handleValueChange,
      open,
      setOpen,
      itemsMap,
      searchQuery,
      setSearchQuery,
      disabled
    }}>
      {children}
    </SelectContext.Provider>
  );
}

const SelectGroup = ({ children, className, ...props }: any) => (
  <div className={cn("space-y-1", className)} {...props}>{children}</div>
);

const SelectValue = ({ placeholder }: { placeholder?: string }) => {
  const context = React.useContext(SelectContext);
  if (!context) return null;
  const label = context.itemsMap[context.value || ''] || placeholder || '';
  return <span>{label}</span>;
};

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button">
>(({ className, children, ...props }, ref) => {
  const context = React.useContext(SelectContext);
  if (!context) return null;

  return (
    <button
      ref={ref}
      type="button"
      disabled={context.disabled}
      onClick={() => context.setOpen(true)}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 text-left",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50 shrink-0 ml-2" />
    </button>
  );
});
SelectTrigger.displayName = "SelectTrigger";

const SelectScrollUpButton = () => null;
const SelectScrollDownButton = () => null;

const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & { position?: string }
>(({ className, children, position, ...props }, ref) => {
  const context = React.useContext(SelectContext);
  if (!context) return null;

  const totalItems = Object.keys(context.itemsMap).length;
  const filteredItemsCount = Object.entries(context.itemsMap).filter(([val, label]) => {
    const q = context.searchQuery.toLowerCase();
    return label.toLowerCase().includes(q) || val.toLowerCase().includes(q);
  }).length;

  return (
    <Dialog open={context.open} onOpenChange={context.setOpen}>
      <DialogContent className="max-w-md w-[92vw] rounded-2xl p-6 gap-4 overflow-hidden flex flex-col max-h-[80vh] z-50">
        <DialogHeader className="border-b pb-2 flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-black italic tracking-wide text-left uppercase">Select Option</DialogTitle>
        </DialogHeader>

        {/* Search Input */}
        {totalItems > 3 && (
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search option..."
              value={context.searchQuery}
              onChange={(e) => context.setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-9 py-2 border rounded-xl text-sm bg-muted/10 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {context.searchQuery && (
              <button
                onClick={() => context.setSearchQuery('')}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto space-y-1 py-1 pr-1 min-h-[150px] max-h-[350px]">
          {children}
          {filteredItemsCount === 0 && (
            <div className="text-center py-8 text-sm text-muted-foreground">
              No options found matching "{context.searchQuery}"
            </div>
          )}
        </div>

        {/* Footer actions */}
        {context.searchQuery && (
          <div className="border-t pt-3 flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Showing {filteredItemsCount} of {totalItems} options</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => context.setSearchQuery('')}
              className="text-primary hover:text-primary/80 font-bold"
            >
              Clear Search
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
});
SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button"> & { value: string }
>(({ className, children, value, ...props }, ref) => {
  const context = React.useContext(SelectContext);
  if (!context) return null;

  const isSelected = context.value === value;
  const label = String(children || '');

  // Filter out if search query doesn't match
  if (context.searchQuery) {
    const q = context.searchQuery.toLowerCase();
    if (!label.toLowerCase().includes(q) && !value.toLowerCase().includes(q)) {
      return null;
    }
  }

  const handleSelect = () => {
    if (context.onValueChange) context.onValueChange(value);
    context.setOpen(false);
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={handleSelect}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-xl py-3 pl-10 pr-4 text-sm outline-none transition-colors hover:bg-muted/60 focus:bg-accent focus:text-accent-foreground text-left",
        isSelected ? "font-bold bg-primary/5 text-primary" : "text-muted-foreground hover:text-foreground",
        className
      )}
      {...props}
    >
      <span className="absolute left-3.5 flex h-4 w-4 items-center justify-center">
        {isSelected && <Check className="h-4 w-4 text-primary stroke-[3px]" />}
      </span>
      <span className="truncate">{children}</span>
    </button>
  );
});
SelectItem.displayName = "SelectItem";

const SelectLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider", className)}
    {...props}
  />
));
SelectLabel.displayName = "SelectLabel";

const SelectSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
SelectSeparator.displayName = "SelectSeparator";

export {
  SelectContext,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
