import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/format';
import type { ProductAttribute } from '@/hooks/useProductAttributes';

interface Props {
  attributes: ProductAttribute[];
  basePrice: number;
  onSelectionChange: (selections: Record<string, string>, priceModifier: number) => void;
}

const DynamicProductOptions: React.FC<Props> = ({ attributes, basePrice, onSelectionChange }) => {
  const [selections, setSelections] = useState<Record<string, string>>({});

  const handleSelect = (attrName: string, value: string) => {
    const updated = { ...selections, [attrName]: value };
    setSelections(updated);

    // Calculate total price modifier
    let totalModifier = 0;
    for (const attr of attributes) {
      const selectedVal = updated[attr.attribute_name];
      if (selectedVal) {
        const valObj = attr.values.find(v => v.value === selectedVal);
        if (valObj) totalModifier += Number(valObj.price_modifier) || 0;
      }
    }
    onSelectionChange(updated, totalModifier);
  };

  const getValueStock = (attr: ProductAttribute, value: string) => {
    const v = attr.values.find(val => val.value === value);
    return v ? { stock: v.stock_quantity, active: v.is_active, modifier: Number(v.price_modifier) || 0 } : null;
  };

  return (
    <div className="space-y-5">
      {attributes.map(attr => (
        <div key={attr.id}>
          <p className="text-sm font-semibold mb-3">
            {attr.attribute_label}: {selections[attr.attribute_name] ? (
              <span className="text-primary font-normal">{selections[attr.attribute_name]}</span>
            ) : (
              <span className="text-muted-foreground font-normal">Select</span>
            )}
            {attr.is_required && <span className="text-destructive ml-1">*</span>}
          </p>

          {attr.attribute_type === 'radio' || attr.attribute_type === 'select' ? (
            <div className="flex gap-2 flex-wrap">
              {attr.values.filter(v => v.is_active).map(val => {
                const info = getValueStock(attr, val.value);
                const isOutOfStock = info && info.stock <= 0;
                const isSelected = selections[attr.attribute_name] === val.value;
                const modifier = info?.modifier || 0;

                return (
                  <button
                    key={val.id}
                    type="button"
                    onClick={() => !isOutOfStock && handleSelect(attr.attribute_name, val.value)}
                    disabled={!!isOutOfStock}
                    className={cn(
                      'min-w-[56px] px-4 py-2.5 border rounded-xl text-sm font-medium transition-all relative',
                      isSelected
                        ? 'border-foreground bg-foreground text-background'
                        : isOutOfStock
                          ? 'border-border bg-muted text-muted-foreground cursor-not-allowed line-through opacity-50'
                          : 'border-border hover:border-foreground'
                    )}
                  >
                    {val.value}
                    {modifier !== 0 && !isOutOfStock && (
                      <span className="block text-[10px] font-normal opacity-75">
                        {modifier > 0 ? '+' : ''}{formatPrice(modifier)}
                      </span>
                    )}
                    {isOutOfStock && (
                      <span className="block text-[9px] font-normal">Sold out</span>
                    )}
                  </button>
                );
              })}
            </div>
          ) : attr.attribute_type === 'text' ? (
            <input
              type="text"
              value={selections[attr.attribute_name] || ''}
              onChange={(e) => handleSelect(attr.attribute_name, e.target.value)}
              placeholder={`Enter ${attr.attribute_label.toLowerCase()}`}
              className="flex h-10 w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          ) : (
            <select
              value={selections[attr.attribute_name] || ''}
              onChange={(e) => handleSelect(attr.attribute_name, e.target.value)}
              className="h-10 px-3 border border-input rounded-md bg-background text-sm min-w-[160px]"
            >
              <option value="">Select {attr.attribute_label}</option>
              {attr.values.filter(v => v.is_active).map(val => {
                const info = getValueStock(attr, val.value);
                const isOutOfStock = info && info.stock <= 0;
                return (
                  <option key={val.id} value={val.value} disabled={!!isOutOfStock}>
                    {val.value}{isOutOfStock ? ' (Sold out)' : ''}{(info?.modifier || 0) !== 0 ? ` (+${formatPrice(info!.modifier)})` : ''}
                  </option>
                );
              })}
            </select>
          )}

          {/* Low stock indicator for selected value */}
          {selections[attr.attribute_name] && (() => {
            const info = getValueStock(attr, selections[attr.attribute_name]);
            if (info && info.stock > 0 && info.stock <= 5) {
              return <p className="text-xs text-amber-600 mt-1.5">Only {info.stock} left!</p>;
            }
            return null;
          })()}
        </div>
      ))}
    </div>
  );
};

export default DynamicProductOptions;
