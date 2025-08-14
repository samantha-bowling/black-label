import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { GameCredit } from '@/hooks/useGameCredits';
import { ExternalLink, Calendar, Trophy, Users, Star } from 'lucide-react';

interface GameCreditsShowcaseProps {
  credits: GameCredit[];
  editable?: boolean;
  onEdit?: (credit: GameCredit) => void;
}

export function GameCreditsShowcase({ credits, editable, onEdit }: GameCreditsShowcaseProps) {
  if (credits.length === 0) {
    return null;
  }

  const featuredCredits = credits.filter(credit => credit.is_featured);
  const otherCredits = credits.filter(credit => !credit.is_featured);

  return (
    <div className="space-y-6">
      {/* Featured Credits */}
      {featuredCredits.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            Featured Projects
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredCredits.map((credit) => (
              <GameCreditCard 
                key={credit.id} 
                credit={credit} 
                editable={editable} 
                onEdit={onEdit}
                featured
              />
            ))}
          </div>
        </div>
      )}

      {/* Other Credits */}
      {otherCredits.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-primary" />
            Additional Credits
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherCredits.map((credit) => (
              <GameCreditCard 
                key={credit.id} 
                credit={credit} 
                editable={editable} 
                onEdit={onEdit}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface GameCreditCardProps {
  credit: GameCredit;
  editable?: boolean;
  onEdit?: (credit: GameCredit) => void;
  featured?: boolean;
}

function GameCreditCard({ credit, editable, onEdit, featured = false }: GameCreditCardProps) {
  return (
    <Card 
      className={`bg-surface/30 border-border transition-colors ${
        editable ? 'cursor-pointer hover:bg-surface/50' : ''
      } ${featured ? 'border-yellow-400/30' : ''}`}
      onClick={() => editable && onEdit?.(credit)}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
              {credit.game_title}
              {featured && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
            </h4>
            <p className="text-primary font-medium">{credit.role}</p>
            {credit.company_studio && (
              <p className="text-muted-foreground">{credit.company_studio}</p>
            )}
          </div>
          
          {credit.external_link && (
            <a
              href={credit.external_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {credit.release_year && (
            <Badge variant="outline" className="border-white/20 text-white">
              <Calendar className="w-3 h-3 mr-1" />
              {credit.release_year}
            </Badge>
          )}
          
          {credit.metacritic_score && (
            <Badge 
              variant="outline" 
              className={`border-white/20 ${
                credit.metacritic_score >= 80 ? 'text-green-400' :
                credit.metacritic_score >= 70 ? 'text-yellow-400' : 'text-white'
              }`}
            >
              {credit.metacritic_score} Metacritic
            </Badge>
          )}
          
          {credit.sales_figures && (
            <Badge variant="outline" className="border-white/20 text-white">
              <Users className="w-3 h-3 mr-1" />
              {credit.sales_figures}
            </Badge>
          )}
        </div>

        {credit.platform && credit.platform.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {credit.platform.map((platform, i) => (
              <Badge key={i} variant="secondary" className="text-xs bg-white/10 text-white">
                {platform}
              </Badge>
            ))}
          </div>
        )}

        {credit.description && (
          <p className="text-white/70 text-sm mb-3 leading-relaxed">
            {credit.description}
          </p>
        )}

        {credit.awards_recognition && credit.awards_recognition.length > 0 && (
          <div className="border-t border-white/10 pt-3">
            <div className="flex flex-wrap gap-1">
              {credit.awards_recognition.map((award, i) => (
                <Badge key={i} variant="outline" className="text-xs border-yellow-400/30 text-yellow-400">
                  <Trophy className="w-3 h-3 mr-1" />
                  {award}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
