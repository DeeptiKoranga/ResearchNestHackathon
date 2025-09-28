/**
 * Transforms a flat array of items with parent-child relationships 
 * into a hierarchical tree structure.
 * * This is a common and efficient two-pass approach:
 * 1. The first pass creates a map for O(1) lookup of any item by its ID.
 * 2. The second pass links each item to its parent's children array.
 *
 * @param {Array<Object>} items - A flat array of progress items from the API. 
 * Each item must have an `_id` and a `parentId` property.
 * @returns {Array<Object>} An array of root-level nodes, with children nested inside.
 */
export const buildTree = (items) => {
    // Return an empty array if the input is not a valid array or is empty.
    if (!Array.isArray(items) || items.length === 0) {
      return [];
    }
  
    const itemMap = {};
    const roots = [];
  
    // --- First Pass: Create a map of all items by their ID ---
    // This allows us to quickly find any item in the list later.
    for (const item of items) {
      itemMap[item._id] = { ...item, children: [] };
    }
  
    // --- Second Pass: Link children to their parents ---
    for (const item of items) {
      // If an item has a parentId and that parent exists in our map...
      if (item.parentId && itemMap[item.parentId]) {
        // ...push this item into its parent's 'children' array.
        itemMap[item.parentId].children.push(itemMap[item._id]);
      } else {
        // If an item has no parentId, it's a root node. Add it to the roots array.
        roots.push(itemMap[item._id]);
      }
    }
  
    return roots;
  };
  
  