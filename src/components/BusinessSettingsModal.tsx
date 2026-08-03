'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Save, Trash2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { compressImage } from '@/lib/utils';

export interface BusinessProfile {
  companyName: string;
  address: string;
  mobile: string;
  email: string;
  gstin: string;
  logo: string | null;
}

const STORAGE_KEY = 'usebro_business_profile';

export default function BusinessSettingsModal({
  onSave,
}: {
  onSave: (profile: BusinessProfile) => void;
}) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<BusinessProfile>({
    companyName: '',
    address: '',
    mobile: '',
    email: '',
    gstin: '',
    logo: null,
  });

  // Load profile from localStorage when modal is opened or mounted
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setProfile(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse business profile:', e);
        }
      }
    }
  }, [open]);

  const handleInputChange = (field: keyof BusinessProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      compressImage(file, 250, 250, (base64) => {
        setProfile((prev) => ({ ...prev, logo: base64 }));
      });
    } else if (file) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file.',
        variant: 'destructive',
      });
    }
  };

  const handleSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      onSave(profile);
      toast({
        title: 'Profile Saved',
        description: 'Your business details have been saved and applied.',
      });
      setOpen(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast({
        title: 'Storage Full',
        description: 'Could not save profile details to localStorage because storage is full.',
        variant: 'destructive',
      });
    }
  };

  const handleClear = () => {
    localStorage.removeItem(STORAGE_KEY);
    const emptyProfile = {
      companyName: '',
      address: '',
      mobile: '',
      email: '',
      gstin: '',
      logo: null,
    };
    setProfile(emptyProfile);
    onSave(emptyProfile);
    toast({
      title: 'Profile Cleared',
      description: 'Saved business details have been cleared.',
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          type="button"
          className="flex items-center gap-1.5 h-8 text-xs font-bold border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all duration-200"
        >
          <Settings className="h-3.5 w-3.5" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-headline text-xl">Default Business Settings</DialogTitle>
          <DialogDescription>
            Save your business details here. They will automatically fill all matching invoice, receipt, and quotation forms.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3 text-sm">
          <div className="space-y-1">
            <Label htmlFor="companyName" className="font-semibold text-xs">Company/Business Name</Label>
            <Input
              id="companyName"
              placeholder="e.g. Acme Corporation"
              value={profile.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="address" className="font-semibold text-xs">Address</Label>
            <Textarea
              id="address"
              placeholder="e.g. 123 Main St, New Delhi, Delhi 110001"
              value={profile.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="min-h-[60px] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="mobile" className="font-semibold text-xs">Mobile Number</Label>
              <Input
                id="mobile"
                placeholder="e.g. +91 9876543210"
                value={profile.mobile}
                onChange={(e) => handleInputChange('mobile', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email" className="font-semibold text-xs">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="e.g. billing@acme.com"
                value={profile.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="gstin" className="font-semibold text-xs">GSTIN / Tax ID Number</Label>
            <Input
              id="gstin"
              placeholder="e.g. 07AAAAA1111A1Z1"
              value={profile.gstin}
              onChange={(e) => handleInputChange('gstin', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="font-semibold text-xs">Company Logo</Label>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Input
                  type="file"
                  id="logo"
                  accept="image/png, image/jpeg"
                  onChange={handleLogoChange}
                  className="w-full text-xs"
                />
              </div>
              {profile.logo && (
                <div className="relative flex-shrink-0 group">
                  <img
                    src={profile.logo}
                    alt="Saved Logo"
                    className="w-12 h-12 object-contain rounded-md border p-1 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setProfile((prev) => ({ ...prev, logo: null }))}
                    className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-0 mt-3 pt-3 border-t">
          <Button
            variant="outline"
            type="button"
            onClick={handleClear}
            className="text-destructive hover:bg-destructive/10 border-destructive/20"
          >
            <Trash2 className="h-4 w-4 mr-1.5" />
            Clear Saved
          </Button>
          <Button type="button" onClick={handleSave} className="bg-primary hover:bg-primary/90 text-white">
            <Save className="h-4 w-4 mr-1.5" />
            Save & Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
