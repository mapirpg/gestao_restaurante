import type { NextApiRequest, NextApiResponse } from 'next'
import { getDatabase } from '@/database'
import { Produto, ProdutoCategoria } from '@/database/models'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = await getDatabase()
  const collection = db.collection<Produto>('produtos')

  switch (req.method) {
    case 'GET':
      try {
        const { categoria, disponivel, busca, precoMin, precoMax, ordenacao } = req.query
        
        const query: any = {}
        
        if (categoria && categoria !== 'todas') {
          query.categoria = categoria as ProdutoCategoria
        }

        if (disponivel !== undefined && disponivel !== 'todos') {
          query.disponivel = disponivel === 'true'
        }

        if (busca && busca !== '') {
          query.$or = [
            { nome: { $regex: busca, $options: 'i' } },
            { descricao: { $regex: busca, $options: 'i' } }
          ]
        }

        if (precoMin || precoMax) {
          query.preco = {}
          
          if (precoMin) {
            query.preco.$gte = parseFloat(precoMin as string)
          }
          
          if (precoMax) {
            query.preco.$lte = parseFloat(precoMax as string)
          }
        }

        let sort: any = { nome: 1 }

        if (ordenacao) {
          switch (ordenacao) {
            case 'nome_asc':
              sort = { nome: 1 }
              break
            case 'nome_desc':
              sort = { nome: -1 }
              break
            case 'preco_asc':
              sort = { preco: 1 }
              break
            case 'preco_desc':
              sort = { preco: -1 }
              break
          }
        }

        const produtos = await collection
          .find(query)
          .sort(sort)
          .toArray()

        console.log('Query MongoDB (Produtos):', JSON.stringify(query, null, 2))
        console.log('Total de produtos encontrados:', produtos.length)

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

    case 'PUT':
      try {
        const { _id, ...updateData } = req.body
        
        const result = await collection.findOneAndUpdate(
          { _id },
          { 
            $set: {
              ...updateData,
              updatedAt: new Date()
            }
          },
          { returnDocument: 'after' }
        )

        if (!result) {
          res.status(404).json({ error: 'Produto não encontrado' })
          return
        }

        res.status(200).json(result)
      } catch (error) {
        console.error('Erro ao atualizar produto:', error)
        res.status(500).json({ error: 'Erro ao atualizar produto' })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}