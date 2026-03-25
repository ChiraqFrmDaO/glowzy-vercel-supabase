import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper functie voor database operaties
export class SupabaseDB {
  static async execute(query, params = []) {
    try {
      // Voor SELECT queries
      if (query.trim().toLowerCase().startsWith('select')) {
        const { data, error } = await supabase
          .from(this.extractTableName(query))
          .select('*')
          .eq(...this.buildWhereClause(query, params));
        
        if (error) throw error;
        return [data];
      }
      
      // Voor INSERT queries
      if (query.trim().toLowerCase().startsWith('insert')) {
        const tableName = this.extractTableName(query);
        const insertData = this.buildInsertData(query, params);
        
        const { data, error } = await supabase
          .from(tableName)
          .insert(insertData)
          .select();
        
        if (error) throw error;
        return [{ insertId: data[0]?.id }];
      }
      
      // Voor UPDATE queries
      if (query.trim().toLowerCase().startsWith('update')) {
        const tableName = this.extractTableName(query);
        const updateData = this.buildUpdateData(query, params);
        const whereClause = this.buildWhereClause(query, params);
        
        const { data, error } = await supabase
          .from(tableName)
          .update(updateData)
          .eq(...whereClause)
          .select();
        
        if (error) throw error;
        return [{ affectedRows: data?.length || 0 }];
      }
      
      // Voor DELETE queries
      if (query.trim().toLowerCase().startsWith('delete')) {
        const tableName = this.extractTableName(query);
        const whereClause = this.buildWhereClause(query, params);
        
        const { data, error } = await supabase
          .from(tableName)
          .delete()
          .eq(...whereClause);
        
        if (error) throw error;
        return [{ affectedRows: data?.length || 0 }];
      }
      
    } catch (error) {
      console.error('Supabase query error:', error);
      throw error;
    }
  }
  
  static extractTableName(query) {
    // Simpele regex om tabel naam te extraheren
    const match = query.match(/(?:from|into|update)\s+(\w+)/i);
    return match ? match[1] : '';
  }
  
  static buildWhereClause(query, params) {
    // Simpele implementatie - moet aangepast worden voor complexe queries
    const match = query.match(/where\s+(\w+)\s*=\s*\?/i);
    if (match && params.length > 0) {
      return [match[1], params[0]];
    }
    return ['id', '']; // fallback
  }
  
  static buildInsertData(query, params) {
    // Simpele implementatie - moet aangepast worden
    return {};
  }
  
  static buildUpdateData(query, params) {
    // Simpele implementatie - moet aangepast worden
    return {};
  }
}
