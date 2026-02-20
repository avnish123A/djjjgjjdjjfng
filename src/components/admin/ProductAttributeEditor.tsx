import React, { useState } from 'react';
import { Plus, X, GripVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface AttributeFormData {
  id?: string;
  attribute_name: string;
  attribute_label: string;
  attribute_type: string;
  is_required: boolean;
  sort_order: number;
  values: AttributeValueFormData[];
}

export interface AttributeValueFormData {
  id?: string;
  value: string;
  price_modifier: number;
  stock_quantity: number;
  sku: string;
  is_active: boolean;
  sort_order: number;
}

interface Props {
  attributes: AttributeFormData[];
  onChange: (attrs: AttributeFormData[]) => void;
}

const ATTRIBUTE_TYPES = [
  { value: 'select', label: 'Dropdown' },
  { value: 'radio', label: 'Radio Buttons' },
  { value: 'text', label: 'Text Input' },
];

const ProductAttributeEditor: React.FC<Props> = ({ attributes, onChange }) => {
  const [newAttrName, setNewAttrName] = useState('');

  const addAttribute = () => {
    const name = newAttrName.trim();
    if (!name) return;
    onChange([
      ...attributes,
      {
        attribute_name: name.toLowerCase().replace(/\s+/g, '_'),
        attribute_label: name,
        attribute_type: 'select',
        is_required: true,
        sort_order: attributes.length,
        values: [],
      },
    ]);
    setNewAttrName('');
  };

  const removeAttribute = (index: number) => {
    onChange(attributes.filter((_, i) => i !== index));
  };

  const updateAttribute = (index: number, field: string, value: any) => {
    const updated = [...attributes];
    (updated[index] as any)[field] = value;
    onChange(updated);
  };

  const addValue = (attrIndex: number) => {
    const updated = [...attributes];
    updated[attrIndex].values.push({
      value: '',
      price_modifier: 0,
      stock_quantity: 0,
      sku: '',
      is_active: true,
      sort_order: updated[attrIndex].values.length,
    });
    onChange(updated);
  };

  const removeValue = (attrIndex: number, valIndex: number) => {
    const updated = [...attributes];
    updated[attrIndex].values = updated[attrIndex].values.filter((_, i) => i !== valIndex);
    onChange(updated);
  };

  const updateValue = (attrIndex: number, valIndex: number, field: string, value: any) => {
    const updated = [...attributes];
    (updated[attrIndex].values[valIndex] as any)[field] = value;
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {attributes.map((attr, ai) => (
        <div key={ai} className="border border-border rounded-xl p-4 space-y-3 bg-secondary/30">
          <div className="flex items-center gap-3">
            <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Input
                value={attr.attribute_label}
                onChange={(e) => {
                  updateAttribute(ai, 'attribute_label', e.target.value);
                  updateAttribute(ai, 'attribute_name', e.target.value.toLowerCase().replace(/\s+/g, '_'));
                }}
                placeholder="Attribute name"
                className="text-sm"
              />
              <select
                value={attr.attribute_type}
                onChange={(e) => updateAttribute(ai, 'attribute_type', e.target.value)}
                className="h-10 px-3 border border-input rounded-md bg-background text-sm"
              >
                {ATTRIBUTE_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={attr.is_required}
                    onChange={(e) => updateAttribute(ai, 'is_required', e.target.checked)}
                    className="accent-accent w-3.5 h-3.5"
                  />
                  Required
                </label>
                <button onClick={() => removeAttribute(ai)} className="ml-auto p-1.5 text-destructive hover:bg-destructive/10 rounded-lg">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Values */}
          {attr.attribute_type !== 'text' && (
            <div className="ml-7 space-y-2">
              <Label className="text-xs text-muted-foreground">Values</Label>
              {attr.values.map((val, vi) => (
                <div key={vi} className="grid grid-cols-2 sm:grid-cols-5 gap-2 items-center">
                  <Input
                    value={val.value}
                    onChange={(e) => updateValue(ai, vi, 'value', e.target.value)}
                    placeholder="Value (e.g. S, M, L)"
                    className="text-sm"
                  />
                  <Input
                    type="number"
                    value={val.price_modifier || ''}
                    onChange={(e) => updateValue(ai, vi, 'price_modifier', parseFloat(e.target.value) || 0)}
                    placeholder="Price +/-"
                    className="text-sm"
                  />
                  <Input
                    type="number"
                    value={val.stock_quantity || ''}
                    onChange={(e) => updateValue(ai, vi, 'stock_quantity', parseInt(e.target.value) || 0)}
                    placeholder="Stock"
                    className="text-sm"
                  />
                  <Input
                    value={val.sku}
                    onChange={(e) => updateValue(ai, vi, 'sku', e.target.value)}
                    placeholder="SKU (optional)"
                    className="text-sm"
                  />
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={val.is_active}
                        onChange={(e) => updateValue(ai, vi, 'is_active', e.target.checked)}
                        className="accent-accent w-3 h-3"
                      />
                      Active
                    </label>
                    <button onClick={() => removeValue(ai, vi)} className="p-1 text-destructive hover:bg-destructive/10 rounded">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => addValue(ai)} className="text-xs gap-1">
                <Plus className="h-3 w-3" /> Add Value
              </Button>
            </div>
          )}
        </div>
      ))}

      {/* Add new attribute */}
      <div className="flex gap-2">
        <Input
          value={newAttrName}
          onChange={(e) => setNewAttrName(e.target.value)}
          placeholder="New attribute name (e.g. Weight, Shoe Size)"
          className="text-sm"
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAttribute())}
        />
        <Button type="button" variant="outline" onClick={addAttribute} className="gap-1 shrink-0">
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>
    </div>
  );
};

export default ProductAttributeEditor;
