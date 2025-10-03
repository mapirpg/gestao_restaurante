import type { NextApiRequest, NextApiResponse } from 'next'
import { getDatabase } from '@/database'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const db = await getDatabase()
    
    // Teste simples: listar coleções
    const collections = await db.listCollections().toArray()
    
    res.status(200).json({ 
      message: 'Conexão bem-sucedida!',
      database: db.databaseName,
      collections: collections.map(c => c.name)
    })
  } catch (error) {
    console.error('Erro de conexão:', error)
    res.status(500).json({ 
      error: 'Erro ao conectar com o banco de dados',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    })
  }
}