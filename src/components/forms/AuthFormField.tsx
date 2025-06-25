
import { UseFormReturn } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { InputLuxe } from '@/components/ui/primitives';
import { Textarea } from '@/components/ui/textarea';

interface AuthFormFieldProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'textarea';
  placeholder?: string;
  required?: boolean;
  error?: boolean;
  form?: UseFormReturn<any>;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  className?: string;
}

export function AuthFormField({
  id,
  label,
  type = 'text',
  placeholder,
  required = false,
  error = false,
  form,
  value,
  onChange,
  className = '',
}: AuthFormFieldProps) {
  const registerProps = form ? form.register(id, { required }) : {};

  return (
    <div className={className}>
      <Label htmlFor={id} className="block text-sm font-medium mb-2">
        {label} {required && '*'}
      </Label>
      {type === 'textarea' ? (
        <Textarea
          id={id}
          placeholder={placeholder}
          className="min-h-[100px] bg-black/20 border-white/20 text-white placeholder:text-white/50"
          {...(form ? registerProps : { value, onChange })}
        />
      ) : (
        <InputLuxe
          id={id}
          type={type}
          placeholder={placeholder}
          required={required}
          error={error}
          {...(form ? registerProps : { value, onChange })}
        />
      )}
    </div>
  );
}
