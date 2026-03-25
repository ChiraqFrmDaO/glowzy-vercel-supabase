import { db } from '@/integrations/local/client';

export function viewDatabase() {
  console.log('=== DATABASE CONTENTS ===');
  
  // View users
  const users = db.prepare('SELECT * FROM users').all();
  console.log('\n USERS:', users);
  
  // View profiles
  const profiles = db.prepare('SELECT * FROM profiles').all();
  console.log('\n👤 PROFILES:', profiles);
  
  // View uploaded files
  const files = db.prepare('SELECT * FROM uploaded_files').all();
  console.log('\n📁 UPLOADED FILES:', files);
  
  // View links
  const links = db.prepare('SELECT * FROM links').all();
  console.log('\n🔗 LINKS:', links);
  
  // View profile customization
  const customization = db.prepare('SELECT * FROM profile_customization').all();
  console.log('\n🎨 PROFILE CUSTOMIZATION:', customization);
  
  console.log('\n=== END DATABASE CONTENTS ===');
}

export function getTableInfo(tableName: string) {
  try {
    const schema = db.prepare(`PRAGMA table_info(${tableName})`).all();
    console.log(`\n📋 SCHEMA for ${tableName}:`, schema);
    
    const count = db.prepare(`SELECT COUNT(*) as count FROM ${tableName}`).get() as { count: number };
    console.log(`📊 ${tableName} has ${count.count} rows`);
    
    const data = db.prepare(`SELECT * FROM ${tableName} LIMIT 10`).all();
    console.log(`📄 First 10 rows of ${tableName}:`, data);
  } catch (error) {
    console.error(`❌ Error accessing table ${tableName}:`, error);
  }
}

// Export for browser console access
if (typeof window !== 'undefined') {
  (window as any).dbViewer = {
    viewDatabase,
    getTableInfo,
    db
  };
}
