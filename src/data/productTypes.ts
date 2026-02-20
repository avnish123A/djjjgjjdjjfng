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
    id: 'apparel',
    label: 'Apparel',
    suggestedAttributes: [
      { name: 'size', label: 'Size', type: 'radio', values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
      { name: 'color', label: 'Color', type: 'select', values: ['Black', 'White', 'Red', 'Blue', 'Green'] },
    ],
  },
  {
    id: 'footwear',
    label: 'Footwear',
    suggestedAttributes: [
      { name: 'shoe_size', label: 'Shoe Size', type: 'select', values: ['6', '7', '8', '9', '10', '11', '12'] },
      { name: 'color', label: 'Color', type: 'select', values: ['Black', 'White', 'Brown'] },
    ],
  },
  {
    id: 'weight_based',
    label: 'Weight Based',
    suggestedAttributes: [
      { name: 'weight', label: 'Weight', type: 'select', values: ['250g', '500g', '1kg', '2kg', '5kg'] },
    ],
  },
  {
    id: 'custom',
    label: 'Custom',
    suggestedAttributes: [],
  },
];

export const getProductType = (id: string) => PRODUCT_TYPES.find(t => t.id === id);
