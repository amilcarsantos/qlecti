.pragma library

var VERSION = '0.0.1';

// TODO:
//   - first(key, cb) ???
//   - .reduce() ????
//   - .expand() ????

var on = function(qlection) {

    var _q;

	function _val() {
		return qlection;
	}
	function _next() {
		return _q;
	}

    function _filterCallback(f) {
        if (f instanceof RegExp) {
            return function(element) {
                return f.exec(element);
            }
        }
        if (f instanceof Function) {
            return function(v, k, e) {return f(k, v, e)};
        }
        return function(element) {
            return f === element;
        }
    }
    function _compactCallback(word) {
        return [false, null, 0, ""].indexOf(word) < 0;
    }

	// process 'undefined'
	if (!qlection) {
		_q = {
			each: _next,
			empty: function(callback) {
				callback.call();
				return _q;
			},
            first: _next,
            last: _next,
			one: _next,
            op: function() {
                var __q = {
                    each: _next,
                    empty: _q.empty,
                    first: _next,
                    last: _next,
                    one: _next,
                    compact: _next,
                    filter: _next
                };
                return __q;
            },
            ret: function() {
                return {
                    val: _val
                }
            }
        }
		return _q;
	}
    if (Qt.isQtObject(qlection)) {
        if (qlection.toString().indexOf("QQmlListModel") >= 0) {
            _q = {
                each: function(callback) {
                    for (var idx = 0, t = qlection.count; idx < t; idx++) {
                        if (callback.call(_q, idx, qlection.get(idx)) === false) return _q;
                    }
                    return _q;
                },
                empty: function(callback) {
                    if (qlection.count === 0) {
                        callback.call();
                    }
                    return _q;
                },
                first: function(callback) {
                    if (qlection.count > 0) {
                        callback.call(_q, 0, qlection.get(0));
                    }
                    return _q;
                },
                last: function(callback) {
                    var li = qlection.count - 1;
                    if (li > 0) {
                        callback.call(_q, li, qlection.get(li));
                    }
                    return _q;
                },
                one: function(callback) {
                    if (qlection.count === 1) {
                        callback.call(_q, 0, qlection.get(0));
                    }
                    return _q;
                },
                op: function() {
                    var __q = {
                        each: _next,
                        empty: _q.empty,
                        first: _next,
                        last: _next,
                        one: _next,
                        compact: _next,
                        filter: _next
                    };
                    return __q;
                },
                ret: function() {
                    return {
                        val: _val
                    }
                }

            }
            return _q;
        }
        throw "Unsuported object";
    }

	// process 'arrays'
	if (qlection instanceof Array) {
        function _statsArray(currentCol, previousCol) {
            return {
                count: currentCol.length
            }
        }

		_q = {
			each: function(callback) {
				for (var idx = 0, t = qlection.length; idx < t; idx++) {
					if (callback.call(_q, idx, qlection[idx]) === false) return _q;
				}
				return _q;
			},
			empty: function(callback) {
                if (qlection.length === 0) {
                    callback.call(_q);
                }
				return _q;
            },
            first: function(callback) {
                if (qlection.length > 0) {
                    callback.call(_q, 0, qlection[0]);
                }
                return _q;
            },
            last: function(callback) {
                var li = qlection.length - 1;
                if (li > 0) {
                    callback.call(_q, li, qlection[li]);
                }
                return _q;
            },
			one: function(callback) {
				if (qlection.length === 1) {
					callback.call(_q, 0, qlection[0]);
				}
				return _q;
            },
            op: function (stats) {
                // operations...
                var p_q = _q;
                var __q = {
                    each: p_q.each,
                    empty: p_q.empty,
                    first: p_q.first,
                    last: p_q.last,
                    one: p_q.one,
                    val: p_q.val,
                    compact: function() {
                        var _qlection = qlection.filter(_compactCallback);
                        return on(_qlection).op(_statsArray(_qlection, qlection));
                    },
                    filter: function(filterCallback) {
                        var _qlection = qlection.filter(_filterCallback(filterCallback));
                        return on(_qlection).op(_statsArray(_qlection, qlection));
                    },
                    stats: function(callback) {
                        if (stats) callback.call(__q, stats);
                        return __q;
                    },
                    ret: p_q.ret
                }
                return __q;
            },
            ret: function() {
                return {
                    val: _val
                }
            }
		};
		return _q;
	}

	// process 'string' or 'dates'
	if (qlection instanceof String || qlection instanceof Date) {
		_q = {
			each: function(callback) {
				if (qlection.toString() !== "") {
					callback.call(_q, 0, qlection);
				}
				return _q;
			},
			empty: function(callback) {
				if (qlection.toString() === "") {
					callback.call();
				}
				return _q;
			},
            first: function(callback) {
                callback.call(_q, 0, qlection);
                return _q;
            },
            last: _next,
			one: function(callback) {
				callback.call(_q, undefined, qlection);
				return _q;
			},
            op: function() {
                // modifier...
                throw "UNDER CONSTRUCTION";
            },
            ret: function() {
                return {
                    val: _val
                }
            }
		}
		return _q;
	}

	// process 'map/object'
	_q = {
		each: function(callback) {
			for (var key in qlection) {
				if (callback.call(_q, key, qlection[key]) === false) return _q;
			}
			return _q;
		},
		empty: function(callback) {
			if (qlection === {}) {
				callback.call();
			}
			return _q;
		},
        first: function() {
            throw "UNDER CONSTRUCTION";
        },
        last: function() {
            throw "UNDER CONSTRUCTION";
        },
		one: function(callback) {
			var key = Object.keys(qlection);
			if (key.length === 1) {
				callback.call(_q, key, qlection[key]);
			}
			return _q;
		},
        op: {
            filter: function(filterCallback) {
                // modifier...
              //  var _qlection = qlection.filter(_filterCallback(filterCallback));
             //   return on(_qlection);
                throw "UNDER CONSTRUCTION";
            },
            ret: _q.ret
        },
        ret: function() {
            return {
                val: _val
            }
        }
	};
	return _q;
}
