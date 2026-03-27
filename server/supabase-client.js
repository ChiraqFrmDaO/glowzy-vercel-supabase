import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Service role client voor server-side operaties
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Database helper class om MySQL queries te vervangen
export class SupabaseDB {
  // Simuleert MySQL pool.execute() voor compatibiliteit
  static async execute(query, params = []) {
    try {
      console.log('Executing query:', query, params);
      
      // Parse query type
      const queryType = this.getQueryType(query);
      
      switch (queryType) {
        case 'SELECT':
          return await this.handleSelect(query, params);
        case 'INSERT':
          return await this.handleInsert(query, params);
        case 'UPDATE':
          return await this.handleUpdate(query, params);
        case 'DELETE':
          return await this.handleDelete(query, params);
        default:
          throw new Error(`Unsupported query type: ${queryType}`);
      }
    } catch (error) {
      console.error('Supabase query error:', error);
      throw error;
    }
  }

  static getQueryType(query) {
    const trimmed = query.trim().toLowerCase();
    if (trimmed.startsWith('select')) return 'SELECT';
    if (trimmed.startsWith('insert')) return 'INSERT';
    if (trimmed.startsWith('update')) return 'UPDATE';
    if (trimmed.startsWith('delete')) return 'DELETE';
    return 'UNKNOWN';
  }

  static async handleSelect(query, params) {
    // Extract table name and conditions
    const tableName = this.extractTableName(query);
    const { selectFields, whereConditions, orderBy, limit } = this.parseSelectQuery(query);
    
    let supabaseQuery = supabase.from(tableName).select(selectFields);
    
    // Apply WHERE conditions
    if (whereConditions.length > 0) {
      whereConditions.forEach((condition, index) => {
        if (condition.operator === '=' && params[index] !== undefined) {
          supabaseQuery = supabaseQuery.eq(condition.field, params[index]);
        } else if (condition.operator === 'LIKE' && params[index] !== undefined) {
          supabaseQuery = supabaseQuery.like(condition.field, params[index]);
        } else if (condition.operator === '>' && params[index] !== undefined) {
          supabaseQuery = supabaseQuery.gt(condition.field, params[index]);
        } else if (condition.operator === '<' && params[index] !== undefined) {
          supabaseQuery = supabaseQuery.lt(condition.field, params[index]);
        }
      });
    }
    
    // Apply ORDER BY
    if (orderBy) {
      supabaseQuery = supabaseQuery.order(orderBy.field, { ascending: orderBy.ascending });
    }
    
    // Apply LIMIT
    if (limit) {
      supabaseQuery = supabaseQuery.limit(limit);
    }
    
    const { data, error } = await supabaseQuery;
    
    if (error) throw error;
    return [data];
  }

  static async handleInsert(query, params) {
    const tableName = this.extractTableName(query);
    const { columns, values } = this.parseInsertQuery(query);
    
    // Build insert data object
    const insertData = {};
    columns.forEach((col, index) => {
      insertData[col] = params[index];
    });
    
    const { data, error } = await supabase
      .from(tableName)
      .insert(insertData)
      .select();
    
    if (error) throw error;
    
    // Simulate MySQL insertId
    return [{ insertId: data[0]?.id, affectedRows: data.length }];
  }

  static async handleUpdate(query, params) {
    const tableName = this.extractTableName(query);
    const { setColumns, whereConditions } = this.parseUpdateQuery(query);
    
    // Build update data object
    const updateData = {};
    const setCount = setColumns.length;
    setColumns.forEach((col, index) => {
      updateData[col] = params[index];
    });
    
    let supabaseQuery = supabase.from(tableName).update(updateData);
    
    // Apply WHERE conditions
    if (whereConditions.length > 0) {
      whereConditions.forEach((condition, index) => {
        const paramIndex = setCount + index;
        if (condition.operator === '=' && params[paramIndex] !== undefined) {
          supabaseQuery = supabaseQuery.eq(condition.field, params[paramIndex]);
        }
      });
    }
    
    const { data, error } = await supabaseQuery;
    
    if (error) throw error;
    return [{ affectedRows: data?.length || 0 }];
  }

  static async handleDelete(query, params) {
    const tableName = this.extractTableName(query);
    const whereConditions = this.parseWhereClause(query);
    
    let supabaseQuery = supabase.from(tableName).delete();
    
    // Apply WHERE conditions
    whereConditions.forEach((condition, index) => {
      if (condition.operator === '=' && params[index] !== undefined) {
        supabaseQuery = supabaseQuery.eq(condition.field, params[index]);
      }
    });
    
    const { data, error } = await supabaseQuery.select();
    
    if (error) throw error;
    return [{ affectedRows: data?.length || 0 }];
  }

  static extractTableName(query) {
    const match = query.match(/(?:FROM|INTO|UPDATE)\s+(\w+)/i);
    return match ? match[1] : '';
  }

  static parseSelectQuery(query) {
    // Extract SELECT fields
    const selectMatch = query.match(/SELECT\s+(.+?)\s+FROM/i);
    const selectFields = selectMatch ? selectMatch[1].trim() : '*';
    
    // Extract WHERE conditions
    const whereMatch = query.match(/WHERE\s+(.+?)(?:\s+ORDER\s+BY|\s+LIMIT|$)/i);
    const whereConditions = whereMatch ? this.parseConditions(whereMatch[1]) : [];
    
    // Extract ORDER BY
    const orderMatch = query.match(/ORDER\s+BY\s+(\w+)(?:\s+(ASC|DESC))?/i);
    const orderBy = orderMatch ? {
      field: orderMatch[1],
      ascending: orderMatch[2]?.toUpperCase() !== 'DESC'
    } : null;
    
    // Extract LIMIT
    const limitMatch = query.match(/LIMIT\s+(\d+)/i);
    const limit = limitMatch ? parseInt(limitMatch[1]) : null;
    
    return { selectFields, whereConditions, orderBy, limit };
  }

  static parseInsertQuery(query) {
    const columnsMatch = query.match(/INSERT\s+INTO\s+\w+\s*\(([^)]+)\)\s*VALUES/i);
    const columns = columnsMatch ? columnsMatch[1].split(',').map(col => col.trim().replace(/`/g, '')) : [];
    
    return { columns, values: [] };
  }

  static parseUpdateQuery(query) {
    // Parse SET part
    const setMatch = query.match(/SET\s+(.+?)\s+WHERE/i);
    const setColumns = setMatch ? setMatch[1].split(',').map(set => {
      const [field] = set.trim().split('=');
      return field.trim().replace(/`/g, '');
    }) : [];
    
    // Parse WHERE part
    const whereConditions = this.parseWhereClause(query);
    
    return { setColumns, whereConditions };
  }

  static parseWhereClause(query) {
    const whereMatch = query.match(/WHERE\s+(.+?)(?:\s+ORDER\s+BY|\s+LIMIT|$)/i);
    return whereMatch ? this.parseConditions(whereMatch[1]) : [];
  }

  static parseConditions(conditionsStr) {
    const conditions = [];
    const parts = conditionsStr.split(/\s+AND\s+/i);
    
    parts.forEach(part => {
      const match = part.match(/(\w+)\s*(=|LIKE|>|<)\s*\?/i);
      if (match) {
        conditions.push({
          field: match[1],
          operator: match[2]
        });
      }
    });
    
    return conditions;
  }

  // Helper voor specifieke Supabase operaties
  static async auth() {
    return supabase.auth;
  }

  static async storage() {
    return supabase.storage;
  }
}

// Export voor compatibiliteit met bestaande code
export const pool = {
  execute: SupabaseDB.execute
};
