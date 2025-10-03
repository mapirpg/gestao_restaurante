export interface Cliente {
  _id?: string
  nome: string
  email: string
  telefone: string
  endereco?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface Produto {
  _id?: string
  nome: string
  descricao: string
  preco: number
  categoria: string
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

export interface Pedido {
  _id?: string
  clienteId: string
  itens: ItemPedido[]
  total: number
  status: 'pendente' | 'preparando' | 'pronto' | 'entregue' | 'cancelado'
  observacoes?: string
  createdAt?: Date
  updatedAt?: Date
}