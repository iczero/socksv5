var net = require('net'),
    ipv6 = require('ipv6').v6;

exports.ipbytes = function(str) {
  var type = net.isIP(str),
      nums,
      bytes,
      i;

  if (type === 4) {
    nums = str.split('.', 4);
    bytes = new Array(4);
    for (i = 0; i < 4; ++i) {
      if (isNaN(bytes[i] = +nums[i]))
        throw new Error('Error parsing IP: ' + str);
    }
  } else if (type === 6) {
    var addr = new ipv6.Address(str),
        b = 0,
        group;
    if (!addr.valid)
      throw new Error('Error parsing IP: ' + str);
    nums = addr.parsedAddress;
    bytes = new Array(16);
    for (i = 0; i < 8; ++i, b += 2) {
      group = parseInt(nums[i], 16);
      bytes[b] = group >>> 8;
      bytes[b + 1] = group & 0xFF;
    }
  }

  return bytes;
};

function toNumber(x) { return (x = Number(x)) >= 0 ? x : false; }

function isPipeName(s) {
  return typeof s === 'string' && toNumber(s) === false;
}

exports.normalizeConnectArgs = function normalizeConnectArgs(args) {
  var options = {};

  if (args.length === 0) {
    return [options];
  } else if (args[0] !== null && typeof args[0] === 'object') {
    // connect(options, [cb])
    options = args[0];
  } else if (isPipeName(args[0])) {
    // connect(path, [cb]);
    options.path = args[0];
  } else {
    // connect(port, [host], [cb])
    options.port = args[0];
    if (args.length > 1 && typeof args[1] === 'string') {
      options.host = args[1];
    }
  }

  var cb = args[args.length - 1];
  return typeof cb === 'function' ? [options, cb] : [options];
}
