export const money = (cents, currency = 'USD') => new Intl.NumberFormat('en-US', {style:'currency',currency}).format(cents / 100);
export const transitions = {pending:['pending','processing','cancelled'],processing:['processing','shipped','cancelled'],shipped:['shipped','completed'],completed:['completed'],cancelled:['cancelled']};
export function shipping(subtotal, settings) { return !subtotal || subtotal >= Number(settings.free_shipping_cents) ? 0 : Number(settings.shipping_cents); }
