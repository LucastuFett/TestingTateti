var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})

let turno
var tablero
var jugadores
const marcas = ['x', 'o']

router.put('/empezar', function (request, response) {
  turno = 0
  jugadores = request.body.jugadores
  tablero = [
    [' ', ' ', ' '],
    [' ', ' ', ' '],
    [' ', ' ', ' ']
  ]
  response.setHeader('Content-Type', 'application/json')
  response.send({
    turno: jugadores[turno],
    tablero: tablero
  })
})

router.put('/movimiento', function (request, response) {
  const columna = request.body.columna
  const fila = request.body.fila

  tablero[fila][columna] = marcas[turno]
  turno = (turno + 1) % 2

  response.setHeader('Content-Type', 'application/json')
  response.send({
    turno: jugadores[turno],
    tablero: tablero
  })
})

module.exports = router
