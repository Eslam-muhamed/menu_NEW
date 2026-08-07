import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface TableContextValue {
  tableNumber: string | null;
}

const TableContext = createContext<TableContextValue>({ tableNumber: null });

export function TableProvider({ children }: { children: ReactNode }) {
  const [tableNumber, setTableNumber] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const table  = params.get('table') ?? params.get('t');
    if (table && table.trim()) {
      setTableNumber(table.trim());
    }
  }, []);

  return (
    <TableContext.Provider value={{ tableNumber }}>
      {children}
    </TableContext.Provider>
  );
}

export function useTable() {
  return useContext(TableContext);
}