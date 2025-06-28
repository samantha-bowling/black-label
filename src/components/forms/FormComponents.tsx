
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Label, Input, Button, Text, Card } from '@/components/ui/design-primitives';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

// Form Field Wrapper
interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({ 
  label, 
  required, 
  error, 
  description, 
  children, 
  className 
}: FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label required={required}>
        {label}
      </Label>
      {children}
      {description && (
        <Text size="sm" variant="tertiary">
          {description}
        </Text>
      )}
      {error && (
        <Text size="sm" className="text-red-400">
          {error}
        </Text>
      )}
    </div>
  );
}

// Form Section for grouping related fields
interface FormSectionProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({ 
  title, 
  subtitle, 
  icon, 
  children, 
  className 
}: FormSectionProps) {
  return (
    <Card className={cn('space-y-6', className)}>
      <div className="flex items-start space-x-3">
        {icon && (
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white/10 rounded-lg text-white">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-lg text-white uppercase tracking-wide">
            {title}
          </h3>
          {subtitle && (
            <Text size="sm" variant="secondary" className="mt-1">
              {subtitle}
            </Text>
          )}
        </div>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </Card>
  );
}

// Enhanced Form Field Group
interface FormFieldGroupProps {
  fields: FormFieldConfig[];
  form: UseFormReturn<any>;
  columns?: 1 | 2 | 3;
  className?: string;
}

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

export function FormFieldGroup({ 
  fields, 
  form, 
  columns = 1, 
  className 
}: FormFieldGroupProps) {
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

    const fieldContainer = (children: React.ReactNode) => (
      <FormField
        key={field.id}
        label={field.label}
        required={field.required}
        error={error?.message as string}
        description={field.description}
        className={field.gridSpan && field.gridSpan > 1 ? `md:col-span-${field.gridSpan}` : ''}
      >
        {children}
      </FormField>
    );

    switch (field.type) {
      case 'textarea':
        return fieldContainer(
          <Textarea
            id={field.id}
            {...register(field.id, field.validation)}
            placeholder={field.placeholder}
            className="min-h-[100px] bg-black/20 border-white/20 text-white placeholder:text-white/50"
          />
        );

      case 'select':
        return fieldContainer(
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
        );

      case 'checkbox':
        return fieldContainer(
          <div className="flex items-center space-x-3">
            <Checkbox
              id={field.id}
              checked={fieldValue}
              onCheckedChange={(checked) => setValue(field.id, checked)}
            />
            <Label htmlFor={field.id} className="cursor-pointer">
              {field.label}
            </Label>
          </div>
        );

      case 'number':
        return fieldContainer(
          <Input
            id={field.id}
            type="number"
            {...register(field.id, { 
              valueAsNumber: true, 
              ...field.validation 
            })}
            placeholder={field.placeholder}
            hasError={!!error}
          />
        );

      default:
        return fieldContainer(
          <Input
            id={field.id}
            type={field.type || 'text'}
            {...register(field.id, field.validation)}
            placeholder={field.placeholder}
            hasError={!!error}
          />
        );
    }
  };

  return (
    <div className={cn(getGridClasses(), className)}>
      {fields.map(renderField)}
    </div>
  );
}

// Form Actions (buttons)
interface FormActionsProps {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right' | 'between';
  className?: string;
}

export function FormActions({ 
  children, 
  align = 'right', 
  className 
}: FormActionsProps) {
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between'
  };

  return (
    <div className={cn(
      'flex items-center space-x-4 pt-6',
      alignClasses[align],
      className
    )}>
      {children}
    </div>
  );
}

// Form Container
interface FormContainerProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
}

export function FormContainer({ 
  title, 
  subtitle, 
  children, 
  onSubmit, 
  className 
}: FormContainerProps) {
  return (
    <Card padding="lg" className={cn('max-w-2xl mx-auto', className)}>
      {(title || subtitle) && (
        <div className="mb-8 text-center">
          {title && (
            <h2 className="font-display font-bold text-2xl text-white uppercase tracking-wide mb-2">
              {title}
            </h2>
          )}
          {subtitle && (
            <Text variant="secondary">
              {subtitle}
            </Text>
          )}
        </div>
      )}
      
      <form onSubmit={onSubmit} className="space-y-6">
        {children}
      </form>
    </Card>
  );
}
