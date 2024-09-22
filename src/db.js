import Dexie from 'dexie';

const db = new Dexie('DocumentProcessingDB');
db.version(3).stores({
  fields: '++id, name', // Ensure the `name` is indexed
  extractedData: '++id',
});

// Save fields as array of objects with 'name' property, ensuring no duplicates
export const saveFields = async (fields) => {
  await db.fields.clear();
  const fieldObjects = fields.map((name) => ({ name }));
  
  // Use bulkPut with `name` uniqueness to avoid duplicates
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
  const uniqueFields = [...new Set(fieldObjects.map((fieldObj) => fieldObj.name))];
  return uniqueFields;
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

// Clear IndexedDB
export const clearIndexedDB = async () => {
  await db.fields.clear();
  await db.extractedData.clear();
};