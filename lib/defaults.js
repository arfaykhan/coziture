export const defaults = {
  brand: 'Coziture', announcement: 'Thoughtful finds. Beautiful living.',
  hero_eyebrow: 'A LITTLE INSPIRATION FOR YOUR EVERYDAY', hero_title: 'Find your next favorite thing.',
  hero_text: 'Beautiful pieces. Comfortable spaces. Discover a collection made for the way you live.',
  hero_button: 'Explore collection', hero_image: '/shop/hero.webp', featured_title: 'Featured finds', new_title: 'Fresh arrivals',
  about_title: 'Good things make a home.', about_text: 'We bring together thoughtfully chosen furniture, beautiful details, and everyday essentials. Our collection is made for spaces that feel personal, comfortable, and entirely your own.',
  footer_text: 'Considered pieces for a life well lived. Find something that feels like you.',
  support_email: '', support_phone: '', store_address: '', currency: 'USD', shipping_cents: '800', free_shipping_cents: '10000',
  shipping_text: 'Standard shipping is calculated in your bag. Contact the store for delivery availability and timing.',
  returns_text: 'Please contact the store before arranging a return. The store owner will confirm eligibility and return instructions.',
  privacy_text: 'We use the account and delivery details you provide to process your orders. Contact the store with questions about your personal information.'
};
export const categories = ['Living', 'Decor', 'Everyday', 'Lighting'].map((name, i) => ({id:i+1, name, icon:'box', sort_order:i}));
export const products = [
  ['Everyday Lounge Chair','A sculptural lounge chair with a natural wood frame and soft, textured upholstery.','Living',24900,'chair',12,true],
  ['Stoneware Ceramic Vase','Organic curves and a softly textured finish. Beautiful with a few stems or on its own.','Decor',3800,'vase',24,true],
  ['Everyday Canvas Tote','A roomy cotton canvas tote for market mornings and everyday errands.','Everyday',2800,'tote',35,true],
  ['The Reading Light','A warm, focused glow and a timeless silhouette for your evening ritual.','Lighting',8900,'lamp',16,true],
  ['Soft Woven Throw','An extra layer of comfort in a warm neutral palette.','Living',6400,'throw',20,false],
  ['Morning Ceramic Cup','A tactile ceramic cup with a comfortable handle and understated shape.','Everyday',2200,'cup',40,false],
  ['Oak Accent Table','Simple lines, a natural finish, and just the right footprint.','Living',12900,'table',9,false],
  ['Blue Abstract Print','Soft blue shapes and a natural oak frame. Frame included.','Decor',4500,'print',18,false]
].map(([name,description,category,price_cents,image,stock,featured],i)=>({id:i+1,name,description,category,price_cents,image:`/shop/${image}.webp`,stock,featured,active:true}));
