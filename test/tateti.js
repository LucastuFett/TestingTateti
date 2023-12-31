/**
 * Copyright (c) 2023, Laboratorio de Microprocesadores
 * Facultad de Ciencias Exactas y Tecnología, Universidad Nacional de Tucumán
 * https://www.microprocesadores.unt.edu.ar/
 *
 * Copyright (c) 2023, Lucas Gutierrez <lucasgutie2003@gmail.com>
 *
 * SPDX-License-Identifier: MIT
 */

const describe = require('mocha').describe
const it = require('mocha').it
const chai = require('chai')
const chaiHttp = require('chai-http')
const res = require('express/lib/response')
const server = require('../app')
const should = chai.should()

chai.use(chaiHttp)

// - Cuando se inicia un juego nuevo le toca al primer jugador y el tablero esta vacio.
// - Cuando el primer jugador hace su movimiento le toca al otro jugador y la casilla
// elegida por el primer jugardor esta ocupada.
// - Cuando el segundo jugador hace su movimiento le toca de nuevo al primer jugador y
// las dos casillas elegidar por el primer y segundo jugador estan ocupadas con
// marcas diferentes
// - Cuando un jugador marca tres casillas de la misma fila entonces gana
// - Cuando un jugador marca tres casillas de la misma columna entonces gana
// - Cuando un jugador marca tres casillas de las diagonales entonces gana
// - Si un jugador mueve cuando no es su turno entonces se devuelve un error y el tablero
// no cambia.
// - Cuando no quedan casillas vacias y no hay un ganador entonces hay un empate.

describe('Juego de TaTeTi', () => {
  let juego = {
    jugadores: ['Juan', 'Pedro']
  }
  let movimientos = [
    { jugador: 'Juan', columna: 0, fila: 0 },
    { jugador: 'Pedro', columna: 1, fila: 0 },
    { jugador: 'Juan', columna: 0, fila: 1 },
    { jugador: 'Pedro', columna: 1, fila: 1 },
    { jugador: 'Juan', columna: 0, fila: 2 }, // Gana Juan por Columna
    { jugador: 'Juan', columna: 2, fila: 2 },
    { jugador: 'Pedro', columna: 1, fila: 2 }
  ]
  describe('Se empieza un juego nuevo', () => {
    it('Todos los casilleros estan vacios y le toca mover al primer jugador', (done) => {
      chai
        .request(server)
        .put('/empezar')
        .send(juego)
        .end((err, res) => {
          res.should.have.status(200)
          res.should.to.be.json
          res.body.should.be.a('object')
          // Le toca mover al primer jugador
          res.body.should.have.property('turno').eql('Juan')
          // Todos los casilleros estan vacios
          res.body.should.have.property('tablero').eql([
            [' ', ' ', ' '],
            [' ', ' ', ' '],
            [' ', ' ', ' ']
          ])
          done()
        })
    })
  })
  describe('El primer jugador hace su primer movimiento', () => {
    it('El casillero queda ocupado y le toca al otro jugador', function (done) {
      chai.request(server).put('/empezar').send(juego).end()
      chai
        .request(server)
        .put('/movimiento')
        .send(movimientos[0])
        .end((err, res) => {
          res.should.have.status(200)
          res.should.to.be.json
          res.body.should.be.a('object')
          res.body.should.have.property('turno').eql('Pedro')
          res.body.should.have.property('tablero').eql([
            ['x', ' ', ' '],
            [' ', ' ', ' '],
            [' ', ' ', ' ']
          ])
          done()
        })
    })
  })

  describe('El segundo jugador hace su primer movimiento', () => {
    it('El casillero queda ocupado y le toca al otro jugador', function (done) {
      chai.request(server).put('/empezar').send(juego).end()
      chai.request(server).put('/movimiento').send(movimientos[0]).end()
      chai
        .request(server)
        .put('/movimiento')
        .send(movimientos[1])
        .end((err, res) => {
          res.should.have.status(200)
          res.should.to.be.json
          res.body.should.be.a('object')
          res.body.should.have.property('turno').eql('Juan')
          res.body.should.have.property('tablero').eql([
            ['x', 'o', ' '],
            [' ', ' ', ' '],
            [' ', ' ', ' ']
          ])
          done()
        })
    })
  })
  describe('El jugador marca tres casillas de', () => {
    it('la misma columna, gana', (done) => {
      chai.request(server).put('/empezar').send(juego).end()
      chai.request(server).put('/movimiento').send(movimientos[0]).end()
      chai.request(server).put('/movimiento').send(movimientos[1]).end()
      chai.request(server).put('/movimiento').send(movimientos[2]).end()
      chai.request(server).put('/movimiento').send(movimientos[3]).end()
      chai.request(server).put('/movimiento').send(movimientos[5]).end()
      chai
        .request(server)
        .put('/movimiento')
        .send(movimientos[6])
        .end((err, res) => {
          res.should.have.status(200)
          res.should.to.be.json
          res.body.should.be.a('object')
          res.body.should.have.property('tablero').eql([
            ['x', 'o', ' '],
            ['x', 'o', ' '],
            [' ', 'o', 'x']
          ])
          res.body.should.have.property('ganador').eql('Pedro')
          done()
        })
    })
  })
})
