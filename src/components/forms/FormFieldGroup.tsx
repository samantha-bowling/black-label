import { ReactNode } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { InputLuxe } from '@/components/ui/primitives';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

export interface FormFieldConfig {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'textarea' | 'number' | 'url' | 'select' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  description?: string;
  options?: { value: string; label: string }[];
  validation?: Record<string, any>;
  gridSpan?: 1 | 2 | 3;
}

interface FormFieldGroupProps {
  fields: FormFieldConfig[];
  form: UseFormReturn<any>;
  columns?: 1 | 2 | 3;
  className?: string;
}

export function FormFieldGroup({ fields, form, columns = 1, className = '' }: FormFieldGroupProps) {
  const { register, setValue, watch, formState: { errors } } = form;

  const getGridClasses = () => {
    switch (columns) {
      case 2:
        return 'grid md:grid-cols-2 gap-4';
      case 3:
        return 'grid md:grid-cols-3 gap-4';
      default:
        return 'space-y-4';
    }
  };

  const renderField = (field: FormFieldConfig) => {
    const error = errors[field.id];
    const fieldValue = watch(field.id);

    const fieldContainer = (children: ReactNode) => (
      <div key={field.id} className={field.gridSpan && field.gridSpan > 1 ? `md:col-span-${field.gridSpan}` : ''}>
        {children}
        {error && (
          <p className="text-destructive text-sm mt-1">
            {error.message as string}
          </p>
        )}
        {field.description && (
          <p className="text-white/50 text-xs mt-1">
            {field.description}
          </p>
        )}
      </div>
    );

    switch (field.type) {
      case 'textarea':
        const textValue = fieldValue || '';
        const maxLength = field.validation?.maxLength?.value;
        
        return fieldContainer(
          <div className="space-y-2">
            <Label htmlFor={field.id} className="text-white">
              {field.label} {field.required && '*'}
            </Label>
            <Textarea
              id={field.id}
              {...register(field.id, field.validation)}
              placeholder={field.placeholder}
              className="min-h-[100px] bg-black/20 border-white/20 text-white placeholder:text-white/50"
            />
            {maxLength && (
              <div className="text-right text-xs">
                <span className={`${textValue.length > maxLength ? 'text-red-400' : 'text-white/50'}`}>
                  {textValue.length}/{maxLength}
                </span>
              </div>
            )}
          </div>
        );

      case 'select':
        return fieldContainer(
          <>
            <Label htmlFor={field.id} className="text-white">
              {field.label} {field.required && '*'}
            </Label>
            <Select onValueChange={(value) => setValue(field.id, value)}>
              <SelectTrigger className="bg-black/20 border-white/20 text-white">
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        );

      case 'checkbox':
        return fieldContainer(
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.id}
              checked={fieldValue}
              onCheckedChange={(checked) => setValue(field.id, checked)}
            />
            <Label htmlFor={field.id} className="text-white cursor-pointer">
              {field.label}
            </Label>
          </div>
        );

      case 'number':
        return fieldContainer(
          <>
            <Label htmlFor={field.id} className="text-white">
              {field.label} {field.required && '*'}
            </Label>
            <InputLuxe
              id={field.id}
              type="number"
              {...register(field.id, { 
                valueAsNumber: true, 
                ...field.validation 
              })}
              placeholder={field.placeholder}
              error={!!error}
            />
          </>
        );

      default:
        return fieldContainer(
          <>
            <Label htmlFor={field.id} className="text-white">
              {field.label} {field.required && '*'}
            </Label>
            <InputLuxe
              id={field.id}
              type={field.type || 'text'}
              {...register(field.id, field.validation)}
              placeholder={field.placeholder}
              error={!!error}
            />
          </>
        );
    }
  };

  return (
    <div className={`${getGridClasses()} ${className}`}>
      {fields.map(renderField)}
    </div>
  );
}
