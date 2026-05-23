export function errorHandler(error, _req, res, _next) {
  console.error(error);

  if (error.statusCode) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  return res.status(500).json({ message: "blog service error" });
}
