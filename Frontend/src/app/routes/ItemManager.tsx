import { useState, useEffect } from 'react'
import { Search, Plus, Edit2, Trash2, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { getItems, createItem, updateItem, deleteItem } from '../../features/item/api'
import type { Item } from '../../types'

const itemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional()
})
type ItemFormValues = z.infer<typeof itemSchema>

export default function ItemManager() {
  const [items, setItems] = useState<Item[]>([])
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(true)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema)
  })

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const data = await getItems()
      setItems(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: ItemFormValues) => {
    try {
      if (editingItem) {
        await updateItem(editingItem.id, data)
      } else {
        await createItem({ ...data })
      }
      closeModal()
      fetchItems()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure?')) return
    try {
      await deleteItem(id)
      fetchItems()
    } catch (err) {
      console.error(err)
    }
  }

  const openModal = (item?: Item) => {
    if (item) {
      setEditingItem(item)
      reset({ title: item.title, description: item.description || '' })
    } else {
      setEditingItem(null)
      reset({ title: '', description: '' })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingItem(null)
    reset()
  }

  const filteredItems = items.filter(i => 
    i.title.toLowerCase().includes(search.toLowerCase()) || 
    (i.description?.toLowerCase() || '').includes(search.toLowerCase())
  )

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Items</h1>
          <p className="page-subtitle">Manage your inventory or list items</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <Plus size={16} /> New Item
        </button>
      </div>

      <div className="card">
        <div className="card-header" style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dim)' }} />
            <input
              type="text"
              placeholder="Search items..."
              className="form-input"
              style={{ paddingLeft: '36px' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center' }}><span className="spinner" /></div>
        ) : filteredItems.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--color-text-dim)' }}>
            No items found.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-alt)' }}>
                  <th style={{ padding: '12px 24px', fontWeight: 500, fontSize: '13px', color: 'var(--color-text-dim)' }}>Title</th>
                  <th style={{ padding: '12px 24px', fontWeight: 500, fontSize: '13px', color: 'var(--color-text-dim)' }}>Description</th>
                  <th style={{ padding: '12px 24px', fontWeight: 500, fontSize: '13px', color: 'var(--color-text-dim)', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '16px 24px', fontWeight: 500 }}>{item.title}</td>
                    <td style={{ padding: '16px 24px', color: 'var(--color-text-dim)' }}>{item.description || '-'}</td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button className="btn btn-icon" onClick={() => openModal(item)}><Edit2 size={16} /></button>
                        <button className="btn btn-icon" onClick={() => handleDelete(item.id)} style={{ color: 'var(--color-danger)' }}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">{editingItem ? 'Edit Item' : 'Create Item'}</h2>
              <button className="btn-icon" onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-dim)' }}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className={`form-input ${errors.title ? 'input-error' : ''}`}
                    {...register('title')}
                  />
                  {errors.title && <p className="error-text" style={{color:'red', fontSize:'12px', marginTop:'4px'}}>{errors.title.message}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-input"
                    rows={4}
                    {...register('description')}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? <span className="spinner" /> : null}
                  {editingItem ? 'Save Changes' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
