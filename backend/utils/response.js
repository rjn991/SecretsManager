exports.success = (data) => ({
  statusCode: 200,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data)
});

exports.error = (msg, code = 500) => ({
  statusCode: code,
  body: JSON.stringify({ error: msg })
});
