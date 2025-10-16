import { Produto, ProdutoCategoria } from "@/database/models";
import { AlertProps, Box, Button, TextField, Typography, FormControlLabel, Switch, Select, MenuItem, FormControl, InputLabel, Card, CardContent, IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { API_BASE_URL, headers } from '@/config'
import React from "react";
import { Toast } from "@/components/Toast";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const apiUrl = API_BASE_URL

export default function Produtos() {
  const [toastMessage, setToastMessage] = React.useState<{ message: string | undefined, type: AlertProps['severity']} | undefined>();
  const [produtos, setProdutos] = React.useState<Produto[]>([]);
  const [produtoParaDeletar, setProdutoParaDeletar] = React.useState<Produto | null>(null);
  const [produtoSelecionado, setProdutoSelecionado] = React.useState<Produto | null>(null);
  const [edicaoProduto, setEdicaoProduto] = React.useState<Omit<Produto, '_id' | 'createdAt' | 'updatedAt'> | null>(null);

  async function cadastrarProduto(data: Omit<Produto, '_id' | 'createdAt' | 'updatedAt'>): Promise<Produto | null> {
    const res = await fetch(apiUrl + '/produtos', {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const produto: Produto = await res.json();
      setProdutos(v => [...v, produto]);
      return produto;
    } else {
      return null;
    }
  }

  async function listarProdutos(): Promise<Produto[] | null> {
    const res = await fetch(apiUrl + '/produtos', {
      method: 'GET',
      headers,
    });

    if (res.ok) {
      const produtos: Produto[] = await res.json();
      return produtos;
    } else {
      return null;
    }
  }

  async function deletarProduto(produto: Produto): Promise<void> {
    if (!produto._id) return;

    setProdutoParaDeletar(produto);
  }

  async function selecionarProdutoParaEdicao(produto: Produto): Promise<void> {
    setProdutoSelecionado(produto);
    setEdicaoProduto({
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco,
      quantidade: produto.quantidade,
      categoria: produto.categoria,
      disponivel: produto.disponivel,
    });
  }

  async function enviarFormularioEdicao(): Promise<void> {
    if (!produtoSelecionado?._id || !edicaoProduto) return;

    const res = await fetch(apiUrl + '/produtos/' + produtoSelecionado._id, {
      method: 'PUT',
      headers,
      body: JSON.stringify(edicaoProduto),
    });

    if (res.ok) {
      const produtoAtualizado: Produto = await res.json();
      setProdutos(prev => prev.map(p => p._id === produtoAtualizado._id ? produtoAtualizado : p));
      setToastMessage({ message: `Produto ${produtoAtualizado.nome} atualizado com sucesso!`, type: 'success' });
      setProdutoSelecionado(null);
      setEdicaoProduto(null);
    } else {
      setToastMessage({ message: 'Erro ao atualizar produto.', type: 'error' });
    }
  }

  async function confirmarDelecao(): Promise<void> {
    if (!produtoParaDeletar?._id) return;

    const res = await fetch(apiUrl + '/produtos/' + produtoParaDeletar._id, {
      method: 'DELETE',
      headers,
    });

    if (res.ok) {
      setToastMessage({message: 'Produto deletado com sucesso!', type: 'success' });
      setProdutos(v => v.filter(p => p._id !== produtoParaDeletar._id));
    } else {
      setToastMessage({message: 'Erro ao deletar produto.', type: 'error' });
    }

    setProdutoParaDeletar(null);
  }

  async function enviarFormulario(event: React.FormEvent) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const nome = (form.elements.namedItem('nome') as HTMLInputElement).value;
    const descricao = (form.elements.namedItem('descricao') as HTMLInputElement).value;
    const preco = parseFloat((form.elements.namedItem('preco') as HTMLInputElement).value);
    const quantidade = parseInt((form.elements.namedItem('quantidade') as HTMLInputElement).value);
    const categoria = (form.elements.namedItem('categoria') as HTMLSelectElement).value as ProdutoCategoria;
    const disponivel = (form.elements.namedItem('disponivel') as HTMLInputElement).checked;

    if (!nome || !descricao || isNaN(preco) || isNaN(quantidade) || !categoria) {
      setToastMessage({ message: 'Todos os campos são obrigatórios.', type: 'warning' });
      return;
    }

    const produto = await cadastrarProduto({ nome, descricao, preco, quantidade, categoria, disponivel });

    if (produto) {
      setToastMessage({message: `Produto ${produto.nome} cadastrado com sucesso!`, type: 'success' });
      form.reset();
    } else {
      setToastMessage({message: 'Erro ao cadastrar produto.', type: 'error' });
    }
  }

  React.useEffect(() => {
    listarProdutos().then((data) => {
      if (data) {
        setProdutos(data);
      }
    });
  }, []); 

  return (
    <div>
      <Toast
        open={!!toastMessage}
        onClose={() => setToastMessage(undefined)}
        type={toastMessage?.type}
        message={toastMessage?.message}
      />
      
      <form onSubmit={enviarFormulario} style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
        <TextField size="small" type="text" name="nome" placeholder="Nome do Produto" />
        <TextField size="small" type="text" name="descricao" placeholder="Descrição do Produto" multiline rows={3} />
        <TextField size="small" type="number" name="preco" placeholder="Preço" inputProps={{ step: "0.01" }} />
        <TextField size="small" type="number" name="quantidade" placeholder="Quantidade" inputProps={{ min: "0", step: "1" }} />
        
        <FormControl size="small">
          <InputLabel>Categoria</InputLabel>
          <Select name="categoria" defaultValue="" label="Categoria">
            <MenuItem value="bebida">Bebida</MenuItem>
            <MenuItem value="comida">Comida</MenuItem>
            <MenuItem value="sobremesa">Sobremesa</MenuItem>
            <MenuItem value="outro">Outro</MenuItem>
          </Select>
        </FormControl>

        <FormControlLabel
          control={<Switch name="disponivel" defaultChecked />}
          label="Disponível"
        />

        <Button type="submit" variant="contained">Cadastrar Produto</Button>
      </form>

      <Box sx={{
        maxHeight: '80vh',
        overflowY: 'auto',
        marginTop: '16px',
        padding: '8px',
        width: '60%',
      }}>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>Produtos Cadastrados:</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {produtos.map((produto) => (
            <Card key={produto._id} sx={{ position: 'relative' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="h6" component="div">
                      {produto.nome}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {produto.descricao}
                    </Typography>
                    <Box sx={{ mt: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Typography variant="body1" color="primary">
                        R$ {produto.preco.toFixed(2)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Qtd: {produto.quantidade}
                      </Typography>
                      <Chip
                        label={produto.categoria}
                        size="small"
                        color="secondary"
                      />
                      <Chip
                        label={produto.disponivel ? "Disponível" : "Indisponível"}
                        size="small"
                        color={produto.disponivel ? "success" : "error"}
                      />
                    </Box>
                  </Box>
                  <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 1 }}>
                    <IconButton 
                      aria-label="edit"
                      onClick={() => selecionarProdutoParaEdicao(produto)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      aria-label="delete"
                      onClick={() => deletarProduto(produto)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Dialog
          open={!!produtoParaDeletar}
          onClose={() => setProdutoParaDeletar(null)}
        >
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogContent>
            <Typography>
              Tem certeza que deseja excluir o produto &quot;{produtoParaDeletar?.nome}&quot;?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setProdutoParaDeletar(null)}>Cancelar</Button>
            <Button onClick={confirmarDelecao} color="error" variant="contained">
              Excluir
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={!!produtoSelecionado}
          onClose={() => {
            setProdutoSelecionado(null);
            setEdicaoProduto(null);
          }}
        >
          <DialogTitle>Editar Produto</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1, minWidth: '300px' }}>
              <TextField 
                size="small"
                type="text"
                label="Nome"
                value={edicaoProduto?.nome || ''}
                onChange={e => setEdicaoProduto(prev => prev ? {...prev, nome: e.target.value} : null)}
              />
              <TextField 
                size="small"
                type="text"
                label="Descrição"
                multiline
                rows={3}
                value={edicaoProduto?.descricao || ''}
                onChange={e => setEdicaoProduto(prev => prev ? {...prev, descricao: e.target.value} : null)}
              />
              <TextField 
                size="small"
                type="number"
                label="Preço"
                inputProps={{ step: "0.01" }}
                value={edicaoProduto?.preco || ''}
                onChange={e => setEdicaoProduto(prev => prev ? {...prev, preco: parseFloat(e.target.value)} : null)}
              />
              <TextField 
                size="small"
                type="number"
                label="Quantidade"
                inputProps={{ min: "0", step: "1" }}
                value={edicaoProduto?.quantidade || ''}
                onChange={e => setEdicaoProduto(prev => prev ? {...prev, quantidade: parseInt(e.target.value)} : null)}
              />
              <FormControl size="small">
                <InputLabel>Categoria</InputLabel>
                <Select
                  value={edicaoProduto?.categoria || ''}
                  label="Categoria"
                  onChange={e => setEdicaoProduto(prev => prev ? {...prev, categoria: e.target.value as ProdutoCategoria} : null)}
                >
                  <MenuItem value="bebida">Bebida</MenuItem>
                  <MenuItem value="comida">Comida</MenuItem>
                  <MenuItem value="sobremesa">Sobremesa</MenuItem>
                  <MenuItem value="outro">Outro</MenuItem>
                </Select>
              </FormControl>
              <FormControlLabel
                control={
                  <Switch 
                    checked={edicaoProduto?.disponivel || false}
                    onChange={e => setEdicaoProduto(prev => prev ? {...prev, disponivel: e.target.checked} : null)}
                  />
                }
                label="Disponível"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setProdutoSelecionado(null);
              setEdicaoProduto(null);
            }}>
              Cancelar
            </Button>
            <Button onClick={enviarFormularioEdicao} color="primary" variant="contained">
              Salvar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </div>
  )
}