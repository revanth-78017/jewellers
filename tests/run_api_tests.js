// Simple API tests for products
(async () => {
  const base = 'http://localhost:3000';
  const headers = { 'Content-Type': 'application/json' };

  console.log('1) Test: POST with missing fields (expect 400)');
  try {
    const res = await fetch(`${base}/api/products`, {
      method: 'POST',
      headers,
      body: JSON.stringify({}),
    });
    const body = await res.text();
    console.log('Status:', res.status);
    console.log('Body:', body);
  } catch (err) {
    console.error('Error calling POST /api/products', err);
  }

  console.log('\n2) Test: POST valid product (expect 201)');
  let createdId = null;
  try {
    const payload = {
      name: 'Test Ring from API',
      type: 'ring',
      material: 'gold',
      gemstone: 'none',
      price: 199.99,
      imageUrl: 'https://images.unsplash.com/photo-1519741499649-84b6b6d0b6d6?w=1200',
    };
    const res = await fetch(`${base}/api/products`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    console.log('Status:', res.status);
    console.log('Body:', JSON.stringify(json, null, 2));
    if (json?.success && json.data?.product) {
      createdId = json.data.product.id;
      console.log('Created product id:', createdId);
    }
  } catch (err) {
    console.error('Error creating product', err);
  }

  console.log('\n3) Test: GET /api/products (expect to include created product)');
  try {
    const res = await fetch(`${base}/api/products`);
    const json = await res.json();
    console.log('Status:', res.status);
    console.log('Count:', Array.isArray(json.data?.products) ? json.data.products.length : 'unknown');
    if (createdId) {
      const found = (json.data.products || []).find((p) => p.id === createdId);
      console.log('Product present in list?', !!found);
    }
  } catch (err) {
    console.error('Error fetching products', err);
  }

  if (createdId) {
    console.log(`\n4) Test: GET product page /products/${createdId} (expect 200 HTML)`);
    try {
      const res = await fetch(`${base}/products/${createdId}`);
      console.log('Status:', res.status);
      const txt = await res.text();
      console.log('Page length:', txt.length);
    } catch (err) {
      console.error('Error fetching product page', err);
    }
  }

  console.log('\nAPI tests complete.');
})();
