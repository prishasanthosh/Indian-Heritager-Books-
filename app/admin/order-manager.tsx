'use client'

import { useState } from 'react'
import { statusValues, orderStatusLabels, type Order } from '@/lib/db/schema'

export function OrderManager({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders)
  const [saving, setSaving] = useState<string | null>(null)
  async function updateStatus(id: string, status: string) {
    setSaving(id)
    const response = await fetch('/api/admin/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) })
    if (response.ok) {
      const updated = await response.json() as Order
      setOrders((current) => current.map((order) => order.id === id ? updated : order))
    }
    setSaving(null)
  }
  return <section className="overflow-hidden bg-white"><div className="border-b border-[#eadfce] p-5"><h2 className="font-serif text-2xl">Order management</h2><p className="mt-1 text-sm text-[#59645f]">Update fulfilment status. Orders remain immutable records.</p></div>{orders.length === 0 ? <p className="p-5 text-[#59645f]">No orders have been recorded yet.</p> : <div className="divide-y divide-[#eadfce]">{orders.map((order) => <div key={order.id} className="flex flex-wrap items-center justify-between gap-4 p-5 text-sm"><div><p className="font-bold">{order.customerName}</p><p className="text-[#59645f]">{order.id} · {order.customerEmail}</p><p className="mt-1 text-xs text-[#59645f]">{order.createdAt.toLocaleDateString('en-IN')} · ₹{order.total.toLocaleString('en-IN')}</p></div><select aria-label={`Status for ${order.id}`} disabled={saving === order.id} value={order.status} onChange={(event) => updateStatus(order.id, event.target.value)} className="border border-[#dcd3c2] bg-[#fbfaf6] px-3 py-2 font-bold text-[#183d38]">{statusValues.map((status) => <option key={status} value={status}>{orderStatusLabels[status]}</option>)}</select></div>)}</div>}</section>
}
