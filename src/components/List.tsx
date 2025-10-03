import { Card, IconButton, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

export const List = ({
  itens,
  deletarItem
}: {
  deletarItem: (id: string) => Promise<boolean>;
  itens: any[];
}) => {
    return itens?.length > 0 ? itens.map((item) => (
      <Card
        key={item._id} 
        style={{ 
          margin: '2px', 
          padding: '8px', 
          flexDirection: 'row', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center'
        }}
      >
        <Typography>Nome: {item.nome}</Typography>
        <IconButton onClick={() => item?._id && deletarItem(item._id)}>
          <DeleteIcon />
        </IconButton>
      </Card>
    )) : null
  }