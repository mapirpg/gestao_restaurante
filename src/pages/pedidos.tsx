/* eslint-disable react-hooks/exhaustive-deps */
 
import { InProgress } from "@/components/InProgress";
import { Statistics } from "@/components/Statistics";
import { Toast } from "@/components/Toast";
import { API_BASE_URL, headers } from "@/config";
import { Cliente, ItemPedido, Pedido, Produto } from "@/database/models";
import { Add, Delete } from "@mui/icons-material";
import { 
  AlertProps, 
  FormControl, 
  TextField, 
  Typography, 
  InputLabel, 
  Select, 
  MenuItem, 
  Button,
  CircularProgress,
  Grid,
  Box,
  IconButton,
  Tabs,
  Tab,
  ChipProps} from "@mui/material";
import React, { useCallback } from "react";

const apiUrl = API_BASE_URL

export default function Pedidos() {
  const [toastMessage, setToastMessage] = React.useState<{ message: string | undefined, type: AlertProps['severity']} | undefined>();
  const [carregandoProdutos, setCarregandoProdutos] = React.useState(false);
  const [carregandoClientes, setCarregandoClientes] = React.useState(false);
  const [carregandoPedidos, setCarregandoPedidos] = React.useState(false);

  const [tabValue, setTabValue] = React.useState(0);
  
  const [produtos, setProdutos] = React.useState<Produto[]>([]);
  const [clientes, setClientes] = React.useState<Cliente[]>([]);
  const [itensPedido, setItensPedido] = React.useState<{ produto: Produto; quantidade: number }[]>([]);

  const [produtoSelecionado, setProdutoSelecionado] = React.useState<Produto>();
  const [quantidadeSelecionada, setQuantidadeSelecionada] = React.useState<number>(1);
  const [clienteSelecionado, setClienteSelecionado] = React.useState<Cliente>();
  const [total, setTotal] = React.useState<number>(0);

  const [observacoes, setObservacoes] = React.useState<string>('');

  const [pedidos, setPedidos] = React.useState<Pedido[]>([]);
  const [pedidoSelecionado, setPedidoSelecionado] = React.useState<Pedido>();
  const [ancoraStatusMenu, setAncoraStatusMenu] = React.useState<null | HTMLElement>(null);

  const [filtrosAbertos, setFiltrosAbertos] = React.useState(false);
  const [filtros, setFiltros] = React.useState({
    status: 'todos',
    clienteId: 'todos',
    busca: '',
    ordenacao: 'data_desc' as 'data_desc' | 'data_asc' | 'valor_desc' | 'valor_asc',
    dataInicio: '',
    dataFim: '',
    valorMin: '',
    valorMax: ''
  });


  function alterarAba(event: React.SyntheticEvent, newValue: number) {
    setTabValue(newValue);
  };

  function adicionarItemPedido() {
    if (!produtoSelecionado) {
      setToastMessage({ message: 'Selecione um produto', type: 'warning' });
      return;
    }

    if (quantidadeSelecionada <= 0) {
      setToastMessage({ message: 'Quantidade deve ser maior que zero', type: 'warning' });
      return;
    }

    const novaLista = [...itensPedido, { produto: produtoSelecionado, quantidade: quantidadeSelecionada }]
    setItensPedido(novaLista);
    setProdutoSelecionado(undefined);
    setQuantidadeSelecionada(1);
  }

  function removerItemPedido(index: number) {
    const novaLista = itensPedido.filter((_, i) => i !== index);
    setItensPedido(novaLista);
  }

  async function listarPedidos(): Promise<Pedido[] | null> {
    const params = new URLSearchParams();
    
    if (filtros.status !== 'todos') {
      params.append('status', filtros.status);
    }
    
    if (filtros.clienteId !== 'todos') {
      params.append('clienteId', filtros.clienteId);
    }
    
    if (filtros.busca) {
      params.append('busca', filtros.busca);
    }
    
    if (filtros.ordenacao) {
      params.append('ordenacao', filtros.ordenacao);
    }
    
    if (filtros.dataInicio) {
      params.append('dataInicio', filtros.dataInicio);
    }
    
    if (filtros.dataFim) {
      params.append('dataFim', filtros.dataFim);
    }
    
    if (filtros.valorMin) {
      params.append('valorMin', filtros.valorMin);
    }
    
    if (filtros.valorMax) {
      params.append('valorMax', filtros.valorMax);
    }

    const url = `${apiUrl}/pedidos?${params.toString()}`;
    console.log('Buscando pedidos com filtros:', url);

    const res = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (res.ok) {
      const pedidos: Pedido[] = await res.json();
      console.log('Pedidos retornados do backend:', pedidos.length);
      return pedidos;
    } else {
      console.error('Erro ao listar pedidos:', res.statusText);
      return null;
    }
  }

  async function enviarFormulario(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!clienteSelecionado?._id) {
      setToastMessage({ message: 'Selecione um cliente', type: 'warning' });
      return;
    }

    if (!itensPedido.length) {
      setToastMessage({ message: 'Adicione ao menos um item ao pedido', type: 'warning' });
      return;
    }

    const itens: ItemPedido[] = itensPedido
      .map(item => item?.produto?._id ? ({
          produtoId: item.produto._id,
          quantidade: item.quantidade,
          nome: item.produto.nome,
          preco: item.produto.preco,
        }) : null)
      .filter(i => i !== null)

    const pedido: Pedido = {
      total,
      itens,
      cliente: clienteSelecionado,
      status: 'preparando',
      observacoes: observacoes || undefined,
    };

    const resposta = await fetch(apiUrl + '/pedidos', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(pedido)
    });

    if (resposta.ok) {
      setToastMessage({ message: 'Pedido cadastrado com sucesso', type: 'success' });
      limparFormularioPedido();
      await atualizarPedidos();
    } else {
      setToastMessage({ message: `Erro ao cadastrar pedido`, type: 'error' });
    }
  }

  function limparFormularioPedido() {
    setItensPedido([]);
    setClienteSelecionado(undefined);
    setProdutoSelecionado(undefined);
    setQuantidadeSelecionada(1);
    setTotal(0);
    setObservacoes('');
  }

  async function inicializarDados() {
    setCarregandoProdutos(true);
    setCarregandoClientes(true);
    setCarregandoPedidos(true);
  
    const listaProdutos = await fetch(apiUrl + '/produtos')

    if (listaProdutos.ok) {
      const produtos: Produto[] = await listaProdutos.json();
      setProdutos(produtos);
    } else {
      setToastMessage({ message: 'Erro ao carregar produtos', type: 'error' });
    }
    setCarregandoProdutos(false);
  
    const listaClientes = await fetch(apiUrl + '/clientes')

    if (listaClientes.ok) {
      const clientes: Cliente[] = await listaClientes.json();
      setClientes(clientes);
    } else {
      setToastMessage({ message: 'Erro ao carregar clientes', type: 'error' });
    }
    setCarregandoClientes(false);

    const listaPedidos = await listarPedidos()
    setPedidos(listaPedidos || []);
    setCarregandoPedidos(false);
  }

  const atualizarTotal = useCallback(() => {
    const novoTotal = itensPedido.reduce((acc, item) => acc + (item.produto.preco * item.quantidade), 0);
    setTotal(novoTotal);
  }, [itensPedido]);

  const atualizarPedidos = useCallback(async () => {
    if (tabValue === 1) {
      setCarregandoPedidos(true);
      const lista = await listarPedidos()
      setPedidos(lista || []);
      setCarregandoPedidos(false);
    }
  }, [tabValue, filtros]);

  function limparFiltros() {
    setFiltros({
      status: 'todos',
      clienteId: 'todos',
      busca: '',
      ordenacao: 'data_desc',
      dataInicio: '',
      dataFim: '',
      valorMin: '',
      valorMax: ''
    });
  }

  function corDoStatus(status: string): ChipProps['color'] {
    switch (status) {
      case 'preparando':
        return 'info';
      case 'pronto':
        return 'success';
      case 'entregue':
        return 'default';
      default:
        return 'default';
    }
  }

  function abrirMenuStatus(event: React.MouseEvent<HTMLElement>, pedido: Pedido) {
    setPedidoSelecionado(pedido);
    setAncoraStatusMenu(event.currentTarget);
  }

  function fecharMenuStatus() {
    setAncoraStatusMenu(null);
  }

  async function alterarStatusPedido(novoStatus: Pedido['status']) {
    if (!pedidoSelecionado?._id) return;

    if (pedidoSelecionado.status === novoStatus) {
      fecharMenuStatus();
      return;
    }

    const pedidoAtualizado = { ...pedidoSelecionado, status: novoStatus };

    const resposta = await fetch(apiUrl + '/pedidos', {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(pedidoAtualizado)
    });

    if (resposta.ok) {
      setToastMessage({ message: 'Status do pedido atualizado com sucesso', type: 'success' });
      await atualizarPedidos();
    } else {
      setToastMessage({ message: `Erro ao atualizar status do pedido`, type: 'error' });
    }

    fecharMenuStatus();
  }

  const desabilitarEnvio = !itensPedido.length || carregandoClientes || carregandoProdutos || !clienteSelecionado;
  const desabilitarAlterarAba = carregandoClientes || carregandoProdutos || itensPedido.length || carregandoPedidos;

  React.useEffect(() => {
    atualizarTotal();
  }, [atualizarTotal]);

  React.useEffect(() => {
    atualizarPedidos();
  }, [atualizarPedidos]);

  React.useEffect(() => {
    inicializarDados();
  }, []);

  return (
    <div>
      <Toast
        open={!!toastMessage}
        type={toastMessage?.type}
        message={toastMessage?.message}
        onClose={() => setToastMessage(undefined)}
      />

      <Tabs value={tabValue} onChange={alterarAba} style={{ marginBottom: 20 }}>
        <Tab label="Adicionar Pedido" />
        <Tab disabled={Boolean(desabilitarAlterarAba)} label="Pedidos em andamento"  />
        <Tab disabled={Boolean(desabilitarAlterarAba)} label="Estatísticas"  />
      </Tabs>

      {tabValue === 0 && (
        <form onSubmit={enviarFormulario} style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '70svh' }}>
          <Grid container spacing={2} >
            <Grid size={4} spacing={2}>
              {carregandoProdutos ? <CircularProgress /> : (
                <>
                  <FormControl size="small" fullWidth>
                    <InputLabel>Produtos</InputLabel>
                      <Select 
                        name="produtos" 
                        defaultValue="" 
                        label="Produtos"
                        value={produtoSelecionado?._id || ''}
                      >
                        {produtos.map(produto => (
                          <MenuItem 
                            key={produto._id} value={produto._id}
                            onClick={() => setProdutoSelecionado(produto)}
                          >
                            {produto.nome}
                          </MenuItem>
                        ))}
                      </Select>
                  </FormControl>

                  <TextField  
                  fullWidth 
                  type="number" 
                  size="small" 
                  name="quantidade" 
                  placeholder="Quantidade"
                  value={quantidadeSelecionada}
                  onChange={(e) => setQuantidadeSelecionada(Number(e.target.value))}
                  >
                    Quantidade
                  </TextField>

                  <Button onClick={adicionarItemPedido} fullWidth endIcon={<Add />}>
                    Adicionar Item
                  </Button>
                </>
              )}
            </Grid>

            <Grid size={4} style={{ maxHeight: '70svh', overflowY: 'auto' }} >
              {itensPedido.map((item, index) => {
                return (
                  <Box 
                    key={index} 
                    sx={{ 
                      border: '1px solid #ccc', 
                      borderRadius: '4px', 
                      padding: '8px', 
                      marginBottom: '8px', 
                      display: 'flex', 
                      flexDirection: 'row',
                      justifyContent: 'space-between', 
                      alignItems: 'center' 
                    }}
                  >
                    <Box>
                      <Typography variant="body1">{item.produto.nome}</Typography>
                      <Typography variant="body2">Quantidade: {item.quantidade}</Typography>
                    </Box>
                    <Box>
                      <IconButton onClick={() => removerItemPedido(index)}>
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                );
              })}
            </Grid>

            <Grid size={4} sx={{height: '70svh' }} >
              {carregandoClientes ? <CircularProgress /> : (
                <Box
                  sx={{ display: 'flex', flexDirection: 'column', gap: 2 , justifyContent: 'space-between', height: '100%'}}
                >
                  <Box>
                    <FormControl size="small" fullWidth>
                      <InputLabel>Cliente</InputLabel>
                        <Select 
                          name="cliente" 
                          defaultValue="" 
                          label="Clientes"
                          value={clienteSelecionado?._id || ''}
                        >
                          {clientes.map(cliente => (
                            <MenuItem 
                              key={cliente._id} 
                              value={cliente._id}
                              onClick={() => setClienteSelecionado(cliente)}  
                            >
                              {cliente.nome}
                            </MenuItem>
                          ))}
                        </Select>
                    </FormControl>

                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Observações"
                      value={observacoes}
                      onChange={(e) => setObservacoes(e.target.value)}
                      placeholder="Observações sobre o pedido (opcional)"
                      sx={{ mt: 2 }}
                    />

                    <Typography variant="h6" style={{ marginTop: 16 }}>
                      Total: R$ {total.toFixed(2)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', justifyContent: 'flex-end' }}>
                    <Button onClick={limparFormularioPedido} variant="outlined" color="secondary">Limpar Formulário</Button>        
                    <Button  disabled={desabilitarEnvio} type="submit" variant="contained">Cadastrar Pedido</Button>
                  </Box>
                </Box>
              )}
            </Grid>
          </Grid>
        </form>
      )}

      {tabValue === 1 && (
        <InProgress
          clientes={clientes}
          pedidosFiltrados={pedidos}
          produtos={produtos}
          corDoStatus={corDoStatus}
          pedidos={pedidos} 
          carregandoPedidos={carregandoPedidos}
          filtrosAbertos={filtrosAbertos}
          setFiltrosAbertos={setFiltrosAbertos}
          filtros={filtros}
          setFiltros={setFiltros}
          abrirMenuStatus={abrirMenuStatus}
          ancoraStatusMenu={ancoraStatusMenu}
          fecharMenuStatus={fecharMenuStatus}
          alterarStatusPedido={alterarStatusPedido}
          atualizarPedidos={atualizarPedidos}
          limparFiltros={limparFiltros}
        />
      )}

      {tabValue === 2 && (
        <Statistics corDoStatus={corDoStatus} />
      )}
    </div>
  )
}