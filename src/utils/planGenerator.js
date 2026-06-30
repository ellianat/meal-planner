import { ALL_RECIPES } from '../data/recipes';

let _idSeed = 0;
const uid = () => `m${++_idSeed}-${Math.random().toString(36).slice(2, 7)}`;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Strip optional leading quantity ("2 packages of", "1 lb", "3") before matching.
function extractProteinName(entry) {
  const m = entry.trim().match(
    /^(\d+(?:\.\d+)?(?:\s+(?:packages?|packs?|lbs?|pounds?|oz|ounces?|pieces?|bags?|cans?|jars?|portions?|servings?|containers?|kg|g|bunches?))?)(?:\s+of)?\s+(.+)$/i
  );
  return m ? m[2].trim() : entry.trim();
}

function recipeMatchesProtein(recipe, proteins) {
  return proteins.some(p => {
    const name = extractProteinName(p);
    return recipe.ingredients.some(ing => ing.toLowerCase().includes(name.toLowerCase()));
  });
}

function recipeMatchesDiet(recipe, diet) {
  if (!diet || diet === 'none') return true;
  const d = recipe.diets ?? [];
  if (diet === 'vegan')       return d.includes('vegan');
  if (diet === 'vegetarian')  return d.includes('vegan') || d.includes('vegetarian');
  if (diet === 'pescatarian') return d.includes('vegan') || d.includes('vegetarian') || d.includes('pescatarian');
  if (diet === 'gluten-free') return d.includes('gluten-free');
  return true;
}

export function generatePlan({ selectedCuisines, mealsPerWeek, leftoverNights, leftoverProteins, diet }) {
  const proteins = leftoverProteins
    .split(',')
    .map(p => p.trim())
    .filter(Boolean);

  const pool = ALL_RECIPES.filter(r =>
    selectedCuisines.includes(r.cuisine) && recipeMatchesDiet(r, diet)
  );

  const cookingCount = Math.max(1, mealsPerWeek - leftoverNights);
  const actualLeftovers = mealsPerWeek - cookingCount;

  const recentIds = new Set();
  const weeks = [];

  for (let w = 0; w < 4; w++) {
    const selected = [];

    let freshPool = pool.filter(r => !recentIds.has(r.id));
    if (freshPool.length < cookingCount) {
      recentIds.clear();
      freshPool = [...pool];
    }

    // Inject a protein-match recipe roughly every other week
    if (proteins.length > 0 && w % 2 === 0) {
      const match = freshPool.find(r => recipeMatchesProtein(r, proteins));
      if (match && selected.length < cookingCount) selected.push(match);
    }

    // Fill remaining slots
    const remaining = shuffle(freshPool.filter(r => !selected.includes(r)));
    for (const r of remaining) {
      if (selected.length >= cookingCount) break;
      selected.push(r);
    }

    // Last resort: allow repeats
    if (selected.length < cookingCount) {
      for (const r of shuffle(pool)) {
        if (selected.length >= cookingCount) break;
        if (!selected.includes(r)) selected.push(r);
      }
    }

    selected.forEach(r => recentIds.add(r.id));

    // Build cooking meals — cookExtra is false until the user toggles it
    const cookingMeals = selected.slice(0, cookingCount).map(r => ({
      id: uid(),
      name: r.name,
      cuisine: r.cuisine,
      label: 'Cooking',
      prevLabel: 'Cooking',
      ingredients: [...r.ingredients],
      isBatchCooking: r.isBatchCooking,
      recipeId: r.id,
      sourceMealId: null,
      rating: null,
      isCustom: false,
      cookExtra: false,
      diets: r.diets ?? [],
    }));

    // Build unassigned leftover placeholder slots
    const leftoverSlots = Array.from({ length: actualLeftovers }, () => ({
      id: uid(),
      name: '',
      cuisine: '',
      label: 'Leftovers',
      prevLabel: 'Leftovers',
      ingredients: [],
      isBatchCooking: false,
      recipeId: null,
      sourceMealId: null,
      rating: null,
      isCustom: false,
      cookExtra: false,
    }));

    weeks.push([...cookingMeals, ...leftoverSlots]);
  }

  return weeks;
}

// Swap a cooking meal in a week, keeping leftover references consistent
export function swapCookingMeal(weeks, weekIndex, mealId, selectedCuisines, diet) {
  const week = weeks[weekIndex];
  const mealIdx = week.findIndex(m => m.id === mealId);
  if (mealIdx === -1) return weeks;

  const currentMeal = week[mealIdx];
  const usedIds = new Set(week.map(m => m.recipeId).filter(Boolean));

  const eligible = ALL_RECIPES.filter(r =>
    selectedCuisines.includes(r.cuisine) && recipeMatchesDiet(r, diet)
  );
  const pool = eligible.filter(r => !usedIds.has(r.id));
  const candidates = pool.length > 0 ? pool : eligible;
  const newRecipe = shuffle(candidates)[0];
  if (!newRecipe) return weeks;

  const newWeeks = weeks.map((wk, wi) => {
    return wk.map(m => {
      if (wi === weekIndex && m.id === mealId) {
        return {
          ...m,
          name: newRecipe.name,
          cuisine: newRecipe.cuisine,
          ingredients: [...newRecipe.ingredients],
          isBatchCooking: newRecipe.isBatchCooking,
          recipeId: newRecipe.id,
          rating: null,
        };
      }
      // Update leftover slots referencing this meal — may live in any week
      if (m.sourceMealId === mealId) {
        return { ...m, name: `${newRecipe.name} (leftovers)`, cuisine: newRecipe.cuisine };
      }
      return m;
    });
  });

  return newWeeks;
}

