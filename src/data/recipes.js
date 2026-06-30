export const CUISINES = ['Italian', 'Asian', 'Mexican', 'Mediterranean', 'American'];

const CATEGORY_MAP = {
  // Protein
  'chicken breast': 'Protein', 'chicken thighs': 'Protein', 'ground beef': 'Protein',
  'beef chuck': 'Protein', 'pork shoulder': 'Protein', 'pork belly': 'Protein',
  'ground lamb': 'Protein', 'salmon': 'Protein', 'shrimp': 'Protein', 'eggs': 'Protein',
  // Produce
  'tomatoes': 'Produce', 'cherry tomatoes': 'Produce', 'onion': 'Produce', 'garlic': 'Produce',
  'bell pepper': 'Produce', 'broccoli': 'Produce', 'zucchini': 'Produce', 'cucumber': 'Produce',
  'spinach': 'Produce', 'carrots': 'Produce', 'celery': 'Produce', 'potatoes': 'Produce',
  'avocado': 'Produce', 'lime': 'Produce', 'lemon': 'Produce', 'orange': 'Produce',
  'cilantro': 'Produce', 'parsley': 'Produce', 'dill': 'Produce', 'green onion': 'Produce',
  'thai basil': 'Produce', 'bamboo shoots': 'Produce', 'jalapeño': 'Produce', 'mushrooms': 'Produce',
  'corn': 'Produce', 'green beans': 'Produce', 'peas': 'Produce', 'ginger': 'Produce',
  // Pantry
  'spaghetti': 'Pantry', 'pasta': 'Pantry', 'elbow pasta': 'Pantry', 'lasagna noodles': 'Pantry',
  'arborio rice': 'Pantry', 'rice': 'Pantry', 'ramen noodles': 'Pantry', 'tortillas': 'Pantry',
  'pita bread': 'Pantry', 'olive oil': 'Pantry', 'soy sauce': 'Pantry', 'sesame oil': 'Pantry',
  'coconut milk': 'Pantry', 'canned tomatoes': 'Pantry', 'tomato paste': 'Pantry',
  'chicken broth': 'Pantry', 'beef broth': 'Pantry', 'flour': 'Pantry', 'breadcrumbs': 'Pantry',
  'cumin': 'Pantry', 'chili powder': 'Pantry', 'paprika': 'Pantry', 'oregano': 'Pantry',
  'black beans': 'Pantry', 'kidney beans': 'Pantry', 'chickpeas': 'Pantry', 'red lentils': 'Pantry',
  'bbq sauce': 'Pantry', 'enchilada sauce': 'Pantry', 'salsa': 'Pantry', 'honey': 'Pantry',
  'brown sugar': 'Pantry', 'apple cider vinegar': 'Pantry', 'worcestershire sauce': 'Pantry',
  'fish sauce': 'Pantry', 'tahini': 'Pantry', 'green curry paste': 'Pantry', 'miso paste': 'Pantry',
  'gochujang': 'Pantry', 'red wine': 'Pantry', 'white wine': 'Pantry', 'olives': 'Pantry',
  'capers': 'Pantry', 'cornstarch': 'Pantry', 'mirin': 'Pantry', 'sesame seeds': 'Pantry',
  'cinnamon': 'Pantry', 'nori': 'Pantry', 'ketchup': 'Pantry', 'mustard powder': 'Pantry',
  'marinara sauce': 'Pantry', 'orange juice': 'Pantry',
  // Other (dairy & specialty)
  'parmesan': 'Other', 'mozzarella': 'Other', 'ricotta': 'Other', 'feta': 'Other',
  'cheddar': 'Other', 'sour cream': 'Other', 'yogurt': 'Other', 'butter': 'Other',
  'milk': 'Other', 'pie crust': 'Other',
};

export function categorizeIngredient(ingredient) {
  const lower = ingredient.toLowerCase();
  if (CATEGORY_MAP[lower]) return CATEGORY_MAP[lower];
  for (const [key, cat] of Object.entries(CATEGORY_MAP)) {
    if (lower.includes(key) || key.includes(lower)) return cat;
  }
  return 'Pantry';
}

