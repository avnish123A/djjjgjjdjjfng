export interface ProductTypeConfig {
  id: string;
  label: string;
  suggestedAttributes: { name: string; label: string; type: string; values?: string[] }[];
}

export const PRODUCT_TYPES: ProductTypeConfig[] = [
  {
    id: 'standard',
    label: 'Standard Product',
    suggestedAttributes: [],
  },
  {
    id: 'electronics',
    label: 'Electronics',
    suggestedAttributes: [
      { name: 'storage', label: 'Storage', type: 'select', values: ['64GB', '128GB', '256GB', '512GB', '1TB'] },
      { name: 'color', label: 'Color', type: 'select', values: ['Black', 'White', 'Silver', 'Blue', 'Gold'] },
      { name: 'ram', label: 'RAM', type: 'select', values: ['4GB', '8GB', '16GB', '32GB', '64GB'] },
    ],
  },
  {
    id: 'apparel',
    label: 'Apparel',
    suggestedAttributes: [
      { name: 'size', label: 'Size', type: 'radio', values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
      { name: 'color', label: 'Color', type: 'select', values: ['Black', 'White', 'Red', 'Blue', 'Green'] },
    ],
  },
  {
    id: 'custom',
    label: 'Custom',
    suggestedAttributes: [],
  },
];

export const getProductType = (id: string) => PRODUCT_TYPES.find(t => t.id === id);
