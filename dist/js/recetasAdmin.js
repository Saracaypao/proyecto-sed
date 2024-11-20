"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// Obtener recetas
function obtenerRecetas() {
  return _obtenerRecetas.apply(this, arguments);
} // Mostrar recetas en el HTML
function _obtenerRecetas() {
  _obtenerRecetas = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
    var response, data;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return fetch('http://localhost:3000/api/recipe/allRecetas', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
        case 3:
          response = _context.sent;
          if (response.ok) {
            _context.next = 6;
            break;
          }
          throw new Error('Error al obtener las recetas');
        case 6:
          _context.next = 8;
          return response.json();
        case 8:
          data = _context.sent;
          mostrarRecetas(data.recetas);
          _context.next = 15;
          break;
        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](0);
          console.error('Error:', _context.t0);
        case 15:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 12]]);
  }));
  return _obtenerRecetas.apply(this, arguments);
}
function mostrarRecetas(recetas) {
  var contenedor = document.querySelector('.row');
  contenedor.innerHTML = ''; // Limpiar el contenido actual

  recetas.forEach(function (receta) {
    var card = document.createElement('div');
    card.classList.add('col-md-4', 'mb-4');
    card.innerHTML = "\n            <div class=\"card shadow-sm\">\n                <div class=\"card-header bg-secondary text-white\">\n                    <h5 class=\"card-title mb-0\">".concat(receta.titulo, "</h5>\n                </div>\n                <div class=\"card-body\">\n                    <p><strong>Categor\xEDa:</strong> ").concat(receta.categoria, "</p>\n                    <p><strong>Porciones:</strong> ").concat(receta.porciones, "</p>\n                    <p><strong>Autor:</strong> ").concat(receta.autor, "</p>\n                    <p><strong>Descripci\xF3n:</strong> ").concat(receta.descripcion, "</p>\n                    <div class=\"d-flex justify-content-between\">\n                        <button class=\"btn btn-primary btn-sm btn-edit\" data-id=\"").concat(receta.id, "\">Editar</button>\n                        <button class=\"btn btn-danger btn-sm btn-delete\" data-id=\"").concat(receta.id, "\">Eliminar</button>\n                    </div>\n                </div>\n            </div>\n        ");
    contenedor.appendChild(card);
  });

  // Asignar eventos de editar y eliminar después de que las recetas se carguen
  document.querySelectorAll('.btn-edit').forEach(function (button) {
    button.addEventListener('click', editarReceta);
  });
  document.querySelectorAll('.btn-delete').forEach(function (button) {
    button.addEventListener('click', eliminarReceta);
  });
}

