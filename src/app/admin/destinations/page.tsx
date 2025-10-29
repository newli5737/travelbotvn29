'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { DataTable, ColumnDef } from '@/components/admin/DataTable';
import { EntityForm } from '@/components/admin/EntityForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAdminCRUD } from '@/hooks/useAdminCRUD';
import { Destination } from '@/types';
import { z } from 'zod';

const destinationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  province: z.string().min(2, 'Province is required'),
  region: z.string().min(2, 'Region is required'),
  rating: z.coerce.number().min(0).max(5, 'Rating must be between 0 and 5'),
  best_time_to_visit: z.string().min(2, 'Best time to visit is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  image_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type DestinationFormData = z.infer<typeof destinationSchema>;

const columns: ColumnDef<Destination>[] = [
  { key: 'name', label: 'Name' },
  { key: 'province', label: 'Province' },
  { key: 'region', label: 'Region' },
  {
    key: 'rating',
    label: 'Rating',
    render: (value) => `${value}/5`,
  },
  { key: 'best_time_to_visit', label: 'Best Time' },
];

export default function DestinationsPage() {
  const { data, isLoading, error, fetchData, createItem, updateItem, deleteItem } =
    useAdminCRUD<Destination>({ endpoint: 'destinations' });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Destination | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAdd = () => {
    setEditingItem(null);
    setSubmitError(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (item: Destination) => {
    setEditingItem(item);
    setSubmitError(null);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this destination?')) return;
    setDeletingId(id);
    const success = await deleteItem(id);
    if (!success) {
      setSubmitError('Failed to delete destination');
    }
    setDeletingId(null);
  };

  const handleSubmit = async (formData: DestinationFormData) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      if (editingItem) {
        await updateItem(editingItem.id, formData);
      } else {
        await createItem(formData);
      }

      setIsDialogOpen(false);
      setEditingItem(null);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formFields = [
    {
      name: 'name',
      label: 'Destination Name',
      placeholder: 'e.g., Paris, Tokyo',
      required: true,
    },
    {
      name: 'province',
      label: 'Province',
      placeholder: 'e.g., Île-de-France',
      required: true,
    },
    {
      name: 'region',
      label: 'Region',
      placeholder: 'e.g., Europe, Asia',
      required: true,
    },
    {
      name: 'rating',
      label: 'Rating (0-5)',
      type: 'number' as const,
      placeholder: '4.5',
      required: true,
    },
    {
      name: 'best_time_to_visit',
      label: 'Best Time to Visit',
      placeholder: 'e.g., April to May',
      required: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea' as const,
      placeholder: 'Describe this destination...',
      required: true,
    },
    {
      name: 'image_url',
      label: 'Image URL',
      placeholder: 'https://...',
      required: false,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Manage Destinations
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create, read, update, and delete travel destinations
          </p>
        </div>

        <DataTable
          title="Destinations"
          columns={columns}
          data={data}
          isLoading={isLoading}
          error={error}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isDeleting={deletingId}
        />
      </div>

      {/* Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit Destination' : 'Add New Destination'}
            </DialogTitle>
          </DialogHeader>

          <EntityForm
            title=""
            fields={formFields}
            defaultValues={editingItem || undefined}
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
            error={submitError}
            onCancel={() => setIsDialogOpen(false)}
            schema={destinationSchema}
          />
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
