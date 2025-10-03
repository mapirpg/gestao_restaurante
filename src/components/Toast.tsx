import { Alert, AlertProps, Snackbar } from "@mui/material"

export const Toast = (  { 
    message, 
    onClose, 
    open,
    type
  }: {
    message: string | undefined, 
    onClose: () => void, 
    open: boolean
    type: AlertProps['severity']
  }) => {
  return (
    <Snackbar 
      open={open} 
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        onClose={onClose}
        severity={type}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  )
}