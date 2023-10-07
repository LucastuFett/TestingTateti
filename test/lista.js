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
const assert = require('chai').assert
const Lista = require('../src/lista.js')

// Cuando se agrega un par a una lista vacia la lista de claves esta ordenada
// Cuando se agrega un par con una clave menor a las existentes queda ordenada
// Cuando se agrega un par con una clave mayor a las existentes queda ordenada
// Cuando se elimina un par se reduce la cantidad
// Cuando se elimina un par de la lista no se puede recuperar el valor
// No se puede agregar un par en el que la clave no es una cadena
// No se puede agregar un par en el que la clave es una cadena vacía

describe('En una lista pares clave:valor ...', function () {
  describe('cuando la lista está vacía ...', function () {
    let lista = new Lista()
    it('hay cero elementos', function () {
      assert.equal(lista.count(), 0)
    })
    it('no se encuentra ninguna clave', function () {
      assert.isNaN(lista.find('clave'))
    })
  })

  describe('cuando se agrega un elemento a una lista vacia ...', function () {
    let lista = new Lista()
    lista.add('clave', 'valor')
    it('hay un elemento', function () {
      assert.equal(lista.count(), 1)
    })
    it('se puede recuperar el valor a partir de la clave', function () {
      assert.equal(lista.find('clave'), 'valor')
    })
  })

  describe('cuando se agregan dos elementos a una lista vacia ...', function () {
    let lista = new Lista()
    lista.add('clave', 'valor')
    lista.add('clave1', 'valor1')
    it('hay dos elementos', function () {
      assert.equal(lista.count(), 2)
    })
    it('se pueden recuperar los valores a partir de las claves', function () {
      assert.equal(lista.find('clave'), 'valor')
      assert.equal(lista.find('clave1'), 'valor1')
    })
  })

  describe('cuando se agrega una clave que ya existe ...', function () {
    let lista = new Lista()
    lista.add('clave', 'valor')
    lista.add('clave', 'value')
    it('la cantidad de elementos en la lista no cambia', function () {
      assert.equal(lista.count(), 1)
    })
    it('se actualiza el valor almacenado', function () {
      assert.equal(lista.find('clave'), 'value')
    })
  })
})
