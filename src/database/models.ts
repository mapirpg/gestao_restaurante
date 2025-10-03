export interface Cliente {
  _id?: string
  nome: string
  createdAt?: Date
  updatedAt?: Date
}

export type ProdutoCategoria = 'bebida' | 'comida' | 'sobremesa' | 'outro'

export interface Produto {
  _id?: string
  nome: string
  descricao: string
  preco: number
  categoria: ProdutoCategoria
  disponivel: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface ItemPedido {
  produtoId: string
  nome: string
  quantidade: number
  preco: number
}

export type StatusPedido  = 'pendente' | 'preparando' | 'pronto' | 'entregue' | 'cancelado'

export interface Pedido {
  _id?: string
  clienteId: string
  itens: ItemPedido[]
  total: number
  status: StatusPedido
  observacoes?: string
  createdAt?: Date
  updatedAt?: Date
}