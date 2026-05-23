export function errorHandler(error, _req, res, _next) {
  console.error(error);

  if (error.statusCode) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  if (error.code === "23505") {
    return res.status(409).json({ message: "email already exists" });
  }

  return res.status(500).json({ message: "auth service error" });
}
