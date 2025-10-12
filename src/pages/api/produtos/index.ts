 
import type { NextApiRequest, NextApiResponse } from 'next'
import { getDatabase } from '@/database'
import { Produto, ProdutoCategoria } from '@/database/models'

interface FiltrosProduto {
  categoria?: ProdutoCategoria
  disponivel?: boolean
}

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
        const filtro: FiltrosProduto = {}
        
        if (consulta.categoria) {
          filtro.categoria = consulta.categoria as ProdutoCategoria
        }

        if (consulta.disponivel) {
          filtro.disponivel = consulta.disponivel === 'true'
        }

        const produtos = await collection.find(filtro).toArray()

        res.status(200).json(produtos)
      } catch (error) {
        console.error('Erro ao buscar produtos:', error)
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
        res.status(201).json({ _id: result.insertedId.toString(), ...produto })
      } catch (error) {
        console.error('Erro ao criar produto:', error)
        res.status(500).json({ error: 'Erro ao criar produto' })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}