// Función para editar una receta
function editarReceta(_x) {
  return _editarReceta.apply(this, arguments);
} // Función para actualizar la receta
function _editarReceta() {
  _editarReceta = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(event) {
    var recetaId, response, receta;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          recetaId = event.target.getAttribute('data-id');
          _context2.prev = 1;
          _context2.next = 4;
          return fetch("http://localhost:3000/api/recipe/".concat(recetaId));
        case 4:
          response = _context2.sent;
          _context2.next = 7;
          return response.json();
        case 7:
          receta = _context2.sent;
          // Agrega un console.log para ver el nombre de la receta
          //console.log("Nombre de la receta a editar:", receta.nombreReceta);  

          Swal.fire({
            title: 'Editar Receta',
            html: "\n                <input type=\"text\" id=\"editTitulo\" class=\"form-control mb-3\" value=\"".concat(receta.nombreReceta, "\" placeholder=\"T\xEDtulo de la receta\">\n                <input type=\"text\" id=\"editCategoria\" class=\"form-control mb-3\" value=\"").concat(receta.categoria, "\" placeholder=\"Categor\xEDa\">\n                <textarea id=\"editDescripcion\" class=\"form-control mb-3\" placeholder=\"Descripci\xF3n\">").concat(receta.descripcion, "</textarea>\n                <input type=\"number\" id=\"editPorciones\" class=\"form-control mb-3\" value=\"").concat(receta.porciones, "\" placeholder=\"Porciones\">\n                <input type=\"text\" id=\"editIngredientes\" class=\"form-control mb-3\" value=\"").concat(receta.ingredientes.join(','), "\" placeholder=\"Ingredientes (separados por comas)\">\n                <textarea id=\"editInstrucciones\" class=\"form-control mb-3\" placeholder=\"Instrucciones\">").concat(receta.preparacion, "</textarea>\n            "),
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar',
            preConfirm: function preConfirm() {
              var titulo = $('#editTitulo').val();
              var categoria = $('#editCategoria').val();
              var descripcion = $('#editDescripcion').val();
              var porciones = $('#editPorciones').val();
              var ingredientes = $('#editIngredientes').val().split(',');
              var instrucciones = $('#editInstrucciones').val();

              // Solo se enviarán los campos que hayan sido modificados
              var updatedReceta = {};
              if (titulo !== receta.titulo) updatedReceta.nombreReceta = titulo;
              if (categoria !== receta.categoria) updatedReceta.categoria = categoria;
              if (descripcion !== receta.descripcion) updatedReceta.descripcion = descripcion;
              if (porciones != receta.porciones) updatedReceta.porciones = porciones;
              if (ingredientes.join(',') !== receta.ingredientes.join(',')) updatedReceta.ingredientes = ingredientes;
              if (instrucciones !== receta.preparacion) updatedReceta.instrucciones = instrucciones;
              if (Object.keys(updatedReceta).length === 0) {
                Swal.showValidationMessage('No se realizaron cambios');
                return false;
              }
              return updatedReceta;
            }
          }).then(function (result) {
            if (result.isConfirmed) {
              var updatedReceta = result.value;
              if (updatedReceta) {
                // Enviar los datos al backend para actualizar la receta
                actualizarReceta(recetaId, updatedReceta);
              }
            }
          });
          _context2.next = 14;
          break;
        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](1);
          console.error('Error al obtener la receta para editarla:', _context2.t0);
        case 14:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[1, 11]]);
  }));
  return _editarReceta.apply(this, arguments);
}
function actualizarReceta(_x2, _x3) {
  return _actualizarReceta.apply(this, arguments);
} // Función para eliminar una receta
function _actualizarReceta() {
  _actualizarReceta = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(recetaId, updatedReceta) {
    var response;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return fetch("http://localhost:3000/api/recipe/update/".concat(recetaId), {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedReceta)
          });
        case 3:
          response = _context3.sent;
          if (response.ok) {
            Swal.fire('¡Receta actualizada!', 'Los cambios se han guardado correctamente.', 'success').then(function () {
              return location.reload();
            });
          } else {
            Swal.fire('Error', 'Hubo un problema al actualizar la receta.', 'error');
          }
          _context3.next = 11;
          break;
        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          console.error('Error al actualizar la receta:', _context3.t0);
          Swal.fire('Error', 'Hubo un error al intentar actualizar la receta.', 'error');
        case 11:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 7]]);
  }));
  return _actualizarReceta.apply(this, arguments);
}
function eliminarReceta(_x4) {
  return _eliminarReceta.apply(this, arguments);
}
function _eliminarReceta() {
  _eliminarReceta = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(event) {
    var recetaId, confirmacion, response;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          recetaId = event.target.getAttribute('data-id');
          _context4.next = 3;
          return Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
          });
        case 3:
          confirmacion = _context4.sent;
          if (!confirmacion.isConfirmed) {
            _context4.next = 16;
            break;
          }
          _context4.prev = 5;
          _context4.next = 8;
          return fetch("http://localhost:3000/api/recipe/delete/".concat(recetaId), {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            }
          });
        case 8:
          response = _context4.sent;
          if (response.ok) {
            Swal.fire('Eliminada', 'La receta ha sido eliminada.', 'success').then(function () {
              return location.reload();
            });
          } else {
            Swal.fire('Error', 'Hubo un problema al eliminar la receta.', 'error');
          }
          _context4.next = 16;
          break;
        case 12:
          _context4.prev = 12;
          _context4.t0 = _context4["catch"](5);
          console.error('Error al eliminar la receta:', _context4.t0);
          Swal.fire('Error', 'Hubo un error al intentar eliminar la receta.', 'error');
        case 16:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[5, 12]]);
  }));
  return _eliminarReceta.apply(this, arguments);
}
document.addEventListener('DOMContentLoaded', obtenerRecetas);