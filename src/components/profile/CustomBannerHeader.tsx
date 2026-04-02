// @ts-nocheck

import { useState } from 'react';
import { Upload, Camera, Palette } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CustomBannerHeaderProps {
  user: {
    id: string;
    displayName: string;
    avatarUrl?: string;
    banner_image_url?: string;
    banner_background_color?: string;
    signature_quote?: string;
  };
  isOwner?: boolean;
}

export function CustomBannerHeader({ user, isOwner = false }: CustomBannerHeaderProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [bannerColor, setBannerColor] = useState(user.banner_background_color || '#000000');
  const [isEditingColor, setIsEditingColor] = useState(false);

  const handleBannerUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/banner-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-media')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-media')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('users')
        .update({ banner_image_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast({ title: "Banner updated successfully!" });
      window.location.reload(); // Simple refresh to show new banner
    } catch (error) {
      console.error('Error uploading banner:', error);
      toast({ 
        title: "Error uploading banner", 
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive" 
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleColorChange = async (color: string) => {
    setBannerColor(color);
    
    try {
      const { error } = await supabase
        .from('users')
        .update({ banner_background_color: color })
        .eq('id', user.id);

      if (error) throw error;
      
      toast({ title: "Banner color updated!" });
    } catch (error) {
      console.error('Error updating banner color:', error);
      toast({ 
        title: "Error updating banner color", 
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive" 
      });
    }
  };

  const bannerStyle = user.banner_image_url 
    ? { backgroundImage: `url(${user.banner_image_url})` }
    : { backgroundColor: bannerColor };

  return (
    <div className="relative">
      {/* Banner */}
      <div 
        className="h-48 md:h-64 bg-surface bg-cover bg-center relative"
        style={bannerStyle}
      >
        {/* Banner Overlay */}
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Banner Controls (Owner Only) */}
        {isOwner && (
          <div className="absolute top-4 right-4 flex gap-2">
            <label htmlFor="banner-upload">
              <Button 
                size="sm" 
                variant="secondary" 
                className="bg-white/10 hover:bg-white/20 text-white"
                disabled={isUploading}
              >
                <Camera className="w-4 h-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Change Banner'}
              </Button>
            </label>
            <input
              id="banner-upload"
              type="file"
              accept="image/*"
              onChange={handleBannerUpload}
              className="hidden"
            />
            
            <Button 
              size="sm" 
              variant="secondary" 
              className="bg-white/10 hover:bg-white/20 text-white"
              onClick={() => setIsEditingColor(!isEditingColor)}
            >
              <Palette className="w-4 h-4" />
            </Button>
            
            {isEditingColor && (
              <div className="absolute top-12 right-0 bg-white p-2 rounded-lg shadow-lg">
                <Input
                  type="color"
                  value={bannerColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-12 h-8 p-0 border-0"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Profile Info Overlay */}
      <div className="absolute -bottom-16 left-6 flex items-end gap-4">
        <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
          <AvatarImage src={user.avatarUrl} />
          <AvatarFallback className="text-2xl">
            {user.displayName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="pb-4 text-white">
          <h1 className="text-3xl font-bold mb-1">{user.displayName}</h1>
          {user.signature_quote && (
            <p className="text-lg opacity-90 max-w-md">{user.signature_quote}</p>
          )}
        </div>
      </div>
    </div>
  );
}
