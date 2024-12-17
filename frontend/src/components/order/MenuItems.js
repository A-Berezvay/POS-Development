// menuItems.js

const menuItems = [
    // Starters
    { id: 1, name: 'Spelt Cavatelli', category: 'starters', price: 7, allergens: { contains: ['Gluten'], mayContain: ['Nuts'], removable: ['Cheese']}},
    { id: 2, name: 'Potato and Tarragon Veloute', category: 'starters', price: 6, allergens: {contains: ['Milk', 'Eggs', 'Soya'], mayContain: ['Nuts'], removable: ['Eggs']}},
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
  
    // Wines: Red, White, Rose, Sparkling
    { id: 23, name: 'Sancerre Sauvignon Blanc', category: 'white', price: { '125ml': 6, '175ml': 8, '250ml': 10, 'Bottle': 35, } },
    { id: 24, name: 'Catena Malbec', category: 'red', price: { '125ml': 7, '175ml': 9, '250ml': 12, 'Bottle': 40, } },
    { id: 25, name: 'Whispering Angel', category: 'rose', price: { '125ml': 8, '175ml': 10, '250ml': 13, 'Bottle': 45, } },
    { id: 26, name: 'Louis Pommery', category: 'sparkling', price: { '125ml': 15, 'Bottle': 80, } },

    // Beers
    { id: 27, name: 'Peroni', category: 'beers', price: {'0.5 Pint': 4.50, '1 Pint': 9, }},
    { id: 28, name: 'Meantime Pale Ale', category: 'beers', price: {'0.5 Pint': 4, '1 Pint': 8, }},
    { id: 29, name: 'London Pride', category: 'beers', price: {'0.5 Pint': 3.5, '1 Pint': 7, }},

    //Spirits
    { id: 30, name: 'Absolute', category: 'spirits', type: 'vodka', price: { '25ml': 4, '50ml': 8 }},
    { id: 31, name: 'Captain Morgan', category: 'spirits', type: 'rum', price: { '25ml': 4.5, '50ml': 9 }},
    { id: 32, name: 'Hendricks', category: 'spirits', type: 'gin', price: { '25ml': 4, '50ml': 8 }},
    { id: 33, name: 'Makers Mark', category: 'spirits', type: 'whiskey', price: { '25ml': 3.8, '50ml': 7.6 }},

    // Soft Drinks
    { id: 34, name: 'Coke', category: 'soft drinks', price: 4 },
    { id: 35, name: 'Diet Coke', category: 'soft drinks', price: 4 },
    { id: 36, name: 'Fanta', category: 'soft drinks', price: 4 },
    { id: 37, name: 'Sprite', category: 'soft drinks', price: 4 },
    { id: 38, name: 'Apple Juice', category: 'soft drinks', price: 4 },
    { id: 39, name: 'Orange Juice', category: 'soft drinks', price: 4 },
    { id: 40, name: 'Pineapple Juice', category: 'soft drinks', price: 4 },
    { id: 41, name: 'Cranberry Juice', category: 'soft drinks', price: 4 },

    // Hot Drinks - Coffees
    { id: 42, name: 'Single Espresso', category: 'hot drinks', type: 'coffees', price: 2.5 },
    { id: 43, name: 'Double Espresso', category: 'hot drinks', type: 'coffees', price: 3.5 },
    { id: 44, name: 'Americano', category: 'hot drinks', type: 'coffees', price: 3.5 },
    { id: 45, name: 'Latte', category: 'hot drinks', type: 'coffees', price: 4 },
    { id: 46, name: 'Cappuccino', category: 'hot drinks', type: 'coffees', price: 4 },
    { id: 47, name: 'Flat White', category: 'hot drinks', type: 'coffees', price: 4 },

    // Hot Drinks - Teas
    { id: 48, name: 'English Breakfast', category: 'hot drinks', type: 'teas', price: 4 },
    { id: 49, name: 'Decaf English Breakfast', category: 'hot drinks', type: 'teas', price: 4 },
    { id: 50, name: 'Chamomile', category: 'hot drinks', type: 'teas', price: 4 },
    { id: 51, name: 'Green', category: 'hot drinks', type: 'teas', price: 4 },
    { id: 52, name: 'Peppermint', category: 'hot drinks', type: 'teas', price: 4 },
    { id: 53, name: 'Earl Grey', category: 'hot drinks', type: 'teas', price: 4 },
    { id: 54, name: 'Lemon & Ginger', category: 'hot drinks', type: 'teas', price: 4 },

];
  
  export default menuItems;
  
