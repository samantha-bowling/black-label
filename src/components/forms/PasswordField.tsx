
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { InputLuxe } from '@/components/ui/primitives';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { checkPasswordStrength } from '@/lib/auth/passwordUtils';

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: boolean;
  showStrengthIndicator?: boolean;
  className?: string;
}

export function PasswordField({
  id,
  label,
  value,
  onChange,
  placeholder = "Enter your password",
  required = false,
  error = false,
  showStrengthIndicator = false,
  className = '',
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const strength = checkPasswordStrength(value);

  return (
    <div className={className}>
      <Label htmlFor={id} className="block text-sm font-medium mb-2">
        {label} {required && '*'}
      </Label>
      
      <div className="relative">
        <InputLuxe
          id={id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          error={error}
          className="pr-12"
        />
        
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>

      {showStrengthIndicator && (
        <div className="mt-3">
          <PasswordStrengthIndicator 
            strength={strength} 
            password={value} 
          />
        </div>
      )}
    </div>
  );
}
