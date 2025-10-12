import type { NextApiRequest, NextApiResponse } from 'next'
import { getDatabase } from '@/database'
import { Produto } from '@/database/models'
import { ObjectId } from 'mongodb'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query
  
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'ID inválido' })
  }

  const db = await getDatabase()
  const collection = db.collection<Produto>('produtos')

  if (req.method === 'DELETE') {
    try {
      const result = await collection.deleteOne({ _id: new ObjectId(id) })

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Produto não encontrado' })
      }

      res.status(200).json({ message: 'Produto deletado com sucesso' })
    } catch (error) {
      console.error('Erro ao deletar produto:', error)
      res.status(500).json({ error: 'Erro ao deletar produto' })
    }
  } else {
    res.setHeader('Allow', ['DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}