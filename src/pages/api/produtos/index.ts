 
import type { NextApiRequest, NextApiResponse } from 'next'
import { getDatabase } from '@/database'
import { Produto } from '@/database/models'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = await getDatabase()
  const collection = db.collection<Produto>('produtos')

  switch (req.method) {
    case 'GET':
      try {
        const consulta = req.query
        let categorias: string | string[] = []
        let disponiveis: string | string[] = []
        
        if (consulta.categoria) {
          categorias = consulta.categoria
        }

        if (consulta.disponivel) {
          disponiveis = consulta.disponivel
        }

        const filtrados = {
          categorias,
          disponiveis
        }

        const produtos = await collection.find(filtrados).toArray()

        res.status(200).json(produtos)
      } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar produtos' })
      }
      break

    case 'POST':
      try {
        const produto: Produto = {
          ...req.body,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        const result = await collection.insertOne(produto)
        res.status(201).json({ id: result.insertedId, ...produto })
      } catch (error) {
        res.status(500).json({ error: 'Erro ao criar produto' })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}