"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function volver() {
  var referrer = document.referrer; // url de la página anterior

  // verificando si la página anterior es la de inicio o la de recetas
  if (referrer.includes('index.html')) {
    window.location.href = 'index.html';
  } else if (referrer.includes('recetas.html')) {
    window.location.href = 'recetas.html';
  } else {
    // si no se puede determinar, redirige a un lugar predeterminado
    window.location.href = 'recetas.html';
  }
}
function cargarRecetaCompleta() {
  return _cargarRecetaCompleta.apply(this, arguments);
}
function _cargarRecetaCompleta() {
  _cargarRecetaCompleta = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
    var urlParams, recipeId, token, response, receta, usuarioIdActual, ingredientsList, instructionsText, descriptionText;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          urlParams = new URLSearchParams(window.location.search);
          recipeId = urlParams.get('id');
          token = localStorage.getItem('token'); // verificando si el token existe
          if (token) {
            _context.next = 5;
            break;
          }
          throw new Error('Token no encontrado');
        case 5:
          if (!(recipeId && recipeId !== 'undefined')) {
            _context.next = 35;
            break;
          }
          _context.prev = 6;
          _context.next = 9;
          return fetch("http://localhost:3000/api/recipe/".concat(recipeId), {
            headers: {
              'Authorization': "Bearer ".concat(token)
            }
          });
        case 9:
          response = _context.sent;
          if (response.ok) {
            _context.next = 12;
            break;
          }
          throw new Error('No se pudo obtener la receta');
        case 12:
          _context.next = 14;
          return response.json();
        case 14:
          receta = _context.sent;
          usuarioIdActual = JSON.parse(atob(token.split('.')[1])).userId; // llenando los detalles de la receta en la página
          document.getElementById('nombreReceta').innerText = receta.nombreReceta || 'Sin nombre';
          document.getElementById('categoria').innerText = receta.categoria || 'Sin categoría';
          document.getElementById('porciones').innerText = receta.porciones || 'No especificado';

          // cuando hay un autor desconocido
          if (receta.autor && receta.autor.nombre) {
            document.getElementById('autor').innerText = receta.autor.nombre;
          } else {
            document.getElementById('autor').innerText = 'Desconocido';
          }

          // mostrar u ocultar botones segun el autor
          if (receta.autor && receta.autor._id === usuarioIdActual) {
            document.querySelector('.btn-edit').style.display = 'inline-block';
            document.querySelector('.btn-delete').style.display = 'inline-block';
          } else {
            document.querySelector('.btn-edit').style.display = 'none';
            document.querySelector('.btn-delete').style.display = 'none';
          }
          ingredientsList = document.getElementById('ingredientes');
          ingredientsList.innerHTML = '';
          if (Array.isArray(receta.ingredientes) && receta.ingredientes.length > 0) {
            receta.ingredientes.forEach(function (item) {
              var li = document.createElement('li');
              li.innerText = item;
              ingredientsList.appendChild(li);
            });
          } else {
            ingredientsList.innerHTML = '<li>No se encontraron ingredientes.</li>';
          }
          instructionsText = document.getElementById('preparacion');
          instructionsText.innerText = receta.preparacion || 'No se encontraron instrucciones.';
          descriptionText = document.getElementById('descripcion');
          descriptionText.innerText = receta.descripcion || 'Sin descripción.';
          _context.next = 33;
          break;
        case 30:
          _context.prev = 30;
          _context.t0 = _context["catch"](6);
          console.error('Error al cargar la receta:', _context.t0);
        case 33:
          _context.next = 36;
          break;
        case 35:
          console.error('ID de receta no definido');
        case 36:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[6, 30]]);
  }));
  return _cargarRecetaCompleta.apply(this, arguments);
}
function editarReceta() {
  return _editarReceta.apply(this, arguments);
}
function _editarReceta() {
  _editarReceta = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
    var urlParams, recipeId, response, receta;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          urlParams = new URLSearchParams(window.location.search);
          recipeId = urlParams.get('id');
          if (!(recipeId && recipeId !== 'undefined')) {
            _context3.next = 24;
            break;
          }
          _context3.prev = 3;
          _context3.next = 6;
          return fetch("http://localhost:3000/api/recipe/".concat(recipeId), {
            headers: {
              'Authorization': "Bearer ".concat(localStorage.getItem('token'))
            }
          });
        case 6:
          response = _context3.sent;
          if (response.ok) {
            _context3.next = 9;
            break;
          }
          throw new Error('No se pudo obtener la receta para editarla.');
        case 9:
          _context3.next = 11;
          return response.json();
        case 11:
          receta = _context3.sent;
          // editar el form del modal con los datos existentes
          document.getElementById('editNombreReceta').value = receta.nombreReceta || '';
          document.getElementById('editCategoria').value = receta.categoria || '';
          document.getElementById('editDescripcion').value = receta.descripcion || '';
          document.getElementById('editPorciones').value = receta.porciones || '';
          document.getElementById('editIngredientes').value = (receta.ingredientes || []).join(',');
          document.getElementById('editInstrucciones').value = receta.preparacion || '';

          // logica para actualizar la receta al evento onsubmit del formulario
          document.getElementById('editRecipeForm').onsubmit = /*#__PURE__*/function () {
            var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(event) {
              var updatedReceta, updateResponse;
              return _regeneratorRuntime().wrap(function _callee2$(_context2) {
                while (1) switch (_context2.prev = _context2.next) {
                  case 0:
                    event.preventDefault();

                    // capturando los datos del formulario
                    updatedReceta = {
                      nombreReceta: document.getElementById('editNombreReceta').value,
                      categoria: document.getElementById('editCategoria').value,
                      descripcion: document.getElementById('editDescripcion').value,
                      porciones: document.getElementById('editPorciones').value,
                      ingredientes: document.getElementById('editIngredientes').value.split(','),
                      preparacion: document.getElementById('editInstrucciones').value
                    }; // enviando los datos al backend
                    _context2.next = 4;
                    return fetch("http://localhost:3000/api/recipe/update/".concat(recipeId), {
                      method: 'PUT',
                      headers: {
                        'Authorization': "Bearer ".concat(localStorage.getItem('token')),
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify(updatedReceta)
                    });
                  case 4:
                    updateResponse = _context2.sent;
                    if (updateResponse.ok) {
                      Swal.fire({
                        icon: 'success',
                        title: '¡Receta actualizada!',
                        text: 'La receta se actualizó correctamente.',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'Aceptar'
                      }).then(function () {
                        location.reload();
                      });
                    } else {
                      Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Hubo un problema al actualizar la receta.',
                        cancelButtonColor: '#d33',
                        cancelButtonText: 'Cerrar'
                      });
                    }
                  case 6:
                  case "end":
                    return _context2.stop();
                }
              }, _callee2);
            }));
            return function (_x) {
              return _ref.apply(this, arguments);
            };
          }();
          _context3.next = 24;
          break;
        case 21:
          _context3.prev = 21;
          _context3.t0 = _context3["catch"](3);
          console.error('Error al obtener la receta para editarla:', _context3.t0);
        case 24:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[3, 21]]);
  }));
  return _editarReceta.apply(this, arguments);
}
function eliminarReceta() {
  return _eliminarReceta.apply(this, arguments);
} // agregando event listeners a los botones de edición y eliminación
function _eliminarReceta() {
  _eliminarReceta = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
    var urlParams, recipeId, token;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          urlParams = new URLSearchParams(window.location.search);
          recipeId = urlParams.get('id');
          token = localStorage.getItem('token');
          if (token) {
            _context5.next = 6;
            break;
          }
          console.error('Token no encontrado');
          return _context5.abrupt("return");
        case 6:
          if (recipeId && recipeId !== 'undefined') {
            Swal.fire({
              title: '¿Estás seguro?',
              text: 'Esta acción no se puede deshacer.',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Sí, eliminar',
              cancelButtonText: 'Cancelar'
            }).then(/*#__PURE__*/function () {
              var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(result) {
                var response;
                return _regeneratorRuntime().wrap(function _callee4$(_context4) {
                  while (1) switch (_context4.prev = _context4.next) {
                    case 0:
                      if (!result.isConfirmed) {
                        _context4.next = 16;
                        break;
                      }
                      _context4.prev = 1;
                      _context4.next = 4;
                      return fetch("http://localhost:3000/api/recipe/delete/".concat(recipeId), {
                        method: 'DELETE',
                        headers: {
                          'Authorization': "Bearer ".concat(token)
                        }
                      });
                    case 4:
                      response = _context4.sent;
                      if (!response.ok) {
                        _context4.next = 9;
                        break;
                      }
                      Swal.fire({
                        icon: 'success',
                        title: '¡Eliminado!',
                        text: 'La receta ha sido eliminada exitosamente.',
                        confirmButtonText: 'Aceptar'
                      }).then(function () {
                        volver(); // modificar esto
                      });
                      _context4.next = 10;
                      break;
                    case 9:
                      throw new Error('No se pudo eliminar la receta');
                    case 10:
                      _context4.next = 16;
                      break;
                    case 12:
                      _context4.prev = 12;
                      _context4.t0 = _context4["catch"](1);
                      console.error('Error al eliminar la receta:', _context4.t0);
                      Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Hubo un error al intentar eliminar la receta.',
                        confirmButtonText: 'Cerrar'
                      });
                    case 16:
                    case "end":
                      return _context4.stop();
                  }
                }, _callee4, null, [[1, 12]]);
              }));
              return function (_x2) {
                return _ref2.apply(this, arguments);
              };
            }());
          }
        case 7:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return _eliminarReceta.apply(this, arguments);
}
document.querySelector('.btn-edit').addEventListener('click', editarReceta);
document.querySelector('.btn-delete').addEventListener('click', eliminarReceta);
window.onload = cargarRecetaCompleta;