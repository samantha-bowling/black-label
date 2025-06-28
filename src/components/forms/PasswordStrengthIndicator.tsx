
import { CheckCircle, AlertCircle } from 'lucide-react';
import { PasswordStrength, getPasswordStrengthColor, getPasswordStrengthText } from '@/lib/auth/passwordUtils';

interface PasswordStrengthIndicatorProps {
  strength: PasswordStrength;
  password: string;
  className?: string;
}

export function PasswordStrengthIndicator({ 
  strength, 
  password, 
  className = '' 
}: PasswordStrengthIndicatorProps) {
  if (!password) return null;

  const strengthColor = getPasswordStrengthColor(strength.score);
  const strengthText = getPasswordStrengthText(strength.score);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Strength Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Password Strength</span>
          <span className={`text-sm font-medium ${strengthColor.split(' ')[0]}`}>
            {strengthText}
          </span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              strength.score === 0 ? 'bg-red-500' :
              strength.score === 1 ? 'bg-red-500 w-1/4' :
              strength.score === 2 ? 'bg-yellow-500 w-2/4' :
              strength.score === 3 ? 'bg-blue-500 w-3/4' :
              'bg-green-500 w-full'
            }`}
            style={{ 
              width: strength.score === 0 ? '10%' : `${(strength.score + 1) * 20}%` 
            }}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="space-y-1">
        <RequirementItem 
          met={strength.requirements.length} 
          text="At least 12 characters" 
        />
        <RequirementItem 
          met={strength.requirements.uppercase} 
          text="Uppercase letter (A-Z)" 
        />
        <RequirementItem 
          met={strength.requirements.lowercase} 
          text="Lowercase letter (a-z)" 
        />
        <RequirementItem 
          met={strength.requirements.numbers} 
          text="Number (0-9)" 
        />
        <RequirementItem 
          met={strength.requirements.symbols} 
          text="Special character (!@#$%^&*)" 
        />
        <RequirementItem 
          met={strength.requirements.noCommon} 
          text="Not a common password" 
        />
      </div>

      {/* Feedback */}
      {strength.feedback.length > 0 && strength.score < 4 && (
        <div className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-200">
              <p className="font-medium mb-1">Suggestions:</p>
              <ul className="space-y-0.5">
                {strength.feedback.slice(0, 3).map((tip, index) => (
                  <li key={index}>• {tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RequirementItem({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center space-x-2 text-sm">
      {met ? (
        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
      ) : (
        <div className="w-4 h-4 border border-gray-600 rounded-full flex-shrink-0" />
      )}
      <span className={met ? 'text-green-200' : 'text-gray-400'}>
        {text}
      </span>
    </div>
  );
}
