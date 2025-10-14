import { Cliente } from "@/database/models";
import { AlertProps, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import { API_BASE_URL, headers } from '@/config'
import React from "react";
import { Toast } from "@/components/Toast";
import { List } from "@/components/List";


const apiUrl = API_BASE_URL

export default function Clientes() {
  const [toastMessage, setToastMessage] = React.useState<{ message: string | undefined, type: AlertProps['severity']} | undefined>();
  const [clientes, setClientes] = React.useState<Cliente[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = React.useState<Cliente | null>(null);
  const [edicaoNomeCliente, setEdicaoNomeCliente] = React.useState<string>('');

  async function cadastrarCliente(data: { nome: string } ): Promise<Cliente | null> {
    const res = await fetch(apiUrl + '/clientes', {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const cliente: Cliente = await res.json();
      setClientes(v => [...v, cliente]);
      return cliente;
    } else {
      console.error('Erro ao cadastrar cliente:', res.statusText);
      return null;
    }
  }

  async function listarClientes(): Promise<Cliente[] | null> {
    const res = await fetch(apiUrl + '/clientes', {
      method: 'GET',
      headers,
    });

    if (res.ok) {
      const clientes: Cliente[] = await res.json();
      console.log('Clientes listados:', clientes);
      return clientes;
    } else {
      console.error('Erro ao listar clientes:', res.statusText);
      return null;
    }
  }

  async function deletarCliente(id: string): Promise<boolean> {
    const res = await fetch(apiUrl + '/clientes/' + id, {
      method: 'DELETE',
      headers,
    });

    if (res.ok) {
      setToastMessage({message: 'Cliente deletado com sucesso!', type: 'info' });
      setClientes(v => v.filter(c => c._id !== id));
      return true;
    } else {
      setToastMessage({message: 'Erro ao deletar cliente.', type: 'error' });
      console.error('Erro ao deletar cliente:', res.statusText);
      return false;
    }
  }

  async function enviarFormularioCadastro(event: React.FormEvent) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const nome = (form.elements.namedItem('nome') as HTMLInputElement).value;

    if (!nome) {
      setToastMessage({ message: 'O nome é obrigatório.', type: 'warning' });
      return;
    }

    const cliente = await cadastrarCliente({ nome });

    if (cliente) {
      setToastMessage({message: `Cliente ${cliente.nome} cadastrado com sucesso!`, type: 'success' });
      form.reset();
    } else {
      setToastMessage({message: 'Erro ao cadastrar cliente.', type: 'error' });
    }
  }

  async function selecionarClienteParaEdicao(id: string): Promise<void> {
    const res = await fetch(apiUrl + '/clientes/' + id, {
      method: 'GET',
      headers,
    })


    if (res.ok) {
      const cliente: Cliente = await res.json();
      setClienteSelecionado(cliente);
      setEdicaoNomeCliente(cliente.nome);
    } else {
      setToastMessage({message: 'Erro ao buscar dados do cliente.', type: 'error' });
    }
  }

  async function enviarFormularioEdicao(): Promise<void> {
    if (!clienteSelecionado) return;

    if (!edicaoNomeCliente) {
      setToastMessage({ message: 'O nome é obrigatório.', type: 'warning' });
      return;
    }

    const res = await fetch(apiUrl + '/clientes/' + clienteSelecionado._id, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ nome: edicaoNomeCliente }),
    });

    if (res.ok) {
      const clienteAtualizado: Cliente = await res.json();
      const novaLista = await listarClientes() || [];

      setClientes(novaLista);
      setToastMessage({ message: `Cliente ${clienteAtualizado.nome} atualizado com sucesso!`, type: 'success' });
      setClienteSelecionado(null);
      setEdicaoNomeCliente('');
    } else {
      setToastMessage({ message: 'Erro ao atualizar cliente.', type: 'error' });
    }
  }

  React.useEffect(() => {
    listarClientes().then((data) => {
      if (data) {
        setClientes(data);
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
      
      <form onSubmit={enviarFormularioCadastro}>
        <TextField size="small" type="text" name="nome" placeholder="Nome do Cliente" />
        <Button type="submit">Cadastrar Cliente</Button>
      </form>

      <Box sx={{
        maxHeight: '80vh',
        overflowY: 'auto',
        marginTop: '16px',
        padding: '8px',
        width: '30%',
      }}>
        <Typography>Clientes Cadastrados:</Typography>
        <List itens={clientes} deletarItem={deletarCliente} editarItem={selecionarClienteParaEdicao}  />
      </Box>


      <Dialog
        open={!!clienteSelecionado}
        onClose={() => setClienteSelecionado(null)}
      >
        <DialogTitle>Editar Cliente</DialogTitle>
        <DialogContent>
          <TextField 
            size="small" 
            type="text" 
            placeholder="Nome do Cliente" 
            value={edicaoNomeCliente} 
            onChange={e => setEdicaoNomeCliente(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClienteSelecionado(null)}>Cancelar</Button>
          <Button onClick={enviarFormularioEdicao} color="info" variant="contained">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}