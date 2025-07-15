// ✅ src/utils/slugify.js
export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        
    .replace(/&/g, '-and-')      
    .replace(/[^\w\-]+/g, '')    
    .replace(/--+/g, '-')        
    .replace(/^-+/, '')          
    .replace(/-+$/, '');
};
