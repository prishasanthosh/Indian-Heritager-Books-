'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

type CartItem = { id: string; quantity: number }
type CartContextValue = { items: CartItem[]; count: number; add: (id: string, quantity?: number, stock?: number) => void; remove: (id: string) => void; setQuantity: (id: string, quantity: number, stock?: number) => void; clear: () => void }
const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loaded, setLoaded] = useState(false)
  useEffect(() => { try { setItems(JSON.parse(window.localStorage.getItem('indian-heritager-cart') || '[]')) } catch {} finally { setLoaded(true) } }, [])
  useEffect(() => { if (loaded) window.localStorage.setItem('indian-heritager-cart', JSON.stringify(items)) }, [items, loaded])
  const value = useMemo(() => ({
    items,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    add: (id: string, quantity = 1, stock = 20) => setItems((current) => {
      const maxQuantity = Math.min(20, Math.max(0, stock))
      if (maxQuantity === 0) return current
      const existing = current.find((item) => item.id === id)
      return existing
        ? current.map((item) => item.id === id ? { ...item, quantity: Math.min(maxQuantity, item.quantity + quantity) } : item)
        : [...current, { id, quantity: Math.min(maxQuantity, quantity) }]
    }),
    remove: (id: string) => setItems((current) => current.filter((item) => item.id !== id)),
    setQuantity: (id: string, quantity: number, stock = 20) => setItems((current) => quantity <= 0
      ? current.filter((item) => item.id !== id)
      : current.map((item) => item.id === id ? { ...item, quantity: Math.min(20, Math.max(1, stock), quantity) } : item)),
    clear: () => setItems([]),
  }), [items])
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
export function useCart() { const value = useContext(CartContext); if (!value) throw new Error('useCart must be used within CartProvider'); return value }
export type { CartItem }