// diets: tags that apply to a recipe.
//   'vegetarian'  — no meat or fish
//   'vegan'       — no animal products at all
//   'pescatarian' — fish/seafood OK, no meat
//   'gluten-free' — no gluten-containing ingredients
//
// Filtering logic (in planGenerator):
//   vegetarian  → include 'vegetarian' | 'vegan'
//   vegan       → include 'vegan'
//   pescatarian → include 'pescatarian' | 'vegetarian' | 'vegan'
//   gluten-free → include 'gluten-free'

export const ALL_RECIPES = [
  // ── Italian ──────────────────────────────────────────────────────────────
  { id: 'it1', name: 'Spaghetti Bolognese', cuisine: 'Italian', isBatchCooking: true,
    diets: [],
    ingredients: ['ground beef', 'spaghetti', 'canned tomatoes', 'onion', 'garlic', 'olive oil', 'parmesan', 'tomato paste', 'red wine', 'carrots', 'celery'] },

  { id: 'it2', name: 'Chicken Parmesan', cuisine: 'Italian', isBatchCooking: false,
    diets: [],
    ingredients: ['chicken breast', 'breadcrumbs', 'marinara sauce', 'mozzarella', 'parmesan', 'olive oil', 'eggs'] },

  { id: 'it3', name: 'Lasagna', cuisine: 'Italian', isBatchCooking: true,
    diets: [],
    ingredients: ['ground beef', 'lasagna noodles', 'ricotta', 'mozzarella', 'canned tomatoes', 'onion', 'garlic', 'olive oil', 'parmesan'] },

  { id: 'it4', name: 'Mushroom Risotto', cuisine: 'Italian', isBatchCooking: false,
    diets: ['vegetarian', 'gluten-free'],
    ingredients: ['arborio rice', 'mushrooms', 'parmesan', 'onion', 'garlic', 'white wine', 'butter', 'chicken broth'] },

  { id: 'it5', name: 'Pasta Primavera', cuisine: 'Italian', isBatchCooking: false,
    diets: ['vegetarian'],
    ingredients: ['pasta', 'zucchini', 'bell pepper', 'cherry tomatoes', 'olive oil', 'garlic', 'parmesan'] },

  { id: 'it6', name: 'Chicken Cacciatore', cuisine: 'Italian', isBatchCooking: true,
    diets: ['gluten-free'],
    ingredients: ['chicken thighs', 'canned tomatoes', 'bell pepper', 'onion', 'garlic', 'olive oil', 'olives', 'capers', 'oregano'] },

  { id: 'it7', name: 'Shrimp Scampi', cuisine: 'Italian', isBatchCooking: false,
    diets: ['pescatarian'],
    ingredients: ['shrimp', 'pasta', 'garlic', 'white wine', 'butter', 'lemon', 'parsley', 'olive oil'] },

  // ── Asian ─────────────────────────────────────────────────────────────────
  { id: 'as1', name: 'Chicken Stir Fry', cuisine: 'Asian', isBatchCooking: false,
    diets: [],
    ingredients: ['chicken breast', 'broccoli', 'bell pepper', 'soy sauce', 'ginger', 'garlic', 'sesame oil', 'rice', 'cornstarch'] },

  { id: 'as2', name: 'Beef Fried Rice', cuisine: 'Asian', isBatchCooking: false,
    diets: [],
    ingredients: ['ground beef', 'rice', 'eggs', 'peas', 'carrots', 'soy sauce', 'sesame oil', 'green onion'] },

  { id: 'as3', name: 'Thai Green Curry', cuisine: 'Asian', isBatchCooking: true,
    diets: ['gluten-free'],
    ingredients: ['chicken thighs', 'coconut milk', 'green curry paste', 'bamboo shoots', 'thai basil', 'fish sauce', 'rice'] },

  { id: 'as4', name: 'Teriyaki Salmon', cuisine: 'Asian', isBatchCooking: false,
    diets: ['pescatarian'],
    ingredients: ['salmon', 'soy sauce', 'honey', 'mirin', 'ginger', 'sesame seeds', 'rice', 'green onion'] },

  { id: 'as5', name: 'Tonkotsu Ramen', cuisine: 'Asian', isBatchCooking: true,
    diets: [],
    ingredients: ['pork belly', 'ramen noodles', 'soy sauce', 'miso paste', 'eggs', 'green onion', 'nori', 'sesame oil', 'chicken broth'] },

  { id: 'as6', name: 'Korean Bibimbap', cuisine: 'Asian', isBatchCooking: false,
    diets: [],
    ingredients: ['ground beef', 'rice', 'spinach', 'carrots', 'cucumber', 'gochujang', 'sesame oil', 'eggs', 'soy sauce'] },

  { id: 'as7', name: 'Miso-Glazed Salmon', cuisine: 'Asian', isBatchCooking: false,
    diets: ['pescatarian'],
    ingredients: ['salmon', 'miso paste', 'mirin', 'soy sauce', 'honey', 'ginger', 'green onion', 'rice'] },

  // ── Mexican ───────────────────────────────────────────────────────────────
  { id: 'mx1', name: 'Chicken Tacos', cuisine: 'Mexican', isBatchCooking: false,
    diets: ['gluten-free'],
    ingredients: ['chicken breast', 'tortillas', 'salsa', 'avocado', 'lime', 'cilantro', 'onion', 'cumin', 'chili powder'] },

  { id: 'mx2', name: 'Beef Enchiladas', cuisine: 'Mexican', isBatchCooking: true,
    diets: [],
    ingredients: ['ground beef', 'tortillas', 'enchilada sauce', 'cheddar', 'onion', 'sour cream', 'garlic'] },

  { id: 'mx3', name: 'Black Bean Soup', cuisine: 'Mexican', isBatchCooking: true,
    diets: ['vegan', 'gluten-free'],
    ingredients: ['black beans', 'chicken broth', 'onion', 'garlic', 'cumin', 'lime', 'cilantro', 'jalapeño'] },

  { id: 'mx4', name: 'Pork Carnitas', cuisine: 'Mexican', isBatchCooking: true,
    diets: ['gluten-free'],
    ingredients: ['pork shoulder', 'orange juice', 'garlic', 'cumin', 'oregano', 'tortillas', 'cilantro', 'lime', 'onion'] },

  { id: 'mx5', name: 'Chicken Burrito Bowl', cuisine: 'Mexican', isBatchCooking: false,
    diets: ['gluten-free'],
    ingredients: ['chicken breast', 'rice', 'black beans', 'salsa', 'cheddar', 'sour cream', 'avocado', 'cilantro'] },

  { id: 'mx6', name: 'Shrimp Fajitas', cuisine: 'Mexican', isBatchCooking: false,
    diets: ['pescatarian', 'gluten-free'],
    ingredients: ['shrimp', 'bell pepper', 'onion', 'tortillas', 'lime', 'cumin', 'chili powder', 'garlic'] },

  { id: 'mx7', name: 'Chicken Tortilla Soup', cuisine: 'Mexican', isBatchCooking: true,
    diets: ['gluten-free'],
    ingredients: ['chicken thighs', 'chicken broth', 'canned tomatoes', 'black beans', 'corn', 'jalapeño', 'cumin', 'chili powder', 'cilantro', 'tortillas'] },

  // ── Mediterranean ─────────────────────────────────────────────────────────
  { id: 'me1', name: 'Greek Chicken Salad', cuisine: 'Mediterranean', isBatchCooking: false,
    diets: ['gluten-free'],
    ingredients: ['chicken breast', 'cucumber', 'tomatoes', 'olives', 'feta', 'olive oil', 'lemon', 'oregano'] },

  { id: 'me2', name: 'Lamb Kofta', cuisine: 'Mediterranean', isBatchCooking: false,
    diets: [],
    ingredients: ['ground lamb', 'onion', 'parsley', 'cumin', 'cinnamon', 'paprika', 'pita bread', 'yogurt', 'garlic'] },

  { id: 'me3', name: 'Shakshuka', cuisine: 'Mediterranean', isBatchCooking: false,
    diets: ['vegetarian', 'gluten-free'],
    ingredients: ['eggs', 'canned tomatoes', 'bell pepper', 'onion', 'garlic', 'cumin', 'paprika', 'feta', 'olive oil'] },

  { id: 'me4', name: 'Falafel Bowl', cuisine: 'Mediterranean', isBatchCooking: false,
    diets: ['vegan'],
    ingredients: ['chickpeas', 'tahini', 'lemon', 'garlic', 'pita bread', 'cucumber', 'tomatoes', 'parsley', 'cumin'] },

  { id: 'me5', name: 'Lemon Herb Salmon', cuisine: 'Mediterranean', isBatchCooking: false,
    diets: ['pescatarian', 'gluten-free'],
    ingredients: ['salmon', 'lemon', 'dill', 'garlic', 'olive oil', 'capers', 'green beans'] },

  { id: 'me6', name: 'Turkish Red Lentil Stew', cuisine: 'Mediterranean', isBatchCooking: true,
    diets: ['vegan', 'gluten-free'],
    ingredients: ['red lentils', 'canned tomatoes', 'onion', 'garlic', 'cumin', 'paprika', 'lemon', 'olive oil', 'chicken broth'] },

  { id: 'me7', name: 'Chicken Shawarma', cuisine: 'Mediterranean', isBatchCooking: true,
    diets: [],
    ingredients: ['chicken thighs', 'yogurt', 'garlic', 'lemon', 'cumin', 'paprika', 'cinnamon', 'olive oil', 'pita bread', 'cucumber', 'tomatoes'] },

  // ── American ──────────────────────────────────────────────────────────────
  { id: 'am1', name: 'Classic Beef Chili', cuisine: 'American', isBatchCooking: true,
    diets: ['gluten-free'],
    ingredients: ['ground beef', 'kidney beans', 'canned tomatoes', 'onion', 'garlic', 'chili powder', 'cumin', 'bell pepper'] },

  { id: 'am2', name: 'BBQ Pulled Pork', cuisine: 'American', isBatchCooking: true,
    diets: [],
    ingredients: ['pork shoulder', 'bbq sauce', 'onion', 'garlic', 'brown sugar', 'apple cider vinegar'] },

  { id: 'am3', name: 'Chicken Pot Pie', cuisine: 'American', isBatchCooking: true,
    diets: [],
    ingredients: ['chicken breast', 'peas', 'carrots', 'celery', 'onion', 'flour', 'butter', 'chicken broth', 'pie crust', 'milk'] },

  { id: 'am4', name: 'Beef Stew', cuisine: 'American', isBatchCooking: true,
    diets: ['gluten-free'],
    ingredients: ['beef chuck', 'potatoes', 'carrots', 'onion', 'garlic', 'beef broth', 'tomato paste', 'celery'] },

  { id: 'am5', name: 'Baked Mac and Cheese', cuisine: 'American', isBatchCooking: false,
    diets: ['vegetarian'],
    ingredients: ['elbow pasta', 'cheddar', 'milk', 'butter', 'flour', 'breadcrumbs', 'mustard powder'] },

  { id: 'am6', name: 'Classic Meatloaf', cuisine: 'American', isBatchCooking: true,
    diets: [],
    ingredients: ['ground beef', 'breadcrumbs', 'eggs', 'ketchup', 'onion', 'worcestershire sauce', 'garlic', 'milk'] },

  { id: 'am7', name: 'Honey Garlic Salmon', cuisine: 'American', isBatchCooking: false,
    diets: ['pescatarian'],
    ingredients: ['salmon', 'honey', 'garlic', 'soy sauce', 'lemon', 'butter', 'green beans'] },
];
