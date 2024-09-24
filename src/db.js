import Dexie from 'dexie';

const db = new Dexie('DocumentProcessingDB');
db.version(3).stores({
  fields: '++id, name',
  extractedData: '++id',
  reviewData: '++id',  // Add store for review data
});

export const saveReviewData = async (data) => {
  await db.reviewData.clear();
  await db.reviewData.bulkAdd(data);
};

export const loadReviewData = async () => {
  return await db.reviewData.toArray();
};

// Save fields as array of objects with 'name' property, ensuring no duplicates
export const saveFields = async (fields) => {
  await db.fields.clear();
  const fieldObjects = fields.map((name) => ({ name }));
  
  for (const fieldObj of fieldObjects) {
    const existingField = await db.fields.get({ name: fieldObj.name });
    if (!existingField) {
      await db.fields.put(fieldObj);
    }
  }
};

// Load fields and deduplicate them before returning
export const loadFields = async () => {
  const fieldObjects = await db.fields.toArray();
  return [...new Set(fieldObjects.map((fieldObj) => fieldObj.name))];
};

// Save extractedData without manually assigning ids
export const saveExtractedData = async (data) => {
  await db.extractedData.clear();
  await db.extractedData.bulkAdd(data); // Let IndexedDB assign 'id's
};

// Load extractedData including 'id's
export const loadExtractedData = async () => {
  return await db.extractedData.toArray();
};

// Remove a field from IndexedDB by name
export const deleteFieldByName = async (fieldName) => {
  const fieldToDelete = await db.fields.get({ name: fieldName });
  if (fieldToDelete) {
    await db.fields.delete(fieldToDelete.id);
    console.log(`Deleted field from IndexedDB: ${fieldName}`);
  } else {
    console.log(`Field not found in IndexedDB: ${fieldName}`);
  }
};

// Clear extractedData from IndexedDB
export const clearExtractedData = async () => {
  await db.extractedData.clear();  // Clear only extractedData
};

// Clear IndexedDB (both fields and extracted data)
export const clearIndexedDB = async () => {
  await db.fields.clear();
  await db.extractedData.clear();
  await db.reviewData.clear()
};