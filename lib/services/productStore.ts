import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { Design } from '@/lib/types';

// Resolve data directory relative to this file to avoid issues when Next infers a different workspace root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '..', 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');

async function ensureDataFile() {
  try {
    await fs.access(PRODUCTS_FILE);
  } catch (err) {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      await fs.writeFile(PRODUCTS_FILE, '[]', 'utf-8');
    } catch (e) {
      console.error('Failed to create products data file', e);
      throw e;
    }
  }
}

export async function readProducts(): Promise<Design[]> {
  await ensureDataFile();
  const raw = await fs.readFile(PRODUCTS_FILE, 'utf-8');
  try {
    const parsed = JSON.parse(raw) as Design[];
    return parsed;
  } catch (err) {
    console.error('Failed to parse products.json', err);
    return [];
  }
}

export async function writeProducts(products: Design[]) {
  await ensureDataFile();
  await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
}

export async function addProduct(product: Design) {
  const products = await readProducts();
  products.unshift(product);
  await writeProducts(products);
  return product;
}

export async function clearProducts() {
  await writeProducts([]);
}
