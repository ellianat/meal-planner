import { useState, useEffect, useCallback } from 'react';
import { CUISINES, ALL_RECIPES, categorizeIngredient } from './data/recipes';
import { generatePlan, swapCookingMeal } from './utils/planGenerator';

// ─── helpers ────────────────────────────────────────────────────────────────

let _customSeed = 0;
const customId = () => `custom-${++_customSeed}-${Date.now()}`;

// ─── Settings panel ──────────────────────────────────────────────────────────

function Settings({ cuisines, setCuisines, mealsPerWeek, setMealsPerWeek, leftoverNights, setLeftoverNights, leftoverProteins, setLeftoverProteins, diet, setDiet, onGenerate, onReset, hasPlan }) {
  const toggleCuisine = (c) => {
    setCuisines(prev =>
      prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
    );
  };

  const mealOptions = [3, 4, 5, 7];

  return (
    <section className="settings-panel">
      <h2>Plan Settings</h2>
      <div className="settings-grid">
        <div className="setting-group">
          <label className="setting-label">Cuisines</label>
          <div className="cuisine-checkboxes">
            {CUISINES.map(c => (
              <label key={c} className={`checkbox-chip ${cuisines.includes(c) ? 'checked' : ''}`}>
                <input
                  type="checkbox"
                  checked={cuisines.includes(c)}
                  onChange={() => toggleCuisine(c)}
                />
                {c}
              </label>
            ))}
          </div>
          {cuisines.length === 0 && (
            <p className="warning-text">Select at least one cuisine</p>
          )}
        </div>

        <div className="setting-group">
          <label className="setting-label">Meals per week</label>
          <div className="seg-control">
            {mealOptions.map(n => (
              <button
                key={n}
                className={`seg-btn ${mealsPerWeek === n ? 'active' : ''}`}
                onClick={() => setMealsPerWeek(n)}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="setting-group">
          <label className="setting-label">
            Leftover nights per week
            <span className="setting-value">{leftoverNights}</span>
          </label>
          <input
            type="range"
            min="0"
            max={Math.min(3, mealsPerWeek - 1)}
            value={Math.min(leftoverNights, mealsPerWeek - 1)}
            onChange={e => setLeftoverNights(Number(e.target.value))}
            className="slider"
          />
          <div className="slider-labels">
            <span>0</span>
            <span>{Math.min(3, mealsPerWeek - 1)}</span>
          </div>
        </div>

        <div className="setting-group">
          <label className="setting-label">Diet</label>
          <select className="select-input" value={diet} onChange={e => setDiet(e.target.value)}>
            <option value="none">No restriction</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="pescatarian">Pescatarian</option>
            <option value="gluten-free">Gluten-Free</option>
          </select>
        </div>

        <div className="setting-group">
          <label className="setting-label">Proteins on hand</label>
          <input
            type="text"
            className="text-input"
            placeholder="e.g. chicken thighs, ground beef"
            value={leftoverProteins}
            onChange={e => setLeftoverProteins(e.target.value)}
          />
          <p className="hint-text">Comma-separated — we'll suggest meals that use these up</p>
        </div>
      </div>

      <div className="generate-row">
        <button
          className="btn btn-primary btn-generate"
          onClick={onGenerate}
          disabled={cuisines.length === 0}
        >
          Generate 4-Week Plan
        </button>
        {hasPlan && (
          <button className="btn btn-secondary btn-reset" onClick={onReset}>
            Reset plan
          </button>
        )}
      </div>
    </section>
  );
}

// ─── Meal card ───────────────────────────────────────────────────────────────

function MealCard({ meal, flatIndex, isLastFlat, onSwap, onRate, onToggleEatingOut, onMove, onToggleCookExtra, canCookExtra, onDelete, onEdit }) {
  const isFirst = flatIndex === 0;
  const isLast = isLastFlat;

  const labelClass = {
    'Cooking': 'label-cooking',
    'Leftovers': 'label-leftovers',
    'Eating out': 'label-eating-out',
  }[meal.label] || 'label-cooking';

  // Unassigned leftover placeholder
  if (meal.label === 'Leftovers' && !meal.sourceMealId) {
    return (
      <div className="meal-card leftover-unassigned">
        <div className="meal-card-header">
          <span className={`meal-label ${labelClass}`}>Leftovers</span>
          <button className="icon-btn delete-btn" onClick={onDelete} title="Remove this night" aria-label="Delete">✕</button>
        </div>
        <p className="unassigned-hint">
          Toggle "cook extra" on a cooking meal to assign this night
        </p>
        <div className="meal-actions">
          <div className="action-group" style={{ marginLeft: 'auto' }}>
            <button className="icon-btn" onClick={() => onMove('left')} disabled={isFirst} title="Move earlier" aria-label="Move left">←</button>
            <button className="icon-btn" onClick={() => onMove('right')} disabled={isLast} title="Move later" aria-label="Move right">→</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`meal-card ${meal.label === 'Eating out' ? 'eating-out' : ''}`}>
      <div className="meal-card-header">
        <span className={`meal-label ${labelClass}`}>{meal.label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {meal.cuisine && <span className="meal-cuisine">{meal.cuisine}</span>}
          {meal.isCustom && (
            <button className="icon-btn edit-btn" onClick={onEdit} title="Edit recipe" aria-label="Edit">✎</button>
          )}
          <button className="icon-btn delete-btn" onClick={onDelete} title="Remove meal" aria-label="Delete">✕</button>
        </div>
      </div>

      <div className="meal-name-row">
        <p className="meal-name">{meal.name}</p>
        {meal.label === 'Cooking' && (
          <a
            className="recipe-search-link"
            href={`https://www.google.com/search?q=${encodeURIComponent(meal.name + ' recipe')}`}
            target="_blank"
            rel="noopener noreferrer"
            title={`Search "${meal.name} recipe" on Google`}
            aria-label="Find recipe"
          >↗</a>
        )}
      </div>
      {meal.crossWeek && (
        <span className="cross-week-badge">↑ from last week</span>
      )}

      {meal.label === 'Cooking' && (
        <button
          className={`cook-extra-btn ${meal.cookExtra ? 'active' : ''} ${!meal.cookExtra && !canCookExtra ? 'disabled' : ''}`}
          onClick={onToggleCookExtra}
          disabled={!meal.cookExtra && !canCookExtra}
          title={meal.cookExtra ? 'Remove from leftover nights' : 'Cook extra for a leftover night'}
        >
          {meal.cookExtra ? '✓ Cooking extra' : '+ Cook extra for leftovers'}
        </button>
      )}

      <div className="meal-actions">
        <div className="action-group">
          <button
            className={`icon-btn ${meal.rating === 'up' ? 'active-up' : ''}`}
            onClick={() => onRate(meal.rating === 'up' ? null : 'up')}
            title="Thumbs up"
            aria-label="Rate up"
          >
            👍
          </button>
          <button
            className={`icon-btn ${meal.rating === 'down' ? 'active-down' : ''}`}
            onClick={() => onRate(meal.rating === 'down' ? null : 'down')}
            title="Thumbs down"
            aria-label="Rate down"
          >
            👎
          </button>
        </div>

        <div className="action-group">
          {meal.label === 'Cooking' && (
            <button className="icon-btn" onClick={onSwap} title="Swap this meal" aria-label="Swap meal">⟳</button>
          )}
          <button
            className={`icon-btn eat-out-btn ${meal.label === 'Eating out' ? 'active-eat' : ''}`}
            onClick={onToggleEatingOut}
            title={meal.label === 'Eating out' ? 'Mark as cooking' : 'Mark as eating out'}
            aria-label="Toggle eating out"
          >
            🍽
          </button>
        </div>

        <div className="action-group">
          <button className="icon-btn" onClick={() => onMove('left')} disabled={isFirst} title="Move earlier" aria-label="Move left">←</button>
          <button className="icon-btn" onClick={() => onMove('right')} disabled={isLast} title="Move later" aria-label="Move right">→</button>
        </div>
      </div>
    </div>
  );
}

// ─── Week section ─────────────────────────────────────────────────────────────

function WeekSection({ weekIndex, meals, allWeeks, onSwap, onRate, onToggleEatingOut, onMove, onAddRecipe, onToggleCookExtra, onDelete, onEditRecipe }) {
  const flatTotal = allWeeks.reduce((sum, w) => sum + w.length, 0);
  const flatOffset = allWeeks.slice(0, weekIndex).reduce((sum, w) => sum + w.length, 0);
  const freeSlots = meals.filter(m => m.label === 'Leftovers' && !m.sourceMealId).length;
  const nextWeekFreeSlots = (allWeeks[weekIndex + 1] ?? []).filter(m => m.label === 'Leftovers' && !m.sourceMealId).length;
  const hasAvailableSlot = freeSlots + nextWeekFreeSlots > 0;

  return (
    <section className="week-section">
      <div className="week-header">
        <h2>Week {weekIndex + 1}</h2>
        <button className="btn btn-secondary btn-sm" onClick={() => onAddRecipe(weekIndex)}>
          + Add Recipe
        </button>
      </div>
      <div className="meals-grid">
        {meals.map((meal, mealIndex) => {
          const flatIndex = flatOffset + mealIndex;
          return (
            <MealCard
              key={meal.id}
              meal={meal}
              flatIndex={flatIndex}
              isLastFlat={flatIndex === flatTotal - 1}
              onSwap={() => onSwap(weekIndex, meal.id)}
              onRate={(r) => onRate(weekIndex, meal.id, r)}
              onToggleEatingOut={() => onToggleEatingOut(weekIndex, meal.id)}
              onMove={(dir) => onMove(flatIndex, dir)}
              onToggleCookExtra={() => onToggleCookExtra(weekIndex, meal.id)}
              canCookExtra={hasAvailableSlot}
              onDelete={() => onDelete(weekIndex, meal.id)}
              onEdit={() => onEditRecipe(weekIndex, meal)}
            />
          );
        })}
      </div>
    </section>
  );
}

// ─── Shopping list ────────────────────────────────────────────────────────────

function ShoppingList({ weeks }) {
  const [copied, setCopied] = useState(false);
  const byCategory = { Protein: new Set(), Produce: new Set(), Pantry: new Set(), Other: new Set() };

  for (const week of weeks) {
    for (const meal of week) {
      if (meal.label === 'Leftovers' || meal.label === 'Eating out') continue;
      for (const ing of meal.ingredients) {
        const cat = categorizeIngredient(ing);
        byCategory[cat].add(ing);
      }
    }
  }

  const hasItems = Object.values(byCategory).some(s => s.size > 0);

  const handleCopy = () => {
    const lines = ['Shopping List', ''];
    for (const [cat, items] of Object.entries(byCategory)) {
      if (items.size === 0) continue;
      lines.push(cat);
      for (const ing of [...items].sort()) lines.push(`- ${ing}`);
      lines.push('');
    }
    navigator.clipboard.writeText(lines.join('\n').trimEnd()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!hasItems) return null;

  return (
    <section className="shopping-list">
      <div className="shopping-list-header">
        <div>
          <h2>Shopping List</h2>
          <p className="hint-text">Based on cooking nights only — leftovers and eating-out meals excluded.</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={handleCopy}>
          {copied ? '✓ Copied!' : 'Copy list'}
        </button>
      </div>
      <div className="shopping-grid">
        {Object.entries(byCategory).map(([cat, items]) =>
          items.size > 0 ? (
            <div key={cat} className="shopping-category">
              <h3 className="category-title">{cat}</h3>
              <ul>
                {[...items].sort().map(ing => (
                  <li key={ing}>{ing}</li>
                ))}
              </ul>
            </div>
          ) : null
        )}
      </div>
    </section>
  );
}

// ─── Recipe modal (add + edit) ────────────────────────────────────────────────

function RecipeModal({ defaultWeek, totalWeeks, onAdd, onEdit, onClose, editMeal }) {
  const isEdit = !!editMeal;
  const [name, setName] = useState(editMeal?.name ?? '');
  const [week, setWeek] = useState(defaultWeek);
  const [ingredients, setIngredients] = useState(
    editMeal?.ingredients?.join(', ') ?? ''
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const parsedIngredients = ingredients.split(',').map(s => s.trim()).filter(Boolean);
    if (isEdit) {
      onEdit({ name: name.trim(), ingredients: parsedIngredients });
    } else {
      onAdd({
        weekIndex: week,
        meal: {
          id: customId(),
          name: name.trim(),
          cuisine: 'Custom',
          label: 'Cooking',
          prevLabel: 'Cooking',
          ingredients: parsedIngredients,
          isBatchCooking: false,
          recipeId: null,
          sourceMealId: null,
          rating: null,
          isCustom: true,
          cookExtra: false,
        }
      });
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{isEdit ? 'Edit Recipe' : 'Add Custom Recipe'}</h2>
          <button className="icon-btn close-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Recipe Name</label>
            <input
              className="text-input"
              type="text"
              placeholder="e.g. Mom's Chicken Soup"
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
            />
          </div>
          {!isEdit && (
            <div className="form-group">
              <label>Add to Week</label>
              <select className="select-input" value={week} onChange={e => setWeek(Number(e.target.value))}>
                {Array.from({ length: totalWeeks }, (_, i) => (
                  <option key={i} value={i}>Week {i + 1}</option>
                ))}
              </select>
            </div>
          )}
          <div className="form-group">
            <label>Ingredients (comma-separated)</label>
            <textarea
              className="text-input textarea"
              placeholder="e.g. chicken thighs, carrots, onion, garlic"
              value={ingredients}
              onChange={e => setIngredients(e.target.value)}
              rows={3}
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={!name.trim()}>
              {isEdit ? 'Save Changes' : 'Add to Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [cuisines, setCuisines] = useState([...CUISINES]);
  const [mealsPerWeek, setMealsPerWeek] = useState(5);
  const [leftoverNights, setLeftoverNights] = useState(1);
  const [leftoverProteins, setLeftoverProteins] = useState('');
  const [diet, setDiet] = useState('none');

  const [weeks, setWeeks] = useState(() => {
    try {
      const saved = localStorage.getItem('mealplanner_weeks');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // { mode: 'add', weekIndex } | { mode: 'edit', weekIndex, mealId, meal } | null
  const [recipeModal, setRecipeModal] = useState(null);

  useEffect(() => {
    if (weeks) {
      localStorage.setItem('mealplanner_weeks', JSON.stringify(weeks));
    } else {
      localStorage.removeItem('mealplanner_weeks');
    }
  }, [weeks]);

  const handleGenerate = useCallback(() => {
    const plan = generatePlan({
      selectedCuisines: cuisines,
      mealsPerWeek,
      leftoverNights: Math.min(leftoverNights, mealsPerWeek - 1),
      leftoverProteins,
      diet,
    });
    setWeeks(plan);
  }, [cuisines, mealsPerWeek, leftoverNights, leftoverProteins, diet]);

  const handleSwap = useCallback((weekIndex, mealId) => {
    setWeeks(prev => {
      const meal = prev[weekIndex].find(m => m.id === mealId);
      if (!meal || meal.label === 'Leftovers') return prev;
      return swapCookingMeal(prev, weekIndex, mealId, cuisines, diet);
    });
  }, [cuisines, diet]);

  const handleDelete = useCallback((weekIndex, mealId) => {
    setWeeks(prev => {
      const meal = prev[weekIndex]?.find(m => m.id === mealId);
      if (!meal) return prev;

      if (meal.label === 'Cooking' && meal.cookExtra) {
        // Reset leftover slots in ANY week that reference this meal, then remove it
        return prev.map((wk, wi) => {
          const reset = wk.map(m =>
            m.sourceMealId === mealId
              ? { ...m, sourceMealId: null, name: '', cuisine: '', crossWeek: false }
              : m
          );
          return wi === weekIndex ? reset.filter(m => m.id !== mealId) : reset;
        });
      }
      if (meal.label === 'Leftovers' && meal.sourceMealId) {
        // Unmark cookExtra on the source meal (may be in a different week), remove this slot
        return prev.map((wk, wi) => {
          const unmark = wk.map(m =>
            m.id === meal.sourceMealId ? { ...m, cookExtra: false } : m
          );
          return wi === weekIndex ? unmark.filter(m => m.id !== mealId) : unmark;
        });
      }
      return prev.map((wk, wi) => wi === weekIndex ? wk.filter(m => m.id !== mealId) : wk);
    });
  }, []);

  const handleToggleCookExtra = useCallback((weekIndex, mealId) => {
    setWeeks(prev => {
      const meal = prev[weekIndex]?.find(m => m.id === mealId);
      if (!meal || meal.label !== 'Cooking') return prev;

      if (!meal.cookExtra) {
        // Prefer a free slot in the same week; fall back to next week
        let slotWeek = -1;
        let slotId = null;

        const sameSlot = prev[weekIndex]?.find(m => m.label === 'Leftovers' && !m.sourceMealId);
        if (sameSlot) {
          slotWeek = weekIndex;
          slotId = sameSlot.id;
        } else if (weekIndex + 1 < prev.length) {
          const nextSlot = prev[weekIndex + 1]?.find(m => m.label === 'Leftovers' && !m.sourceMealId);
          if (nextSlot) {
            slotWeek = weekIndex + 1;
            slotId = nextSlot.id;
          }
        }

        if (slotId === null) return prev;

        const crossWeek = slotWeek !== weekIndex;

        return prev.map((wk, wi) => {
          if (wi === weekIndex) return wk.map(m => m.id === mealId ? { ...m, cookExtra: true } : m);
          if (wi === slotWeek) return wk.map(m =>
            m.id === slotId
              ? { ...m, sourceMealId: mealId, name: `${meal.name} (leftovers)`, cuisine: meal.cuisine, crossWeek }
              : m
          );
          return wk;
        });
      } else {
        // Turn off: release the slot in whichever week it lives
        return prev.map(wk =>
          wk.map(m => {
            if (m.id === mealId) return { ...m, cookExtra: false };
            if (m.sourceMealId === mealId) return { ...m, sourceMealId: null, name: '', cuisine: '', crossWeek: false };
            return m;
          })
        );
      }
    });
  }, []);

  const handleRate = useCallback((weekIndex, mealId, rating) => {
    if (rating === 'down') {
      setWeeks(prev => {
        const meal = prev[weekIndex]?.find(m => m.id === mealId);
        if (!meal || meal.label === 'Leftovers') return prev;
        return swapCookingMeal(prev, weekIndex, mealId, cuisines, diet);
      });
      return;
    }
    setWeeks(prev => prev.map((wk, wi) =>
      wi !== weekIndex ? wk :
        wk.map(m => m.id === mealId ? { ...m, rating } : m)
    ));
  }, [cuisines, diet]);

  const handleToggleEatingOut = useCallback((weekIndex, mealId) => {
    setWeeks(prev => prev.map((wk, wi) =>
      wi !== weekIndex ? wk :
        wk.map(m => {
          if (m.id !== mealId) return m;
          if (m.label === 'Eating out') {
            return { ...m, label: m.prevLabel };
          }
          return { ...m, label: 'Eating out', prevLabel: m.label };
        })
    ));
  }, []);

  // Move a meal left or right in the flat list (can cross week boundaries)
  const handleMove = useCallback((flatIndex, direction) => {
    setWeeks(prev => {
      const flat = prev.flat();
      const targetIndex = direction === 'left' ? flatIndex - 1 : flatIndex + 1;
      if (targetIndex < 0 || targetIndex >= flat.length) return prev;

      const newFlat = [...flat];
      [newFlat[flatIndex], newFlat[targetIndex]] = [newFlat[targetIndex], newFlat[flatIndex]];

      // Re-chunk into weeks
      const perWeek = prev.map(w => w.length);
      const newWeeks = [];
      let cursor = 0;
      for (const size of perWeek) {
        newWeeks.push(newFlat.slice(cursor, cursor + size));
        cursor += size;
      }
      return newWeeks;
    });
  }, []);

  const handleAddRecipe = useCallback(({ weekIndex, meal }) => {
    setWeeks(prev => prev.map((wk, wi) =>
      wi !== weekIndex ? wk : [...wk, meal]
    ));
  }, []);

  const handleEditRecipe = useCallback(({ weekIndex, mealId, name, ingredients }) => {
    setWeeks(prev => prev.map(wk =>
      wk.map(m => {
        if (m.id === mealId) return { ...m, name, ingredients };
        if (m.sourceMealId === mealId) return { ...m, name: `${name} (leftovers)` };
        return m;
      })
    ));
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div>
            <h1>Meal Planner</h1>
            <p className="tagline">4 weeks of dinners, planned in seconds</p>
          </div>
        </div>
      </header>

      <main className="app-main">
        <Settings
          cuisines={cuisines}
          setCuisines={setCuisines}
          mealsPerWeek={mealsPerWeek}
          setMealsPerWeek={setMealsPerWeek}
          leftoverNights={leftoverNights}
          setLeftoverNights={setLeftoverNights}
          leftoverProteins={leftoverProteins}
          setLeftoverProteins={setLeftoverProteins}
          diet={diet}
          setDiet={setDiet}
          onGenerate={handleGenerate}
          onReset={() => setWeeks(null)}
          hasPlan={weeks !== null}
        />

        {weeks ? (
          <>
            <div className="weeks-container">
              {weeks.map((weekMeals, wi) => (
                <WeekSection
                  key={wi}
                  weekIndex={wi}
                  meals={weekMeals}
                  allWeeks={weeks}
                  onSwap={handleSwap}
                  onRate={handleRate}
                  onToggleEatingOut={handleToggleEatingOut}
                  onMove={handleMove}
                  onAddRecipe={(wi) => setRecipeModal({ mode: 'add', weekIndex: wi })}
                  onToggleCookExtra={handleToggleCookExtra}
                  onDelete={handleDelete}
                  onEditRecipe={(wi, meal) => setRecipeModal({ mode: 'edit', weekIndex: wi, mealId: meal.id, meal })}
                />
              ))}
            </div>
            <ShoppingList weeks={weeks} />
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <p>Configure your settings above and click <strong>Generate 4-Week Plan</strong> to get started.</p>
          </div>
        )}
      </main>

      {recipeModal && (
        <RecipeModal
          defaultWeek={recipeModal.weekIndex}
          totalWeeks={weeks ? weeks.length : 4}
          editMeal={recipeModal.mode === 'edit' ? recipeModal.meal : null}
          onAdd={handleAddRecipe}
          onEdit={({ name, ingredients }) =>
            handleEditRecipe({ weekIndex: recipeModal.weekIndex, mealId: recipeModal.mealId, name, ingredients })
          }
          onClose={() => setRecipeModal(null)}
        />
      )}
    </div>
  );
}
