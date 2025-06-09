/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useState, useEffect } from "react";
import { TRPCClientError } from '@trpc/client';
import { type NextPage } from "next";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { ItemOrderHeader } from "../../../../components/ItemOrderHeader";
import { ContentHeader } from "../../../../components/ContentHeader";
import { Edit, Delete, Search, Add } from "@mui/icons-material";
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
  Button,
  InputAdornment,
} from "@mui/material";

import { api } from "../../../../utils/api";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const PDVItems: NextPage = () => {
  const router = useRouter();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [findName, setFindName] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const { id } = router.query;

  const itemsQuery = api.items.getByPdvId.useQuery({ pdvId: id as string }, { suspense: false });
  const deleteItemMutation = api.items.deleteById.useMutation();

  useEffect(() => {
    setItems(itemsQuery.data ?? []);
  }, [itemsQuery.data]);

  useEffect(() => {
    if (items.length === 0) return;
    setItems(items.filter(
      (item) =>
        item.item.name.toUpperCase().trim().indexOf(findName.toUpperCase().trim()) >=
        0
    ));
    setPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [findName]);

  if (itemsQuery.error) {
    console.error(itemsQuery.error); // eslint-disable-line no-console
    return <div>An error occurred</div>;
  }

  if (itemsQuery.isLoading) {
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

  const deleteItemById = async (id: string) => {
    try {
      await deleteItemMutation.mutateAsync({ id });
      toast.success("Item excluído com sucesso.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      router.reload();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      toast.error(`Ocorreu um erro. ${message}`, {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
      });
    }
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, items.length - page * rowsPerPage);


  const handleAddItem = () => {
    if (id && typeof id === "string") {
      void router.push(`/pdv/${id}/item/create`);
    }
  };

  const handleDeleteItem = (id: string) => {
    void Swal.fire({
      title: "Deseja excluir?",
      text: "Essa opção não poderá ser revertida.",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#3085d6",
      confirmButtonColor: "#d33",
      cancelButtonText: "Não",
      confirmButtonText: "Sim",
    }).then((result: { isConfirmed: any; }) => {
      if (result.isConfirmed) {
        try {
          void deleteItemById(id);
        } catch (error: any) {
          toast.error(error.response.data.message, {
            position: toast.POSITION.TOP_RIGHT,
            theme: "colored",
            autoClose: 5000,
          });
        }
      }
    });
  };

  const handleEditItem = (itemid: string) => {
    if (id && typeof id === "string") {
      void router.push(`/pdv/${id}/item/edit/${itemid}`);
    }
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  return (
    <>
      {id && typeof id === "string" && <ItemOrderHeader id={id} />}

      {items ? (
        <Container maxWidth="lg" sx={{ mt: "75px" }}>
          <Box
            sx={{
              my: 4,
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <h1 style={{ margin: 0 }}>Itens</h1>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={handleAddItem}
                sx={{
                  borderRadius: '8px',
                  backgroundColor: (theme) => theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: (theme) => theme.palette.primary.dark,
                  },
                }}
              >
                ADICIONAR
              </Button>
            </Box>

            <TextField
              placeholder="Pesquisar itens..."
              name="find"
              size="small"
              value={findName}
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
              onChange={(value) => {
                if (value.target.value === "") {
                  setFindName(value.target.value);
                  setItems(itemsQuery.data ?? []);
                } else {
                  setFindName(value.target.value);
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
              <Table size="medium" aria-label="lista de itens">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">ITEM</TableCell>
                    <TableCell align="left">DESCRIÇÃO</TableCell>
                    <TableCell align="left">PREÇO</TableCell>
                    <TableCell align="left">QUANTIDADE</TableCell>
                    <TableCell align="right">AÇÕES</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? items.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    : items
                  ).map((itemsOnPDV) => (
                    <TableRow key={itemsOnPDV.item.id}>
                      <TableCell>{itemsOnPDV.item.name}</TableCell>
                      <TableCell>{itemsOnPDV.item.description}</TableCell>
                      <TableCell>R$ {itemsOnPDV.item.price}</TableCell>
                      <TableCell>{itemsOnPDV.quantity}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleEditItem(itemsOnPDV.item.id)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteItem(itemsOnPDV.item.id)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={5} />
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, { label: "Todos", value: -1 }]}
                      colSpan={5}
                      count={items.length}
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
        </Container>) : (
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

export default PDVItems;
