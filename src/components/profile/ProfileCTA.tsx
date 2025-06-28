
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProfileContactForm } from './ProfileContactForm';
import { MessageSquare, Star, Shield, Clock, ArrowRight } from 'lucide-react';

interface ProfileCTAProps {
  userId: string;
  displayName: string;
  availabilityStatus?: string;
  rateRangeMin?: number;
  rateRangeMax?: number;
  acceptsIntros?: boolean;
  requiresNda?: boolean;
}

export function ProfileCTA({ 
  userId, 
  displayName, 
  availabilityStatus,
  rateRangeMin,
  rateRangeMax,
  acceptsIntros,
  requiresNda
}: ProfileCTAProps) {
  const [showContactForm, setShowContactForm] = useState(false);

  const getAvailabilityColor = (status?: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'limited':
        return 'bg-yellow-500';
      case 'unavailable':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatRate = () => {
    if (rateRangeMin && rateRangeMax) {
      return `$${rateRangeMin.toLocaleString()} - $${rateRangeMax.toLocaleString()}`;
    }
    return null;
  };

  return (
    <>
      <Card className="sticky top-6 border-2 border-primary/20 bg-gradient-to-br from-background to-muted/20">
        <CardContent className="p-6 space-y-4">
          {/* Availability Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getAvailabilityColor(availabilityStatus)}`} />
              <span className="font-medium capitalize">
                {availabilityStatus || 'Available'}
              </span>
            </div>
            {formatRate() && (
              <Badge variant="outline" className="text-sm">
                {formatRate()}
              </Badge>
            )}
          </div>

          {/* Main CTA */}
          <div className="space-y-3">
            <Button
              onClick={() => setShowContactForm(true)}
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 group"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Start a Project
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <p className="text-sm text-muted-foreground text-center">
              Get a response within 24 hours
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>Verified Professional</span>
            </div>
            
            {acceptsIntros && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-blue-500" />
                <span>Accepts Introductions</span>
              </div>
            )}
            
            {requiresNda && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-purple-500" />
                <span>NDA Protected</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4 text-green-500" />
              <span>Fast Response Guaranteed</span>
            </div>
          </div>

          {/* Value Proposition */}
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              Start your project with confidence. Get expert consultation, 
              clear timelines, and professional results from day one.
            </p>
          </div>
        </CardContent>
      </Card>

      <ProfileContactForm
        profileUserId={userId}
        profileName={displayName}
        isOpen={showContactForm}
        onClose={() => setShowContactForm(false)}
      />
    </>
  );
}
