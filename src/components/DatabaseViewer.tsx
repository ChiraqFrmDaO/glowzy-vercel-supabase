import { useState } from 'react';
import { db } from '@/integrations/local/client';
import { motion } from 'framer-motion';
import { Database, Eye, Trash2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface TableData {
  name: string;
  count: number;
  schema: any[];
  data: any[];
}

export default function DatabaseViewer() {
  const [tables, setTables] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const loadTables = async () => {
    setLoading(true);
    try {
      const tableNames = ['users', 'profiles', 'uploaded_files', 'links', 'profile_customization'];
      const tableData: TableData[] = [];

      for (const tableName of tableNames) {
        try {
          const schema = db.prepare(`PRAGMA table_info(${tableName})`).all() as any[];
          const count = db.prepare(`SELECT COUNT(*) as count FROM ${tableName}`).get() as { count: number };
          const data = db.prepare(`SELECT * FROM ${tableName} LIMIT 10`).all() as any[];
          
          tableData.push({
            name: tableName,
            count: count.count,
            schema,
            data
          });
        } catch (error) {
          console.warn(`Table ${tableName} might not exist:`, error);
        }
      }

      setTables(tableData);
      toast.success('Database loaded successfully');
    } catch (error) {
      toast.error('Failed to load database');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const clearDatabase = async () => {
    if (!confirm('Are you sure you want to clear all data? This cannot be undone!')) {
      return;
    }

    try {
      db.exec('DELETE FROM uploaded_files');
      db.exec('DELETE FROM links');
      db.exec('DELETE FROM profile_customization');
      db.exec('DELETE FROM profiles');
      db.exec('DELETE FROM users');
      
      toast.success('Database cleared successfully');
      loadTables();
    } catch (error) {
      toast.error('Failed to clear database');
      console.error(error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Database className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Database Viewer</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadTables}
            disabled={loading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Refresh
          </button>
          <button
            onClick={clearDatabase}
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        </div>
      </div>

      {tables.length === 0 ? (
        <div className="text-center py-12">
          <Database className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Click Refresh to load database contents</p>
        </div>
      ) : (
        <div className="space-y-6">
          {tables.map((table) => (
            <motion.div
              key={table.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold capitalize">{table.name}</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Eye className="w-4 h-4" />
                  {table.count} rows
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Schema</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left p-2">Column</th>
                          <th className="text-left p-2">Type</th>
                          <th className="text-left p-2">Nullable</th>
                          <th className="text-left p-2">Default</th>
                        </tr>
                      </thead>
                      <tbody>
                        {table.schema.map((col, idx) => (
                          <tr key={idx} className="border-b border-border/50">
                            <td className="p-2 font-mono text-xs">{col.name}</td>
                            <td className="p-2 text-xs">{col.type}</td>
                            <td className="p-2 text-xs">{col.notnull ? 'NOT NULL' : 'NULL'}</td>
                            <td className="p-2 text-xs font-mono">{col.dflt_value || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {table.data.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Data (first 10 rows)</h3>
                    <div className="overflow-x-auto max-h-64">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-border">
                            {Object.keys(table.data[0]).map((key) => (
                              <th key={key} className="text-left p-2 font-mono">{key}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {table.data.map((row, idx) => (
                            <tr key={idx} className="border-b border-border/50">
                              {Object.values(row).map((value, cellIdx) => (
                                <td key={cellIdx} className="p-2 font-mono break-all max-w-xs">
                                  {typeof value === 'string' && value.length > 50 
                                    ? value.substring(0, 50) + '...' 
                                    : String(value)
                                  }
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
