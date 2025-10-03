import { Cliente } from "@/database/models";
import { AlertProps, Box, Button, TextField, Typography } from "@mui/material";
import { API_BASE_URL, headers } from '@/config'
import React from "react";
import { Toast } from "@/components/Toast";
import { List } from "@/components/List";


const apiUrl = API_BASE_URL

export default function Clientes() {
  const [toastMessage, setToastMessage] = React.useState<{ message: string | undefined, type: AlertProps['severity']} | undefined>();
  const [clientes, setClientes] = React.useState<Cliente[]>([]);

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

  async function enviarFormulario(event: React.FormEvent) {
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
      
      <form onSubmit={enviarFormulario}>
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
        <List itens={clientes} deletarItem={deletarCliente}  />
      </Box>
    </div>
  )
}