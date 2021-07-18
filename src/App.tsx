import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import axios from 'axios'
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
    width: '80%',
  },
  table: {
    minWidth: 650,
  },
  button: {
    marginTop: '15px',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

export interface Entity {
  name: string
  humanReadableSize: string
  lastModifiedAt: string
}

export interface ListResponse {
  data: {
    entities: Entity[]
    totalSize: string
  }
  status: number
}

function App() {
  const classes = useStyles()
  const [query, setQuery] = useState<string | undefined>(undefined)
  const [entities, setEntities] = useState<Entity[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const queryFolders = async  () => {
    setLoading(true)
    try {
      const response: ListResponse = await axios.get(
        `http://localhost:8001`, 
        {
          params: {
            path: query
          }
        }
      )

      if (response && response.status === 200) {
        setEntities(response.data.entities)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  return (
    <Container maxWidth="sm">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <form noValidate autoComplete="off">
              <Box>
                <TextField 
                  className={classes.root} 
                  id="standard-basic" 
                  label="Enter route" 
                  onChange={handleChange}
                />
                <Button 
                  variant="outlined" 
                  color="primary"
                  onClick={queryFolders}
                  className={classes.button}
                >
                  Query
                </Button>
              </Box>
            </form>
          </Grid>
          <Grid>
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Size</TableCell>
                    <TableCell align="right">Last Modidification time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {entities.map((entity) => (
                    <TableRow key={entity.name}>
                      <TableCell component="th" scope="row">
                        {entity.name}
                      </TableCell>
                      <TableCell align="right">{entity.humanReadableSize}</TableCell>
                      <TableCell align="right">{entity.lastModifiedAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Container>
  );
}

export default App;
