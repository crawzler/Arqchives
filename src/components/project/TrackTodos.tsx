'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Plus, Check, Trash2, GripVertical, RotateCw, X, Edit2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

interface TrackTodosProps {
  todos: import('@/types').TodoItem[]
  projectColor: string
  onToggle: (todoId: string) => void
  onAdd?: (text: string) => void
  onEdit?: (todoId: string, text: string) => void
  onDelete?: (todoId: string) => void
  onReorder?: (reordered: import('@/types').TodoItem[]) => void
  triggerRef?: React.RefObject<HTMLButtonElement>
  templateCount?: number
  onApplyTemplate?: () => void
}

export function TrackTodos({
  todos,
  projectColor,
  onToggle,
  onAdd,
  onEdit,
  onDelete,
  onReorder,
  triggerRef,
  templateCount,
  onApplyTemplate,
}: TrackTodosProps) {
  const [showPopover, setShowPopover] = useState(false)
  const [newTodoText, setNewTodoText] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        if (triggerRef?.current && !triggerRef.current.contains(e.target as Node)) {
          setShowPopover(false)
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodoText.trim()) return
    onAdd?.(newTodoText.trim())
    setNewTodoText('')
  }

  const handleEditSave = (id: string) => {
    if (!editText.trim()) return
    onEdit?.(id, editText.trim())
    setEditingId(null)
  }

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    const sourceId = e.dataTransfer.getData('text/plain')
    if (sourceId && sourceId !== targetId) {
      const sourceIndex = todos.findIndex(t => t.id === sourceId)
      const targetIndex = todos.findIndex(t => t.id === targetId)
      if (sourceIndex !== -1 && targetIndex !== -1) {
        const newTodos = [...todos]
        const [removed] = newTodos.splice(sourceIndex, 1)
        newTodos.splice(targetIndex, 0, removed)
        onReorder?.(newTodos)
      }
    }
  }

  const openPopover = () => setShowPopover(true)
  const closePopover = () => setShowPopover(false)

  useEffect(() => {
    if (triggerRef?.current) {
      triggerRef.current.onclick = openPopover
    }
  }, [triggerRef])

  return (
    <>
      <button
        ref={triggerRef}
        className={cn(
          "flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors",
          todos.length > 0 ? "text-white hover:bg-white/10" : "text-neutral-500 hover:text-white hover:bg-white/5"
        )}
        onClick={openPopover}
        aria-haspopup="true"
        aria-expanded={showPopover}
      >
        <Check className={cn("w-4 h-4", todos.some(t => t.done) && "text-green-400")} />
        <span className="text-xs font-medium">{todos.filter(t => t.done).length}/{todos.length}</span>
      </button>

      <AnimatePresence>
        {showPopover && (
          <motion.div
            ref={popoverRef}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="fixed z-50 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl w-80"
            style={{ top: triggerRef.current?.getBoundingClientRect().bottom! + 8, left: triggerRef.current?.getBoundingClientRect().left! - 280 }}
          >
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
              <h3 className="font-semibold text-white">Tarefas da Faixa</h3>
              <button onClick={closePopover} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>

            {onAdd && (
              <form onSubmit={handleAdd} className="p-4 border-b border-neutral-800 flex gap-2">
                <input
                  value={newTodoText}
                  onChange={e => setNewTodoText(e.target.value)}
                  placeholder="Nova tarefa..."
                  className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                  autoFocus
                />
                <Button type="submit" size="sm" style={{ '--accent': projectColor }}>
                  <Plus className="w-3.5 h-3.5" />
                </Button>
              </form>
            )}

            {templateCount && templateCount > 0 && onApplyTemplate && (
              <div className="px-4 py-3 border-b border-neutral-800">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2"
                  onClick={onApplyTemplate}
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Aplicar template ({templateCount} tarefas)</span>
                </Button>
              </div>
            )}

            <div className="max-h-80 overflow-y-auto">
              {todos.length === 0 ? (
                <div className="p-8 text-center text-neutral-500 text-sm">Nenhuma tarefa</div>
              ) : (
                <ul className="divide-y divide-neutral-800">
                  {todos.map((todo, index) => (
                    <motion.li
                      key={todo.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="group"
                    >
                      {editingId === todo.id ? (
                        <form onSubmit={e => { e.preventDefault(); handleEditSave(todo.id) }} className="p-3 flex gap-2">
                          <input
                            value={editText}
                            onChange={e => setEditText(e.target.value)}
                            className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                            autoFocus
                            onKeyDown={e => e.key === 'Enter' && handleEditSave(todo.id)}
                          />
                          <Button type="submit" size="sm" variant="ghost"><Check className="w-3.5 h-3.5" /></Button>
                          <Button type="button" size="sm" variant="ghost" onClick={() => setEditingId(null)}><X className="w-3.5 h-3.5" /></Button>
                        </form>
                      ) : (
                        <div
                          className="flex items-center gap-2 p-3 hover:bg-neutral-800/50 transition-colors"
                          draggable
                          onDragStart={e => handleDragStart(e, todo.id)}
                          onDragOver={e => handleDragOver(e)}
                          onDrop={e => handleDrop(e, todo.id)}
                        >
                          <button
                            onClick={() => onToggle(todo.id)}
                            className={cn(
                              "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all",
                              todo.done
                                ? "bg-green-500 border-green-500 text-white"
                                : "border-neutral-600 text-transparent hover:border-white/30"
                            )}
                          >
                            {todo.done && <Check className="w-3 h-3" />}
                          </button>
                          <span className={cn("flex-1 text-sm truncate", todo.done && "line-through text-neutral-500")}>
                            {todo.text}
                          </span>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => { setEditingId(todo.id); setEditText(todo.text) }}
                              className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white"
                              title="Editar"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDelete?.(todo.id)}
                              className="w-8 h-8 rounded-lg hover:bg-red-600/20 flex items-center justify-center text-neutral-400 hover:text-red-400"
                              title="Deletar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <span className="w-8 h-8 flex items-center justify-center text-neutral-500 cursor-grab active:cursor-grabbing" title="Reordenar">
                              <GripVertical className="w-4 h-4" />
                            </span>
                          </div>
                        </div>
                      )}
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}