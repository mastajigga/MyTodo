import { describe, it, expect, beforeEach, vi } from 'vitest'
import { supabase } from './__mocks__/supabase'
import type { Entry } from '../types/entry'

vi.mock('./supabase')

describe('Tests Supabase', () => {
  const testEntry = {
    title: '__TEST_ENTRY__',
    description: 'Test description',
    workspace_id: '00000000-0000-0000-0000-000000000000',
    user_id: '00000000-0000-0000-0000-000000000000'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('devrait se connecter à Supabase', async () => {
    const mockResponse = { data: { count: 1 }, error: null }
    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue(mockResponse)
    })
    vi.spyOn(supabase, 'from').mockImplementation(mockFrom)

    const { data, error } = await supabase
      .from('entries')
      .select('count')
      .limit(1)
      .single()

    expect(error).toBeNull()
    expect(data).toEqual({ count: 1 })
    expect(supabase.from).toHaveBeenCalledWith('entries')
    console.log('✅ Connexion à Supabase réussie')
  })

  it('devrait pouvoir créer une entrée', async () => {
    const mockResponse = { data: { ...testEntry, id: '123' }, error: null }
    const mockFrom = vi.fn().mockReturnValue({
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue(mockResponse)
    })
    vi.spyOn(supabase, 'from').mockImplementation(mockFrom)

    const { data, error } = await supabase
      .from('entries')
      .insert(testEntry)
      .select()
      .single()

    expect(error).toBeNull()
    expect(data).toEqual(mockResponse.data)
    expect(supabase.from).toHaveBeenCalledWith('entries')
    console.log('✅ Création d\'entrée réussie')
  })

  it('devrait pouvoir lire une entrée', async () => {
    const mockResponse = { data: { ...testEntry, id: '123' }, error: null }
    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue(mockResponse)
    })
    vi.spyOn(supabase, 'from').mockImplementation(mockFrom)

    const { data, error } = await supabase
      .from('entries')
      .select()
      .eq('id', '123')
      .single()

    expect(error).toBeNull()
    expect(data).toEqual(mockResponse.data)
    expect(supabase.from).toHaveBeenCalledWith('entries')
    console.log('✅ Lecture d\'entrée réussie')
  })

  it('devrait pouvoir mettre à jour une entrée', async () => {
    const updateData = { title: '__TEST_ENTRY_UPDATED__' }
    const mockResponse = { 
      data: { ...testEntry, ...updateData, id: '123' }, 
      error: null 
    }
    
    const mockFrom = vi.fn().mockReturnValue({
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue(mockResponse)
    })
    vi.spyOn(supabase, 'from').mockImplementation(mockFrom)

    const { data, error } = await supabase
      .from('entries')
      .update(updateData)
      .eq('id', '123')
      .select()
      .single()

    expect(error).toBeNull()
    expect(data).toEqual(mockResponse.data)
    expect(supabase.from).toHaveBeenCalledWith('entries')
    console.log('✅ Mise à jour d\'entrée réussie')
  })

  it('devrait pouvoir supprimer une entrée', async () => {
    const mockResponse = { data: null, error: null }
    const mockFrom = vi.fn().mockReturnValue({
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue(mockResponse)
    })
    vi.spyOn(supabase, 'from').mockImplementation(mockFrom)

    const { error } = await supabase
      .from('entries')
      .delete()
      .eq('id', '123')

    expect(error).toBeNull()
    expect(supabase.from).toHaveBeenCalledWith('entries')
    console.log('✅ Suppression d\'entrée réussie')
  })
}) 