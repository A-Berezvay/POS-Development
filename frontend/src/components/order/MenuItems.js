// menuItems.js

const menuItems = [
    // Starters
    { id: 1, name: 'Spelt Cavatelli', category: 'starters', price: 7, allergens: { contains: ['Gluten'], mayContain: ['Nuts'], removable: ['Cheese']}},
    { id: 2, name: 'Potato and Tarragon Veloute', category: 'starters', price: 6 },
    { id: 3, name: 'Smoked River Trout', category: 'starters', price: 8 },
    { id: 4, name: 'Roasted Pork Neck', category: 'starters', price: 10 },
    { id: 5, name: 'Soup of The Day', category: 'starters', price: 5 },
    { id: 6, name: 'Charred Leek, Onion Puree', category: 'starters', price: 9 },
  
    // Mains
    { id: 7, name: 'Roast Cornish Hake', category: 'mains', price: 15 },
    { id: 8, name: 'Fish & Chips', category: 'mains', price: 15 },
    { id: 9, name: 'Baked Megrim Sole', category: 'mains', price: 15 },
    { id: 10, name: 'Chew Valley Pork', category: 'mains', price: 15 },
    { id: 11, name: 'Potato Dumplings', category: 'mains', price: 15 },
    { id: 12, name: 'Beef Burger', category: 'mains', price: 15 },
    { id: 13, name: 'Steak Fillet', category: 'mains', price: 15, allergens: {contains: ['Mustard'], mayContain: ['Milk'], removable: ['Gluten']}},
    { id: 14, name: 'Club Sandwich', category: 'mains', price: 15 },
  
    // Sides 
    { id: 15, name: 'Triple Cooked Chips', category: 'sides', price: 4 },
    { id: 16, name: 'Skin On Fries', category: 'sides', price: 3.5 },
    { id: 17, name: 'Charred Hispi Cabbage', category: 'sides', price: 4.5 },
  
    // Desserts
    { id: 18, name: 'Sticky Toffee Pudding', category: 'desserts', price: 6.5 },
    { id: 19, name: 'Brown Butter Fraingipane', category: 'desserts', price: 7.5 },
    { id: 20, name: 'Dark Chocolate Mousse', category: 'desserts', price: 8 },
    { id: 21, name: 'Artisan Cheeses', category: 'desserts', price: 9.5 },
    { id: 22, name: 'Vanilla Ice Cream', category: 'desserts', price: 6 },
  
    // Wines: Red, White, Rose
    { id: 23, name: 'Sancerre Sauvignon Blanc', category: 'white', price: { '125ml': 6, '175ml': 8, '250ml': 10, 'bottle': 35 } },
    { id: 24, name: 'Catena Malbec', category: 'red', price: { '125ml': 7, '175ml': 9, '250ml': 12, 'bottle': 40 } },
    { id: 25, name: 'Whispering Angel', category: 'rose', price: { '125ml': 8, '175ml': 10, '250ml': 13, 'bottle': 45 } },
  ];
  
  export default menuItems;
  
