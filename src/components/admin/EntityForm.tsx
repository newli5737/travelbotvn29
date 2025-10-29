'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodSchema } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Loader2 } from 'lucide-react';

interface FormField {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'number' | 'textarea' | 'select';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
}

interface EntityFormProps {
  title: string;
  fields: FormField[];
  defaultValues?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  onCancel?: () => void;
  schema: ZodSchema;
}

export const EntityForm: React.FC<EntityFormProps> = ({
  title,
  fields,
  defaultValues,
  onSubmit,
  isLoading = false,
  error = null,
  onCancel,
  schema,
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </Label>

              {field.type === 'textarea' ? (
                <textarea
                  id={field.name}
                  placeholder={field.placeholder}
                  disabled={isLoading}
                  className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  {...register(field.name)}
                />
              ) : field.type === 'select' ? (
                <select
                  id={field.name}
                  disabled={isLoading}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  {...register(field.name)}
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  id={field.name}
                  type={field.type || 'text'}
                  placeholder={field.placeholder}
                  disabled={isLoading}
                  {...register(field.name)}
                />
              )}

              {errors[field.name] && (
                <p className="text-sm text-destructive">
                  {errors[field.name]?.message as string}
                </p>
              )}
            </div>
          ))}

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="bg-ocean-blue hover:bg-ocean-dark flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
