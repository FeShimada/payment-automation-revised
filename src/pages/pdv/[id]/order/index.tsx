/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useState, useEffect } from 'react';
import { type NextPage } from 'next';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { ItemOrderHeader } from '../../../../components/ItemOrderHeader';
import { CheckBox, Cancel, Search, Visibility } from '@mui/icons-material';
import Link from 'next/link';
import type { Items } from '@prisma/client';
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  TableFooter,
  TablePagination,
  CircularProgress,
  Skeleton,
  Chip,
  InputAdornment,
} from '@mui/material';

import { api } from '../../../../utils/api';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const PDVOrders: NextPage = () => {
  const router = useRouter();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [find, setFind] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const { id } = router.query;

  const ordersQuery = api.order.getByPdvId.useQuery(
    { pdvId: id as string },
    { suspense: false },
  );
  const updateOrderMutation = api.order.update.useMutation();

  useEffect(() => {
    setOrders(ordersQuery.data ?? []);
  }, [ordersQuery.data]);

  useEffect(() => {
    if (orders.length === 0) return;
    setOrders(
      orders.filter(
        order =>
          order.id.toUpperCase().trim().indexOf(find.toUpperCase().trim()) >= 0,
      ),
    );
    setPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [find]);

  if (ordersQuery.error) {
    console.error(ordersQuery.error); // eslint-disable-line no-console
    return <div>An error occurred</div>;
  }

  if (ordersQuery.isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const updateOrderStatus = async (
    id: string,
    status: 'pending' | 'approved' | 'accredited' | 'delivered' | 'canceled',
  ) => {
    const updateOrderPromise = updateOrderMutation.mutateAsync({ id, status });
    void toast.promise(
      updateOrderPromise,
      {
        pending: 'Updating order...',
        success: 'Pedido finalizado com sucesso.',
        error: 'Ocorreu um erro.',
      },
      {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
      },
    );

    try {
      await updateOrderPromise;
      router.reload();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'An error occurred';
      toast.error(`Ocorreu um erro. ${message}`, {
        position: 'top-right',
        autoClose: 5000,
        theme: 'colored',
      });
    }
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, orders.length - page * rowsPerPage);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  return (
    <>
      {id && typeof id === 'string' && <ItemOrderHeader id={id} />}

      {orders ? (
        <Container maxWidth="lg" sx={{ mt: '75px' }}>
          <Box
            sx={{
              my: 4,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <h1 style={{ margin: 0 }}>Pedidos</h1>
            </Box>

            <TextField
              placeholder="Pesquisar pedidos..."
              name="find"
              size="small"
              value={find}
              sx={{
                mb: 3,
                maxWidth: "400px",
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              onChange={value => {
                if (value.target.value === '') {
                  setFind(value.target.value);
                  setOrders(ordersQuery.data ?? []);
                } else {
                  setFind(value.target.value);
                }
              }}
            />

            <TableContainer
              component={Paper}
              sx={{
                borderRadius: '8px',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
              }}
            >
              <Table size="medium" aria-label="lista de pedidos">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">ITEMS</TableCell>
                    <TableCell align="left">PREÇO TOTAL</TableCell>
                    <TableCell align="left">ID</TableCell>
                    <TableCell align="left">STATUS</TableCell>
                    <TableCell align="left">LINK DE PAGAMENTO</TableCell>
                    <TableCell align="right">FINALIZAR</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? orders.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage,
                    )
                    : orders
                  ).map(orderOnPDV => (
                    <TableRow key={orderOnPDV.id}>
                      <TableCell>{orderOnPDV.items.map(
                        (item: { item: Items; quantity: number; }, index: number) => (
                          <div key={index}>
                            {item.item.name}
                          </div>
                        ),
                      )}</TableCell>
                      <TableCell>R$ {orderOnPDV.price}</TableCell>
                      <TableCell>{orderOnPDV.id}</TableCell>
                      <TableCell>
                        <Chip
                          label={orderOnPDV.status === 'pending' ? 'Pendente' : orderOnPDV.status}
                          color={orderOnPDV.status === 'pending' ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Link href={orderOnPDV.payment_link} target="_blank" style={{ color: '#10B981', textDecoration: 'none' }}>
                          Link de Pagamento
                        </Link>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => void updateOrderStatus(orderOnPDV.id, 'delivered')}
                        >
                          <CheckBox />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => void updateOrderStatus(orderOnPDV.id, 'canceled')}
                        >
                          <Cancel />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, { label: 'Todos', value: -1 }]}
                      colSpan={6}
                      count={orders.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      labelRowsPerPage="Linhas por página"
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </Box>
        </Container>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <Skeleton variant="text" />
          <Skeleton variant="rectangular" width={210} height={118} />
        </Box>
      )}
    </>
  );
};

export default PDVOrders;
